"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import { Profile } from "@/types/profile";
import { Experience } from "@/types/experience";
import { Education } from "@/types/education";
import { Skill } from "@/services/skills.service";
import { Project } from "@/services/projects.service";
import { Course } from "@/services/courses.service";
import { Blog } from "@/services/blogs.service";
import { getProfile } from "@/services/profile.service";
import { getExperience } from "@/services/experience.service";
import { getEducation } from "@/services/cv.service";
import { getSkills } from "@/services/skills.service";
import { getProjects } from "@/services/projects.service";
import { getCourses } from "@/services/courses.service";
import { getBlogs } from "@/services/blogs.service";
import { downloadCVPDF, savePDFToFile } from "@/services/cv.service";

export default function PublicCVPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, ex, ed, sk, pr, co, bl] = await Promise.all([
          getProfile().catch(() => null),
          getExperience().catch(() => [] as Experience[]),
          getEducation().catch(() => [] as Education[]),
          getSkills().catch(() => [] as Skill[]),
          getProjects().catch(() => [] as Project[]),
          getCourses().catch(() => [] as Course[]),
          getBlogs().catch(() => [] as Blog[]),
        ]);
        setProfile(p);
        setExperiences(ex);
        setEducationList(ed);
        setSkills(sk);
        setProjects(pr);
        setCourses(co);
        setBlogs(bl);
      } catch (err) {
        console.error("Error loading CV data", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDownloadPDF = async () => {
    try {
      const blob = await downloadCVPDF();
      savePDFToFile(blob, "cv.pdf");
    } catch {
      alert("Could not generate PDF");
    }
  };

  if (loading) {
    return (
      <Container className="cv-page text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container className="cv-page">
        <Alert variant="info" className="text-center py-5">
          <h4>CV not configured yet</h4>
          <p className="mb-0">The admin needs to set up the profile.</p>
        </Alert>
      </Container>
    );
  }

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <Container className="cv-page">
      {/* HERO */}
      <section className="cv-hero mb-5">
        <span className="eyebrow">Professional CV</span>
        <h1 className="display-cv">{profile.name}</h1>
        <p className="lead-cv">{profile.title}</p>
        {profile.bio && <p className="section-copy mt-3">{profile.bio}</p>}
        <div className="metric-strip">
          <div className="metric-node">
            <strong>{experiences.length}</strong>
            <span>Experience</span>
          </div>
          <div className="metric-node">
            <strong>{projects.length}</strong>
            <span>Projects</span>
          </div>
          <div className="metric-node">
            <strong>{skills.length}</strong>
            <span>Skills</span>
          </div>
        </div>
        <div className="mt-4 d-flex gap-3 flex-wrap">
          <Button variant="primary" onClick={handleDownloadPDF}>
            Download CV (PDF)
          </Button>
        </div>
      </section>

      {/* CONTACT */}
      <Card className="mb-4">
        <Card.Body className="p-4">
          <span className="eyebrow">Contact</span>
          <div className="d-flex flex-wrap gap-4 mt-3">
            {profile.email && <span><strong>Email:</strong> {profile.email}</span>}
            {profile.phone && <span><strong>Phone:</strong> {profile.phone}</span>}
            {profile.website && <span><strong>Web:</strong> <a href={profile.website} target="_blank">{profile.website}</a></span>}
            {profile.github && <span><strong>GitHub:</strong> <a href={profile.github} target="_blank">{profile.github.replace("https://github.com/", "")}</a></span>}
            {profile.linkedin && <span><strong>LinkedIn:</strong> <a href={profile.linkedin} target="_blank">{profile.linkedin.replace("https://linkedin.com/in/", "")}</a></span>}
            {profile.location && <span><strong>Location:</strong> {profile.location}</span>}
          </div>
        </Card.Body>
      </Card>

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <Card className="mb-4">
          <Card.Body className="p-4">
            <span className="eyebrow">Career</span>
            <h2 className="section-heading h2 mb-4">Experience</h2>
            <div className="timeline-list">
              {experiences.map((exp) => (
                <div key={exp.id} className="timeline-item">
                  <h3 className="h5 mb-1">{exp.role}</h3>
                  <p className="text-muted mb-2">{exp.company}</p>
                  {exp.description && <p className="section-copy small mb-2">{exp.description}</p>}
                  <small className="text-muted">
                    {exp.start_date} {exp.end_date ? `- ${exp.end_date}` : "- Present"}
                  </small>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* EDUCATION */}
      {educationList.length > 0 && (
        <Card className="mb-4">
          <Card.Body className="p-4">
            <span className="eyebrow">Education</span>
            <h2 className="section-heading h2 mb-4">Education</h2>
            <div className="timeline-list">
              {educationList.map((edu) => (
                <div key={edu.id} className="timeline-item">
                  <h3 className="h5 mb-1">{edu.degree}</h3>
                  <p className="text-muted mb-1">{edu.institution}</p>
                  {edu.description && <p className="section-copy small mb-1">{edu.description}</p>}
                  <small className="text-muted">{edu.year}</small>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* SKILLS */}
      {Object.keys(skillsByCategory).length > 0 && (
        <Row className="mb-4 g-4">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <Col md={6} lg={4} key={category}>
              <Card className="h-100">
                <Card.Body className="p-4">
                  <span className="eyebrow">{category}</span>
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {categorySkills.map((s) => (
                      <span key={s.id} className="nav-user-pill" style={{ opacity: 0.5 + (s.level / 200) }}>
                        {s.name}
                      </span>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <Card className="mb-4">
          <Card.Body className="p-4">
            <span className="eyebrow">Portfolio</span>
            <h2 className="section-heading h2 mb-4">Projects</h2>
            <Row xs={1} md={2} className="g-3">
              {projects.map((p) => (
                <Col key={p.id}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title className="h5">{p.title}</Card.Title>
                      <Card.Text className="small section-copy">{p.description}</Card.Text>
                      <div className="d-flex gap-2 mt-2">
                        {p.repo_url && <a href={p.repo_url} target="_blank" className="btn btn-sm btn-outline-secondary">Repo</a>}
                        {p.demo_url && <a href={p.demo_url} target="_blank" className="btn btn-sm btn-outline-secondary">Demo</a>}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* COURSES */}
      {courses.length > 0 && (
        <Card className="mb-4">
          <Card.Body className="p-4">
            <span className="eyebrow">Learning</span>
            <h2 className="section-heading h2 mb-4">Courses</h2>
            <Row xs={1} md={2} lg={3} className="g-3">
              {courses.map((c) => (
                <Col key={c.id}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title className="h6">{c.title}</Card.Title>
                      <Card.Subtitle className="text-muted small mb-2">{c.platform}</Card.Subtitle>
                      {c.certificate_url && (
                        <a href={c.certificate_url} target="_blank" className="btn btn-sm btn-outline-secondary">Certificate</a>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* BLOG */}
      {blogs.length > 0 && (
        <Card className="mb-4">
          <Card.Body className="p-4">
            <span className="eyebrow">Articles</span>
            <h2 className="section-heading h2 mb-4">Blog</h2>
            <div className="timeline-list">
              {blogs.map((post) => (
                <div key={post.id} className="timeline-item">
                  <h3 className="h5 mb-1">{post.title}</h3>
                  {post.excerpt && <p className="section-copy small mb-2">{post.excerpt}</p>}
                  <small className="text-muted">{new Date(post.created_at).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
