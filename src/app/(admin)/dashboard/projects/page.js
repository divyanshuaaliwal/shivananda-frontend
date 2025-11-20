"use client";

import { useEffect, useState } from "react";
import { getAdminProjects, createProjectAdmin, updateProjectAdmin, deleteProjectAdmin } from "../../utils/api";

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await getAdminProjects({ limit: 200 });
      const list = res?.data?.data?.projects || [];
      setProjects(list);
    } catch (e) {
      setMessage("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const setField = (index, key, value) => {
    setProjects((prev) => prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)));
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image file must be less than 5MB");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/upload/image", { method: "POST", body: formData, credentials: "include" });
      const result = await res.json();
      if (result?.success && result?.imageUrl) {
        setField(index, "ProjectImg", result.imageUrl);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      e.target.value = '';
    }
  };

  const addProject = () => {
    setProjects((prev) => [
      {
        ProjectTitle: "",
        ProjectLink: "/",
        ProjectImg: "",
        isActive: true,
        _isNew: true,
      },
      ...prev,
    ]);
  };

  const saveProject = async (index) => {
    const proj = projects[index];
    if (!proj?.ProjectTitle || !proj?.ProjectImg) {
      alert("Project title and image are required");
      return;
    }
    try {
      setSaving(true);
      if (proj._id) {
        await updateProjectAdmin(proj._id, {
          ProjectTitle: proj.ProjectTitle,
          ProjectLink: proj.ProjectLink || "/",
          ProjectImg: proj.ProjectImg,
          isActive: !!proj.isActive,
        });
      } else {
        await createProjectAdmin({
          ProjectTitle: proj.ProjectTitle,
          ProjectLink: proj.ProjectLink || "/",
          ProjectImg: proj.ProjectImg,
          isActive: !!proj.isActive,
        });
      }
      await loadProjects();
      alert("Saved");
    } catch (e) {
      alert("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const removeProject = async (index) => {
    const proj = projects[index];
    if (!proj) return;
    if (!confirm("Delete this project?")) return;
    try {
      setSaving(true);
      if (proj._id) {
        await deleteProjectAdmin(proj._id);
      }
      setProjects((prev) => prev.filter((_, i) => i !== index));
    } catch (e) {
      alert("Failed to delete project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={addProject}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={saving}
        >
          Add Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((proj, index) => (
          <details key={proj._id || index} className="border rounded-lg bg-white">
            <summary className="px-4 py-3 cursor-pointer font-semibold list-none [&::-webkit-details-marker]:hidden">
              {proj.ProjectTitle || "New Project"}
              <div className="float-right flex gap-2">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); saveProject(index); }}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={saving}
                >Save</button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeProject(index); }}
                  className="text-red-600 hover:text-red-800 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={saving}
                >Delete</button>
              </div>
            </summary>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={proj.ProjectTitle || ""}
                    onChange={(e) => setField(index, 'ProjectTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="text"
                    value={proj.ProjectLink || "/"}
                    onChange={(e) => setField(index, 'ProjectLink', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  <div className="flex gap-2 items-center">
                    <div className="relative">
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, index)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <button type="button" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Upload Image</button>
                    </div>
                    {proj.ProjectImg && (
                      <button type="button" className="px-3 py-2 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200" onClick={() => setField(index, 'ProjectImg', '')}>Clear</button>
                    )}
                  </div>
                  {proj.ProjectImg && (
                    <div className="mt-2">
                      <img src={proj.ProjectImg} alt="Preview" className="h-24 object-cover rounded-md border" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input id={`active-${index}`} type="checkbox" checked={!!proj.isActive} onChange={(e) => setField(index, 'isActive', e.target.checked)} />
                  <label htmlFor={`active-${index}`}>Active</label>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>

      {message && (
        <div className={`mt-4 p-4 rounded-md ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}


