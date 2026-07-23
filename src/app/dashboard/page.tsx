"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
import EmptyState from "@/components/ui/EmptyState";
import { PageSkeleton } from "@/components/ui/Skeleton";
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
      toast.success("Profile saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
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
      toast.success("Experience added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add experience");
    }
  }

  async function handleDeleteExperience(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteExperience(token, id);
      setExperiences(await getExperience());
      toast.success("Experience deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete experience");
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
      toast.success("Education added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add education");
    }
  }

  async function handleDeleteEducation(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteEducation(token, id);
      setEducationList(await getEducation());
      toast.success("Education deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete education");
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
      toast.success("Skill added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add skill");
    }
  }

  async function handleDeleteSkill(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteSkill(token, id);
      setSkills(await getSkills());
      toast.success("Skill deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete skill");
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
      toast.success("Project added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add project");
    }
  }

  async function handleDeleteProject(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteProject(token, id);
      setProjects(await getProjects());
      toast.success("Project deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete project");
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
      toast.success("Course added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add course");
    }
  }

  async function handleDeleteCourse(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteCourse(token, id);
      setCourses(await getCourses());
      toast.success("Course deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete course");
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
      toast.success("Blog post added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add blog post");
    }
  }

  async function handleDeleteBlog(id: number) {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      await deleteBlog(token, id);
      setBlogs(await getBlogs());
      toast.success("Blog post deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog post");
    }
  }

  if (authLoading) {
    return (
      <Container className="cv-page py-5">
        <PageSkeleton />
      </Container>
    );
  }
  if (!user) return null;

  const navItems: { key: Section; label: string }[] = [
    { key: "profile", label: "Perfil" },
    { key: "experience", label: "Experiencia" },
    { key: "education", label: "Educación" },
    { key: "skills", label: "Habilidades" },
    { key: "projects", label: "Proyectos" },
    { key: "courses", label: "Cursos" },
    { key: "blog", label: "Blog" },
  ];

  return (
    <Container className="cv-page">
      <section className="cv-hero mb-5">
        <span className="eyebrow">Administración</span>
        <h1 className="display-cv">Dashboard.</h1>
        <p className="lead-cv">Gestiona todo el contenido de tu CV profesional en un solo lugar.</p>
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
                <span className="eyebrow">Información personal</span>
                <Card.Title className="section-heading h2 mb-4">Perfil</Card.Title>
                {profile ? (
                  <ProfileForm profile={profile} onSave={handleSaveProfile} />
                ) : (
                  <Alert variant="info">
                    <Alert.Heading>Sin perfil aún</Alert.Heading>
                    <p className="mb-0">Completa el formulario y haz clic en "Guardar Perfil" para crear uno.</p>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          )}

          {/* EXPERIENCE */}
          {activeSection === "experience" && (
            <>
              <Card className="mb-4">
                <Card.Body className="p-4">
                  <span className="eyebrow">Trayectoria</span>
                  <Card.Title className="section-heading h2 mb-4">Añadir Experiencia</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Empresa</Form.Label>
                        <Form.Control value={newExpCompany} onChange={(e) => setNewExpCompany(e.target.value)} placeholder="Nombre de la empresa" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Rol</Form.Label>
                        <Form.Control value={newExpRole} onChange={(e) => setNewExpRole(e.target.value)} placeholder="Título del puesto" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Fecha de inicio</Form.Label>
                        <Form.Control type="date" value={newExpStart} onChange={(e) => setNewExpStart(e.target.value)} />
                      </Col>
                      <Col md={12}>
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control as="textarea" rows={2} value={newExpDesc} onChange={(e) => setNewExpDesc(e.target.value)} placeholder="Describe tu rol" />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddExperience} variant="primary">Añadir Experiencia</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Experiencia Existente</Card.Title>
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
                      <EmptyState
                      icon="💼"
                      title="Sin experiencia aún"
                      description="Añade tu primera experiencia laboral usando el formulario de arriba."
                    />
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
                  <span className="eyebrow">Formación</span>
                  <Card.Title className="section-heading h2 mb-4">Añadir Educación</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Institución</Form.Label>
                        <Form.Control value={newInst} onChange={(e) => setNewInst(e.target.value)} placeholder="Universidad / Escuela" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Título</Form.Label>
                        <Form.Control value={newDegree} onChange={(e) => setNewDegree(e.target.value)} placeholder="Ingeniería / Carrera" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Año</Form.Label>
                        <Form.Control value={newYear} onChange={(e) => setNewYear(e.target.value)} placeholder="Ej: 2020-2023" />
                      </Col>
                      <Col md={12}>
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control as="textarea" rows={2} value={newEduDesc} onChange={(e) => setNewEduDesc(e.target.value)} />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddEducation} variant="primary">Añadir Educación</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Educación Existente</Card.Title>
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
                    <EmptyState
                      icon="🎓"
                      title="Sin formación añadida"
                      description="Agrega tu historial educativo usando el formulario de arriba."
                    />
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
                  <span className="eyebrow">Habilidades</span>
                  <Card.Title className="section-heading h2 mb-4">Añadir Habilidad</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={4}>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="Ej: React" />
                      </Col>
                      <Col md={4}>
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control value={newSkillCat} onChange={(e) => setNewSkillCat(e.target.value)} placeholder="Ej: Frontend" />
                      </Col>
                      <Col md={4}>
                        <Form.Label>Nivel (0-100)</Form.Label>
                        <Form.Control type="number" min={0} max={100} value={newSkillLevel} onChange={(e) => setNewSkillLevel(Number(e.target.value))} />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddSkill} variant="primary">Añadir Habilidad</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Habilidades Existentes</Card.Title>
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
                    <EmptyState
                      icon="🛠️"
                      title="Sin habilidades aún"
                      description="Agrega tus habilidades usando el formulario de arriba."
                    />
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
                  <span className="eyebrow">Portafolio</span>
                  <Card.Title className="section-heading h2 mb-4">Añadir Proyecto</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Título</Form.Label>
                        <Form.Control value={newProjTitle} onChange={(e) => setNewProjTitle(e.target.value)} placeholder="Nombre del proyecto" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>URL Demo</Form.Label>
                        <Form.Control value={newProjUrl} onChange={(e) => setNewProjUrl(e.target.value)} placeholder="https://..." />
                      </Col>
                      <Col md={12}>
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control as="textarea" rows={2} value={newProjDesc} onChange={(e) => setNewProjDesc(e.target.value)} />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddProject} variant="primary">Añadir Proyecto</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Proyectos Existentes</Card.Title>
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
                    <EmptyState
                      icon="📁"
                      title="Sin proyectos aún"
                      description="Muestra tu trabajo añadiendo proyectos arriba."
                    />
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
                  <span className="eyebrow">Aprendizaje</span>
                  <Card.Title className="section-heading h2 mb-4">Añadir Curso</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Título</Form.Label>
                        <Form.Control value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} placeholder="Nombre del curso" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Plataforma</Form.Label>
                        <Form.Control value={newCoursePlat} onChange={(e) => setNewCoursePlat(e.target.value)} placeholder="Ej: Udemy, Coursera" />
                      </Col>
                      <Col md={12}>
                        <Form.Label>URL Certificado</Form.Label>
                        <Form.Control value={newCourseCert} onChange={(e) => setNewCourseCert(e.target.value)} placeholder="https://..." />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddCourse} variant="primary">Añadir Curso</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Cursos Existentes</Card.Title>
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
                    <EmptyState
                      icon="📚"
                      title="Sin cursos aún"
                      description="Añade tus cursos completados y certificaciones arriba."
                    />
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
                  <span className="eyebrow">Artículos</span>
                  <Card.Title className="section-heading h2 mb-4">Añadir Artículo</Card.Title>
                  <div className="control-panel">
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Label>Título</Form.Label>
                        <Form.Control value={newBlogTitle} onChange={(e) => setNewBlogTitle(e.target.value)} placeholder="Título del post" />
                      </Col>
                      <Col md={6}>
                        <Form.Label>Slug</Form.Label>
                        <Form.Control value={newBlogSlug} onChange={(e) => setNewBlogSlug(e.target.value)} placeholder="mi-post-slug" />
                      </Col>
                      <Col md={12}>
                        <Form.Label>Contenido (Markdown)</Form.Label>
                        <Form.Control as="textarea" rows={5} value={newBlogContent} onChange={(e) => setNewBlogContent(e.target.value)} placeholder="Escribe tu artículo en markdown..." />
                      </Col>
                      <Col md={12}>
                        <Button onClick={handleAddBlog} variant="primary">Publicar Artículo</Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <Card>
                <Card.Body className="p-4">
                  <Card.Title className="section-heading h3 mb-3">Artículos Existentes</Card.Title>
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
                    <EmptyState
                      icon="✍️"
                      title="Sin artículos aún"
                      description="Empieza a escribir y comparte tu conocimiento."
                    />
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
