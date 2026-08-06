import React from "react";
import DashboardLayout from "./DashboardLayout";

const STUDENT_NAV = [
  { href: "/dashboard", icon: "📊", label: "Overview" },
  { href: "/dashboard/my-courses", icon: "📚", label: "My Courses" },
  { href: "/dashboard/sessions", icon: "🎥", label: "Live Sessions" },
  { href: "/dashboard/lessons", icon: "🎓", label: "All Lessons" },
];

const MY_COURSES = [
  { icon: "✨", title: "Prompt Engineering", modules: "6 of 8 modules" },
  { icon: "🔗", title: "RAG Design", modules: "3 of 10 modules" },
  { icon: "💡", title: "Agentic AI", modules: "1 of 9 modules" },
];

export default function StudentLesson() {
  return (
    <DashboardLayout role="student" userName="Alex Morgan" navItems={STUDENT_NAV}>
      <div className="dash-panel">
        <div className="dash-panel-head">
          <h2>All Lessons</h2>
        </div>
        {MY_COURSES.map((course) => (
          <div key={course.title} className="dash-course-item">
            <div className="dash-course-icon">{course.icon}</div>
            <div className="dash-course-info">
              <div className="dash-course-title">{course.title}</div>
              <div className="dash-course-meta">{course.modules}</div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}