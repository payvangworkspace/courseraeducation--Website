import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const ADMIN_NAV = [
  { href: "/admin", icon: "📊", label: "Overview" },
  { href: "/admin/students", icon: "👥", label: "Students" },
  { href: "/admin/courses", icon: "📚", label: "Courses" },
  { href: "/admin/sessions", icon: "🎥", label: "Live Sessions" },
];

// TODO: replace with a real fetch once the courses API exists,
// e.g. const { data: courses } = useQuery(["courses"], fetchCourses);
const AVAILABLE_COURSES = [
  "Prompt Engineering",
  "RAG Design",
  "Agentic AI",
  "ML Foundations",
  "VectorDB & Embeddings",
];

const EMPTY_FORM = { name: "", email: "", course: AVAILABLE_COURSES[0], status: "pending" };

export default function AdminAddStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Student name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    // TODO: replace with a real POST once the students API exists,
    // e.g. await createStudent(form); then navigate("/admin/students");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <DashboardLayout role="admin" userName="Alex Morgan" userRole="Lead Instructor" navItems={ADMIN_NAV}>
        <div className="dash-panel" style={{ maxWidth: 480, margin: "40px auto", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 19, margin: "0 0 8px" }}>Student added</h2>
          <p style={{ fontSize: 13.5, color: "var(--text-1)", margin: "0 0 24px" }}>
            <strong>{form.name}</strong> was added locally for this preview. Nothing is saved yet — this page
            just calls <code>createStudent</code> once the students API exists.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              type="button"
              className="ld-btn ld-btn--ghost ld-btn--sm"
              onClick={() => {
                setForm(EMPTY_FORM);
                setSubmitted(false);
              }}
            >
              Add another
            </button>
            <button
              type="button"
              className="ld-btn ld-btn--primary ld-btn--sm"
              onClick={() => navigate("/admin/students")}
            >
              Go to Students →
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" userName="Alex Morgan" userRole="Lead Instructor" navItems={ADMIN_NAV}>
      <div className="dash-panel" style={{ maxWidth: 480, margin: "0 auto" }}>
        <div className="dash-panel-head">
          <h2>Add student</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
            Full name
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Jordan Rivera"
              style={{
                display: "block", width: "100%", marginTop: 6, padding: "10px 12px",
                borderRadius: 10, border: `1px solid ${errors.name ? "var(--accent-red)" : "var(--card-border)"}`,
                fontSize: 14, fontFamily: "var(--font-body)",
              }}
            />
          </label>
          {errors.name && <div style={{ color: "var(--accent-red)", fontSize: 12, marginTop: -4, marginBottom: 12 }}>{errors.name}</div>}

          <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, marginTop: 14 }}>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="jordan@company.com"
              style={{
                display: "block", width: "100%", marginTop: 6, padding: "10px 12px",
                borderRadius: 10, border: `1px solid ${errors.email ? "var(--accent-red)" : "var(--card-border)"}`,
                fontSize: 14, fontFamily: "var(--font-body)",
              }}
            />
          </label>
          {errors.email && <div style={{ color: "var(--accent-red)", fontSize: 12, marginTop: -4, marginBottom: 12 }}>{errors.email}</div>}

          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, flex: 1 }}>
              Course
              <select
                value={form.course}
                onChange={(e) => updateField("course", e.target.value)}
                style={{
                  display: "block", width: "100%", marginTop: 6, padding: "10px 12px",
                  borderRadius: 10, border: "1px solid var(--card-border)", fontSize: 14,
                  fontFamily: "var(--font-body)", background: "#fff",
                }}
              >
                {AVAILABLE_COURSES.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
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
                <option value="pending">Pending</option>
                <option value="active">Active</option>
              </select>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
            <button
              type="button"
              className="ld-btn ld-btn--ghost ld-btn--sm"
              onClick={() => navigate("/admin")}
            >
              Cancel
            </button>
            <button type="submit" className="ld-btn ld-btn--primary ld-btn--sm">
              Add student
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}