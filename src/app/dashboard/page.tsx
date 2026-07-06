"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile } from "@/services/profile.service";
import { getExperience, createExperience, deleteExperience } from "@/services/experience.service";
import { getEducation, createEducation, deleteEducation } from "@/services/cv.service";
import { getSkills, createSkill, deleteSkill } from "@/services/skills.service";
import { getProjects, createProject, deleteProject } from "@/services/projects.service";
import { getCourses, createCourse, deleteCourse } from "@/services/courses.service";
import { getBlogs, createBlog, deleteBlog } from "@/services/blogs.service";
import { Profile } from "@/types/profile";
import { Experience } from "@/types/experience";
import { Education } from "@/types/education";
import { Skill } from "@/services/skills.service";
import { Project } from "@/services/projects.service";
import { Course } from "@/services/courses.service";
import { Blog } from "@/services/blogs.service";
import ProfileForm from "@/components/ProfileForm";
import {
  Container, Row, Col, Card, Spinner, Alert, Button, Form,
} from "react-bootstrap";

type Section = "profile" | "experience" | "education" | "skills" | "projects" | "courses" | "blog";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newExpCompany, setNewExpCompany] = useState("");
  const [newExpRole, setNewExpRole] = useState("");
  const [newExpDesc, setNewExpDesc] = useState("");
  const [newExpStart, setNewExpStart] = useState("");
  const [newInst, setNewInst] = useState("");
  const [newDegree, setNewDegree] = useState("");
  const [newEduDesc, setNewEduDesc] = useState("");
  const [newYear, setNewYear] = useState("");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState(50);
  const [newSkillCat, setNewSkillCat] = useState("");
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjUrl, setNewProjUrl] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCoursePlat, setNewCoursePlat] = useState("");
  const [newCourseCert, setNewCourseCert] = useState("");
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogSlug, setNewBlogSlug] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    async function loadAll() {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      setDataLoading(true);
      try {
        const [p, ex, ed, sk, pr, co, bl] = await Promise.all([
          getProfile().catch(() => null),
          getExperience(),
          getEducation(),
          getSkills(),
          getProjects(),
          getCourses(),
          getBlogs(),
        ]);
        setProfile(p);
        setExperiences(ex);
        setEducationList(ed);
        setSkills(sk);
        setProjects(pr);
        setCourses(co);
        setBlogs(bl);
        setError(null);
      } catch (err) {
        console.error("Error loading data", err);
        setError("Failed to load data");
      } finally {
        setDataLoading(false);
      }
    }
    loadAll();
  }, [user]);

  async function handleSaveProfile(data: Partial<Profile>) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const updated = await updateProfile(token, data);
      setProfile(updated);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  }

  async function handleAddExperience() {
    const token = localStorage.getItem("access_token");
    if (!token || !newExpCompany || !newExpRole) return;
    try {
      await createExperience(token, {
        company: newExpCompany,
        role: newExpRole,
        description: newExpDesc,
        start_date: newExpStart,
        order: experiences.length,
      });
      setExperiences(await getExperience());
      setNewExpCompany(""); setNewExpRole(""); setNewExpDesc(""); setNewExpStart("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add experience");
    }
  }

  async function handleDeleteExperience(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteExperience(token, id);
      setExperiences(await getExperience());
    } catch (err) {
      console.error(err);
      setError("Failed to delete experience");
    }
  }

  async function handleAddEducation() {
    const token = localStorage.getItem("access_token");
    if (!token || !newInst || !newDegree) return;
    try {
      await createEducation(token, {
        institution: newInst,
        degree: newDegree,
        description: newEduDesc,
        year: newYear,
      });
      setEducationList(await getEducation());
      setNewInst(""); setNewDegree(""); setNewEduDesc(""); setNewYear("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add education");
    }
  }

  async function handleDeleteEducation(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteEducation(token, id);
      setEducationList(await getEducation());
    } catch (err) {
      console.error(err);
      setError("Failed to delete education");
    }
  }

  async function handleAddSkill() {
    const token = localStorage.getItem("access_token");
    if (!token || !newSkillName || !newSkillCat) return;
    try {
      await createSkill(token, {
        name: newSkillName,
        level: newSkillLevel,
        category: newSkillCat,
        order: skills.length,
      });
      setSkills(await getSkills());
      setNewSkillName(""); setNewSkillLevel(50); setNewSkillCat("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add skill");
    }
  }

  async function handleDeleteSkill(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteSkill(token, id);
      setSkills(await getSkills());
    } catch (err) {
      console.error(err);
      setError("Failed to delete skill");
    }
  }

  async function handleAddProject() {
    const token = localStorage.getItem("access_token");
    if (!token || !newProjTitle) return;
    try {
      await createProject(token, {
        title: newProjTitle,
        description: newProjDesc,
        repo_url: "",
        demo_url: newProjUrl,
        featured: false,
        order: projects.length,
      });
      setProjects(await getProjects());
      setNewProjTitle(""); setNewProjDesc(""); setNewProjUrl("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add project");
    }
  }

  async function handleDeleteProject(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteProject(token, id);
      setProjects(await getProjects());
    } catch (err) {
      console.error(err);
      setError("Failed to delete project");
    }
  }

  async function handleAddCourse() {
    const token = localStorage.getItem("access_token");
    if (!token || !newCourseTitle || !newCoursePlat) return;
    try {
      await createCourse(token, {
        title: newCourseTitle,
        platform: newCoursePlat,
        certificate_url: newCourseCert || undefined,
      });
      setCourses(await getCourses());
      setNewCourseTitle(""); setNewCoursePlat(""); setNewCourseCert("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add course");
    }
  }

  async function handleDeleteCourse(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteCourse(token, id);
      setCourses(await getCourses());
    } catch (err) {
      console.error(err);
      setError("Failed to delete course");
    }
  }

  async function handleAddBlog() {
    const token = localStorage.getItem("access_token");
    if (!token || !newBlogTitle || !newBlogSlug || !newBlogContent) return;
    try {
      await createBlog(token, {
        title: newBlogTitle,
        slug: newBlogSlug,
        content_md: newBlogContent,
        is_published: true,
      });
      setBlogs(await getBlogs());
      setNewBlogTitle(""); setNewBlogSlug(""); setNewBlogContent("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add blog post");
    }
  }

  async function handleDeleteBlog(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteBlog(token, id);
      setBlogs(await getBlogs());
    } catch (err) {
      console.error(err);
      setError("Failed to delete blog post");
    }
  }

  if (authLoading) {
    return (
      <Container className="cv-page text-center py-5">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }
  if (!user) return null;

  const navItems: { key: Section; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "skills", label: "Skills" },
    { key: "projects", label: "Projects" },
    { key: "courses", label: "Courses" },
    { key: "blog", label: "Blog" },
  ];

  return (
    <Container className="cv-page">
      <section className="cv-hero mb-5">
        <span className="eyebrow">Admin panel</span>
        <h1 className="display-cv">Dashboard.</h1>
        <p className="lead-cv">Manage your CV content — all sections in one place.</p>
      </section>

      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      {/* SECTION NAV */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {navItems.map((item) => (
          <Button
            key={item.key}
            variant={activeSection === item.key ? "primary" : "outline-secondary"}
            onClick={() => setActiveSection(item.key)}
            size="sm"
          >
            {item.label}
          </Button>
        ))}
      </div>

      {dataLoading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <>
          {/* PROFILE */}
          {activeSection === "profile" && (
            <Card>
              <Card.Body className="p-4">
                <span className="eyebrow">Personal info</span>
                <Card.Title className="section-heading h2 mb-4">Profile</Card.Title>
                {profile ? (
                  <ProfileForm profile={profile} onSave={handleSaveProfile} />
                ) : (
                  <Alert variant="info">No profile yet. Create one to get started.</Alert>
                )}
              </Card.Body>
            </Card>
          )}

          {/* EXPERIENCE */}
          {activeSection === "experience" && (
            <>
              <Card className="mb-4">
                <Card.Body className="p-4">
                  <span className="eyebrow">Career</span>
                  <Card.Title className="section-heading h2 mb-4">Add Experience</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Company</Form.Label>
                        <Form.Control value={newExpCompany} onChange={(e) => setNewExpCompany(e.target.value)} placeholder="Company name" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Role</Form.Label>
                        <Form.Control value={newExpRole} onChange={(e) => setNewExpRole(e.target.value)} placeholder="Job title" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type="date" value={newExpStart} onChange={(e) => setNewExpStart(e.target.value)} />
                      </Col>
                      <Col md={12}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={2} value={newExpDesc} onChange={(e) => setNewExpDesc(e.target.value)} placeholder="Describe your role" />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddExperience} variant="primary">Add Experience</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Existing Experience</Card.Title>
                  {experiences.length > 0 ? (
                    <div className="timeline-list">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="timeline-item d-flex justify-content-between align-items-start">
                          <div>
                            <h4 className="h6 mb-1">{exp.role} — {exp.company}</h4>
                            <small className="text-muted">{exp.start_date} {exp.end_date ? `- ${exp.end_date}` : "- Present"}</small>
                          </div>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteExperience(exp.id)}>Delete</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No experience added yet</p>
                  )}
                </Card.Body>
              </Card>
            </>
          )}

          {/* EDUCATION */}
          {activeSection === "education" && (
            <>
              <Card className="mb-4">
                <Card.Body className="p-4">
                  <span className="eyebrow">Education</span>
                  <Card.Title className="section-heading h2 mb-4">Add Education</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Institution</Form.Label>
                        <Form.Control value={newInst} onChange={(e) => setNewInst(e.target.value)} placeholder="University / School" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Degree</Form.Label>
                        <Form.Control value={newDegree} onChange={(e) => setNewDegree(e.target.value)} placeholder="Degree / Major" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Year</Form.Label>
                        <Form.Control value={newYear} onChange={(e) => setNewYear(e.target.value)} placeholder="e.g. 2020-2023" />
                      </Col>
                      <Col md={12}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={2} value={newEduDesc} onChange={(e) => setNewEduDesc(e.target.value)} />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddEducation} variant="primary">Add Education</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Existing Education</Card.Title>
                  {educationList.length > 0 ? (
                    <div className="timeline-list">
                      {educationList.map((edu) => (
                        <div key={edu.id} className="timeline-item d-flex justify-content-between align-items-start">
                          <div>
                            <h4 className="h6 mb-1">{edu.degree} — {edu.institution}</h4>
                            <small className="text-muted">{edu.year}</small>
                          </div>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteEducation(edu.id)}>Delete</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No education added yet</p>
                  )}
                </Card.Body>
              </Card>
            </>
          )}

          {/* SKILLS */}
          {activeSection === "skills" && (
            <>
              <Card className="mb-4">
                <Card.Body className="p-4">
                  <span className="eyebrow">Skills</span>
                  <Card.Title className="section-heading h2 mb-4">Add Skill</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={4}>
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="e.g. React" />
                      </Col>
                      <Col md={4}>
                        <Form.Label>Category</Form.Label>
                        <Form.Control value={newSkillCat} onChange={(e) => setNewSkillCat(e.target.value)} placeholder="e.g. Frontend" />
                      </Col>
                      <Col md={4}>
                        <Form.Label>Level (0-100)</Form.Label>
                        <Form.Control type="number" min={0} max={100} value={newSkillLevel} onChange={(e) => setNewSkillLevel(Number(e.target.value))} />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddSkill} variant="primary">Add Skill</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Existing Skills</Card.Title>
                  {skills.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {skills.map((s) => (
                        <span key={s.id} className="nav-user-pill d-inline-flex align-items-center gap-2">
                          {s.name} ({s.category})
                          <button className="btn-close btn-close-white ms-2" style={{ fontSize: "0.6rem" }} onClick={() => handleDeleteSkill(s.id)} />
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No skills added yet</p>
                  )}
                </Card.Body>
              </Card>
            </>
          )}

          {/* PROJECTS */}
          {activeSection === "projects" && (
            <>
              <Card className="mb-4">
                <Card.Body className="p-4">
                  <span className="eyebrow">Portfolio</span>
                  <Card.Title className="section-heading h2 mb-4">Add Project</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Title</Form.Label>
                        <Form.Control value={newProjTitle} onChange={(e) => setNewProjTitle(e.target.value)} placeholder="Project name" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Demo URL</Form.Label>
                        <Form.Control value={newProjUrl} onChange={(e) => setNewProjUrl(e.target.value)} placeholder="https://..." />
                      </Col>
                      <Col md={12}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={2} value={newProjDesc} onChange={(e) => setNewProjDesc(e.target.value)} />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddProject} variant="primary">Add Project</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Existing Projects</Card.Title>
                  {projects.length > 0 ? (
                    <div className="timeline-list">
                      {projects.map((p) => (
                        <div key={p.id} className="timeline-item d-flex justify-content-between align-items-start">
                          <div>
                            <h4 className="h6 mb-1">{p.title}</h4>
                            <small className="text-muted">{p.description}</small>
                          </div>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteProject(p.id)}>Delete</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No projects added yet</p>
                  )}
                </Card.Body>
              </Card>
            </>
          )}

          {/* COURSES */}
          {activeSection === "courses" && (
            <>
              <Card className="mb-4">
                <Card.Body className="p-4">
                  <span className="eyebrow">Learning</span>
                  <Card.Title className="section-heading h2 mb-4">Add Course</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Course Title</Form.Label>
                        <Form.Control value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} placeholder="Course name" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Platform</Form.Label>
                        <Form.Control value={newCoursePlat} onChange={(e) => setNewCoursePlat(e.target.value)} placeholder="e.g. Udemy, Coursera" />
                      </Col>
                      <Col md={12}>
                        <Form.Label>Certificate URL</Form.Label>
                        <Form.Control value={newCourseCert} onChange={(e) => setNewCourseCert(e.target.value)} placeholder="https://..." />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddCourse} variant="primary">Add Course</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Existing Courses</Card.Title>
                  {courses.length > 0 ? (
                    <div className="timeline-list">
                      {courses.map((c) => (
                        <div key={c.id} className="timeline-item d-flex justify-content-between align-items-start">
                          <div>
                            <h4 className="h6 mb-1">{c.title}</h4>
                            <small className="text-muted">{c.platform}</small>
                          </div>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteCourse(c.id)}>Delete</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No courses added yet</p>
                  )}
                </Card.Body>
              </Card>
            </>
          )}

          {/* BLOG */}
          {activeSection === "blog" && (
            <>
              <Card className="mb-4">
                <Card.Body className="p-4">
                  <span className="eyebrow">Articles</span>
                  <Card.Title className="section-heading h2 mb-4">Add Blog Post</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Title</Form.Label>
                        <Form.Control value={newBlogTitle} onChange={(e) => setNewBlogTitle(e.target.value)} placeholder="Post title" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Slug</Form.Label>
                        <Form.Control value={newBlogSlug} onChange={(e) => setNewBlogSlug(e.target.value)} placeholder="my-post-slug" />
                      </Col>
                      <Col md={12}>
                        <Form.Label>Content (Markdown)</Form.Label>
                        <Form.Control as="textarea" rows={5} value={newBlogContent} onChange={(e) => setNewBlogContent(e.target.value)} placeholder="Write your post in markdown..." />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddBlog} variant="primary">Add Post</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Existing Posts</Card.Title>
                  {blogs.length > 0 ? (
                    <div className="timeline-list">
                      {blogs.map((post) => (
                        <div key={post.id} className="timeline-item d-flex justify-content-between align-items-start">
                          <div>
                            <h4 className="h6 mb-1">{post.title}</h4>
                            <small className="text-muted">{post.slug} — {new Date(post.created_at).toLocaleDateString()}</small>
                          </div>
                          <Button variant="danger" size="sm" onClick={() => handleDeleteBlog(post.id)}>Delete</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No blog posts yet</p>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </>
      )}
    </Container>
  );
}
