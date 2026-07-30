import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const ADMIN_NAV = [
  { href: "/admin", icon: "📊", label: "Overview" },
  { href: "/admin/students", icon: "👥", label: "Students" },
  { href: "/admin/courses", icon: "📚", label: "Courses" },
  { href: "/admin/sessions", icon: "🎥", label: "Live Sessions" },
];

const STUDENTS = [
  { name: "Alex Morgan", email: "alex@company.com", course: "Prompt Engineering", progress: 75, status: "active" },
  { name: "Sarah Chen", email: "sarah@company.com", course: "RAG Design", progress: 45, status: "active" },
  { name: "James Wilson", email: "james@company.com", course: "Agentic AI", progress: 20, status: "pending" },
  { name: "Priya Patel", email: "priya@company.com", course: "ML Foundations", progress: 100, status: "completed" },
  { name: "Marcus Lee", email: "marcus@company.com", course: "VectorDB & Embeddings", progress: 62, status: "active" },
];

const RECENT_ENROLLMENTS = [
  { name: "Emily Rodriguez", course: "Prompt Engineering", time: "1 hour ago" },
  { name: "David Kim", course: "RAG Design", time: "3 hours ago" },
  { name: "Lisa Thompson", course: "Agentic AI", time: "Yesterday" },
];

const LIVE_SESSIONS = [
  { title: "RAG Pipeline Workshop", instructor: "Alex Morgan", students: 24, status: "live" },
  { title: "Prompt Evaluation Lab", instructor: "Sarah Chen", students: 18, status: "scheduled" },
  { title: "Agent Architecture Review", instructor: "James Wilson", students: 12, status: "scheduled" },
];

function StatusBadge({ status }) {
  const labels = { active: "Active", pending: "Pending", completed: "Completed", live: "Live", scheduled: "Scheduled" };
  const className =
    status === "active" || status === "live"
      ? "dash-status--active"
      : status === "pending" || status === "scheduled"
        ? "dash-status--pending"
        : "dash-status--completed";
  return <span className={`dash-status ${className}`}>{labels[status]}</span>;
}

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" userName="Alex Morgan" userRole="Lead Instructor" navItems={ADMIN_NAV}>
      <div className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-label">Active Students</div>
          <div className="dash-stat-value">
            247
            <span className="dash-stat-badge dash-stat-badge--up">+12%</span>
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Training Modules</div>
          <div className="dash-stat-value">
            12
            <span className="dash-stat-badge dash-stat-badge--up">+2 new</span>
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Completion Rate</div>
          <div className="dash-stat-value">89.3%</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Live Sessions</div>
          <div className="dash-stat-value">
            03
            <span className="dash-stat-badge dash-stat-badge--live">● Live</span>
          </div>
        </div>
      </div>

      <div className="dash-panel" style={{ marginBottom: 22 }}>
        <div className="dash-panel-head">
          <h2>Enrollment Trends</h2>
          <span style={{ fontSize: 13, color: "var(--text-2)" }}>Last 30 days</span>
        </div>
        <div className="dash-chart">
          <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="dash-chart-svg">
            <polyline
              fill="none"
              stroke="var(--accent-orange)"
              strokeWidth="2.5"
              points="0,80 50,40 100,55 150,30 200,60 250,35 300,50 350,20 400,45"
            />
            <polyline
              fill="none"
              stroke="var(--accent-teal)"
              strokeWidth="2.5"
              points="0,100 50,70 100,30 150,50 200,25 250,55 300,20 350,45 400,15"
            />
            <polyline
              fill="none"
              stroke="#7a4a1f"
              strokeWidth="2.5"
              points="0,110 50,95 100,90 150,70 200,85 250,60 300,75 350,55 400,65"
            />
          </svg>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>Students</h2>
            <Link to="/admin/students" className="dash-panel-link">
              View all →
            </Link>
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
                {STUDENTS.map((student) => (
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
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="dash-panel" style={{ marginBottom: 22 }}>
            <div className="dash-panel-head">
              <h2>Recent Enrollments</h2>
            </div>
            {RECENT_ENROLLMENTS.map((item) => (
              <div key={item.name} className="dash-activity-item">
                <span className="dash-activity-dot" />
                <div>
                  <div className="dash-activity-text">
                    <strong>{item.name}</strong> enrolled in {item.course}
                  </div>
                  <div className="dash-activity-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Quick Actions</h2>
            </div>
            <div className="dash-quick-actions">
              <Link to="/admin/add-student" className="dash-action-btn">
                <span className="dash-action-icon">➕</span> Add student
              </Link>
              <a href="#new-course" className="dash-action-btn">
                <span className="dash-action-icon">📚</span> Create course
              </a>
              <a href="#schedule" className="dash-action-btn">
                <span className="dash-action-icon">📅</span> Schedule session
              </a>
              <a href="#export" className="dash-action-btn">
                <span className="dash-action-icon">📥</span> Export report
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-panel" style={{ marginTop: 22 }}>
        <div className="dash-panel-head">
          <h2>Live & Upcoming Sessions</h2>
          <a href="#sessions" className="dash-panel-link">
            Manage sessions →
          </a>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Instructor</th>
                <th>Students</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {LIVE_SESSIONS.map((session) => (
                <tr key={session.title}>
                  <td className="dash-table-name">{session.title}</td>
                  <td>{session.instructor}</td>
                  <td>{session.students}</td>
                  <td>
                    <StatusBadge status={session.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}