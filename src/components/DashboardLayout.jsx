import React from "react";
import { Link, useLocation } from "react-router-dom";

const BRAND_NAME = "Coursera Education";

export default function DashboardLayout({
  role = "student",
  userName = "Alex Morgan",
  userRole,
  navItems,
  children,
}) {
  const location = useLocation();
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const displayRole =
    userRole || (role === "admin" ? "Administrator" : "Student");

  return (
    <div className="dash-root">
      <style>{CSS}</style>

      <aside className="dash-sidebar">
        <Link to="/" className="dash-logo">
          <img src="/logoCoursera.png" alt={BRAND_NAME} className="dash-logo-img" />
        </Link>

        <div className="dash-role-badge">
          {role === "admin" ? "Admin Panel" : "Student Portal"}
        </div>

        <nav className="dash-nav">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "/admin" &&
                location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`dash-nav-item ${isActive ? "dash-nav-item--active" : ""}`}
              >
                <span className="dash-nav-icon" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user">
            <div className="dash-avatar">{initials}</div>
            <div>
              <div className="dash-user-name">{userName}</div>
              <div className="dash-user-role">{displayRole}</div>
            </div>
          </div>
          <Link to="/login" className="dash-logout">
            Log out
          </Link>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <div>
            <h1 className="dash-page-title">
              {role === "admin" ? "Admin Dashboard" : "My Dashboard"}
            </h1>
            <p className="dash-page-sub">
              Welcome back, {userName.split(" ")[0]}!
            </p>
          </div>
          <div className="dash-topbar-actions">
            {/* {role === "admin" ? (
              <Link to="/dashboard" className="ld-btn ld-btn--outline ld-btn--sm">
                Student view
              </Link>
            ) : (
              <Link to="/admin" className="ld-btn ld-btn--outline ld-btn--sm">
                Admin view
              </Link>
            )} */}
            <Link to="/" className="ld-btn ld-btn--ghost ld-btn--sm">
              Back to site
            </Link>
          </div>
        </header>

        <main className="dash-content">{children}</main>
      </div>
    </div>
  );
}

const CSS = `
:root {
  --bg-0: #ffffff;
  --bg-1: #f9f0e7;
  --bg-2: #f3e2d0;
  --card: #ffffff;
  --card-border: rgba(122,23,53,0.12);
  --text-0: #241417;
  --text-1: #6b5a56;
  --text-2: #a3908b;
  --accent-orange: #7a1735;
  --accent-teal: #c1922f;
  --accent-green: #16a34a;
  --accent-red: #dc2626;
  --gradient: linear-gradient(90deg, var(--accent-orange), var(--accent-teal));
  --radius-lg: 22px;
  --radius-md: 16px;
  --shadow-sm: 0 1px 2px rgba(36,20,23,0.04);
  --shadow-md: 0 14px 34px -18px rgba(36,20,23,0.20);
  --font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --sidebar-w: 260px;
}

.dash-root {
  display: flex;
  min-height: 100vh;
  background: var(--bg-0);
  color: var(--text-0);
  font-family: var(--font-body);
  line-height: 1.5;
}
.dash-root * { box-sizing: border-box; }

.dash-sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: var(--bg-1);
  border-right: 1px solid var(--card-border);
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.dash-logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: 20px;
  padding: 0 6px;
}
.dash-logo-img { height: 48px; width: auto; }

.dash-role-badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent-orange);
  background: rgba(122,23,53,0.08);
  border: 1px solid rgba(122,23,53,0.18);
  padding: 6px 12px;
  border-radius: 999px;
  margin: 0 6px 24px;
  width: fit-content;
}

.dash-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.dash-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 12px;
  color: var(--text-1);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background .2s ease, color .2s ease;
}
.dash-nav-item:hover { background: rgba(255,255,255,0.7); color: var(--text-0); }
.dash-nav-item--active {
  background: #ffffff;
  color: var(--accent-orange);
  box-shadow: var(--shadow-sm);
  font-weight: 600;
}
.dash-nav-icon { font-size: 16px; width: 22px; text-align: center; }

.dash-sidebar-footer {
  border-top: 1px solid var(--card-border);
  padding-top: 18px;
  margin-top: 18px;
}
.dash-user { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.dash-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--gradient);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: #fff; font-size: 14px; flex-shrink: 0;
}
.dash-user-name { font-size: 13.5px; font-weight: 600; color: var(--text-0); }
.dash-user-role { font-size: 12px; color: var(--text-2); }
.dash-logout {
  display: block;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-1);
  text-decoration: none;
  padding: 9px;
  border-radius: 10px;
  border: 1px solid var(--card-border);
  background: #fff;
  transition: background .2s ease;
}
.dash-logout:hover { background: var(--bg-2); color: var(--text-0); }

.dash-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.dash-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 28px 32px 20px;
  border-bottom: 1px solid var(--card-border);
  background: #fff;
  flex-wrap: wrap;
}
.dash-page-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}
.dash-page-sub { color: var(--text-1); font-size: 14.5px; margin: 0; }
.dash-topbar-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.dash-content { padding: 28px 32px 48px; flex: 1; background: var(--bg-0); }

.ld-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 22px; border-radius: 999px; font-weight: 600; font-size: 14.5px;
  text-decoration: none; border: 1px solid transparent; cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  font-family: var(--font-body);
}
.ld-btn:hover { transform: translateY(-1px); }
.ld-btn--sm { padding: 9px 16px; font-size: 13.5px; }
.ld-btn--primary { background: var(--gradient); color: #ffffff; box-shadow: 0 10px 24px -8px rgba(122,23,53,0.45); }
.ld-btn--ghost { background: transparent; color: var(--text-0); border-color: var(--card-border); }
.ld-btn--ghost:hover { background: var(--bg-1); }
.ld-btn--outline { background: #ffffff; color: var(--text-0); border-color: var(--card-border); }
.ld-btn--outline:hover { background: var(--bg-1); }

.dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 28px; }
.dash-stat {
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  padding: 20px 18px;
  box-shadow: var(--shadow-sm);
}
.dash-stat-label { font-size: 12.5px; color: var(--text-2); margin-bottom: 8px; }
.dash-stat-value {
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.dash-stat-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
}
.dash-stat-badge--up { color: var(--accent-teal); background: rgba(193,146,47,0.12); }
.dash-stat-badge--live { color: var(--accent-red); background: rgba(220,38,38,0.1); }
.dash-stat-badge--green { color: var(--accent-green); background: rgba(22,163,74,0.1); }

.dash-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 22px; }
.dash-grid--equal { grid-template-columns: 1fr 1fr; }

.dash-panel {
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}
.dash-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
}
.dash-panel-head h2 {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  margin: 0;
}
.dash-panel-link {
  font-size: 13px;
  font-weight: 500;
  color: var(--accent-orange);
  text-decoration: none;
}
.dash-panel-link:hover { color: var(--accent-teal); text-decoration: underline; }

.dash-progress-bar {
  height: 8px;
  background: var(--bg-2);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 8px;
}
.dash-progress-fill {
  height: 100%;
  background: var(--gradient);
  border-radius: 999px;
  transition: width .4s ease;
}

.dash-course-item {
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--card-border);
}
.dash-course-item:last-child { border-bottom: none; padding-bottom: 0; }
.dash-course-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--bg-1);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.dash-course-info { flex: 1; min-width: 0; }
.dash-course-title { font-weight: 600; font-size: 14.5px; margin-bottom: 4px; }
.dash-course-meta { font-size: 12.5px; color: var(--text-2); margin-bottom: 2px; }
.dash-course-progress-text { font-size: 12px; color: var(--accent-orange); font-weight: 600; }

.dash-session {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--card-border);
}
.dash-session:last-child { border-bottom: none; }
.dash-session-date {
  text-align: center;
  min-width: 48px;
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 8px 6px;
}
.dash-session-day { font-family: var(--font-display); font-size: 18px; font-weight: 700; line-height: 1; color: var(--accent-orange); }
.dash-session-month { font-size: 10px; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.04em; }
.dash-session-title { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
.dash-session-time { font-size: 12.5px; color: var(--text-2); }

.dash-activity-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--card-border);
  font-size: 13.5px;
}
.dash-activity-item:last-child { border-bottom: none; }
.dash-activity-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent-teal);
  margin-top: 6px; flex-shrink: 0;
}
.dash-activity-text { color: var(--text-1); }
.dash-activity-text strong { color: var(--text-0); font-weight: 600; }
.dash-activity-time { font-size: 12px; color: var(--text-2); margin-top: 2px; }

.dash-table-wrap { overflow-x: auto; }
.dash-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
.dash-table th {
  text-align: left;
  font-size: 11.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-2);
  padding: 10px 14px;
  border-bottom: 1px solid var(--card-border);
}
.dash-table td {
  padding: 14px;
  border-bottom: 1px solid var(--card-border);
  color: var(--text-1);
}
.dash-table tr:last-child td { border-bottom: none; }
.dash-table tr:hover td { background: var(--bg-1); }
.dash-table-name { font-weight: 600; color: var(--text-0); }

.dash-status {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
}
.dash-status--active { color: var(--accent-green); background: rgba(22,163,74,0.1); }
.dash-status--pending { color: var(--accent-teal); background: rgba(193,146,47,0.12); }
.dash-status--completed { color: var(--text-2); background: var(--bg-1); }

.dash-chart {
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-top: 4px;
}
.dash-chart-svg { width: 100%; height: 140px; display: block; }

.dash-quick-actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.dash-action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: var(--bg-1);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-0);
  font-size: 13.5px;
  font-weight: 500;
  transition: border-color .2s ease, transform .2s ease;
}
.dash-action-btn:hover { border-color: rgba(122,23,53,0.28); transform: translateY(-2px); }
.dash-action-icon { font-size: 18px; }

@media (max-width: 1100px) {
  .dash-stats { grid-template-columns: repeat(2, 1fr); }
  .dash-grid, .dash-grid--equal { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .dash-root { flex-direction: column; }
  .dash-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    padding: 16px;
  }
  .dash-nav { flex-direction: row; flex-wrap: wrap; }
  .dash-nav-item { flex: 1; min-width: 120px; justify-content: center; }
  .dash-sidebar-footer { display: none; }
  .dash-content { padding: 20px 16px 40px; }
  .dash-topbar { padding: 20px 16px 16px; }
  .dash-stats { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 480px) {
  .dash-stats { grid-template-columns: 1fr; }
  .dash-quick-actions { grid-template-columns: 1fr; }
}
`;
