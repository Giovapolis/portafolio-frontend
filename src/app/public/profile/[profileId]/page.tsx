"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProfilePublic } from "@/services/profile.service";
import {
  getExperiencesPublic,
  getEducationPublic,
} from "@/services/cv.service";
import { Profile } from "@/types/profile";
import { Experience } from "@/types/experience";
import { Education } from "@/types/education";

export default function PublicProfilePage() {
  const params = useParams();
  const rawId = params?.profileId;
  const profileId = rawId
    ? Array.isArray(rawId)
      ? parseInt(rawId[0])
      : parseInt(rawId)
    : null;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!profileId) return;
      setLoading(true);
      try {
        const p = await getProfilePublic(profileId);
        setProfile(p);
        const ex = await getExperiencesPublic(profileId);
        setExperiences(ex);
        const ed = await getEducationPublic(profileId);
        setEducation(ed);
      } catch (err) {
        console.error("Error loading public profile", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [profileId]);

  if (!profileId) return <p>Profile id missing</p>;
  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Profile not found</p>;

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{profile.title || profile.name}</h1>
        {profile.summary && <p className="text-gray-700">{profile.summary}</p>}
      </header>

      <section>
        <h2 className="text-xl font-semibold">Experience</h2>
        {experiences.length > 0 ? (
          experiences.map((exp) => (
            <div key={exp.id} className="border p-3 rounded mb-2">
              <p className="font-semibold">
                {exp.role} — {exp.company}
              </p>
              {exp.description && (
                <p className="text-sm mt-1">{exp.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {exp.start_date}{" "}
                {exp.end_date ? `- ${exp.end_date}` : "- Present"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No experience</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Education</h2>
        {education.length > 0 ? (
          education.map((edu) => (
            <div key={edu.id} className="border p-3 rounded mb-2">
              <p className="font-semibold">
                {edu.degree} — {edu.institution}
              </p>
              {edu.description && (
                <p className="text-sm mt-1">{edu.description}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No education</p>
        )}
      </section>
    </section>
  );
}
