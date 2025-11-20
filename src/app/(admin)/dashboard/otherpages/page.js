"use client";

import { useEffect, useState } from "react";
import { upsertContentNext } from "@/app/(admin)/utils/api";

const DEFAULT_PAGE = {
  title: "",
  body: "",
  images: [],
  metaTitle: "",
  metaDescription: "",
};

export default function OtherPagesEditor() {
  const [slug, setSlug] = useState("");
  const [data, setData] = useState(DEFAULT_PAGE);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/content/other/${slug}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json?.content || DEFAULT_PAGE);
      } else {
        setData(DEFAULT_PAGE);
      }
    } catch (_) {
      setData(DEFAULT_PAGE);
    } finally {
      setLoading(false);
    }
  }

  async function onSave() {
    if (!slug) {
      setMessage("Please enter a page slug");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await upsertContentNext({ section: "other", pageType: slug, content: data });
      setMessage("Saved successfully");
      if (typeof window !== 'undefined') {
        window.alert(`Page "${slug}" saved successfully`);
      }
    } catch (e) {
      setMessage("Failed to save. Check your login / connection.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Other Pages</h1>

      <label className="block font-semibold mt-3 mb-1">Page Slug</label>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={slug}
          onChange={(e) => setSlug(e.target.value.trim())}
          placeholder="e.g. careers, testimonials, faq"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" onClick={load} disabled={!slug || loading}>
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

      <label className="block font-semibold mt-3 mb-1">Title</label>
      <input
        className="w-full p-2 border rounded"
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
        placeholder="Page Title"
      />

      <label className="block font-semibold mt-3 mb-1">Body</label>
      <textarea
        className="w-full h-48 p-2 mt-1 border rounded"
        value={data.body}
        onChange={(e) => setData({ ...data, body: e.target.value })}
        placeholder="Page content (markdown or plain text)"
      />


      <label className="block font-semibold mt-3 mb-1">Meta Title</label>
      <input
        className="w-full p-2 border rounded"
        value={data.metaTitle}
        onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
        placeholder="SEO title"
      />

      <label className="block font-semibold mt-3 mb-1">Meta Description</label>
      <textarea
        className="w-full h-32 p-2 mt-1 border rounded"
        value={data.metaDescription}
        onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
        placeholder="SEO description"
      />

      <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" onClick={onSave} disabled={saving || !slug}>
        {saving ? "Saving..." : "Save"}
      </button>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}

