"use client";

import { useAuth } from "@/context/AuthContext";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

export default function Header() {
  const { user } = useAuth();

  return (
    <Navbar expand="lg" className="circuit-nav">
      <Container>
        <Navbar.Brand href="/" className="circuit-brand fw-bold fs-5 d-flex align-items-center gap-2">
          <span className="brand-chip">B</span>
          <span className="d-flex flex-column lh-1">
            <span className="brand-name">Brandon G. Castañón</span>
            <span className="brand-sub">Software Engineer</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-2 align-items-lg-center">
            {user ? (
              <>
                <Button href="/dashboard" variant="primary" className="text-white">
                  Panel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    window.location.href = "/";
                  }}
                >
                  Salir
                </Button>
              </>
            ) : (
              <Button href="/login" variant="dark">
                Acceder
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
