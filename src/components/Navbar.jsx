import React from "react";
import { Link } from "react-router-dom";

/**
 * Navbar — self-contained shared navigation component across all pages.
 */

const NAV_LINKS = ["Courses", "Lessons", "Features", "Alternatives", "Pricing", "Payment"];

function navHref(l) {
  switch (l) {
    case "Courses":
      return "/courses";
    case "Lessons":
      return "/lessons";
    case "Features":
      return "/features";
    case "Alternatives":
      return "/alternatives";
    case "Pricing":
      return "/pricing";
    case "Payment":
      return "/payment";
    default:
      return `/#${l.toLowerCase()}`;
  }
}

const NAV_CSS = `
.ld-nav {
  position: sticky;
  top: 0;
  z-index: 999;
  padding: 16px 24px;
  transition: background 0.3s ease, padding 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.ld-nav--scrolled {
  padding: 10px 24px;
  background: rgba(253, 246, 238, 0.88);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(122, 31, 43, 0.12);
}

.ld-nav-inner {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid rgba(122, 31, 43, 0.15);
  box-shadow: 0 4px 20px rgba(122, 31, 43, 0.08);
  border-radius: 999px;
  padding: 8px 20px;
  box-sizing: border-box;
}

.ld-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.ld-logo-img {
  height: 44px;
  width: auto;
  object-fit: contain;
}

.ld-nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
}

.ld-nav-links a {
  color: #6b5a56;
  text-decoration: none;
  font-size: 14.5px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 999px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.ld-nav-links a:hover {
  color: #7A1F2B;
  background: rgba(122, 31, 43, 0.06);
}

.ld-nav-link--active {
  color: #7A1F2B !important;
  background: rgba(122, 31, 43, 0.08);
  border-color: rgba(122, 31, 43, 0.2) !important;
}

.ld-nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ld-nav-auth-link {
  color: #6b5a56;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: color 0.2s ease;
}

.ld-nav-auth-link:hover {
  color: #7A1F2B;
}

.ld-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 999px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.ld-btn--primary {
  background: #7A1F2B;
  color: #ffffff !important;
  box-shadow: 0 4px 14px rgba(122, 31, 43, 0.25);
}

.ld-btn--primary:hover {
  background: #5B1720;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(122, 31, 43, 0.35);
}

.ld-btn--sm {
  padding: 8px 18px;
  font-size: 13px;
}

@media (max-width: 768px) {
  .ld-nav-links {
    display: none;
  }
}
`;

export default function Navbar({
  brandName = "Coursera Education",
  active,
  scrolled = false,
  ctaHref = "#contact",
  ctaLabel = "Get in Touch",
  onCtaClick,
}) {
  return (
    <header className={`ld-nav ${scrolled ? "ld-nav--scrolled" : ""}`}>
      <style>{NAV_CSS}</style>
      <div className="ld-nav-inner">
        <Link className="ld-logo" to="/">
          <img
            src="/logoCoursera.png"
            alt={brandName}
            className="ld-logo-img"
          />
        </Link>
        <nav className="ld-nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l} to={navHref(l)} className={l === active ? "ld-nav-link--active" : ""}>
              {l}
            </Link>
          ))}
        </nav>

        <div className="ld-nav-actions">
          <Link to="/login" className="ld-nav-auth-link">Log in</Link>
          {onCtaClick ? (
            <button
              type="button"
              className="ld-btn ld-btn--primary ld-btn--sm"
              onClick={onCtaClick}
            >
              {ctaLabel} <span aria-hidden>→</span>
            </button>
          ) : (
            <a className="ld-btn ld-btn--primary ld-btn--sm" href={ctaHref}>
              {ctaLabel} <span aria-hidden>→</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}