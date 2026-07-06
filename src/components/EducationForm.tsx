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
    <form onSubmit={handleSubmit} className="control-panel">
      <h3 className="section-heading h5 mb-3">Add Education</h3>

      <div className="mb-3">
        <label className="form-label">Institution</label>
        <input
          className="form-control"
          placeholder="Institution"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Degree</label>
        <input
          className="form-control"
          placeholder="Degree"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
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

      <div className="mb-4">
        <label className="form-label">Year</label>
        <input
          type="text"
          className="form-control"
          placeholder="Year (e.g., 2020-2023)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="btn btn-primary glow-btn w-100"
      >
        {saving ? "Saving..." : "Add Education"}
      </button>
    </form>
  );
}
