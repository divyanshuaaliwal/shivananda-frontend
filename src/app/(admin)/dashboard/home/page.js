"use client";

import { useEffect, useState } from "react";
import { upsertContentNext } from "@/app/(admin)/utils/api";

// Reusable UI components and editors defined outside the main component to avoid remounts on every render
function Button({ children, onClick, type = "button", variant = "primary", disabled = false }) {
  const base = "px-4 py-2 rounded transition-colors";
  const variants = {
    primary: `bg-blue-600 text-white hover:bg-blue-700 ${disabled ? 'opacity-75 cursor-not-allowed hover:bg-blue-600' : ''}`,
    secondary: `bg-gray-700 text-white hover:bg-gray-800 ${disabled ? 'opacity-75 cursor-not-allowed hover:bg-gray-700' : ''}`,
    danger: `bg-red-600 text-white hover:bg-red-700 ${disabled ? 'opacity-75 cursor-not-allowed hover:bg-red-600' : ''}`,
    success: `bg-green-600 text-white hover:bg-green-700 ${disabled ? 'opacity-75 cursor-not-allowed hover:bg-green-600' : ''}`,
    ghost: `bg-transparent text-gray-700 hover:bg-gray-100 ${disabled ? 'opacity-75 cursor-not-allowed hover:bg-transparent' : ''}`,
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}

function SectionCard({ title, description, actions, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex items-start gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Collapse section' : 'Expand section'}
              className="mt-0.5 p-1.5 rounded hover:bg-gray-100 text-gray-600"
            >
              <svg className={`w-5 h-5 transition-transform ${isOpen ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="min-w-0">
              <h2 className="font-semibold text-gray-900 truncate">{title}</h2>
              {description ? <p className="text-sm text-gray-500 mt-0.5">{description}</p> : null}
            </div>
          </div>
          {actions ? <div className="shrink-0 flex items-center gap-2">{actions}</div> : null}
        </div>
      </div>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

function reorderArray(array, fromIndex, toIndex) {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

function IndustriesEditor({ items, setItems, uploadingImages, handleImageUpload, saving }) {
  const [dragIndex, setDragIndex] = useState(null);

  const updateField = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const addItem = () => setItems([...(items || []), { image: '', title: '', href: '' }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const onDragStart = (index) => setDragIndex(index);
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;
    setItems(reorderArray(items, dragIndex, index));
    setDragIndex(null);
  };

  const uploadKey = (idx) => `industries-${idx}-image`;

  return (
    <div className="space-y-3">
      {(!items || items.length === 0) ? (
        <div className="text-center py-10 border rounded-xl bg-gray-50">
          <p className="text-gray-500 mb-3">No industries added yet.</p>
          <Button variant="success" onClick={addItem} disabled={saving}>Add first industry</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="rounded-lg border bg-white overflow-hidden shadow-sm"
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={onDragOver}
                onDrop={() => onDrop(idx)}
              >
                <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
                  <div className="flex items-center gap-2 text-gray-500">
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4h2v2H7V4zm4 0h2v2h-2V4zM7 9h2v2H7V9zm4 0h2v2h-2V9zM7 14h2v2H7v-2zm4 0h2v2h-2v-2z"/></svg>
                    <span className="text-xs">Drag to reorder</span>
                  </div>
                  <button
                    className="text-red-600 text-sm hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={!!saving}
                    onClick={() => removeItem(idx)}
                  >Remove</button>
                </div>

                <div className="p-3 space-y-3">
                  {/* Image Preview with Upload Button Overlay */}
                  <div className="relative group">
                    <div className="h-36 w-full rounded-md overflow-hidden bg-gray-100 border">
                      {it.image ? (
                        <img 
                          src={it.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            const parent = e.target.parentElement;
                            if (parent && !parent.querySelector('.image-preview-fallback')) {
                              const fallback = document.createElement('div');
                              fallback.className = 'image-preview-fallback w-full h-full flex items-center justify-center text-gray-400 text-sm';
                              fallback.textContent = 'Image preview not available';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                          No image
                        </div>
                      )}
                    </div>
                    {/* Upload Button Overlay - Shows on Hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'industries', idx, 'image')}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          disabled={!!uploadingImages[uploadKey(idx)]}
                        />
                        <button
                          type="button"
                          className={`px-6 py-3 rounded-lg font-medium shadow-lg ${
                            uploadingImages[uploadKey(idx)]
                              ? 'bg-green-400 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700'
                          } text-white transition-colors`}
                          disabled={!!uploadingImages[uploadKey(idx)]}
                        >
                          {uploadingImages[uploadKey(idx)] ? 'Uploading...' : '📤 Upload Image'}
                        </button>
                      </div>
                    </div>
                  </div>


                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Title</label>
                      <input
                        className="w-full p-2 border rounded"
                        placeholder="Industry title"
                        value={it.title || ''}
                        onChange={(e) => updateField(idx, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Link (href)</label>
                      <input
                        className="w-full p-2 border rounded"
                        placeholder="/Products/steel-fibre or https://..."
                        value={it.href || ''}
                        onChange={(e) => updateField(idx, 'href', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <Button variant="success" onClick={addItem} disabled={saving}>Add industry</Button>
          </div>
        </>
      )}
    </div>
  );
}

const DEFAULT_HOME = {
  title: "",
  subtitle: "",
  description: "",
  videoUrl: ""
};

export default function HomeEditor() {
  const [data, setData] = useState(DEFAULT_HOME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);

  // Other sections
  const [about, setAbout] = useState({
    heading: "About Us",
    description: "",
    yearsTitle: "35+",
    yearsSubtitle: "years of Business Excellence",
    establishedLabel: "Established in",
    establishedYear: "1989",
    projectsCount: "250+",
    projectsLabel: "National and State Projects",
  });
  const [industries, setIndustries] = useState([]); // [{image,title,href}]
  const [technology, setTechnology] = useState([]); // [{BlogLink,BlogImg,BlogTitle,BlogDate,BlogDesc,BlogBtn}]
  const [contacts, setContacts] = useState({
    address: "Shivananda Marketing Pvt. Ltd., NDG Cella, 11702/3,\nGT Road, Block 25, Shakti Nagar, Delhi - 110007\nDelhi, 110007",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.2159595874245!2d77.1969581!3d28.683185800000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfda659f0c013%3A0x4e338402ca192f01!2sNDG%20Cella%20Corporate!5e0!3m2!1sen!2sin!4v1745326872870!5m2!1sen!2sin"
  });

  useEffect(() => {
    if (hasLoaded) return; // Prevent double execution in StrictMode

    async function load() {
      try {
        // Load Hero
        await fetchSection("hero", (content) => setData(content || DEFAULT_HOME));

        // Load About
        await fetchSection("about", (content) => setAbout(prev => ({ ...prev, ...content })), about);

        // Load Industries
        await fetchSection("industries", setIndustries, [], true);

        // Load Technology from Blogs API (synced with Blogs)
        await fetchTechnologyFromBlogs();


        // Load Contacts
        await fetchSection("contacts", setContacts, contacts);
      } catch (error) {
        console.error('Error loading sections:', error);
      }
      setHasLoaded(true);
      setLoading(false);
    }
    load();
  }, [hasLoaded]);

  const setField = (key, value) => setData((d) => ({ ...d, [key]: value }));
  const setContactsField = (key, value) => setContacts((c) => ({ ...c, [key]: value }));

  // Generic function to fetch any content section
  const fetchSection = async (section, setter, defaultValue = null, useItems = false) => {
    try {
      const res = await fetch(`/api/content/${section}/home`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        const content = json?.content || {};
        setter(useItems ? content.items || defaultValue : content || defaultValue);
      }
    } catch (error) {
      console.error(`Error fetching ${section}:`, error);
    }
  };

  // Generic function to save any content section
  const saveContent = async (section, content, title = "", successMessage) => {
    setSaving(true);
    setMessage("");
    try {
      await upsertContentNext({
        section,
        pageType: "home",
        content,
        ...(title ? { title } : {})
      });
      setMessage(successMessage);
      if (typeof window !== 'undefined') {
        window.alert(successMessage);
      }
    } catch (e) {
      setMessage(`Failed to save ${section}.`);
    } finally {
      setSaving(false);
    }
  };

  // Technology: fetch from Blogs API to keep in sync
  const fetchTechnologyFromBlogs = async () => {
    try {
      const res = await fetch(`/api/Blog?page=1&limit=100`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const items = Array.isArray(json?.content?.items) ? json.content.items : [];
        setTechnology(items);
      }
    } catch (error) {
      console.error('Error fetching technology from blogs:', error);
    }
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file');
      return;
    }

    // Validate file size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      alert('Video file must be less than 25MB');
      return;
    }

    try {
      setUploadingVideo(true);

      const formData = new FormData();
      formData.append('video', file);

      // Use the Next.js API route for video uploads instead of direct backend call
      const response = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication if needed
      });

      const result = await response.json();

      if (result.success) {
        setData({
          ...data,
          videoUrl: result.videoUrl
        });
        alert('Video uploaded successfully');
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Failed to upload video');
    } finally {
      setUploadingVideo(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleImageUpload = async (event, section, itemIndex, field) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit for images)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file must be less than 5MB');
      return;
    }

    try {
      setUploadingImages(prev => ({ ...prev, [`${section}-${itemIndex}-${field}`]: true }));

      const formData = new FormData();
      formData.append('image', file);

      // Use the Next.js API route for image uploads instead of direct backend call
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        // Important: Don't set Content-Type header, let the browser set it with the correct boundary
        credentials: 'include', // Include cookies for authentication if needed
      });

      const result = await response.json();

      if (result.success) {
        // Update the specific item in the array
        const updateItemInArray = (array, setArray) => {
          const updatedArray = [...array];
          if (updatedArray[itemIndex]) {
            updatedArray[itemIndex] = { ...updatedArray[itemIndex], [field]: result.imageUrl };
            setArray(updatedArray);
          }
        };

        switch (section) {
          case 'industries':
            updateItemInArray(industries, setIndustries);
            break;
          case 'technology':
            updateItemInArray(technology, setTechnology);
            break;
        }

        alert('Image uploaded successfully');
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [`${section}-${itemIndex}-${field}`]: false }));
      // Reset file input
      event.target.value = '';
    }
  };
  const saveHero = () => saveContent("hero", data, "Home Hero", "Hero saved successfully");
  const saveAboutSection = () => saveContent("about", about, "About Section", "About section saved successfully");
  
  const saveIndustriesSection = () => {
    saveContent("industries", { items: industries }, "Industries", "Industries saved successfully");
  };
  
  // Technology section is synced with Blogs. No manual save.
  const saveContactsSection = () => saveContent("contacts", contacts, "Address Section", "Address section saved successfully");

  // Generic Array Manager Component for Industries, Technology, and Products
  const ArrayManager = ({ title, items, setItems, fields, addButtonText, itemTemplate, gridCols = "grid-cols-1 md:grid-cols-4" }) => {
    const updateItem = (index, field, value) => {
      const updatedItems = [...items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      setItems(updatedItems);
    };

    const removeItem = (index) => {
      setItems(items.filter((_, i) => i !== index));
    };

    const addItem = () => {
      setItems([...items, itemTemplate]);
    };

    const renderField = (field, item, index, section) => {
      const isImageField = field.key.toLowerCase().includes('image') || field.key.toLowerCase().includes('img');
      const uploadKey = `${section}-${index}-${field.key}`;
      const isUploading = uploadingImages[uploadKey];

      if (isImageField) {
        return (
          <div key={field.key}>
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 p-2 border rounded"
                placeholder={field.placeholder}
                value={item[field.key] || ''}
                onChange={(e) => updateItem(index, field.key, e.target.value)}
              />
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, section, index, field.key)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <button
                  type="button"
                  className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                    isUploading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
            {item[field.key] && (
              <div className="mt-2">
                <img
                  src={item[field.key]}
                  alt="Preview"
                  className="h-24 object-cover rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );
      }

      return (
        <input
          key={field.key}
          className="w-full p-2 border rounded"
          placeholder={field.placeholder}
          value={item[field.key] || ''}
          onChange={(e) => updateItem(index, field.key, e.target.value)}
        />
      );
    };

    return (
      <div className="p-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">No {title.toLowerCase()} configured yet.</p>
            <p className="text-sm">Click "Add Row" to add your first {title.toLowerCase()} item.</p>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Current {title.toLowerCase()} ({items.length} items):</p>
            {items.map((item, idx) => (
              <div className={`grid ${gridCols} gap-2 mb-2 p-3 border rounded bg-gray-50`} key={idx}>
                {fields.map((field) => renderField(field, item, idx, title.toLowerCase()))}
                <div className="flex gap-2">
                  <button
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={saving}
                    onClick={() => removeItem(idx)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={saving}
          onClick={addItem}
        >
          Add Row
        </button>
      </div>
    );
  };

  // (moved Button, SectionCard, reorderArray, IndustriesEditor to top-level to avoid remounts)

  const QuickActionLink = ({ href, label, icon }) => (
    <a href={href} className="group flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center text-gray-600">
          {icon}
        </div>
        <span className="font-medium text-gray-800">{label}</span>
      </div>
      <span className="text-gray-400 group-hover:text-gray-600">→</span>
    </a>
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 animate-pulse">
        <div className="h-7 w-40 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-40 bg-gray-200 rounded" />
            <div className="h-40 bg-gray-200 rounded" />
            <div className="h-40 bg-gray-200 rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-sm text-gray-500">Manage and organize your homepage content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard
            title="Hero"
            description="Main headline, subtext and optional background video."
            actions={<Button onClick={saveHero} disabled={saving}>{saving ? 'Saving...' : 'Save Hero'}</Button>}
            defaultOpen
          >
        <label className="block font-semibold mt-3 mb-1">Title</label>
        <input
          className="w-full p-2 border rounded"
          value={data.title}
          onChange={(e) => setField("title", e.target.value)}
          placeholder="Hero title"
        />
        <label className="block font-semibold mt-3 mb-1">Subtitle</label>
        <input
          className="w-full p-2 border rounded"
          value={data.subtitle}
          onChange={(e) => setField("subtitle", e.target.value)}
          placeholder="Hero subtitle"
        />
        <label className="block font-semibold mt-3 mb-1">Description</label>
        <textarea
              className="w-full h-40 p-2 mt-1 border rounded"
          value={data.description}
          onChange={(e) => setField("description", e.target.value)}
          placeholder="Hero description"
        />

        <label className="block font-semibold mt-3 mb-1">Background Video</label>
        <div className="flex gap-2 mb-2 items-center">
          <div className="relative">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploadingVideo}
            />
            <button
              type="button"
              className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
                uploadingVideo ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={uploadingVideo}
            >
              {uploadingVideo ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
          {data.videoUrl && (
            <button
              type="button"
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200"
              onClick={() => setField('videoUrl', '')}
            >
              Clear
            </button>
          )}
        </div>

        {data.videoUrl && (
          <div className="mt-2">
            <video
              src={data.videoUrl}
              className="h-32 object-cover rounded-md border"
              controls
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                if (parent && !parent.querySelector('.video-preview-fallback')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'video-preview-fallback h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm';
                  fallback.textContent = 'Video preview not available';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        )}

        {/* Show default video when no custom video is uploaded */}
        {!data.videoUrl && (
          <div className="mt-2">
            <div className="text-sm text-gray-500 mb-2">Default background video:</div>
            <video
              src="/images/hero_bg.mp4"
              className="h-32 object-cover rounded-md border"
              controls
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                if (parent && !parent.querySelector('.video-preview-fallback')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'video-preview-fallback h-32 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm';
                  fallback.textContent = 'Default video not available';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        )}

          </SectionCard>

          <SectionCard
            title="About"
            description="Showcase experience and key stats."
            actions={<Button onClick={saveAboutSection} disabled={saving}>{saving ? 'Saving...' : 'Save About'}</Button>}
          >
        <label className="block font-semibold mt-3 mb-1">Heading</label>
        <input className="w-full p-2 border rounded" value={about.heading} onChange={(e)=>setAbout({...about, heading: e.target.value})} />
        <label className="block font-semibold mt-3 mb-1">Description</label>
            <textarea className="w-full h-40 p-2 mt-1 border rounded" value={about.description} onChange={(e)=>setAbout({...about, description: e.target.value})} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold mt-3 mb-1">Years Title</label>
            <input className="w-full p-2 border rounded" value={about.yearsTitle} onChange={(e)=>setAbout({...about, yearsTitle: e.target.value})} />
          </div>
          <div>
            <label className="block font-semibold mt-3 mb-1">Years Subtitle</label>
            <input className="w-full p-2 border rounded" value={about.yearsSubtitle} onChange={(e)=>setAbout({...about, yearsSubtitle: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold mt-3 mb-1">Established Label</label>
            <input className="w-full p-2 border rounded" value={about.establishedLabel} onChange={(e)=>setAbout({...about, establishedLabel: e.target.value})} />
          </div>
          <div>
            <label className="block font-semibold mt-3 mb-1">Established Year</label>
            <input className="w-full p-2 border rounded" value={about.establishedYear} onChange={(e)=>setAbout({...about, establishedYear: e.target.value})} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold mt-3 mb-1">Projects Count</label>
            <input className="w-full p-2 border rounded" value={about.projectsCount} onChange={(e)=>setAbout({...about, projectsCount: e.target.value})} />
          </div>
          <div>
            <label className="block font-semibold mt-3 mb-1">Projects Label</label>
            <input className="w-full p-2 border rounded" value={about.projectsLabel} onChange={(e)=>setAbout({...about, projectsLabel: e.target.value})} />
          </div>
        </div>
          </SectionCard>

          <SectionCard
            title="Industries"
            description="Tiles for industry categories shown on the homepage. Drag to reorder."
            actions={<Button onClick={saveIndustriesSection} disabled={saving}>{saving ? 'Saving...' : 'Save Industries'}</Button>}
          >
            <IndustriesEditor
              items={industries}
              setItems={setIndustries}
              uploadingImages={uploadingImages}
              handleImageUpload={handleImageUpload}
              saving={saving}
            />
          </SectionCard>

          <SectionCard
            title="Technology"
            description="Auto-synced from the latest blogs."
            actions={
              <div className="flex items-center gap-2">
                <Button variant="secondary" type="button" onClick={fetchTechnologyFromBlogs}>Refresh from Blogs</Button>
                <span className="text-sm text-gray-500">{technology.length} item(s)</span>
              </div>
            }
          >
          {technology.length === 0 ? (
            <div className="text-gray-500">No blogs found. Add a blog to populate this section.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {technology.map((item, idx) => (
                <div key={idx} className="p-3 border rounded bg-gray-50">
                  <div className="flex gap-3">
                    <div className="w-28 h-20 overflow-hidden rounded bg-white border">
                      {item.BlogImg ? (
                        <img src={item.BlogImg} alt={item.BlogTitle || 'Preview'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold line-clamp-2">{item.BlogTitle || 'Untitled'}</div>
                      <div className="text-sm text-gray-600">{item.BlogDate}</div>
                      <div className="text-sm text-gray-700 line-clamp-2 mt-1">{item.BlogDesc}</div>
                      {item.BlogLink && (
                        <a className="text-blue-600 text-sm mt-1 inline-block hover:underline" href={item.BlogLink} target="_blank" rel="noreferrer">
                          View Blog →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </SectionCard>

          <SectionCard
            title="Address Section"
            description="Office address and Google Maps embed."
            actions={<Button onClick={saveContactsSection} disabled={saving}>{saving ? 'Saving...' : 'Save Address'}</Button>}
          >
          <label className="block font-semibold mt-3 mb-1">Address</label>
          <textarea
            className="w-full h-40 p-2 mt-1 border rounded"
            value={contacts.address}
            onChange={(e) => setContactsField("address", e.target.value)}
            placeholder="Enter your office address"
          />

          <label className="block font-semibold mt-3 mb-1">Google Maps Embed URL</label>
          <input
            className="w-full p-2 border rounded"
            value={contacts.mapEmbedUrl}
            onChange={(e) => setContactsField("mapEmbedUrl", e.target.value)}
            placeholder="https://www.google.com/maps/embed?..."
          />
          </SectionCard>
        </div>

        <div className="space-y-6 lg:sticky lg:top-4 self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-auto">
          <div className="border rounded-xl bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Quick actions</h3>
            <div className="space-y-2">
              <QuickActionLink href="/dashboard/products" label="Manage Products" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
              <QuickActionLink href="/dashboard/blogs" label="Manage Blogs" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>} />
              <QuickActionLink href="/dashboard/contact" label="View Contacts" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" /></svg>} />
            </div>
          </div>

          {message && (
            <div className="border rounded-xl bg-white p-4 shadow-sm text-sm text-gray-700">{message}</div>
          )}

          <div className="border rounded-xl bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Tips</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Technology items are synced from your blogs list.</li>
              <li>Remember to click the Save button for each section.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
