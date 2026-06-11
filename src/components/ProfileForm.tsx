"use client";

import { useState } from "react";
import { Profile } from "@/types/profile";

type Props = {
  profile: Profile | null;
  onSave: (data: Partial<Profile>) => Promise<void>;
};

export default function ProfileForm({ profile, onSave }: Props) {
  const [name, setName] = useState(profile?.name ?? "");
  const [title, setTitle] = useState(profile?.title ?? "");
  const [summary, setSummary] = useState(profile?.summary ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({ name, title, summary });
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full border p-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="w-full border p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="w-full border p-2"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
