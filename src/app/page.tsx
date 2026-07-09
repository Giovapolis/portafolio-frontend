"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import toast from "react-hot-toast";
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
import { PageSkeleton } from "@/components/ui/Skeleton";

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
      toast.success("PDF downloaded successfully");
    } catch {
      toast.error("Could not generate PDF");
    }
  };

  if (loading) {
    return (
      <Container className="cv-page py-5">
        <PageSkeleton />
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
        <span className="eyebrow">Full Stack Engineer</span>
        <h1 className="display-cv">{profile.name}</h1>
        <p className="lead-cv">{profile.title}</p>
        <div className="terminal-prompt">
          <span>cat profile --summary</span>
          <span className="cursor" />
        </div>
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
            <span className="d-flex align-items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download CV (PDF)
            </span>
          </Button>
        </div>
      </section>

      {/* CONTACT */}
      <Card className="mb-4">
        <Card.Body className="p-4">
          <span className="eyebrow">Network</span>
          <div className="d-flex flex-wrap gap-4 mt-3">
            {profile.email && (
              <span className="d-flex align-items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <a href={`mailto:${profile.email}`} className="contact-link">{profile.email}</a>
              </span>
            )}
            {profile.location && (
              <span className="d-flex align-items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{profile.location}</span>
              </span>
            )}
            {profile.github && (
              <span className="d-flex align-items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <a href={profile.github} target="_blank" className="contact-link">{profile.github.replace("https://github.com/", "")}</a>
              </span>
            )}
            {profile.linkedin && (
              <span className="d-flex align-items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <a href={profile.linkedin} target="_blank" className="contact-link">{profile.linkedin.replace("https://linkedin.com/in/", "")}</a>
              </span>
            )}
            {profile.phone && (
              <span className="d-flex align-items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>{profile.phone}</span>
              </span>
            )}
            {profile.website && (
              <span className="d-flex align-items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <a href={profile.website} target="_blank" className="contact-link">{profile.website}</a>
              </span>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* EXPERIENCE */}
      {experiences.length > 0 && (
        <Card className="mb-4">
          <Card.Body className="p-4">
            <span className="eyebrow">Timeline</span>
            <h2 className="section-heading h2 mb-4">Work History</h2>
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
            <span className="eyebrow">Formation</span>
            <h2 className="section-heading h2 mb-4">Academic Background</h2>
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
                      <div key={s.id} className="skill-pill flex-fill" style={{ flex: '1 1 120px' }}>
                        <span className="skill-name">{s.name}</span>
                        <div className="skill-bar">
                          <div className="skill-bar-fill" style={{ width: `${s.level}%` }} />
                        </div>
                        <span className="skill-level-label">{s.level}%</span>
                      </div>
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
            <span className="eyebrow">Repository</span>
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
            <span className="eyebrow">Learning Path</span>
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
            <span className="eyebrow">Devlog</span>
            <h2 className="section-heading h2 mb-4">Blog & Articles</h2>
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
