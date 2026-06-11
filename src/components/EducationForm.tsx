"use client";

import { useState, FormEvent } from "react";
import { Education } from "@/types/education";

type Props = {
  onSave: (data: Partial<Education>) => Promise<void>;
};

export default function EducationForm({ onSave }: Props) {
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({
      institution,
      degree,
      description,
      year,
    });
    setSaving(false);
    setInstitution("");
    setDegree("");
    setDescription("");
    setYear("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <h3 className="text-lg font-semibold">Add Education</h3>

      <input
        className="border p-2 w-full"
        placeholder="Institution"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
        required
      />

      <input
        className="border p-2 w-full"
        placeholder="Degree"
        value={degree}
        onChange={(e) => setDegree(e.target.value)}
        required
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Year (e.g., 2020-2023)"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? "Saving..." : "Add Education"}
      </button>
    </form>
  );
}
