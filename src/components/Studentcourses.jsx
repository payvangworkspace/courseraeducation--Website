import React from "react";
import DashboardLayout from "./DashboardLayout";

const STUDENT_NAV = [
  { href: "/dashboard", icon: "📊", label: "Overview" },
  { href: "/dashboard/my-courses", icon: "📚", label: "My Courses" },
  { href: "/dashboard/sessions", icon: "🎥", label: "Live Sessions" },
  { href: "/lessons", icon: "🎓", label: "All Lessons" },
];

const MY_COURSES = [
  { icon: "✨", title: "Prompt Engineering", modules: "6 of 8 modules", progress: 75, next: "Evaluation Workflows" },
  { icon: "🔗", title: "RAG Design", modules: "3 of 10 modules", progress: 30, next: "Vector Search Basics" },
  { icon: "💡", title: "Agentic AI", modules: "1 of 9 modules", progress: 11, next: "Tool Calling Intro" },
];

export default function Studentcourses() {
  return (
    <DashboardLayout role="student" userName="Alex Morgan" navItems={STUDENT_NAV}>
      <div className="dash-panel">
        <div className="dash-panel-head">
          <h2>My Courses</h2>
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
    </DashboardLayout>
  );
}