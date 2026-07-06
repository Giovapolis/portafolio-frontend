"use client";

import { useAuth } from "@/context/AuthContext";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

export default function Header() {
  const { user } = useAuth();

  return (
    <Navbar expand="lg" className="circuit-nav">
      <Container>
        <Navbar.Brand href="/" className="circuit-brand fw-bold fs-5 d-flex align-items-center">
          <span className="brand-chip">G</span>
          <span>Giovapolis CV</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-2 align-items-lg-center">
            {user ? (
              <>
                <Button href="/dashboard" variant="primary" className="text-white">
                  Dashboard
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    localStorage.removeItem("access_token");
                    window.location.href = "/";
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button href="/login" variant="dark">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
