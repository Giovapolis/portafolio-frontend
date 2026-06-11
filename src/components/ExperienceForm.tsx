"use client";

import { useState, FormEvent } from "react";
import { Experience } from "@/types/experience";

type Props = {
  onSave: (data: Partial<Experience>) => Promise<void>;
};

export default function ExperienceForm({ onSave }: Props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({
      company,
      role,
      description,
      start_date: startDate,
      end_date: endDate || undefined,
    });
    setSaving(false);
    setCompany("");
    setRole("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 themed-card p-3">
      <h3 className="text-lg font-semibold section-title">Add Experience</h3>

      <input
        className="form-control"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
      />

      <input
        className="form-control"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />

      <textarea
        className="form-control"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        type="date"
        className="form-control"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />

      <input
        type="date"
        className="form-control"
        placeholder="End Date (optional)"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <button
        type="submit"
        disabled={saving}
        className="btn btn-primary glow-btn w-100"
      >
        {saving ? "Saving..." : "Add Experience"}
      </button>
    </form>
  );
}
