"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import {
  getMyProfiles,
  updateProfile,
  createProfile,
  deleteProfile,
} from "@/services/profile.service";
import {
  getExperiences,
  getEducation,
  createExperience,
  createEducation,
  deleteExperience,
  deleteEducation,
} from "@/services/cv.service";
import { useRouter } from "next/navigation";

import { Profile } from "@/types/profile";
import { Experience } from "@/types/experience";
import { Education } from "@/types/education";

import ProfileForm from "@/components/ProfileForm";
import ExperienceForm from "@/components/ExperienceForm";
import EducationForm from "@/components/EducationForm";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [experience, setExperience] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          setExperience(await getExperiences(token, firstProfile.id));
          setEducation(await getEducation(token, firstProfile.id));
        }
        setError(null);
      } catch (err) {
        console.error("Error loading CV:", err);
        setError("Failed to load profile data");
      } finally {
        setLoadingData(false);
      }
    }

    if (user) {
      loadCV();
    }
  }, [user]);

  async function handleSaveProfile(data: Partial<Profile>) {
    const token = localStorage.getItem("access_token");
    if (!token || !selectedProfile) return;

    try {
      await updateProfile(token, selectedProfile.id, data);
      setSelectedProfile((prev) => (prev ? { ...prev, ...data } : prev));
      setError(null);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    }
  }

  async function handleAddExperience(data: Partial<Experience>) {
    const token = localStorage.getItem("access_token");
    if (!token || !selectedProfile) return;

    try {
      await createExperience(token, selectedProfile.id, data);
      const updated = await getExperiences(token, selectedProfile.id);
      setExperience(updated);
      setError(null);
    } catch (err) {
      console.error("Error adding experience:", err);
      setError("Failed to add experience");
    }
  }

  async function handleAddEducation(data: Partial<Education>) {
    const token = localStorage.getItem("access_token");
    if (!token || !selectedProfile) return;

    try {
      await createEducation(token, selectedProfile.id, data);
      const updated = await getEducation(token, selectedProfile.id);
      setEducation(updated);
      setError(null);
    } catch (err) {
      console.error("Error adding education:", err);
      setError("Failed to add education");
    }
  }

  async function handleCreateProfile() {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const created = await createProfile(token, {
        name: newName,
        title: newTitle,
        summary: newSummary,
      });
      // refresh profiles and select new one
      const myProfiles = await getMyProfiles(token);
      setProfiles(myProfiles);
      setSelectedProfile(created);
      setShowCreate(false);
      setNewName("");
      setNewTitle("");
      setNewSummary("");
      setError(null);
    } catch (err) {
      console.error("Error creating profile:", err);
      setError("Failed to create profile");
    }
  }

  async function handleDeleteProfile() {
    const token = localStorage.getItem("access_token");
    if (!token || !selectedProfile) return;

    try {
      await deleteProfile(token, selectedProfile.id);
      const myProfiles = await getMyProfiles(token);
      setProfiles(myProfiles);
      setSelectedProfile(myProfiles.length > 0 ? myProfiles[0] : null);
      setError(null);
    } catch (err) {
      console.error("Error deleting profile:", err);
      setError("Failed to delete profile");
    }
  }

  async function handleDeleteExperience(experienceId: number) {
    const token = localStorage.getItem("access_token");
    if (!token || !selectedProfile) return;

    try {
      await deleteExperience(token, selectedProfile.id, experienceId);
      const updated = await getExperiences(token, selectedProfile.id);
      setExperience(updated);
      setError(null);
    } catch (err) {
      console.error("Error deleting experience:", err);
      setError("Failed to delete experience");
    }
  }

  async function handleDeleteEducation(educationId: number) {
    const token = localStorage.getItem("access_token");
    if (!token || !selectedProfile) return;

    try {
      await deleteEducation(token, selectedProfile.id, educationId);
      const updated = await getEducation(token, selectedProfile.id);
      setEducation(updated);
      setError(null);
    } catch (err) {
      console.error("Error deleting education:", err);
      setError("Failed to delete education");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <Container className="py-5">
      <div className="mb-5">
        <h1 className="display-6 fw-bold mb-2">Edit Your Profiles</h1>
        <p className="text-muted">
          Create and manage your professional profiles, experience, and
          education.
        </p>
      </div>

      {loading || loadingData ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* PROFILE SELECTOR */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>My Profiles</Card.Title>
              <Row className="mb-3 align-items-end">
                {profiles.length > 0 && (
                  <Col md={6}>
                    <label className="fw-bold d-block mb-2">
                      Select Profile:
                    </label>
                    <select
                      value={selectedProfile?.id ?? ""}
                      onChange={(e) => {
                        const profile = profiles.find(
                          (p) => p.id === parseInt(e.target.value),
                        );
                        if (profile) {
                          setSelectedProfile(profile);
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
                  </Col>
                )}
                <Col md={6} className="d-flex gap-2">
                  <Button
                    variant={showCreate ? "secondary" : "primary"}
                    onClick={() => setShowCreate((s) => !s)}
                  >
                    {showCreate ? "Cancel" : "New Profile"}
                  </Button>
                  {selectedProfile && (
                    <Button variant="danger" onClick={handleDeleteProfile}>
                      Delete Profile
                    </Button>
                  )}
                </Col>
              </Row>

              {showCreate && (
                <Card bg="light" className="p-3 mt-3">
                  <Card.Title>Create New Profile</Card.Title>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>
                    <input
                      className="form-control"
                      placeholder="Enter your name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Title</label>
                    <input
                      className="form-control"
                      placeholder="e.g., Software Engineer"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Summary</label>
                    <textarea
                      className="form-control"
                      placeholder="Brief professional summary"
                      rows={3}
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="success" onClick={handleCreateProfile}>
                      Create
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowCreate(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
              )}
            </Card.Body>
          </Card>

          {selectedProfile ? (
            <>
              {/* PROFILE FORM */}
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title>Profile Details</Card.Title>
                  <ProfileForm
                    profile={selectedProfile}
                    onSave={handleSaveProfile}
                  />
                </Card.Body>
              </Card>

              <Row>
                {/* ADD EXPERIENCE */}
                <Col lg={6} className="mb-4">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Card.Title>Add Experience</Card.Title>
                      <ExperienceForm onSave={handleAddExperience} />
                    </Card.Body>
                  </Card>

                  {/* EXPERIENCE LIST */}
                  <Card className="mt-4 shadow-sm">
                    <Card.Body>
                      <Card.Title>Your Experience</Card.Title>
                      {experience.length > 0 ? (
                        <div className="space-y-3">
                          {experience.map((exp) => (
                            <Card key={exp.id} className="bg-light">
                              <Card.Body className="pb-2">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div style={{ flexGrow: 1 }}>
                                    <Card.Title className="h6">
                                      {exp.role}
                                    </Card.Title>
                                    <Card.Subtitle className="text-muted">
                                      {exp.company}
                                    </Card.Subtitle>
                                    {exp.description && (
                                      <Card.Text className="small mt-2">
                                        {exp.description}
                                      </Card.Text>
                                    )}
                                    <small className="text-muted">
                                      {exp.start_date}{" "}
                                      {exp.end_date
                                        ? `- ${exp.end_date}`
                                        : "- Present"}
                                    </small>
                                  </div>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteExperience(exp.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted mb-0">
                          No experience added yet
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                {/* ADD EDUCATION */}
                <Col lg={6} className="mb-4">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Card.Title>Add Education</Card.Title>
                      <EducationForm onSave={handleAddEducation} />
                    </Card.Body>
                  </Card>

                  {/* EDUCATION LIST */}
                  <Card className="mt-4 shadow-sm">
                    <Card.Body>
                      <Card.Title>Your Education</Card.Title>
                      {education.length > 0 ? (
                        <div className="space-y-3">
                          {education.map((edu) => (
                            <Card key={edu.id} className="bg-light">
                              <Card.Body className="pb-2">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div style={{ flexGrow: 1 }}>
                                    <Card.Title className="h6">
                                      {edu.degree}
                                    </Card.Title>
                                    <Card.Subtitle className="text-muted">
                                      {edu.institution}
                                    </Card.Subtitle>
                                    <Card.Text className="small text-muted mt-1">
                                      {edu.year}
                                    </Card.Text>
                                    {edu.description && (
                                      <Card.Text className="small mt-2">
                                        {edu.description}
                                      </Card.Text>
                                    )}
                                  </div>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteEducation(edu.id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted mb-0">
                          No education added yet
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <Alert variant="info">
              No profiles found. Create one to get started.
            </Alert>
          )}
        </>
      )}
    </Container>
  );
}
