"use client";

import { useAuth } from "@/context/AuthContext";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import Image from "next/image";

export default function Header() {
  const { user } = useAuth();

  return (
    <Navbar bg="dark" expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/" className="fw-bold fs-5">
          Giovapolis
          <Image
            src="/next.svg"
            alt="Giovapolis Logo"
            width="30"
            height="30"
            className="d-inline-block align-top ms-2"
          />
        </Navbar.Brand>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-2">
            {user ? (
              <>
                <Button
                  href="/profile"
                  variant="primary"
                  className="text-white"
                >
                  Edit Profile
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
              <>
                <Button href="/login" variant="dark">
                  Login
                </Button>
                <Button href="/register" variant="success">
                  Registrar
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
