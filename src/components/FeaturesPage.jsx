import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";

/**
 * Features Page — /features
 * Single-file React component, plain CSS (no Tailwind, no CSS modules).
 * Shares the same visual language (colors, nav, footer, buttons) as LandingPage.jsx / LessonsPage.jsx.
 */

const QUICK_STATS = [
  { title: "Cohorts", tag: "Live groups & schedules", desc: "Run cohorts, timelines and milestones" },
  { title: "Assignments", tag: "Hands-on labs", desc: "Rubrics, submissions and feedback" },
  { title: "Quizzes", tag: "Knowledge checks", desc: "MCQ, short answers, pass thresholds" },
  { title: "Analytics", tag: "Performance insights", desc: "Progress, completion and engagement" },
];

const FEATURE_CARDS = [
  {
    icon: "📚",
    tag: "Tracks, modules, and lessons",
    color: "orange",
    title: "Structured Curriculum",
    desc: "Organize training into tracks with clear progression — designed for teams that need repeatable learning outcomes.",
    points: ["Tracks → modules → lessons", "Prerequisites & sequencing", "Versioned content updates", "Reusable templates"],
  },
  {
    icon: "📖",
    tag: "Readable, searchable, consistent",
    color: "teal",
    title: "Lesson Experience",
    desc: "A clean lesson layout optimized for learning: summaries, objectives, checkpoints and downloadable resources.",
    points: ["Objectives & outcomes", "Inline resources & files", "Search across lessons", "Notes & bookmarks"],
  },
  {
    icon: "🎥",
    tag: "Media-first training",
    color: "blue",
    title: "Video & Materials",
    desc: "Support video lessons, PDFs, links and embedded content — with a consistent learning flow.",
    points: ["Video lessons & chapters", "PDFs, slides, links", "Downloadable resources", "Embed external tools"],
  },
  {
    icon: "📝",
    tag: "Practice-driven learning",
    color: "green",
    title: "Assignments & Labs",
    desc: "Collect submissions, evaluate with rubrics, and deliver structured feedback for real progress.",
    points: ["Submissions & attachments", "Rubrics & scoring", "Instructor feedback", "Resubmissions & deadlines"],
  },
  {
    icon: "✅",
    tag: "Measure comprehension",
    color: "lime",
    title: "Quizzes & Checks",
    desc: "Short, frequent checks that help teams retain knowledge and keep quality high.",
    points: ["MCQ & short answers", "Pass thresholds", "Attempts & timing", "Auto grading options"],
  },
  {
    icon: "👥",
    tag: "Teams, instructors, admins",
    color: "pink",
    title: "Cohorts & Roles",
    desc: "Run training for groups with role-based access and clear ownership across programs.",
    points: ["Cohorts & enrollments", "Instructor / admin roles", "Seat management", "Announcements & updates"],
  },
  {
    icon: "🎓",
    tag: "Completion & achievement",
    color: "pink",
    title: "Certificates",
    desc: "Issue certificates based on completion rules and assessment results.",
    points: ["Completion requirements", "Certificate templates", "Score-based eligibility", "Shareable proof"],
  },
  {
    icon: "📊",
    tag: "Progress, engagement, outcomes",
    color: "blue",
    title: "Learning Analytics",
    desc: "Understand what's working: completion, time spent, drop-off points and cohort performance.",
    points: ["Completion & progress tracking", "Engagement insights", "Cohort comparisons", "Exportable reporting"],
  },
  {
    icon: "▦",
    tag: "Manage everything centrally",
    color: "purple",
    title: "Admin Dashboard",
    desc: "Operate programs, content and users in one place with a clear overview.",
    points: ["Program overview", "Content management", "User & cohort controls", "Audit-friendly logs"],
  },
  {
    icon: "⏱️",
    tag: "Self-paced + scheduled",
    color: "blue",
    title: "Always On",
    desc: "Support both self-paced learning and cohort schedules, with reminders and deadlines.",
    points: ["Self-paced lessons", "Schedules & milestones", "Deadlines & reminders", "Timezone-friendly"],
  },
  {
    icon: "📅",
    tag: "Workshops, sessions, calendar",
    color: "orange",
    title: "Training Scheduling",
    desc: "Run workshops alongside the LMS with session scheduling and clear timelines.",
    points: ["Session planning", "Cohort timelines", "Event reminders", "Optional instructor-led formats"],
  },
  {
    icon: "🔗",
    tag: "Fit into your stack",
    color: "teal",
    title: "Integrations Ready",
    desc: "Plug the LMS into your tools and workflows (SSO, HR, reporting, analytics).",
    points: ["SSO-friendly approach", "Data export options", "Webhook-ready patterns", "Bring your own analytics"],
  },
];

const SIMPLE_CARDS = [
  { icon: "🛡️", title: "Enterprise-ready", desc: "Role-based access, program ownership and audit-friendly operations." },
  { icon: "🌐", title: "Global teams", desc: "Timezone-friendly schedules, reminders and consistent delivery." },
  { icon: "✅", title: "Proof of completion", desc: "Certificates tied to progress and assessment rules." },
];

const TRADITIONAL_POINTS = [
  "Scattered docs and videos",
  "No consistent progression",
  "Manual attendance & tracking",
  "Low retention without practice",
  "Hard to measure outcomes",
  "No repeatable curriculum versioning",
];

const DESCOMPLICA_POINTS = [
  "Structured tracks & lessons",
  "Assignments, quizzes, and feedback",
  "Cohorts, roles, and scheduling",
  "Analytics for completion & engagement",
  "Certificates for achievement",
  "Repeatable programs for teams",
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

export default function FeaturesPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="ld-root">
      <style>{CSS}</style>

      <Navbar brandName="Coursera Education" active="Features" scrolled={scrolled} />

      {/* HERO */}
      <section className="ld-hero">
        <div className="ld-hero-bg" aria-hidden="true" />
        <Reveal className="ld-hero-content">
          <div className="ld-pill">
            <span className="ld-dot ld-dot--orange" /> LMS Features
          </div>
          <h1 className="ld-hero-title ld-hero-title--split">
            A Modern Training LMS
            <br />
            <span className="ld-hero-title-accent">Built for real teams</span>
          </h1>
          <p className="ld-hero-sub">
            Deliver structured training with cohorts, assignments, quizzes, analytics and certificates — in one
            focused platform.
          </p>

          <div className="ld-hero-cta">
            <a href="#contact" className="ld-btn ld-btn--gradient">
              Get Started For Free <span aria-hidden>→</span>
            </a>
            <a href="#contact" className="ld-btn ld-btn--outline">
              Get in Touch
            </a>
          </div>
        </Reveal>

        <div className="ld-grid ld-grid--4 ld-hero-stats">
          {QUICK_STATS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80} className="ld-hero-stat-card">
              <div className="ld-hero-stat-value">{s.title}</div>
              <div className="ld-hero-stat-sub">{s.tag}</div>
              <div className="ld-hero-stat-sub2">{s.desc}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="ld-section" id="what-you-get">
        <Reveal className="ld-section-head">
          <h2>What you get</h2>
          <p>Everything needed to run a professional training program — from content to outcomes.</p>
        </Reveal>

        <div className="ld-grid ld-grid--3">
          {FEATURE_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={(i % 6) * 60} className="ld-feat-card">
              <div className="ld-feat-top">
                <div className={`ld-feat-icon accent-bg-${c.color}`}>{c.icon}</div>
                <div className="ld-feat-tag">
                  <div className="ld-feat-tag-eyebrow">Feature</div>
                  <div className={`ld-feat-tag-label tag-${c.color}`}>{c.tag}</div>
                </div>
              </div>
              <h3>{c.title}</h3>
              <p className="ld-card-desc">{c.desc}</p>
              <ul className="ld-check-list">
                {c.points.map((p) => (
                  <li key={p}>
                    <span className={`ld-check-ring tag-${c.color}`}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SIMPLE CARDS */}
      <section className="ld-section ld-section--dark" id="more">
        <div className="ld-grid ld-grid--3">
          {SIMPLE_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 90} className="ld-simple-card">
              <div className="ld-simple-icon">{c.icon}</div>
              <div>
                <h3>{c.title}</h3>
                <p className="ld-card-desc">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section className="ld-section" id="compare">
        <Reveal className="ld-section-head">
          <h2>Replace scattered training</h2>
          <p>Move from ad-hoc learning to structured, measurable programs.</p>
        </Reveal>

        <div className="ld-compare">
          <Reveal className="ld-compare-card ld-compare-card--bad">
            <div className="ld-compare-head">
              <span className="ld-compare-badge ld-compare-badge--bad">✕</span>
              <h3>Traditional Training</h3>
            </div>
            <ul className="ld-compare-list">
              {TRADITIONAL_POINTS.map((p) => (
                <li key={p}>
                  <span className="ld-compare-dot ld-compare-dot--bad" /> {p}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="ld-compare-vs" aria-hidden="true">
            VS
          </div>

          <Reveal delay={120} className="ld-compare-card ld-compare-card--good">
            <div className="ld-compare-head">
              <span className="ld-compare-badge ld-compare-badge--good">✓</span>
              <h3>With Coursera Education LMS</h3>
            </div>
            <ul className="ld-compare-list">
              {DESCOMPLICA_POINTS.map((p) => (
                <li key={p}>
                  <span className="ld-compare-dot ld-compare-dot--good" /> {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="ld-cta" id="contact">
        <Reveal className="ld-cta-inner">
          <h2>Launch your training program</h2>
          <p>Create tracks, run cohorts, assign labs, and measure outcomes — all from one LMS.</p>
          <div className="ld-hero-cta ld-cta-buttons">
            <a href="#contact" className="ld-btn ld-btn--gradient">
              Get Started For Free <span aria-hidden>→</span>
            </a>
            <a href="#contact" className="ld-btn ld-btn--outline">
              Get in Touch
            </a>
          </div>
          <div className="ld-cta-note">
            <span className="ld-check">✓</span> Structured curriculum &nbsp;•&nbsp; Hands-on labs &nbsp;•&nbsp; Analytics & certificates
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
            <a href="mailto:hello@example.com" className="ld-btn ld-btn--primary ld-btn--sm">Email Support</a>
            <p className="ld-footer-note">Typical response time: 1–2 business days.</p>
          </div>
        </div>
        <div className="ld-footer-bottom">© {new Date().getFullYear()} Coursera Education. All rights reserved.</div>
      </footer>
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
  --accent-pink: #b5495b;
  --accent-blue: #7c4b2a;
  --accent-lime: #b58a2c;
  --accent-purple: #7a2942;
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

.ld-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 999px; font-weight: 600; font-size: 14.5px; text-decoration: none; border: 1px solid transparent; cursor: pointer; transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease; }
.ld-btn:hover { transform: translateY(-1px); }
.ld-btn:focus-visible { outline: 2px solid var(--accent-teal); outline-offset: 3px; }
.ld-btn--sm { padding: 9px 16px; font-size: 13.5px; }
.ld-btn--primary { background: var(--accent-teal); color: #ffffff; box-shadow: 0 6px 20px -6px rgba(159,29,70,0.5); }
.ld-btn--gradient { background: linear-gradient(90deg, var(--accent-teal), var(--accent-orange)); color: #ffffff; font-weight: 700; box-shadow: 0 6px 20px -6px rgba(159,29,70,0.4); }
.ld-btn--outline { background: transparent; color: var(--text-0); border-color: var(--card-border); }
.ld-btn--outline:hover { background: rgba(42,14,22,0.04); }

/* HERO */
.ld-hero { position: relative; padding: 90px 24px 60px; max-width: 1180px; margin: 0 auto; text-align: center; }
.ld-hero-bg { position: absolute; inset: -10% -20% auto -20%; height: 520px; background: radial-gradient(60% 60% at 30% 20%, rgba(159,29,70,0.14), transparent 70%), radial-gradient(50% 50% at 75% 10%, rgba(201,147,42,0.16), transparent 70%); filter: blur(10px); pointer-events: none; z-index: 0; }
.ld-hero-content { position: relative; z-index: 1; }
.ld-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-1); background: #ffffff; border: 1px solid var(--card-border); box-shadow: var(--card-shadow); padding: 8px 18px; border-radius: 999px; margin-bottom: 26px; }
.ld-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-teal); display: inline-block; }
.ld-dot--orange { background: var(--accent-orange); }

.ld-hero-title { font-family: var(--font-display); font-size: clamp(2.4rem, 5.4vw, 4.4rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.08; margin: 0 0 20px; color: var(--accent-teal); }
.ld-hero-title-accent { color: var(--accent-orange); }
.ld-hero-sub { font-size: clamp(1rem, 1.6vw, 1.2rem); color: var(--text-1); max-width: 680px; margin: 0 auto 36px; }
.ld-hero-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

.ld-hero-stats { margin-top: 60px; position: relative; z-index: 1; }
.ld-hero-stat-card { background: var(--card); border: 1px solid var(--card-border); box-shadow: var(--card-shadow); border-radius: var(--radius-lg); padding: 28px 22px; text-align: center; }
.ld-hero-stat-value { font-family: var(--font-display); font-size: 21px; font-weight: 700; margin-bottom: 10px; }
.ld-hero-stat-sub { font-size: 14px; color: var(--text-1); margin-bottom: 6px; }
.ld-hero-stat-sub2 { font-size: 12.5px; color: var(--text-2); }

/* SECTIONS */
.ld-section { max-width: 1180px; margin: 0 auto; padding: 96px 24px; }
.ld-section--dark { max-width: 100%; background: var(--bg-1); border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border); padding: 70px 24px; }
.ld-section--dark > * { max-width: 1180px; margin-left: auto; margin-right: auto; }
.ld-section-head { text-align: center; max-width: 680px; margin: 0 auto 56px; }
.ld-section-head h2 { font-family: var(--font-display); font-size: clamp(1.9rem, 3.6vw, 2.8rem); font-weight: 700; margin: 0 0 16px; letter-spacing: -0.01em; }
.ld-section-head p { color: var(--text-1); font-size: 16.5px; }

.ld-grid { display: grid; gap: 22px; }
.ld-grid--4 { grid-template-columns: repeat(4, 1fr); }
.ld-grid--3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 980px) { .ld-grid--4, .ld-grid--3 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px) { .ld-grid--4, .ld-grid--3 { grid-template-columns: 1fr; } .ld-nav-links { display: none; } }

/* feature cards */
.ld-feat-card { background: var(--card); border: 1px solid var(--card-border); box-shadow: var(--card-shadow); border-radius: var(--radius-lg); padding: 28px 24px; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
.ld-feat-card:hover { transform: translateY(-3px); border-color: rgba(42,14,22,0.16); box-shadow: var(--card-shadow-hover); }
.ld-feat-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 12px; }
.ld-feat-icon { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.accent-bg-orange { background: rgba(201,147,42,0.20); } .accent-bg-teal { background: rgba(159,29,70,0.16); }
.accent-bg-blue { background: rgba(124,75,42,0.20); } .accent-bg-green { background: rgba(107,127,63,0.20); }
.accent-bg-lime { background: rgba(181,138,44,0.20); } .accent-bg-pink { background: rgba(181,73,91,0.18); }
.accent-bg-purple { background: rgba(122,41,66,0.18); }
.ld-feat-tag { text-align: right; }
.ld-feat-tag-eyebrow { font-size: 11px; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.ld-feat-tag-label { font-size: 13px; font-weight: 600; }
.tag-orange { color: var(--accent-orange); } .tag-teal { color: var(--accent-teal); } .tag-blue { color: var(--accent-blue); }
.tag-green { color: var(--accent-green); } .tag-lime { color: var(--accent-lime); } .tag-pink { color: var(--accent-pink); }
.tag-purple { color: var(--accent-purple); }
.ld-feat-card h3 { font-family: var(--font-display); font-size: 19px; margin: 0 0 10px; }
.ld-card-desc { color: var(--text-1); font-size: 14px; margin: 0 0 16px; }
.ld-check-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.ld-check-list li { display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: var(--text-1); }
.ld-check-ring { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid currentColor; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; }
.ld-check { color: var(--accent-teal); font-weight: 700; font-size: 12px; }

/* simple cards */
.ld-simple-card { display: flex; gap: 16px; align-items: flex-start; background: var(--card); border: 1px solid var(--card-border); box-shadow: var(--card-shadow); border-radius: var(--radius-lg); padding: 26px; }
.ld-simple-icon { font-size: 22px; flex-shrink: 0; }
.ld-simple-card h3 { font-family: var(--font-display); font-size: 16px; margin: 0 0 6px; }

/* comparison */
.ld-compare { display: grid; grid-template-columns: 1fr auto 1fr; gap: 24px; align-items: center; }
@media (max-width: 860px) { .ld-compare { grid-template-columns: 1fr; } }
.ld-compare-card { background: var(--card); border: 1px solid var(--card-border); box-shadow: var(--card-shadow); border-radius: var(--radius-lg); padding: 30px 28px; }
.ld-compare-head { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
.ld-compare-badge { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
.ld-compare-badge--bad { background: rgba(42,14,22,0.06); color: var(--text-1); }
.ld-compare-badge--good { background: var(--text-0); color: #fff; }
.ld-compare-card h3 { font-family: var(--font-display); font-size: 20px; margin: 0; }
.ld-compare-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
.ld-compare-list li { display: flex; align-items: center; gap: 12px; font-size: 14.5px; color: var(--text-1); }
.ld-compare-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.ld-compare-dot--bad { background: var(--text-2); }
.ld-compare-dot--good { background: var(--accent-teal); }
.ld-compare-vs { width: 56px; height: 56px; border-radius: 50%; background: var(--accent-teal); color: #ffffff; box-shadow: 0 10px 24px -8px rgba(159,29,70,0.4); font-weight: 800; font-size: 13px; display: flex; align-items: center; justify-content: center; margin: 0 auto; }

/* CTA */
.ld-cta { padding: 100px 24px; text-align: center; background: var(--bg-1); border-top: 1px solid var(--card-border); }
.ld-cta-inner { max-width: 620px; margin: 0 auto; }
.ld-cta h2 { font-family: var(--font-display); font-size: clamp(1.9rem, 3.4vw, 2.6rem); margin: 0 0 14px; }
.ld-cta p { color: var(--text-1); font-size: 16.5px; margin-bottom: 34px; }
.ld-cta-buttons { margin-bottom: 20px; }
.ld-cta-note { font-size: 13px; color: var(--text-2); display: flex; align-items: center; justify-content: center; gap: 6px; }

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
`;