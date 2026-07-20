import React from "react";

/**
 * Navbar — shared across LandingPage, LessonsPage, FeaturesPage,
 * AlternativesPage, PricingPage and PaymentPage.
 *
 * All pages already load nav-related CSS (.ld-nav, .ld-nav-inner,
 * .ld-logo, .ld-nav-links, .ld-btn, .ld-nav-link--active, ...) via
 * their own <style>{CSS}</style> block, so this component only needs
 * to render the markup — no styles are duplicated here.
 *
 * Props:
 * - brandName: used as the logo image's alt text (defaults match the
 *   original per-page BRAND_NAME constants).
 * - active: which nav link should get the "ld-nav-link--active" class
 *   ("Lessons" | "Features" | "Alternatives" | "Pricing" | "Payment" | undefined).
 * - scrolled: toggles the "ld-nav--scrolled" state.
 * - ctaHref / ctaLabel: the right-hand CTA button.
 */

const NAV_LINKS = ["Lessons", "Features", "Alternatives", "Pricing", "Payment"];

function navHref(l) {
  switch (l) {
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

export default function Navbar({
  brandName = "Coursera Education",
  active,
  scrolled = false,
  ctaHref = "#contact",
  ctaLabel = "Get in Touch",
}) {
  return (
    <header className={`ld-nav ${scrolled ? "ld-nav--scrolled" : ""}`}>
      <div className="ld-nav-inner">
        <a className="ld-logo" href="/">
          <img
            src="/logoCoursera.png"
            alt={brandName}
            className="ld-logo-img"
            style={{ height: "56px", width: "auto" }}
          />
        </a>
        <nav className="ld-nav-links">
          {NAV_LINKS.map((l) => (
            <a key={l} href={navHref(l)} className={l === active ? "ld-nav-link--active" : ""}>
              {l}
            </a>
          ))}
        </nav>
        <a className="ld-btn ld-btn--primary ld-btn--sm" href={ctaHref}>
          {ctaLabel} <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}