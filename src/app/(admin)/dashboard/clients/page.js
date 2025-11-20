"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { upsertContentNext } from "@/app/(admin)/utils/api";

const DEFAULT_ITEMS = [];

export default function ClientsEditor() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const dragIndexRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/content/clients/list", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          const list = (json?.content?.items || []).map((i) => ({
            name: i.name || "",
            logo: i.logo || "",
            link: i.link || "",
            order: Number(i.order) || 0,
            isActive: i.isActive !== false,
          }));
          const sorted = list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setItems(sorted.map((it, idx) => ({ ...it, order: idx + 1 })));
        }
      } catch (_) {}
      setLoading(false);
    }
    load();
  }, []);

  const addItem = () => {
    setItems((prev) => {
      const nextOrder = (prev[prev.length - 1]?.order || 0) + 1;
      return [
        ...prev,
        { name: "", logo: "", link: "", order: nextOrder, isActive: true },
      ];
    });
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index).map((it, idx) => ({ ...it, order: idx + 1 })));
  };

  const setField = (index, key, value) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [key]: value } : it)));
  };

  const validLogo = (logo) => {
    if (typeof logo !== 'string') return false;
    const v = logo.trim();
    if (!v) return false;
    return v.startsWith('/') || v.startsWith('http://') || v.startsWith('https://');
  };
  const showLogoInvalid = (logo) => {
    if (!logo || typeof logo !== 'string' || logo.trim() === '') return false; // don't show error when empty
    return !validLogo(logo);
  };

  const onDragStart = (e, index) => {
    dragIndexRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e, dropIndex) => {
    e.preventDefault();
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from === null || from === undefined || from === dropIndex) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(dropIndex, 0, moved);
      return next.map((it, idx) => ({ ...it, order: idx + 1 }));
    });
  };

  const handleUpload = async (event, index) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image must be < 5MB'); return; }
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload/image', { method: 'POST', body: formData, credentials: 'include' });
      const result = await res.json();
      if (result?.success && result?.imageUrl) {
        setField(index, 'logo', result.imageUrl);
      } else {
        alert('Upload failed');
      }
    } catch (e) {
      alert('Upload failed');
    } finally {
      event.target.value = '';
    }
  };

  const onSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const normalized = items
        .map((it, idx) => ({ ...it, order: idx + 1 }))
        .map((it) => ({ name: it.name, logo: it.logo, link: it.link, order: it.order, isActive: it.isActive !== false }));

      await upsertContentNext({
        section: 'clients',
        pageType: 'list',
        title: 'Clients / Partners',
        content: { items: normalized },
      });
      setItems(normalized);
      setMessage('Saved successfully');
      if (typeof window !== 'undefined') alert('Clients saved successfully');
    } catch (e) {
      setMessage('Failed to save. Check your login / connection.');
    } finally {
      setSaving(false);
    }
  };

  const allValid = useMemo(
    () => items.length > 0 && items.every((i) => !!i.name && !!i.logo && validLogo(i.logo)),
    [items]
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Clients / Partners</h1>
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={saving}
            onClick={addItem}
          >Add Client</button>
          <button
            className={`px-4 py-2 rounded text-white ${saving ? 'bg-gray-400' : allValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400'}`}
            disabled={saving}
            onClick={onSave}
          >{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white border rounded p-3"
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="cursor-move select-none px-2 py-1 text-sm bg-gray-100 rounded">↕</span>
                <span className="text-sm text-gray-600">Order: {item.order}</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={item.isActive !== false} onChange={(e) => setField(index, 'isActive', e.target.checked)} />
                  Active
                </label>
                <button
                  className="text-red-600 hover:text-red-800 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={saving}
                  onClick={() => removeItem(index)}
                >Delete</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => setField(index, 'name', e.target.value)}
                  className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="text"
                  value={item.link}
                  onChange={(e) => setField(index, 'link', e.target.value)}
                  className="w-full min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://... or /path"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="text"
                    value={item.logo}
                    onChange={(e) => setField(index, 'logo', e.target.value)}
                    className={`flex-1 min-w-0 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${showLogoInvalid(item.logo) ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    placeholder="/uploads/.. or https://.."
                  />
                  <div className="relative shrink-0">
                    <input type="file" accept="image/*" onChange={(e) => handleUpload(e, index)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <button type="button" className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 whitespace-nowrap">Upload</button>
                  </div>
                </div>
                {showLogoInvalid(item.logo) && <div className="text-xs text-red-600 mt-1">Enter a valid logo URL</div>}
              </div>
            </div>

            {item.logo && validLogo(item.logo) && (
              <div className="mt-3">
                <img src={item.logo} alt={item.name || 'Client Logo'} className="h-16 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded ${message.includes('Saved') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{message}</div>
      )}
    </div>
  );
}
