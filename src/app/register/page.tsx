"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validaciones locales
    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(
          data.detail || "Error en el registro. Intenta con otro email.",
        );
        return;
      }

      setSuccess(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Error de conexión. Verifica que el servidor esté corriendo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <Card className="shadow-lg">
          <Card.Body className="p-5">
            <Card.Title className="text-center h3 fw-bold mb-4">
              Crear Cuenta
            </Card.Title>

            {success && (
              <Alert variant="success" className="mb-4">
                ¡Registro exitoso! Redirigiendo al login...
              </Alert>
            )}

            {error && (
              <Alert
                variant="danger"
                className="mb-4"
                dismissible
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  Confirmar Contraseña
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="w-100 fw-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Registrando...
                  </>
                ) : (
                  "Registrarse"
                )}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                ¿Ya tienes cuenta?{" "}
                <a href="/login" className="text-primary fw-bold">
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
