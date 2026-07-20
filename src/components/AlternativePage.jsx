import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import ContactModal from "./ContactModel";

/**
 * Alternatives Page — /alternatives
 * Single-file React component, plain CSS (no Tailwind, no CSS modules).
 * Shares the same visual language (colors, nav, footer, buttons) as
 * LandingPage.jsx and LessonsPage.jsx.
 */

const DIFFERENCE_CARDS = [
  {
    icon: "✨",
    title: "Private, Outcome-Driven Training",
    desc: "Designed to produce measurable skills — not just completed videos.",
  },
  {
    icon: "👥",
    title: "Cohorts & Instructor Feedback",
    desc: "Hands-on practice with reviews, rubrics, and iteration.",
  },
  {
    icon: "📊",
    title: "Learning Analytics for Teams",
    desc: "Progress, completion, engagement, and capability gaps — visible to admins.",
  },
  {
    icon: "🛡️",
    title: "Enterprise-Ready Delivery",
    desc: "Role controls, predictable program governance, and repeatable training runs.",
  },
];

const COLUMNS = ["Coursera Education", "Course Marketplaces (e.g., Coursera)", "Generic LMS", "Bootcamps"];
const COLUMN_ICONS = ["🎓", "📹", "🗂️", "👥"];
const COLUMN_ACCENTS = ["lead", "blue", "purple", "orange"];

const COMPARISON_SECTIONS = [
  {
    icon: "🛡️",
    title: "Learning Outcomes",
    rows: [
      {
        label: "Skill validation (rubrics + real tasks)",
        values: [
          { text: "Built-in", tone: "yes" },
          { text: "Limited / varies by course", tone: "neutral" },
          { text: "Depends on your setup", tone: "neutral" },
          { text: "(often), but not standardized", tone: "yes" },
        ],
      },
      {
        label: "Hands-on assignments & iteration",
        values: [
          { text: "Structured labs + feedback loops", tone: "yes" },
          { text: "Sometimes (often light)", tone: "neutral" },
          { text: "Depends on content authoring", tone: "neutral" },
          { text: "Strong, but time-heavy", tone: "yes" },
        ],
      },
      {
        label: "Team-level capability tracking",
        values: [
          { text: "Admin analytics by cohort & topic", tone: "yes" },
          { text: "Limited for teams", tone: "neutral" },
          { text: "Basic completion reports", tone: "neutral" },
          { text: "Limited visibility", tone: "neutral" },
        ],
      },
    ],
  },
  {
    icon: "👥",
    title: "Instruction & Support",
    rows: [
      {
        label: "Cohort schedules & milestones",
        values: [
          { text: "✓", tone: "yes" },
          { text: "Mostly self-paced", tone: "neutral" },
          { text: "Optional / manual", tone: "neutral" },
          { text: "✓ (fixed schedule)", tone: "yes" },
        ],
      },
      {
        label: "Instructor feedback & grading workflow",
        values: [
          { text: "Built-in submissions + rubrics", tone: "yes" },
          { text: "Varies by course", tone: "neutral" },
          { text: "Often limited", tone: "neutral" },
          { text: "✓", tone: "yes" },
        ],
      },
      {
        label: "Consistent training delivery every run",
        values: [
          { text: "Repeatable program templates", tone: "yes" },
          { text: "Course-specific", tone: "neutral" },
          { text: "Depends on your process", tone: "neutral" },
          { text: "Varies by cohort/instructor", tone: "neutral" },
        ],
      },
    ],
  },
  {
    icon: "📖",
    title: "Content & Curriculum",
    rows: [
      {
        label: "Structured tracks (modules → lessons → checkpoints)",
        values: [
          { text: "✓", tone: "yes" },
          { text: "✓ (course structure)", tone: "yes" },
          { text: "✓", tone: "yes" },
          { text: "✓", tone: "yes" },
        ],
      },
      {
        label: "Private curriculum aligned to your team",
        values: [
          { text: "Private program design", tone: "yes" },
          { text: "Public/general", tone: "no" },
          { text: "Depends (you build)", tone: "neutral" },
          { text: "Sometimes (limited customization)", tone: "neutral" },
        ],
      },
      {
        label: "Versioning for training updates",
        values: [
          { text: "Program versioning approach", tone: "yes" },
          { text: "Course updates vary", tone: "neutral" },
          { text: "Manual", tone: "neutral" },
          { text: "Manual", tone: "neutral" },
        ],
      },
    ],
  },
  {
    icon: "📊",
    title: "Measurement & Analytics",
    rows: [
      {
        label: "Progress, completion, engagement analytics",
        values: [
          { text: "✓", tone: "yes" },
          { text: "Basic / limited for teams", tone: "neutral" },
          { text: "Basic completion", tone: "neutral" },
          { text: "Limited", tone: "neutral" },
        ],
      },
      {
        label: "Assessments + pass thresholds",
        values: [
          { text: "✓", tone: "yes" },
          { text: "Sometimes", tone: "neutral" },
          { text: "Depends", tone: "neutral" },
          { text: "✓ (varies)", tone: "yes" },
        ],
      },
      {
        label: "Exportable reporting",
        values: [
          { text: "✓", tone: "yes" },
          { text: "Limited", tone: "neutral" },
          { text: "Sometimes", tone: "neutral" },
          { text: "Limited", tone: "neutral" },
        ],
      },
    ],
  },
  {
    icon: "🔗",
    title: "Operations & Integrations",
    rows: [
      {
        label: "Cohort enrollment & seat management",
        values: [
          { text: "✓", tone: "yes" },
          { text: "Limited for organizations", tone: "neutral" },
          { text: "✓", tone: "yes" },
          { text: "✓ (manual/ops-heavy)", tone: "yes" },
        ],
      },
      {
        label: "Integrations (SSO / HR / data)",
        values: [
          { text: "Integration-ready patterns", tone: "neutral" },
          { text: "Enterprise tiers only", tone: "neutral" },
          { text: "Varies", tone: "neutral" },
          { text: "Rare", tone: "neutral" },
        ],
      },
      {
        label: "Privacy-friendly for internal training",
        values: [
          { text: "Private by design", tone: "yes" },
          { text: "Public ecosystem", tone: "neutral" },
          { text: "Depends", tone: "neutral" },
          { text: "Depends", tone: "neutral" },
        ],
      },
    ],
  },
  {
    icon: "⏱️",
    title: "Time & Cost Model",
    rows: [
      {
        label: "Fast to deploy for teams",
        values: [
          { text: "✓", tone: "yes" },
          { text: "✓ (but generic outcomes)", tone: "yes" },
          { text: "Setup time required", tone: "neutral" },
          { text: "Slow (time-intensive)", tone: "neutral" },
        ],
      },
      {
        label: "Best for",
        values: [
          { text: "Teams needing measurable outcomes", tone: "neutral" },
          { text: "Individuals learning broadly", tone: "neutral" },
          { text: "Internal content hosting", tone: "neutral" },
          { text: "Career-change immersion", tone: "neutral" },
        ],
      },
    ],
  },
];

const CLOSING_CARDS = [
  {
    icon: "📄",
    title: "Designed for practice",
    desc: "Public platforms optimize for breadth and accessibility. Coursera Education optimizes for repetition, feedback, and proof of competency.",
  },
  {
    icon: "👥",
    title: "Built for teams",
    desc: "Cohorts, roles, admin oversight, and analytics turn training into an operational system — not a collection of videos.",
  },
  {
    icon: "📈",
    title: "Measurable outcomes",
    desc: "Track progress by cohort and topic, identify gaps, and prove improvement — useful for leadership, compliance, and performance.",
  },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function AlternativesPage() {
  const [scrolled, setScrolled] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="ld-root">
      <style>{CSS}</style>

      <Navbar
        brandName="Coursera Education"
        active="Alternatives"
        scrolled={scrolled}
        onCtaClick={() => setContactOpen(true)}
      />

      {/* HERO */}
      <section className="ld-hero ld-hero--alt">
        <div className="ld-hero-bg" aria-hidden="true" />
        <Reveal className="ld-hero-content">
          <div className="ld-pill">
            <span className="ld-dot" /> Alternatives
          </div>
          <h1 className="ld-hero-title ld-hero-title--split">
            Private AI training vs
            <br />
            <span className="ld-hero-title-accent">public course platforms</span>
          </h1>
          <p className="ld-hero-sub">
            Coursera and similar marketplaces are great for broad access. Coursera Education is built for teams who need
            measurable outcomes, hands-on practice, and repeatable training runs.
          </p>

          <div className="ld-hero-cta">
            <a href="#contact" className="ld-btn ld-btn--gradient">
              Get Started For Free <span aria-hidden>→</span>
            </a>
            <button className="ld-btn ld-btn--outline" onClick={() => setContactOpen(true)}>
              Get in Touch
            </button>
          </div>
        </Reveal>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="ld-section" id="difference">
        <Reveal className="ld-section-head">
          <h2 className="ld-plain-heading">What makes Coursera Education different</h2>
          <p>Built for private programs where teams learn by doing — and admins can prove progress.</p>
        </Reveal>

        <div className="ld-grid ld-grid--4">
          {DIFFERENCE_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 80} className="ld-diff-card">
              <div className="ld-diff-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p className="ld-card-desc">{c.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DETAILED COMPARISON */}
      <section className="ld-section ld-section--dark" id="comparison">
        <Reveal className="ld-section-head">
          <h2 className="ld-plain-heading">Detailed comparison</h2>
          <p>A practical breakdown of why private, cohort-based training can outperform public marketplaces for teams.</p>
        </Reveal>

        <Reveal className="ld-compare-wrap">
          <div className="ld-compare-head">
            <div className="ld-compare-head-cell ld-compare-head-cell--label">Capability / Platform</div>
            {COLUMNS.map((c, i) => (
              <div key={c} className={`ld-compare-head-cell accent-col-${COLUMN_ACCENTS[i]}`}>
                <span className="ld-compare-head-icon">{COLUMN_ICONS[i]}</span>
                {c}
              </div>
            ))}
          </div>

          {COMPARISON_SECTIONS.map((section, sIdx) => (
            <Reveal key={section.title} delay={Math.min(sIdx, 4) * 60} className="ld-compare-section">
              <div className="ld-compare-section-title">
                <span className="ld-compare-section-icon">{section.icon}</span>
                {section.title}
              </div>
              <div className="ld-compare-rows">
                {section.rows.map((row) => (
                  <div key={row.label} className="ld-compare-row">
                    <div className="ld-compare-cell ld-compare-cell--label">{row.label}</div>
                    {row.values.map((v, i) => (
                      <div key={i} className={`ld-compare-cell ld-compare-value ld-compare-value--${v.tone} accent-col-${COLUMN_ACCENTS[i]}`}>
                        {v.tone === "yes" && <span className="ld-compare-check">✔</span>}
                        {v.tone === "no" && <span className="ld-compare-cross">✘</span>}
                        {v.text}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </Reveal>

        <div className="ld-grid ld-grid--3 ld-closing-grid">
          {CLOSING_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 90} className="ld-closing-card">
              <div className="ld-closing-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p className="ld-card-desc">{c.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ld-cta" id="contact">
        <Reveal className="ld-cta-inner">
          <h2>Talk to us about a private AI training program</h2>
          <p>Share your team size and target skills. We&rsquo;ll recommend a curriculum structure and rollout plan.</p>
          <div className="ld-hero-cta ld-cta-buttons">
            <a href="#contact" className="ld-btn ld-btn--gradient">
              Get Started For Free <span aria-hidden>→</span>
            </a>
            <button className="ld-btn ld-btn--outline" onClick={() => setContactOpen(true)}>
              Get in Touch
            </button>
          </div>
          <div className="ld-cta-note">
            <span className="ld-check">✓</span> Email us at hello@courseraeducation.study
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="ld-footer">
        <div className="ld-footer-grid">
          <div>
            <a className="ld-logo" href="/">
              <span className="ld-logo-mark">◤</span> Coursera Education
            </a>
            <p className="ld-footer-desc">
              Private, instructor-led AI training with a modern LMS. Learn fast with hands-on lessons, projects, and
              real feedback.
            </p>
          </div>
          <div>
            <h4>Policies</h4>
            <p className="ld-footer-desc">
              Review our legal and privacy documents. You can also manage your cookie preferences anytime.
            </p>
            <ul className="ld-footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms and Conditions</a></li>
              <li><a href="#">Cancellation Policy</a></li>
            </ul>
          </div>
          <div>
            <h4>Need help?</h4>
            <p className="ld-footer-desc">Email us for training guidance, scheduling, or any account questions.</p>
            <a href="mailto:hello@courseraeducation.study" className="ld-btn ld-btn--primary ld-btn--sm">Email Support</a>
            <p className="ld-footer-note">Typical response time: 1–2 business days.</p>
          </div>
        </div>
        <div className="ld-footer-bottom">© {new Date().getFullYear()} Coursera Education. All rights reserved.</div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

const CSS = `
:root {
  --bg-0: #ffffff;
  --bg-1: #fbf1ec;
  --bg-2: #f3e4dc;
  --card: #f7eae3;
  --card-border: rgba(159,29,70,0.10);
  --card-shadow: 0 1px 2px rgba(42,14,22,0.04);
  --card-shadow-hover: 0 14px 34px -18px rgba(42,14,22,0.16);
  --text-0: #2a0e16;
  --text-1: #6b7280;
  --text-2: #9ca3af;
  --accent-orange: #c9932a;
  --accent-teal: #9f1d46;
  --accent-green: #6b7f3f;
  --accent-blue: #7c4b2a;
  --accent-purple: #7a2942;
  --accent-red: #8e1a3d;
  --gradient: linear-gradient(90deg, var(--accent-teal), var(--accent-orange));
  --radius-lg: 22px;
  --radius-md: 16px;
  --font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
}

.ld-root { background: var(--bg-0); color: var(--text-0); font-family: var(--font-body); overflow-x: hidden; line-height: 1.5; }
.ld-root * { box-sizing: border-box; }

.reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
.reveal-visible { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }

/* NAV */
.ld-nav { position: sticky; top: 0; z-index: 50; padding: 18px 24px; transition: background .3s ease, padding .3s ease; }
.ld-nav--scrolled { padding: 10px 24px; background: rgba(255,255,255,0.85); backdrop-filter: blur(14px); border-bottom: 1px solid var(--card-border); }
.ld-nav-inner { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 1px solid var(--card-border); box-shadow: var(--card-shadow); border-radius: 999px; padding: 10px 14px 10px 20px; }
.ld-logo { font-family: var(--font-display); font-weight: 700; letter-spacing: 0.02em; color: var(--text-0); text-decoration: none; display: flex; align-items: center; gap: 8px; font-size: 15px; }
.ld-logo-mark { color: var(--accent-teal); font-size: 18px; }
.ld-nav-links { display: flex; gap: 8px; }
.ld-nav-links a { color: var(--text-1); text-decoration: none; font-size: 14.5px; font-weight: 500; padding: 8px 16px; border-radius: 999px; transition: color .2s ease, background .2s ease, border-color .2s ease; border: 1px solid transparent; }
.ld-nav-links a:hover { color: var(--text-0); }
.ld-nav-link--active { color: var(--accent-teal) !important; background: rgba(159,29,70,0.08); border-color: rgba(159,29,70,0.3) !important; }

.ld-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 999px; font-weight: 600; font-size: 14.5px; text-decoration: none; border: 1px solid transparent; cursor: pointer; transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease; font-family: var(--font-body); }
.ld-btn:hover { transform: translateY(-1px); }
.ld-btn:focus-visible { outline: 2px solid var(--accent-teal); outline-offset: 3px; }
.ld-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
.ld-btn--sm { padding: 9px 16px; font-size: 13.5px; }
.ld-btn--primary { background: var(--accent-teal); color: #ffffff; box-shadow: 0 6px 20px -6px rgba(159,29,70,0.5); }
.ld-btn--gradient { background: linear-gradient(90deg, var(--accent-teal), var(--accent-orange)); color: #ffffff; box-shadow: 0 6px 20px -6px rgba(159,29,70,0.35); }
.ld-btn--outline { background: transparent; color: var(--text-0); border-color: var(--card-border); }
.ld-btn--outline:hover { background: rgba(42,14,22,0.04); }
.ld-btn--dark { background: rgba(42,14,22,0.05); color: var(--text-0); border-color: var(--card-border); }
.ld-btn--dark:hover { background: rgba(42,14,22,0.09); }

/* HERO */
.ld-hero { position: relative; padding: 90px 24px 60px; max-width: 1180px; margin: 0 auto; text-align: center; }
.ld-hero--alt { padding-bottom: 20px; }
.ld-hero-bg { position: absolute; inset: -10% -20% auto -20%; height: 520px; background: radial-gradient(60% 60% at 30% 20%, rgba(159,29,70,0.14), transparent 70%), radial-gradient(50% 50% at 75% 10%, rgba(201,147,42,0.16), transparent 70%); filter: blur(10px); pointer-events: none; z-index: 0; }
.ld-hero-content { position: relative; z-index: 1; }
.ld-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--accent-teal); border: 1px solid rgba(159,29,70,0.3); background: rgba(159,29,70,0.08); padding: 8px 18px; border-radius: 999px; margin-bottom: 26px; }
.ld-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-teal); display: inline-block; }

.ld-hero-title { font-family: var(--font-display); font-size: clamp(2.4rem, 5.4vw, 4.4rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.08; margin: 0 0 22px; color: var(--accent-teal); }
.ld-hero-title-accent { color: var(--accent-orange); }
.ld-hero-sub { font-size: clamp(1rem, 1.6vw, 1.2rem); color: var(--text-1); max-width: 700px; margin: 0 auto 36px; }
.ld-hero-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

/* SECTIONS */
.ld-section { max-width: 1180px; margin: 0 auto; padding: 88px 24px; }
.ld-section--dark { max-width: 100%; background: var(--bg-1); border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border); }
.ld-section--dark > * { max-width: 1180px; margin-left: auto; margin-right: auto; }
.ld-section-head { text-align: center; max-width: 680px; margin: 0 auto 56px; }
.ld-plain-heading { font-family: var(--font-display); font-size: clamp(1.9rem, 3.6vw, 2.8rem); font-weight: 700; margin: 0 0 16px; letter-spacing: -0.01em; color: var(--text-0); }
.ld-section-head p { color: var(--text-1); font-size: 16.5px; }

.ld-grid { display: grid; gap: 22px; }
.ld-grid--4 { grid-template-columns: repeat(4, 1fr); }
.ld-grid--3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 980px) { .ld-grid--4, .ld-grid--3 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px) { .ld-grid--4, .ld-grid--3 { grid-template-columns: 1fr; } .ld-nav-links { display: none; } }

/* Difference cards */
.ld-diff-card { background: var(--card); border: 1px solid var(--card-border); box-shadow: var(--card-shadow); border-radius: var(--radius-lg); padding: 30px 24px; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
.ld-diff-card:hover { transform: translateY(-3px); border-color: rgba(42,14,22,0.16); box-shadow: var(--card-shadow-hover); }
.ld-diff-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 18px; background: rgba(42,14,22,0.05); }
.ld-diff-card h3 { font-family: var(--font-display); font-size: 18px; margin: 0 0 8px; }
.ld-card-desc { color: var(--text-1); font-size: 14px; margin: 0; }

/* COMPARISON TABLE */
.ld-compare-wrap { margin-bottom: 60px; }
.ld-compare-head { display: grid; grid-template-columns: 1.4fr repeat(4, 1fr); gap: 14px; margin-bottom: 20px; position: sticky; top: 78px; z-index: 5; }
.ld-compare-head-cell { border-radius: var(--radius-md); padding: 16px 18px; font-weight: 700; font-size: 14.5px; display: flex; align-items: center; gap: 8px; border: 1px solid var(--card-border); background: var(--bg-2); box-shadow: var(--card-shadow); }
.ld-compare-head-cell--label { background: transparent; border: 1px solid transparent; box-shadow: none; color: var(--text-2); font-weight: 600; }
.ld-compare-head-icon { font-size: 15px; }
.accent-col-lead { background: linear-gradient(90deg, rgba(159,29,70,0.9), rgba(201,147,42,0.9)); color: #ffffff; border-color: transparent; }
.accent-col-blue { background: rgba(124,75,42,0.1); color: #5c2c14; border-color: rgba(124,75,42,0.25); }
.accent-col-purple { background: rgba(122,41,66,0.1); color: #5c2033; border-color: rgba(122,41,66,0.25); }
.accent-col-orange { background: rgba(201,147,42,0.14); color: #8a6116; border-color: rgba(201,147,42,0.3); }

.ld-compare-section { margin-bottom: 34px; }
.ld-compare-section-title { display: flex; align-items: center; gap: 10px; font-family: var(--font-display); font-size: 19px; font-weight: 700; margin-bottom: 16px; color: var(--text-0); }
.ld-compare-section-icon { font-size: 17px; }
.ld-compare-rows { border: 1px solid var(--card-border); border-radius: var(--radius-lg); overflow: hidden; background: var(--card); box-shadow: var(--card-shadow); }
.ld-compare-row { display: grid; grid-template-columns: 1.4fr repeat(4, 1fr); gap: 14px; padding: 18px; border-bottom: 1px solid var(--card-border); align-items: center; }
.ld-compare-row:last-child { border-bottom: none; }
.ld-compare-cell--label { color: var(--text-1); font-size: 14.5px; }
.ld-compare-value { border-radius: 12px; padding: 12px 14px; font-size: 13.5px; text-align: center; border-left: 3px solid var(--card-border); background: rgba(42,14,22,0.02); color: var(--text-1); display: flex; align-items: center; justify-content: center; gap: 6px; }
.ld-compare-value--yes { border-left-color: var(--accent-green); color: #445429; background: rgba(107,127,63,0.12); }
.ld-compare-value--no { border-left-color: var(--accent-red); color: #7a1633; background: rgba(142,26,61,0.08); }
.ld-compare-check { color: var(--accent-green); font-size: 12px; }
.ld-compare-cross { color: var(--accent-red); font-size: 12px; }

@media (max-width: 900px) {
  .ld-compare-head { display: none; }
  .ld-compare-row { grid-template-columns: 1fr; gap: 8px; }
  .ld-compare-cell--label { font-weight: 600; color: var(--text-0); }
}

/* Closing cards */
.ld-closing-grid { margin-top: 10px; }
.ld-closing-card { background: var(--card); border: 1px solid var(--card-border); box-shadow: var(--card-shadow); border-radius: var(--radius-lg); padding: 28px 24px; }
.ld-closing-icon { font-size: 20px; margin-bottom: 14px; }
.ld-closing-card h3 { font-family: var(--font-display); font-size: 17px; margin: 0 0 10px; }

/* CTA */
.ld-cta { padding: 100px 24px; text-align: center; background: var(--bg-1); border-top: 1px solid var(--card-border); }
.ld-cta-inner { max-width: 620px; margin: 0 auto; }
.ld-cta h2 { font-family: var(--font-display); font-size: clamp(1.9rem, 3.4vw, 2.6rem); margin: 0 0 14px; }
.ld-cta p { color: var(--text-1); font-size: 16.5px; margin-bottom: 34px; }
.ld-cta-buttons { margin-bottom: 20px; }
.ld-cta-note { font-size: 13px; color: var(--text-2); display: flex; align-items: center; justify-content: center; gap: 6px; }
.ld-check { color: var(--accent-teal); font-weight: 700; font-size: 12px; }

/* FOOTER */
.ld-footer { padding: 70px 24px 30px; background: var(--bg-1); border-top: 1px solid var(--card-border); }
.ld-footer-grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 50px; }
.ld-footer h4 { font-size: 14px; margin: 0 0 12px; }
.ld-footer-desc { color: var(--text-2); font-size: 13.5px; line-height: 1.6; margin: 12px 0; }
.ld-footer-links { list-style: none; padding: 0; margin: 10px 0 0; display: flex; flex-direction: column; gap: 8px; }
.ld-footer-links a { color: var(--text-1); text-decoration: none; font-size: 13.5px; }
.ld-footer-links a:hover { color: var(--text-0); }
.ld-footer-note { font-size: 12px; color: var(--text-2); margin-top: 10px; }
.ld-footer-bottom { max-width: 1180px; margin: 50px auto 0; padding-top: 24px; border-top: 1px solid var(--card-border); font-size: 12.5px; color: var(--text-2); text-align: center; }
@media (max-width: 800px) { .ld-footer-grid { grid-template-columns: 1fr; gap: 34px; } }

/* CONTACT MODAL */
.ld-modal-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(42,14,22,0.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
  animation: ld-fade-in .2s ease;
}
.ld-modal {
  background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--card-border);
  box-shadow: var(--card-shadow-hover); max-width: 460px; width: 100%;
  padding: 36px 32px 32px; position: relative;
  animation: ld-modal-in .3s ease;
}
.ld-modal-close {
  position: absolute; top: 16px; right: 16px; width: 34px; height: 34px; border-radius: 50%;
  border: 1px solid var(--card-border); background: var(--bg-1);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  color: var(--text-1); font-size: 14px; transition: background .2s ease, transform .2s ease;
}
.ld-modal-close:hover { background: var(--bg-2); transform: rotate(90deg); }
.ld-modal-eyebrow {
  display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--text-1);
  border: 1px solid var(--card-border); background: var(--bg-1);
  padding: 6px 14px; border-radius: 999px; margin-bottom: 18px;
}
.ld-modal h3 { font-family: var(--font-display); font-size: 24px; margin: 0 0 8px; letter-spacing: -0.01em; color: var(--text-0); }
.ld-modal-sub { color: var(--text-1); font-size: 14px; margin: 0 0 26px; line-height: 1.6; }
.ld-field { margin-bottom: 18px; text-align: left; }
.ld-field label { display: block; font-size: 12.5px; font-weight: 600; color: var(--text-0); margin-bottom: 7px; }
.ld-field input, .ld-field textarea {
  width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--card-border);
  background: var(--bg-1); font-family: var(--font-body); font-size: 14px; color: var(--text-0);
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease; resize: vertical;
}
.ld-field input::placeholder, .ld-field textarea::placeholder { color: var(--text-2); }
.ld-field input:focus, .ld-field textarea:focus {
  outline: none; border-color: var(--accent-teal); box-shadow: 0 0 0 3px rgba(159,29,70,0.14); background: #ffffff;
}
.ld-field textarea { min-height: 100px; }
.ld-modal-submit { width: 100%; justify-content: center; margin-top: 6px; }
.ld-modal-success { text-align: center; padding: 10px 0 4px; }
.ld-modal-success-icon {
  width: 56px; height: 56px; border-radius: 50%; background: var(--gradient); color: #ffffff; font-size: 22px;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;
}
@keyframes ld-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes ld-modal-in { from { opacity: 0; transform: translateY(14px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
`;