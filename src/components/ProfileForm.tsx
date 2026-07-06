"use client";

import { useState } from "react";
import { Profile } from "@/types/profile";

type Props = {
  profile: Profile;
  onSave: (data: Partial<Profile>) => Promise<void>;
};

export default function ProfileForm({ profile, onSave }: Props) {
  const [name, setName] = useState(profile.name ?? "");
  const [title, setTitle] = useState(profile.title ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [email, setEmail] = useState(profile.email ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");
  const [github, setGithub] = useState(profile.github ?? "");
  const [linkedin, setLinkedin] = useState(profile.linkedin ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({ name, title, bio, email, phone, website, github, linkedin, location });
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="control-panel">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Full Name</label>
          <input className="form-control" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Professional Title</label>
          <input className="form-control" placeholder="e.g., Software Engineer" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="col-12">
          <label className="form-label">Bio / Summary</label>
          <textarea className="form-control" placeholder="Professional summary" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Email</label>
          <input className="form-control" type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Phone</label>
          <input className="form-control" placeholder="+1 234 567 890" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="col-md-4">
          <label className="form-label">Website</label>
          <input className="form-control" placeholder="https://yourwebsite.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label">GitHub</label>
          <input className="form-control" placeholder="https://github.com/username" value={github} onChange={(e) => setGithub(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label">LinkedIn</label>
          <input className="form-control" placeholder="https://linkedin.com/in/username" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
        </div>
        <div className="col-12">
          <label className="form-label">Location</label>
          <input className="form-control" placeholder="City, Country" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
      </div>
      <button type="submit" disabled={saving} className="btn btn-primary glow-btn w-100 mt-4">
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
