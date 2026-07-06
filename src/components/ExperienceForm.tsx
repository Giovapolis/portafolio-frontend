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
      order: 0,
    });
    setSaving(false);
    setCompany("");
    setRole("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  }

  return (
    <form onSubmit={handleSubmit} className="control-panel">
      <h3 className="section-heading h5 mb-3">Add Experience</h3>

      <div className="mb-3">
        <label className="form-label">Company</label>
        <input
          className="form-control"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Role</label>
        <input
          className="form-control"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Start date</label>
        <input
          type="date"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">End date</label>
        <input
          type="date"
          className="form-control"
          placeholder="End Date (optional)"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

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
