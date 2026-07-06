"use client";

import { useState } from "react";
import { login } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/errors";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await login(username, password);
      localStorage.setItem("access_token", result.access_token);
      await refreshUser();
      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="cv-page">
      <div className="auth-grid">
        <section className="auth-art">
          <span className="eyebrow">Admin access</span>
          <h1 className="display-cv">CV control room.</h1>
          <p className="lead-cv">
            Sign in to update your professional profile, experience, skills,
            and portfolio content.
          </p>
          <div className="signal-map mt-4" aria-hidden="true" />
        </section>

        <Card className="auth-panel">
          <Card.Body className="p-0">
            <span className="eyebrow">Authentication</span>
            <Card.Title className="section-heading h2 mb-2">Welcome back</Card.Title>
            <p className="section-copy mb-4">Enter your admin credentials.</p>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button
                variant="dark"
                type="submit"
                disabled={loading}
                className="w-100"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
