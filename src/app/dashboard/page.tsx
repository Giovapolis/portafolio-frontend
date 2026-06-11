"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfiles } from "@/services/profile.service";
import { getExperiences, getEducation } from "@/services/cv.service";
import { Profile } from "@/types/profile";
import { Experience } from "@/types/experience";
import { Education } from "@/types/education";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    async function loadCV() {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        setLoadingData(true);
        const myProfiles = await getMyProfiles(token);
        setProfiles(myProfiles);

        if (myProfiles.length > 0) {
          const firstProfile = myProfiles[0];
          setSelectedProfile(firstProfile);
          setExperiences(await getExperiences(token, firstProfile.id));
          setEducation(await getEducation(token, firstProfile.id));
        }
      } catch (err) {
        console.error("Error loading CV:", err);
      } finally {
        setLoadingData(false);
      }
    }

    if (user) {
      loadCV();
    }
  }, [user]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }
  if (!user) return null;

  return (
    <Container className="py-5">
      <div className="mb-5">
        <h1 className="display-6 fw-bold mb-3">Your Dashboard</h1>
        <p className="text-muted">
          View your profiles as they appear to others.
        </p>
      </div>

      {loadingData ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : profiles.length > 0 && selectedProfile ? (
        <>
          {/* PROFILE SELECTOR */}
          {profiles.length > 1 && (
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <label className="fw-bold mb-3 d-block">
                  Select Profile to View:
                </label>
                <select
                  value={selectedProfile.id}
                  onChange={async (e) => {
                    const profile = profiles.find(
                      (p) => p.id === parseInt(e.target.value),
                    );
                    if (profile) {
                      setSelectedProfile(profile);
                      const token = localStorage.getItem("access_token");
                      if (token) {
                        const exps = await getExperiences(token, profile.id);
                        const edus = await getEducation(token, profile.id);
                        setExperiences(exps);
                        setEducation(edus);
                      }
                    }
                  }}
                  className="form-select"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title || p.name}
                    </option>
                  ))}
                </select>
              </Card.Body>
            </Card>
          )}

          {/* PROFILE VIEW */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <Card.Title className="h2 mb-2">
                    {selectedProfile.title || selectedProfile.name}
                  </Card.Title>
                  {selectedProfile.summary && (
                    <Card.Text className="text-muted lead">
                      {selectedProfile.summary}
                    </Card.Text>
                  )}
                </div>
                <Button variant="primary" href="/profile">
                  ✏️ Edit
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Row>
            {/* EXPERIENCE */}
            <Col lg={6} className="mb-4">
              <h4 className="mb-3 fw-bold">Experience</h4>
              {experiences.length > 0 ? (
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <Card key={exp.id} className="shadow-sm">
                      <Card.Body>
                        <Card.Title className="h6">
                          {exp.role} — {exp.company}
                        </Card.Title>
                        {exp.description && (
                          <Card.Text className="small text-muted">
                            {exp.description}
                          </Card.Text>
                        )}
                        <small className="text-muted d-block mt-2">
                          {exp.start_date}{" "}
                          {exp.end_date ? `- ${exp.end_date}` : "- Present"}
                        </small>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert variant="info">No experience added</Alert>
              )}
            </Col>

            {/* EDUCATION */}
            <Col lg={6} className="mb-4">
              <h4 className="mb-3 fw-bold">Education</h4>
              {education.length > 0 ? (
                <div className="space-y-3">
                  {education.map((edu) => (
                    <Card key={edu.id} className="shadow-sm">
                      <Card.Body>
                        <Card.Title className="h6">
                          {edu.degree} — {edu.institution}
                        </Card.Title>
                        {edu.description && (
                          <Card.Text className="small text-muted">
                            {edu.description}
                          </Card.Text>
                        )}
                        <small className="text-muted d-block mt-2">
                          {edu.year}
                        </small>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert variant="info">No education added</Alert>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <Alert variant="info">
          No profiles yet. <Alert.Link href="/profile">Create one</Alert.Link>
        </Alert>
      )}
    </Container>
  );
}
