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

      // Refresh user context
      await refreshUser();

      console.log("Login successful", result);
      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: "100%", maxWidth: "400px" }} className="shadow">
        <Card.Body>
          <Card.Title className="text-center mb-4">Login</Card.Title>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
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
    </Container>
  );
}
