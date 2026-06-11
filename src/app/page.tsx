"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { Profile } from "@/types/profile";

interface UserProfile {
  userId: number;
  profiles: Profile[];
}

export default function Home() {
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserProfiles() {
      setLoading(true);
      const userMap = new Map<number, Profile[]>();

      // Try to load profiles with IDs 1-50 to discover users
      for (let i = 1; i <= 50; i++) {
        try {
          const response = await fetch(`http://localhost:8000/profiles/${i}`);
          if (response.ok) {
            const profile = await response.json();
            const userId = profile.user_id;
            if (!userMap.has(userId)) {
              userMap.set(userId, []);
            }
            userMap.get(userId)!.push(profile);
          }
        } catch {
          // Profile not found, continue
        }
      }

      const result = Array.from(userMap.entries()).map(
        ([userId, profiles]) => ({
          userId,
          profiles,
        }),
      );

      setUserProfiles(result);
      setLoading(false);
    }

    loadUserProfiles();
  }, []);

  return (
    <Container className="py-5">
      <div className="mb-5 text-center">
        <h1 className="display-5 fw-bold mb-3">Professional CVs</h1>
        <p className="text-muted lead">
          Discover professional profiles and portfolios from talented
          professionals.
        </p>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : userProfiles.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {userProfiles.map((user) => (
            <Col key={user.userId}>
              <Link
                href={`/public/user/${user.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Card
                  className="h-100 shadow-sm hover-shadow-lg"
                  style={{ cursor: "pointer" }}
                >
                  <Card.Body>
                    <Card.Title className="fw-bold">
                      {user.profiles[0]?.name || `User ${user.userId}`}
                    </Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">
                      {user.profiles.length} profile
                      {user.profiles.length > 1 ? "s" : ""}
                    </Card.Subtitle>
                    <Card.Text className="text-muted small">
                      {user.profiles[0]?.summary || "No description available"}
                    </Card.Text>
                    <span className="text-primary fw-bold">View Profile →</span>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          No registered users found yet.
        </Alert>
      )}
    </Container>
  );
}
