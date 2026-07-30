import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const STUDENT_NAV = [
  { href: "/dashboard", icon: "📊", label: "Overview" },
  { href: "/dashboard/my-courses", icon: "📚", label: "My Courses" },
  { href: "/dashboard/sessions", icon: "🎥", label: "Live Sessions" },
  { href: "/dashboard/lessons", icon: "🎓", label: "All Lessons" },
];

const MY_COURSES = [
  { icon: "✨", title: "Prompt Engineering", modules: "6 of 8 modules", progress: 75, next: "Evaluation Workflows" },
  { icon: "🔗", title: "RAG Design", modules: "3 of 10 modules", progress: 30, next: "Vector Search Basics" },
  { icon: "💡", title: "Agentic AI", modules: "1 of 9 modules", progress: 11, next: "Tool Calling Intro" },
];

const UPCOMING_SESSIONS = [
  { day: "02", month: "Aug", title: "RAG Pipeline Workshop", time: "10:00 AM · Live" },
  { day: "05", month: "Aug", title: "Prompt Evaluation Lab", time: "2:00 PM · Live" },
  { day: "08", month: "Aug", title: "Agent Architecture Review", time: "11:00 AM · Live" },
];

const RECENT_ACTIVITY = [
  { text: "Completed module", highlight: "Prompt Guardrails", time: "2 hours ago" },
  { text: "Submitted lab", highlight: "RAG Chunking Exercise", time: "Yesterday" },
  { text: "Joined live session", highlight: "Intro to Embeddings", time: "2 days ago" },
  { text: "Started course", highlight: "Agentic AI", time: "3 days ago" },
];

export default function StudentPortal() {
  return (
    <DashboardLayout role="student" userName="Alex Morgan" navItems={STUDENT_NAV}>
      <div className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-label">Courses Enrolled</div>
          <div className="dash-stat-value">3</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Overall Progress</div>
          <div className="dash-stat-value">
            39%
            <span className="dash-stat-badge dash-stat-badge--up">+8% this week</span>
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Modules Completed</div>
          <div className="dash-stat-value">
            10
            <span className="dash-stat-badge dash-stat-badge--green">On track</span>
          </div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">Upcoming Sessions</div>
          <div className="dash-stat-value">
            03
            <span className="dash-stat-badge dash-stat-badge--live">● This week</span>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>My Courses</h2>
            <Link to="/dashboard/my-courses" className="dash-panel-link">
              Browse all →
            </Link>
          </div>

          {MY_COURSES.map((course) => (
            <div key={course.title} className="dash-course-item">
              <div className="dash-course-icon">{course.icon}</div>
              <div className="dash-course-info">
                <div className="dash-course-title">{course.title}</div>
                <div className="dash-course-meta">{course.modules}</div>
                <div className="dash-course-meta">Next: {course.next}</div>
                <div className="dash-progress-bar">
                  <div className="dash-progress-fill" style={{ width: `${course.progress}%` }} />
                </div>
                <div className="dash-course-progress-text">{course.progress}% complete</div>
              </div>
            </div>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>Upcoming Live Sessions</h2>
            <Link to="/dashboard/sessions" className="dash-panel-link">
              View calendar →
            </Link>
          </div>

          {UPCOMING_SESSIONS.map((session) => (
            <div key={session.title} className="dash-session">
              <div className="dash-session-date">
                <div className="dash-session-day">{session.day}</div>
                <div className="dash-session-month">{session.month}</div>
              </div>
              <div>
                <div className="dash-session-title">{session.title}</div>
                <div className="dash-session-time">{session.time}</div>
              </div>
            </div>
          ))}

          <button type="button" className="ld-btn ld-btn--primary" style={{ width: "100%", marginTop: 16, justifyContent: "center" }}>
            Join next session <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <div className="dash-panel" style={{ marginTop: 22 }}>
        <div className="dash-panel-head">
          <h2>Recent Activity</h2>
        </div>
        {RECENT_ACTIVITY.map((item) => (
          <div key={item.time + item.highlight} className="dash-activity-item">
            <span className="dash-activity-dot" />
            <div>
              <div className="dash-activity-text">
                {item.text} <strong>{item.highlight}</strong>
              </div>
              <div className="dash-activity-time">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}