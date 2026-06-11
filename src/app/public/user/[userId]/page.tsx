"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProfilePublic } from "@/services/profile.service";
import {
  getEducationPublic,
  getExperiencesPublic,
} from "@/services/cv.service";
import { Profile } from "@/types/profile";
import { Experience } from "@/types/experience";
import { Education } from "@/types/education";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";

export default function PublicUserDashboard() {
  const params = useParams();
  const rawId = params?.userId;
  const userId = rawId
    ? Array.isArray(rawId)
      ? parseInt(rawId[0])
      : parseInt(rawId)
    : null;

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserProfiles() {
      if (!userId) return;
      setLoading(true);
      try {
        // Fetch user's profiles (using token-less endpoint or mocking with profile fetch)
        // We'll load profiles by trying common IDs for this user
        const allProfiles: Profile[] = [];
        for (let i = 1; i <= 50; i++) {
          try {
            const response = await fetch(`http://localhost:8000/profiles/${i}`);
            if (response.ok) {
              const profile = await response.json();
              if (profile.user_id === userId) {
                allProfiles.push(profile);
              }
            }
          } catch {
            // Skip errors
          }
        }

        setProfiles(allProfiles);
        if (allProfiles.length > 0) {
          const firstProfile = allProfiles[0];
          setSelectedProfile(firstProfile);
          try {
            setExperiences(await getExperiencesPublic(firstProfile.id));
            setEducation(await getEducationPublic(firstProfile.id));
          } catch (err) {
            console.error("Error loading experience/education", err);
          }
        }
        setError(null);
      } catch (err) {
        console.error("Error loading user profiles", err);
        setError("Failed to load user profiles");
      } finally {
        setLoading(false);
      }
    }

    loadUserProfiles();
  }, [userId]);

  if (!userId) return <Alert variant="danger">User ID missing</Alert>;
  if (loading)
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-5">
      {profiles.length > 0 && selectedProfile ? (
        <>
          {profiles.length > 1 && (
            <div className="mb-4">
              <label className="fw-bold me-2">Switch Profile:</label>
              <select
                value={selectedProfile.id}
                onChange={async (e) => {
                  const profile = profiles.find(
                    (p) => p.id === parseInt(e.target.value),
                  );
                  if (profile) {
                    setSelectedProfile(profile);
                    try {
                      setExperiences(await getExperiencesPublic(profile.id));
                      setEducation(await getEducationPublic(profile.id));
                    } catch (err) {
                      console.error("Error loading profile data", err);
                    }
                  }
                }}
                className="form-select w-auto"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title || p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title className="h2">
                {selectedProfile.title || selectedProfile.name}
              </Card.Title>
              {selectedProfile.summary && (
                <Card.Text className="text-muted">
                  {selectedProfile.summary}
                </Card.Text>
              )}
            </Card.Body>
          </Card>

          <Row>
            <Col md={6} className="mb-4">
              <h4 className="mb-3">Experience</h4>
              {experiences.length > 0 ? (
                experiences.map((exp) => (
                  <Card key={exp.id} className="mb-3">
                    <Card.Body>
                      <Card.Title>
                        {exp.role} — {exp.company}
                      </Card.Title>
                      {exp.description && (
                        <Card.Text className="small">
                          {exp.description}
                        </Card.Text>
                      )}
                      <small className="text-muted">
                        {exp.start_date}{" "}
                        {exp.end_date ? `- ${exp.end_date}` : "- Present"}
                      </small>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="text-muted">No experience added</p>
              )}
            </Col>

            <Col md={6} className="mb-4">
              <h4 className="mb-3">Education</h4>
              {education.length > 0 ? (
                education.map((edu) => (
                  <Card key={edu.id} className="mb-3">
                    <Card.Body>
                      <Card.Title>
                        {edu.degree} — {edu.institution}
                      </Card.Title>
                      {edu.description && (
                        <Card.Text className="small">
                          {edu.description}
                        </Card.Text>
                      )}
                      <small className="text-muted">{edu.year}</small>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="text-muted">No education added</p>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <Alert variant="info">No profiles found for this user</Alert>
      )}
    </Container>
  );
}
