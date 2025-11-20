"use client";

import { useEffect, useState } from "react";
import { upsertContentNext } from "@/app/(admin)/utils/api";

const DEFAULT_ABOUT = {
  title: "About Us",
  subtitle: "Narsingh Dass Group is a multifarious trading group, renowned and much admired in the paper industry.",
  description: "With a corporate philosophy based on Knowledge Partnership, Narsingh Dass Group follows a guiding principle of Customers Grow, We Grow. With this belief, the group has enjoyed consistent growth and expansion over the years and has transformed itself from a trading company to a complete Solution Marketing Group.",
  heroImage: "/images/about-hero.png",
  stats: [
    { id: 'years', number: '35+', label: 'Years of Excellence', icon: 'Trophy' },
    { id: 'projects', number: '250+', label: 'Projects Delivered', icon: 'Building2' },
    { id: 'clients', number: '98%', label: 'Client Retention', icon: 'Users' }
  ],
  visionTitle: "Our Vision & Core Principles",
  visionDescription: "We are committed to pushing the boundaries of excellence while maintaining unwavering dedication to sustainability and innovation. Our approach combines cutting-edge technology with time-tested craftsmanship.",
  corePrinciples: ['Trust', 'Togetherness', 'Excellence', 'Compassion'],
  logoDescription: {
    represents: "Represents a Paper Fan which denotes the different group activities",
    wings: "The wings, unattached, converge to one focal point, the Consumer!",
    colors: "The changing colors and the circular movement of the fan reflect the dynamism and continuous growth of the group."
  },
  contactInfo: {
    title: 'Get in Touch',
    subtitle: 'Contact us today and let\'s bring it to life.',
    phone1: '+91 9873173214',
    phone2: '+91 9205992676',
    email1: 'material@narsinghdass.com',
    email2: 'smpl@narsinghdass.com'
  }
};

export default function AboutPage() {
  const [data, setData] = useState(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' | 'error'
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/content/about/about", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          setData(json?.content || DEFAULT_ABOUT);
        }
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, []);

  const setField = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessageType('error');
      setMessage('Please select an image file');
      return;
    }

    // Validate file size (5MB limit for images)
    if (file.size > 5 * 1024 * 1024) {
      setMessageType('error');
      setMessage('Image file must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success) {
        setData({
          ...data,
          heroImage: result.imageUrl
        });
        setMessageType('success');
        setMessage('Image uploaded successfully');
      } else {
        setMessageType('error');
        setMessage('Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setMessageType('error');
      setMessage('Failed to upload image');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const saveContent = async (section, content, title = "", successMessage) => {
    setSaving(true);
    setMessage("");
    setMessageType("");
    try {
      await upsertContentNext({
        section,
        pageType: "about",
        content,
        ...(title ? { title } : {})
      });
      setMessageType('success');
      setMessage(successMessage);
    } catch (e) {
      const errorMessage = `Failed to save ${section}. ${e.message || ''}`;
      setMessageType('error');
      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const saveHero = () => saveContent("about-us-hero", {
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    heroImage: data.heroImage
  }, "About Hero", "Hero saved successfully");

  const saveStats = () => saveContent("about-us-stats", {
    stats: data.stats
  }, "About Stats", "Stats saved successfully");

  const saveVision = () => saveContent("about-us-vision", {
    visionTitle: data.visionTitle,
    visionDescription: data.visionDescription,
    corePrinciples: data.corePrinciples
  }, "About Vision", "Vision section saved successfully");

  const saveLogo = () => saveContent("about-us-logo", {
    logoDescription: data.logoDescription
  }, "About Logo", "Logo section saved successfully");

  const saveContact = () => saveContent("about-us-contact", {
    contactInfo: data.contactInfo
  }, "About Contact", "Contact section saved successfully");

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">About Us Content</h1>

      <style jsx>{`
        /* Hide default disclosure arrow on summary elements */
        summary::-webkit-details-marker { display: none; }
        summary::marker { content: ''; }
      `}</style>

      {message && (
        <div
          className={`mb-4 rounded-md border px-4 py-3 text-sm ${
            messageType === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : messageType === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}
        >
          {message}
        </div>
      )}

      <details className="border rounded-lg my-3 bg-white shadow-sm" open>
        <summary className="px-4 py-3 cursor-pointer font-semibold">Hero Section</summary>
        <div className="p-4">
          <label className="block font-semibold mt-3 mb-1">Title</label>
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={data.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="Hero title"
          />
          <label className="block font-semibold mt-3 mb-1">Subtitle</label>
          <textarea
            className="w-full h-32 p-2 mt-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={data.subtitle}
            onChange={(e) => setField("subtitle", e.target.value)}
            placeholder="Hero subtitle"
          />
          <label className="block font-semibold mt-3 mb-1">Description</label>
          <textarea
            className="w-full h-48 p-2 mt-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={data.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Hero description"
          />

          <label className="block font-semibold mt-3 mb-1">Hero Image</label>
          <div className="flex gap-2 mb-2 items-center">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadingImage}
              />
              <button
                type="button"
                className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ${
                  uploadingImage ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
            {data.heroImage && (
              <button
                type="button"
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded border hover:bg-gray-200"
                onClick={() => setField('heroImage', '')}
              >
                Clear
              </button>
            )}
          </div>

          {data.heroImage && (
            <div className="mt-2">
              <img
                src={data.heroImage}
                alt="Preview"
                className="h-24 object-cover rounded-md border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60" disabled={saving} onClick={saveHero}>
            {saving ? "Saving..." : "Save Hero"}
          </button>
        </div>
      </details>

      <details className="border rounded-lg my-3 bg-white shadow-sm">
        <summary className="px-4 py-3 cursor-pointer font-semibold">Stats Section</summary>
        <div className="p-4">
          {data.stats.map((stat, index) => (
            <div key={stat.id || index} className="mb-4 p-3 border rounded bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Stat {index + 1}</span>
                <button
                  type="button"
                  className="text-red-600 text-sm hover:underline"
                  onClick={() => {
                    const newStats = data.stats.filter((_, i) => i !== index);
                    setField('stats', newStats);
                  }}
                >
                  Remove
                </button>
              </div>
              <label className="block font-semibold mb-1">Number</label>
              <input
                className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={stat.number}
                onChange={(e) => {
                  const newStats = [...data.stats];
                  newStats[index].number = e.target.value;
                  setField("stats", newStats);
                }}
                placeholder="e.g., 35+"
              />
              <label className="block font-semibold mb-1">Label</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={stat.label}
                onChange={(e) => {
                  const newStats = [...data.stats];
                  newStats[index].label = e.target.value;
                  setField("stats", newStats);
                }}
                placeholder="e.g., Years of Excellence"
              />
            </div>
          ))}

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded border hover:bg-gray-200"
              onClick={() => {
                const newStat = { id: `stat-${Date.now()}`, number: '', label: '' };
                setField('stats', [...data.stats, newStat]);
              }}
            >
              Add Stat
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60" disabled={saving} onClick={saveStats}>
            {saving ? "Saving..." : "Save Stats"}
            </button>
          </div>
        </div>
      </details>

      <details className="border rounded-lg my-3 bg-white shadow-sm">
        <summary className="px-4 py-3 cursor-pointer font-semibold">Vision Section</summary>
        <div className="p-4">
          <label className="block font-semibold mt-3 mb-1">Vision Title</label>
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={data.visionTitle}
            onChange={(e) => setField("visionTitle", e.target.value)}
            placeholder="Vision title"
          />
          <label className="block font-semibold mt-3 mb-1">Vision Description</label>
          <textarea
            className="w-full h-32 p-2 mt-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={data.visionDescription}
            onChange={(e) => setField("visionDescription", e.target.value)}
            placeholder="Vision description"
          />
          <label className="block font-semibold mt-3 mb-1">Core Principles (one per line)</label>
          <textarea
            className="w-full h-24 p-2 mt-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={data.corePrinciples.join('\n')}
            onChange={(e) => setField("corePrinciples", e.target.value.split('\n').filter(Boolean))}
            placeholder="One principle per line"
          />

          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60" disabled={saving} onClick={saveVision}>
            {saving ? "Saving..." : "Save Vision"}
          </button>
        </div>
      </details>

      <details className="border rounded-lg my-3 bg-white shadow-sm">
        <summary className="px-4 py-3 cursor-pointer font-semibold">Logo Section</summary>
        <div className="p-4">
          <label className="block font-semibold mt-3 mb-1">Logo Description - Represents</label>
          <textarea
            className="w-full h-24 p-2 mt-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={data.logoDescription.represents}
            onChange={(e) => setField("logoDescription", { ...data.logoDescription, represents: e.target.value })}
            placeholder="What the logo represents"
          />
          <label className="block font-semibold mt-3 mb-1">Logo Description - Wings</label>
          <textarea
            className="w-full h-24 p-2 mt-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={data.logoDescription.wings}
            onChange={(e) => setField("logoDescription", { ...data.logoDescription, wings: e.target.value })}
            placeholder="Description about wings"
          />
          <label className="block font-semibold mt-3 mb-1">Logo Description - Colors</label>
          <textarea
            className="w-full h-24 p-2 mt-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={data.logoDescription.colors}
            onChange={(e) => setField("logoDescription", { ...data.logoDescription, colors: e.target.value })}
            placeholder="Description about colors and movement"
          />

          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60" disabled={saving} onClick={saveLogo}>
            {saving ? "Saving..." : "Save Logo"}
          </button>
        </div>
      </details>

      <details className="border rounded-lg my-3 bg-white shadow-sm">
        <summary className="px-4 py-3 cursor-pointer font-semibold">Contact Section</summary>
        <div className="p-4">
          <label className="block font-semibold mt-3 mb-1">Contact Title</label>
          <input
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={data.contactInfo.title}
            onChange={(e) => setField("contactInfo", { ...data.contactInfo, title: e.target.value })}
            placeholder="Contact title"
          />
          <label className="block font-semibold mt-3 mb-1">Contact Subtitle</label>
          <textarea
            className="w-full h-24 p-2 mt-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={data.contactInfo.subtitle}
            onChange={(e) => setField("contactInfo", { ...data.contactInfo, subtitle: e.target.value })}
            placeholder="Contact subtitle"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mt-3 mb-1">Phone 1</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={data.contactInfo.phone1}
                onChange={(e) => setField("contactInfo", { ...data.contactInfo, phone1: e.target.value })}
                placeholder="Primary phone number"
              />
            </div>
            <div>
              <label className="block font-semibold mt-3 mb-1">Phone 2</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={data.contactInfo.phone2}
                onChange={(e) => setField("contactInfo", { ...data.contactInfo, phone2: e.target.value })}
                placeholder="Secondary phone number"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mt-3 mb-1">Email 1</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={data.contactInfo.email1}
                onChange={(e) => setField("contactInfo", { ...data.contactInfo, email1: e.target.value })}
                placeholder="Primary email"
              />
            </div>
            <div>
              <label className="block font-semibold mt-3 mb-1">Email 2</label>
              <input
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={data.contactInfo.email2}
                onChange={(e) => setField("contactInfo", { ...data.contactInfo, email2: e.target.value })}
                placeholder="Secondary email"
              />
            </div>
          </div>

          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60" disabled={saving} onClick={saveContact}>
            {saving ? "Saving..." : "Save Contact"}
          </button>
        </div>
      </details>

      {/* Spacer */}
      <div className="h-4" />
    </div>
  );
}
