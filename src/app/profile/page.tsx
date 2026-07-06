"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile } from "@/services/profile.service";
import { Profile } from "@/types/profile";
import ProfileForm from "@/components/ProfileForm";
import { Container, Card, Spinner, Alert, Button } from "react-bootstrap";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const p = await getProfile();
        setProfile(p);
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function handleSave(data: Partial<Profile>) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const updated = await updateProfile(token, data);
      setProfile(updated);
      setError(null);
    } catch {
      setError("Failed to save profile");
    }
  }

  if (authLoading) {
    return (
      <Container className="cv-page text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (!user) return null;

  return (
    <Container className="cv-page">
      <section className="cv-hero mb-5">
        <span className="eyebrow">CV editor</span>
        <h1 className="display-cv">Edit Profile.</h1>
        <p className="lead-cv">Update your personal information.</p>
        <div className="mt-3">
          <Button variant="outline-secondary" href="/dashboard">Back to Dashboard</Button>
        </div>
      </section>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : profile ? (
        <Card>
          <Card.Body className="p-4">
            <ProfileForm profile={profile} onSave={handleSave} />
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="info">No profile found. Go to dashboard to create one.</Alert>
      )}
    </Container>
  );
}
