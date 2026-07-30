import React, { useMemo, useState } from "react";
import DashboardLayout from "./DashboardLayout";

const ADMIN_NAV = [
  { href: "/admin", icon: "📊", label: "Overview" },
  { href: "/admin/students", icon: "👥", label: "Students" },
  { href: "/admin/courses", icon: "📚", label: "Courses" },
  { href: "/admin/sessions", icon: "🎥", label: "Live Sessions" },
];

// TODO: replace with a real fetch once the students API exists,
// e.g. const { data: students } = useQuery(["students"], fetchStudents);
const MOCK_STUDENTS = [
  { name: "Alex Morgan", email: "alex@company.com", course: "Prompt Engineering", progress: 75, status: "active" },
  { name: "Sarah Chen", email: "sarah@company.com", course: "RAG Design", progress: 45, status: "active" },
  { name: "James Wilson", email: "james@company.com", course: "Agentic AI", progress: 20, status: "pending" },
  { name: "Priya Patel", email: "priya@company.com", course: "ML Foundations", progress: 100, status: "completed" },
  { name: "Marcus Lee", email: "marcus@company.com", course: "VectorDB & Embeddings", progress: 62, status: "active" },
  { name: "Emily Rodriguez", email: "emily@company.com", course: "Prompt Engineering", progress: 12, status: "pending" },
  { name: "David Kim", email: "david@company.com", course: "RAG Design", progress: 88, status: "active" },
  { name: "Lisa Thompson", email: "lisa@company.com", course: "Agentic AI", progress: 100, status: "completed" },
];

function StatusBadge({ status }) {
  const labels = { active: "Active", pending: "Pending", completed: "Completed" };
  const className =
    status === "active" ? "dash-status--active" : status === "pending" ? "dash-status--pending" : "dash-status--completed";
  return <span className={`dash-status ${className}`}>{labels[status]}</span>;
}

export default function AdminStudents() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Client-side filtering over the mock list. Swap this useMemo out for
  // server-side search/pagination once the API is wired up.
  const students = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      const matchesQuery =
        !query ||
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.email.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  return (
    <DashboardLayout role="admin" userName="Alex Morgan" userRole="Lead Instructor" navItems={ADMIN_NAV}>
      <div className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-label">Total Students</div>
          <div className="dash-stat-value">{MOCK_STUDENTS.length}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Active</div>
          <div className="dash-stat-value">
            {MOCK_STUDENTS.filter((s) => s.status === "active").length}
            <span className="dash-stat-badge dash-stat-badge--green">On track</span>
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Pending</div>
          <div className="dash-stat-value">{MOCK_STUDENTS.filter((s) => s.status === "pending").length}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Completed</div>
          <div className="dash-stat-value">{MOCK_STUDENTS.filter((s) => s.status === "completed").length}</div>
        </div>
      </div>

      <div className="dash-panel">
        <div className="dash-panel-head">
          <h2>Students</h2>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              placeholder="Search by name or email"
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
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Course</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.email}>
                  <td>
                    <div className="dash-table-name">{student.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-2)" }}>{student.email}</div>
                  </td>
                  <td>{student.course}</td>
                  <td>{student.progress}%</td>
                  <td>
                    <StatusBadge status={student.status} />
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "24px 0", color: "var(--text-2)" }}>
                    No students match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}