"use client";

import { useEffect, useState } from "react";
import { upsertContentNext } from "@/app/(admin)/utils/api";

const DEFAULT_CONTACT = {
  heading: "Get in touch with us",
  intro: "Please fill in your details and our dedicated team will reach out.",
  phones: ["+91 9873173214", "+91 9205992676"],
  emails: ["smpl@narsinghdass.com", "material@narsinghdass.com"],
  address: "",
  mapEmbedUrl: "",
};

export default function ContactEditor() {
  const [data, setData] = useState(DEFAULT_CONTACT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/content/contact/main", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          setData(json?.content || DEFAULT_CONTACT);
        }
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, []);

  const setField = (k, v) => setData((d) => ({ ...d, [k]: v }));

  async function onSave() {
    setSaving(true);
    setMessage("");
    try {
      await upsertContentNext({ section: "contact", pageType: "main", content: data });
      setMessage("Saved successfully");
      if (typeof window !== 'undefined') {
        window.alert('Contact page saved successfully');
      }
    } catch (e) {
      setMessage("Failed to save. Check your login / connection.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Contact Page Content</h1>

      <label className="block font-semibold mt-3 mb-1">Heading</label>
      <input
        className="w-full p-2 border rounded"
        value={data.heading}
        onChange={(e) => setField("heading", e.target.value)}
        placeholder="Heading"
      />

      <label className="block font-semibold mt-3 mb-1">Intro</label>
      <textarea
        className="w-full h-40 p-2 mt-1 border rounded"
        value={data.intro}
        onChange={(e) => setField("intro", e.target.value)}
        placeholder="Intro text"
      />

      <label className="block font-semibold mt-3 mb-1">Phones (one per line)</label>
      <textarea
        className="w-full h-40 p-2 mt-1 border rounded"
        value={(data.phones || []).join("\n")}
        onChange={(e) => setField("phones", e.target.value.split(/\n+/).map((s)=>s.trim()).filter(Boolean))}
      />

      <label className="block font-semibold mt-3 mb-1">Emails (one per line)</label>
      <textarea
        className="w-full h-40 p-2 mt-1 border rounded"
        value={(data.emails || []).join("\n")}
        onChange={(e) => setField("emails", e.target.value.split(/\n+/).map((s)=>s.trim()).filter(Boolean))}
      />

      <label className="block font-semibold mt-3 mb-1">Address</label>
      <textarea
        className="w-full h-40 p-2 mt-1 border rounded"
        value={data.address}
        onChange={(e) => setField("address", e.target.value)}
      />

      <label className="block font-semibold mt-3 mb-1">Google Maps Embed URL</label>
      <input
        className="w-full p-2 border rounded"
        value={data.mapEmbedUrl}
        onChange={(e) => setField("mapEmbedUrl", e.target.value)}
        placeholder="https://www.google.com/maps/embed?..."
      />

      <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={saving} onClick={onSave}>
        {saving ? "Saving..." : "Save"}
      </button>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}

