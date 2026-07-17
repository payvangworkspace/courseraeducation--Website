import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";

/**
 * Lessons Page — /lessons — Light Theme
 * Single-file React component, plain CSS (no Tailwind, no CSS modules).
 * Shares the same visual language (colors, nav, footer, buttons) as LandingPage.jsx.
 */

const BRAND_NAME = "Coursera Education";

const HERO_STATS = [
  { label: "Workshop Format", value: "Hands-on", sub: "Build real prototypes", sub2: "Labs designed around your stack" },
  { label: "Custom Curriculum", value: "Tailor-Made", sub: "No generic lessons", sub2: "Built around your use-case" },
  { label: "Delivery", value: "Remote / On-site", sub: "Enterprise-ready sessions", sub2: "Workshops, architecture reviews & playbooks" },
];

const TRACKS = [
  {
    icon: "✨",
    title: "Prompt Engineering",
    tag: "Production-grade prompting & evaluation",
    tagColor: "orange",
    desc: "Design reliable prompts, system instructions, guardrails and evaluation workflows for real AI applications.",
  },
  {
    icon: "📈",
    title: "Machine Learning Foundations",
    tag: "Practical ML for AI builders",
    tagColor: "teal",
    desc: "Understand core ML concepts, embeddings, datasets and evaluation — without academic overload.",
  },
  {
    icon: "🔗",
    title: "RAG Design",
    tag: "Knowledge AI architecture",
    tagColor: "teal",
    desc: "Design scalable retrieval pipelines: chunking, vector search, grounding and quality measurement.",
  },
  {
    icon: "🎧",
    title: "AI Chatbot Design",
    tag: "Conversational system architecture",
    tagColor: "orange",
    desc: "Build structured chat experiences: conversation flows, memory strategies and safe handoff patterns.",
  },
  {
    icon: "💡",
    title: "Agentic AI",
    tag: "Tools, orchestration & multi-agent workflows",
    tagColor: "orange",
    desc: "Design autonomous agents with tool calling, planning, supervision and production safety.",
  },
  {
    icon: "🎓",
    title: "VectorDB & Embeddings",
    tag: "Semantic search infrastructure",
    tagColor: "teal",
    desc: "Learn embeddings, indexing, hybrid search and performance optimization for retrieval systems.",
  },
];

const WHY_CARDS = [
  { icon: "✨", title: "Built for Real Projects", desc: "Workshops focus on production use-cases — not theoretical AI lessons." },
  { icon: "📈", title: "Architecture-First", desc: "Learn latency, cost, evaluation and system design for production deployments." },
  { icon: "🎧", title: "Hands-on Labs", desc: "Participants build prompts, RAG pipelines and agents during the sessions." },
  { icon: "🎧", title: "Expert Guidance", desc: "Delivered by engineers experienced in real AI orchestration and deployments." },
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

export default function LessonsPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="ld-root">
      <style>{CSS}</style>

      <Navbar brandName={BRAND_NAME} active="Lessons" scrolled={scrolled} />

      {/* HERO */}
      <section className="ld-hero ld-hero--lessons">
        <div className="ld-hero-bg" aria-hidden="true" />
        <Reveal className="ld-hero-content">
          <div className="ld-pill">
            <span aria-hidden>✨</span> AI Training Programs
          </div>
          <h1 className="ld-hero-title ld-hero-title--split">
            Hands-on AI Training
            <br />
            <span className="ld-hero-title-accent">Built for Production Teams</span>
          </h1>
          <p className="ld-hero-sub">
            Explore tailor-made training tracks designed for developers, product teams and enterprises. From
            prompting to RAG and agents — learn by building with real-world patterns.
          </p>

          <div className="ld-hero-cta">
            <a href="#contact" className="ld-btn ld-btn--primary">
              Get in Touch <span aria-hidden>→</span>
            </a>
            <a href="#syllabus" className="ld-btn ld-btn--outline">
              Request Syllabus
            </a>
          </div>
        </Reveal>

        <div className="ld-grid ld-grid--3 ld-hero-stats">
          {HERO_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="ld-hero-stat-card">
              <div className="ld-hero-stat-label">{s.label}</div>
              <div className="ld-hero-stat-value">{s.value}</div>
              <div className="ld-hero-stat-sub">{s.sub}</div>
              <div className="ld-hero-stat-sub2">{s.sub2}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRAINING TRACKS */}
      <section className="ld-section" id="tracks">
        <Reveal className="ld-section-head">
          <h2 className="ld-gradient-heading">Training Tracks</h2>
          <p>
            Choose a track — or combine multiple into a custom program. Each training is adapted to your team&rsquo;s
            level, stack and goals.
          </p>
        </Reveal>

        <div className="ld-grid ld-grid--3">
          {TRACKS.map((t, i) => (
            <Reveal key={t.title} delay={i * 70} className="ld-track-card">
              <div className={`ld-track-icon accent-${t.tagColor}`}>{t.icon}</div>
              <h3>{t.title}</h3>
              <div className={`ld-track-tag tag-${t.tagColor}`}>{t.tag}</div>
              <p className="ld-card-desc">{t.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="ld-tracks-cta">
          <a href="#contact" className="ld-btn ld-btn--dark">
            Get a custom training plan
          </a>
          <a href="#syllabus" className="ld-btn ld-btn--outline">
            Request syllabus
          </a>
        </Reveal>
      </section>

      {/* WHY */}
      <section className="ld-section ld-section--dark">
        <Reveal className="ld-section-head">
          <h2 className="ld-gradient-heading">Why {BRAND_NAME} Training?</h2>
          <p>
            We design workshops around your real use-cases — so your team leaves with prototypes, playbooks and a
            clear production path.
          </p>
        </Reveal>

        <div className="ld-grid ld-grid--4">
          {WHY_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 90} className="ld-why-card">
              <div className="ld-why-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p className="ld-card-desc">{c.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ld-cta" id="contact">
        <Reveal className="ld-cta-inner">
          <h2>Design Your Custom AI Training</h2>
          <p>Tell us your team, stack and goals — we&rsquo;ll prepare a tailored workshop plan.</p>
          <div className="ld-hero-cta ld-cta-buttons">
            <a href="#contact" className="ld-btn ld-btn--primary">
              Get in Touch <span aria-hidden>→</span>
            </a>
            <a href="#syllabus" className="ld-btn ld-btn--outline">
              Request Syllabus
            </a>
          </div>
          <div className="ld-cta-note">
            <span className="ld-check">✓</span> Custom curriculum &nbsp;•&nbsp; Hands-on labs &nbsp;•&nbsp; Remote or on-site
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="ld-footer">
        <div className="ld-footer-grid">
          <div>
            <a className="ld-logo" href="/">
              <span className="ld-logo-mark">◤</span> {BRAND_NAME}
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
            <a href="mailto:hello@brandname.com" className="ld-btn ld-btn--primary ld-btn--sm">Email Support</a>
            <p className="ld-footer-note">Typical response time: 1–2 business days.</p>
          </div>
        </div>
        <div className="ld-footer-bottom">© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</div>
      </footer>
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
  --gradient: linear-gradient(90deg, var(--accent-orange), var(--accent-teal));
  --radius-lg: 22px;
  --radius-md: 16px;
  --shadow-sm: 0 1px 2px rgba(36,20,23,0.04);
  --shadow-md: 0 14px 34px -18px rgba(36,20,23,0.20);
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
.ld-nav-inner { max-width: 1180px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; background: #ffffff; border: 1px solid var(--card-border); border-radius: 999px; padding: 10px 14px 10px 20px; box-shadow: var(--shadow-sm); }
.ld-logo { font-family: var(--font-display); font-weight: 700; letter-spacing: 0.02em; color: var(--text-0); text-decoration: none; display: flex; align-items: center; gap: 8px; font-size: 15px; }
.ld-logo-mark { background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; font-size: 18px; }
.ld-nav-links { display: flex; gap: 8px; }
.ld-nav-links a { color: var(--text-1); text-decoration: none; font-size: 14.5px; font-weight: 500; padding: 8px 16px; border-radius: 999px; transition: color .2s ease, background .2s ease, border-color .2s ease; border: 1px solid transparent; }
.ld-nav-links a:hover { color: var(--text-0); }
.ld-nav-link--active { color: var(--accent-orange) !important; background: rgba(122,23,53,0.08); border-color: rgba(122,23,53,0.30) !important; }

.ld-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 999px; font-weight: 600; font-size: 14.5px; text-decoration: none; border: 1px solid transparent; cursor: pointer; transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease; }
.ld-btn:hover { transform: translateY(-1px); }
.ld-btn:focus-visible { outline: 2px solid var(--accent-teal); outline-offset: 3px; }
.ld-btn--sm { padding: 9px 16px; font-size: 13.5px; }
.ld-btn--primary { background: var(--gradient); color: #ffffff; box-shadow: 0 10px 24px -8px rgba(122,23,53,0.45); }
.ld-btn--outline { background: #ffffff; color: var(--text-0); border-color: var(--card-border); }
.ld-btn--outline:hover { background: var(--bg-1); }
.ld-btn--dark { background: var(--text-0); color: #ffffff; }
.ld-btn--dark:hover { background: #3a2226; }

/* HERO */
.ld-hero { position: relative; padding: 90px 24px 60px; max-width: 1180px; margin: 0 auto; text-align: center; }
.ld-hero-bg { position: absolute; inset: -10% -20% auto -20%; height: 520px; background: radial-gradient(60% 60% at 30% 20%, rgba(122,23,53,0.12), transparent 70%), radial-gradient(50% 50% at 75% 10%, rgba(193,146,47,0.16), transparent 70%); filter: blur(10px); pointer-events: none; z-index: 0; }
.ld-hero-content { position: relative; z-index: 1; }
.ld-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--accent-orange); border: 1px solid rgba(122,23,53,0.30); background: rgba(122,23,53,0.06); padding: 8px 18px; border-radius: 999px; margin-bottom: 26px; }

.ld-hero-title { font-family: var(--font-display); font-size: clamp(2.4rem, 5.4vw, 4.4rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.08; margin: 0 0 20px; color: var(--text-0); }
.ld-hero-title--split { }
.ld-hero-title-accent { background: linear-gradient(90deg, var(--accent-orange), #93602a 50%, var(--accent-teal)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ld-hero-sub { font-size: clamp(1rem, 1.6vw, 1.2rem); color: var(--text-1); max-width: 680px; margin: 0 auto 36px; }
.ld-hero-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

.ld-hero-stats { margin-top: 60px; position: relative; z-index: 1; }
.ld-hero-stat-card { background: var(--bg-1); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 30px 24px; text-align: center; box-shadow: var(--shadow-sm); }
.ld-hero-stat-label { font-size: 12.5px; color: var(--accent-teal); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }
.ld-hero-stat-value { font-family: var(--font-display); font-size: 26px; font-weight: 700; margin-bottom: 10px; color: var(--accent-orange); }
.ld-hero-stat-sub { font-size: 14px; color: var(--text-1); }
.ld-hero-stat-sub2 { font-size: 12.5px; color: var(--text-2); margin-top: 4px; }

/* SECTIONS */
.ld-section { max-width: 1180px; margin: 0 auto; padding: 96px 24px; }
.ld-section--dark { max-width: 100%; background: var(--bg-1); border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border); }
.ld-section--dark > * { max-width: 1180px; margin-left: auto; margin-right: auto; }
.ld-section-head { text-align: center; max-width: 680px; margin: 0 auto 56px; }
.ld-gradient-heading { font-family: var(--font-display); font-size: clamp(1.9rem, 3.6vw, 2.8rem); font-weight: 700; margin: 0 0 16px; letter-spacing: -0.01em; color: var(--text-0); }
.ld-section-head p { color: var(--text-1); font-size: 16.5px; }

.ld-grid { display: grid; gap: 22px; }
.ld-grid--4 { grid-template-columns: repeat(4, 1fr); }
.ld-grid--3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 980px) { .ld-grid--4, .ld-grid--3 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px) { .ld-grid--4, .ld-grid--3 { grid-template-columns: 1fr; } .ld-nav-links { display: none; } }

/* Track cards */
.ld-track-card { background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 28px 24px; box-shadow: var(--shadow-sm); transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
.ld-track-card:hover { transform: translateY(-3px); border-color: rgba(122,23,53,0.28); box-shadow: var(--shadow-md); }
.ld-track-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 18px; background: rgba(122,23,53,0.10); }
.ld-track-icon.accent-teal { background: rgba(193,146,47,0.14); }
.ld-track-card h3 { font-family: var(--font-display); font-size: 19px; margin: 0 0 8px; }
.ld-track-tag { font-size: 13.5px; font-weight: 600; margin-bottom: 12px; }
.tag-orange { color: var(--accent-orange); }
.tag-teal { color: var(--accent-teal); }
.ld-card-desc { color: var(--text-1); font-size: 14px; margin: 0; }

.ld-tracks-cta { display: flex; justify-content: center; gap: 14px; margin-top: 48px; flex-wrap: wrap; }

/* Why cards */
.ld-why-card { background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 34px 24px; text-align: center; box-shadow: var(--shadow-sm); }
.ld-why-icon { width: 56px; height: 56px; border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 22px; background: var(--gradient); }
.ld-why-card h3 { font-family: var(--font-display); font-size: 18px; margin: 0 0 10px; }

/* CTA */
.ld-cta { padding: 100px 24px; text-align: center; background: var(--bg-1); border-top: 1px solid var(--card-border); }
.ld-cta-inner { max-width: 620px; margin: 0 auto; }
.ld-cta h2 { font-family: var(--font-display); font-size: clamp(1.9rem, 3.4vw, 2.6rem); margin: 0 0 14px; color: var(--text-0); }
.ld-cta p { color: var(--text-1); font-size: 16.5px; margin-bottom: 34px; }
.ld-cta-buttons { margin-bottom: 20px; }
.ld-cta-note { font-size: 13px; color: var(--text-2); display: flex; align-items: center; justify-content: center; gap: 6px; }
.ld-check { color: var(--accent-orange); font-weight: 700; font-size: 12px; }

/* FOOTER */
.ld-footer { padding: 70px 24px 30px; background: var(--bg-1); border-top: 1px solid var(--card-border); }
.ld-footer-grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 50px; }
.ld-footer h4 { font-size: 14px; margin: 0 0 12px; color: var(--text-0); }
.ld-footer-desc { color: var(--text-2); font-size: 13.5px; line-height: 1.6; margin: 12px 0; }
.ld-footer-links { list-style: none; padding: 0; margin: 10px 0 0; display: flex; flex-direction: column; gap: 8px; }
.ld-footer-links a { color: var(--text-1); text-decoration: none; font-size: 13.5px; }
.ld-footer-links a:hover { color: var(--text-0); }
.ld-footer-note { font-size: 12px; color: var(--text-2); margin-top: 10px; }
.ld-footer-bottom { max-width: 1180px; margin: 50px auto 0; padding-top: 24px; border-top: 1px solid var(--card-border); font-size: 12.5px; color: var(--text-2); text-align: center; }
@media (max-width: 800px) { .ld-footer-grid { grid-template-columns: 1fr; gap: 34px; } }
`;