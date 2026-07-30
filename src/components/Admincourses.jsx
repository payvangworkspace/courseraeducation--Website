import React, { useMemo, useState } from "react";
import DashboardLayout from "./DashboardLayout";

const ADMIN_NAV = [
  { href: "/admin", icon: "📊", label: "Overview" },
  { href: "/admin/students", icon: "👥", label: "Students" },
  { href: "/admin/courses", icon: "📚", label: "Courses" },
  { href: "/admin/sessions", icon: "🎥", label: "Live Sessions" },
];

// TODO: replace with a real fetch once the courses API exists,
// e.g. const { data: courses } = useQuery(["courses"], fetchCourses);
const MOCK_COURSES = [
  { title: "Prompt Engineering", instructor: "Alex Morgan", modules: 8, students: 92, completion: 75, status: "published" },
  { title: "RAG Design", instructor: "Sarah Chen", modules: 10, students: 64, completion: 45, status: "published" },
  { title: "Agentic AI", instructor: "James Wilson", modules: 9, students: 41, completion: 20, status: "published" },
  { title: "ML Foundations", instructor: "Priya Patel", modules: 12, students: 130, completion: 100, status: "published" },
  { title: "VectorDB & Embeddings", instructor: "Marcus Lee", modules: 7, students: 38, completion: 62, status: "published" },
  { title: "Multi-Agent Systems", instructor: "Alex Morgan", modules: 6, students: 0, completion: 0, status: "draft" },
];

function StatusBadge({ status }) {
  const labels = { published: "Published", draft: "Draft" };
  const className = status === "published" ? "dash-status--active" : "dash-status--pending";
  return <span className={`dash-status ${className}`}>{labels[status]}</span>;
}

const EMPTY_FORM = { title: "", instructor: "", modules: "", status: "draft" };

function AddCourseModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Course title is required.";
    if (!form.instructor.trim()) next.instructor = "Instructor is required.";
    if (!form.modules || Number(form.modules) <= 0) next.modules = "Enter a module count greater than 0.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: form.title.trim(),
      instructor: form.instructor.trim(),
      modules: Number(form.modules),
      students: 0,
      completion: 0,
      status: form.status,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-course-title"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(36,20,23,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 50,
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          padding: 28,
          width: "100%",
          maxWidth: 440,
          boxShadow: "var(--shadow-md)",
        }}
      >
        <h2 id="add-course-title" style={{ fontFamily: "var(--font-display)", fontSize: 19, margin: "0 0 4px" }}>
          Add course
        </h2>
        <p style={{ fontSize: 13.5, color: "var(--text-1)", margin: "0 0 20px" }}>
          This adds the course to the list below. It isn't saved anywhere yet — hook this up once the courses API exists.
        </p>

        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          Course title
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g. Fine-Tuning Fundamentals"
            style={{
              display: "block", width: "100%", marginTop: 6, padding: "10px 12px",
              borderRadius: 10, border: `1px solid ${errors.title ? "var(--accent-red)" : "var(--card-border)"}`,
              fontSize: 14, fontFamily: "var(--font-body)",
            }}
          />
        </label>
        {errors.title && <div style={{ color: "var(--accent-red)", fontSize: 12, marginTop: -4, marginBottom: 12 }}>{errors.title}</div>}

        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, marginTop: 14 }}>
          Instructor
          <input
            type="text"
            value={form.instructor}
            onChange={(e) => updateField("instructor", e.target.value)}
            placeholder="e.g. Sarah Chen"
            style={{
              display: "block", width: "100%", marginTop: 6, padding: "10px 12px",
              borderRadius: 10, border: `1px solid ${errors.instructor ? "var(--accent-red)" : "var(--card-border)"}`,
              fontSize: 14, fontFamily: "var(--font-body)",
            }}
          />
        </label>
        {errors.instructor && <div style={{ color: "var(--accent-red)", fontSize: 12, marginTop: -4, marginBottom: 12 }}>{errors.instructor}</div>}

        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, flex: 1 }}>
            Modules
            <input
              type="number"
              min="1"
              value={form.modules}
              onChange={(e) => updateField("modules", e.target.value)}
              placeholder="8"
              style={{
                display: "block", width: "100%", marginTop: 6, padding: "10px 12px",
                borderRadius: 10, border: `1px solid ${errors.modules ? "var(--accent-red)" : "var(--card-border)"}`,
                fontSize: 14, fontFamily: "var(--font-body)",
              }}
            />
          </label>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, flex: 1 }}>
            Status
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              style={{
                display: "block", width: "100%", marginTop: 6, padding: "10px 12px",
                borderRadius: 10, border: "1px solid var(--card-border)", fontSize: 14,
                fontFamily: "var(--font-body)", background: "#fff",
              }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>
        {errors.modules && <div style={{ color: "var(--accent-red)", fontSize: 12, marginTop: 6 }}>{errors.modules}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button type="button" onClick={onClose} className="ld-btn ld-btn--ghost ld-btn--sm">
            Cancel
          </button>
          <button type="submit" className="ld-btn ld-btn--primary ld-btn--sm">
            Add course
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminCourses() {
  const [allCourses, setAllCourses] = useState(MOCK_COURSES);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Client-side filtering over the mock list. Swap this useMemo out for
  // server-side search/pagination once the API is wired up.
  const courses = useMemo(() => {
    return allCourses.filter((c) => {
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [allCourses, query, statusFilter]);

  const totalStudents = allCourses.reduce((sum, c) => sum + c.students, 0);
  const publishedCount = allCourses.filter((c) => c.status === "published").length;
  const avgCompletion = allCourses.length
    ? Math.round(allCourses.reduce((sum, c) => sum + c.completion, 0) / allCourses.length)
    : 0;

  function handleAddCourse(newCourse) {
    setAllCourses((prev) => [newCourse, ...prev]);
    setIsModalOpen(false);
  }

  return (
    <DashboardLayout role="admin" userName="Alex Morgan" userRole="Lead Instructor" navItems={ADMIN_NAV}>
      <div className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-label">Total Courses</div>
          <div className="dash-stat-value">{allCourses.length}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Published</div>
          <div className="dash-stat-value">
            {publishedCount}
            <span className="dash-stat-badge dash-stat-badge--green">Live</span>
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Total Enrollments</div>
          <div className="dash-stat-value">{totalStudents}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Avg. Completion</div>
          <div className="dash-stat-value">{avgCompletion}%</div>
        </div>
      </div>

      <div className="dash-panel">
        <div className="dash-panel-head">
          <h2>Courses</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              placeholder="Search by title or instructor"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid var(--card-border)",
                fontSize: 13.5,
                minWidth: 220,
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid var(--card-border)",
                fontSize: 13.5,
                background: "#fff",
              }}
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="ld-btn ld-btn--primary ld-btn--sm"
              style={{ whiteSpace: "nowrap" }}
            >
              + New course
            </button>
          </div>
        </div>

        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Modules</th>
                <th>Students</th>
                <th>Completion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.title}>
                  <td className="dash-table-name">{course.title}</td>
                  <td>{course.instructor}</td>
                  <td>{course.modules}</td>
                  <td>{course.students}</td>
                  <td>{course.completion}%</td>
                  <td>
                    <StatusBadge status={course.status} />
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "24px 0", color: "var(--text-2)" }}>
                    No courses match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <AddCourseModal onClose={() => setIsModalOpen(false)} onSubmit={handleAddCourse} />
      )}
    </DashboardLayout>
  );
}