import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";

/**
 * Pricing Page — /pricing — Light Theme
 * Single-file React component, plain CSS (no Tailwind, no CSS modules).
 * Shares the same visual language (colors, nav, footer, buttons) as LandingPage.jsx / LessonsPage.jsx.
 */

const BRAND_NAME = "Coursera Education";

const HERO_STATS = [
  { icon: "📅", label: "3 plans", value: "Monthly, 6-Month, Yearly", sub: "Pick the billing cycle that fits your team" },
  { icon: "💱", label: "USD & EUR", value: "dual currency", sub: "Prices shown in both currencies" },
  { icon: "🔁", label: "Flexible", value: "upgrade, downgrade or cancel", sub: "No long-term lock-in on the monthly plan" },
];

const WHY_PLANS = [
  {
    icon: "📅",
    title: "Pick your billing rhythm",
    desc: "Monthly for flexibility, 6-Month or Yearly for savings — same full access either way.",
  },
  {
    icon: "⚖",
    title: "One price, every track",
    desc: "Prompt Engineering, RAG, Machine Learning, Agentic AI — all included in every plan.",
  },
  {
    icon: "💱",
    title: "USD or EUR, your choice",
    desc: "Every plan is priced in both currencies so you can bill in whichever works for you.",
  },
  {
    icon: "✅",
    title: "No hidden hourly meter",
    desc: "No time tracking, no surprise usage bills — just a flat rate for the billing period you choose.",
  },
];

const WHATS_INCLUDED = [
  "Access to the " + BRAND_NAME + " LMS experience (tracks, lessons, checkpoints)",
  "Assignments & practical exercises (where available)",
  "Learning analytics (progress, completion, engagement)",
  "Certificates of completion (for eligible tracks)",
  "Email support for account and billing questions",
];

const ADD_ONS = [
  {
    icon: "👥",
    title: "Instructor-led sessions",
    desc: "Live sessions, grading, and structured cohort governance (available as an add-on).",
  },
  {
    icon: "✨",
    title: "Custom curriculum design",
    desc: "Tailored learning path aligned to your team's tools and use cases (available as an add-on).",
  },
  {
    icon: "📄",
    title: "Assessments & reporting pack",
    desc: "Rubrics, pass thresholds, and exportable reporting templates (available as an add-on).",
  },
  {
    icon: "📅",
    title: "Program scheduling",
    desc: "Cohort planning, calendars, and milestone configuration (available as an add-on).",
  },
];

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    tagline: "Flexible, cancel anytime",
    usd: 49,
    eur: 45,
    period: "/ month",
    billedNote: "Billed every month",
    features: [
      "Full access to every training track",
      "Progress & completion analytics",
      "Certificates of completion",
      "Email support",
      "Cancel anytime",
    ],
  },
  {
    id: "sixmonth",
    name: "6-Month",
    tagline: "Save with a semi-annual plan",
    usd: 249,
    eur: 229,
    period: "/ 6 months",
    billedNote: "Billed once every 6 months",
    perMonthUsd: "41.50",
    perMonthEur: "38.17",
    badge: "Save ~15%",
    features: [
      "Everything in Monthly",
      "Priority email support",
      "Downloadable session summaries",
      "Locked-in rate for 6 months",
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    tagline: "Best value for committed teams",
    usd: 420,
    eur: 390,
    period: "/ year",
    billedNote: "Billed once a year",
    perMonthUsd: "35.00",
    perMonthEur: "32.50",
    badge: "Save ~28%",
    featured: true,
    features: [
      "Everything in 6-Month",
      "1 complimentary curriculum consultation",
      "Early access to new tracks",
      "Locked-in rate for the full year",
    ],
  },
];

const FAQS = [
  {
    q: "How does pricing work?",
    a: "Choose a Monthly, 6-Month, or Yearly plan. Each plan gives full access to every " + BRAND_NAME + " track — the price only changes based on the billing cycle you pick, not which courses you use.",
  },
  {
    q: "Do you charge per user or per seat?",
    a: "Each plan covers one learner account. For multiple learners or a team rollout, contact us and we'll put together a volume arrangement.",
  },
  {
    q: "What currencies do you support?",
    a: "Every plan is shown in both USD and EUR. You can toggle between them on this page, and you'll be billed in the currency you select at checkout.",
  },
  {
    q: "Is the price different for different courses?",
    a: "No. Prompt Engineering, Machine Learning, RAG Design, Agentic AI — every track is included at the same plan price.",
  },
  {
    q: "What's the difference between Monthly, 6-Month, and Yearly?",
    a: "They're the same access with different billing frequency. Monthly is the most flexible; 6-Month and Yearly are billed upfront in exchange for a lower effective monthly rate.",
  },
  {
    q: "Do 6-Month and Yearly plans auto-renew?",
    a: "Yes, by default they renew at the end of the billing period. You can turn off auto-renew from your account at any time before the renewal date.",
  },
  {
    q: "Can I cancel anytime?",
    a: "The Monthly plan can be cancelled at any time and you won't be billed again. 6-Month and Yearly plans are billed upfront; cancelling stops future renewals but doesn't refund the current period.",
  },
  {
    q: "Can I switch between plans?",
    a: "Yes. You can upgrade to a longer billing cycle at any time, or move to a shorter one when your current period ends.",
  },
  {
    q: "Do you offer refunds?",
    a: "If there's a billing error, we'll review it and make it right. For general refund questions outside of an error, email us and we'll walk through the options.",
  },
  {
    q: "Is there a free trial?",
    a: "We can arrange a short trial or demo for teams evaluating " + BRAND_NAME + " — email us and we'll set it up.",
  },
  {
    q: "Can multiple people share one account?",
    a: "Plans are designed for one learner per account so progress and certificates stay accurate. For teams, we offer multi-seat arrangements — contact us for details.",
  },
  {
    q: "Do you offer team or volume pricing?",
    a: "Yes. For department or company-wide rollouts, email us with your team size and we'll propose a volume rate on top of the standard plans.",
  },
  {
    q: "What's included in every plan?",
    a: "All tracks and lessons, assignments where available, learning analytics, certificates of completion for eligible tracks, and email support.",
  },
  {
    q: "Are add-ons billed separately from the plan?",
    a: "Yes. Add-ons like instructor-led sessions, custom curriculum design, or assessment packs are quoted and billed separately from your Monthly, 6-Month, or Yearly plan.",
  },
  {
    q: "Do you provide invoices and receipts?",
    a: "Yes. Every payment generates an invoice and receipt you can access from your account.",
  },
  {
    q: "Which payment methods do you support?",
    a: "We typically support major cards and bank transfers in both USD and EUR. If you need a purchase order process, email us.",
  },
  {
    q: "Is our data private?",
    a: "Yes. We treat customer and learner data as private. If you need specific compliance requirements (e.g., retention rules, DPA), we can discuss and document them.",
  },
  {
    q: "Can we use " + BRAND_NAME + " for corporate training?",
    a: "Yes. " + BRAND_NAME + " is designed for private training, cohorts, and analytics — particularly useful for teams and organizations, with plans or volume pricing depending on size.",
  },
  {
    q: "Do you offer certifications?",
    a: "We provide completion certificates for eligible tracks on every plan. For deeper skills validation, ask about the assessments & reporting add-on.",
  },
  {
    q: "How do we get started?",
    a: "Pick the plan and currency that fit you, create an account, and start learning. For a private team rollout, email us and we'll help you plan it.",
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

function FaqItem({ index, item, isOpen, onToggle }) {
  return (
    <div className="pr-faq-item">
      <button className="pr-faq-head" onClick={() => onToggle(index)} aria-expanded={isOpen}>
        <span className="pr-faq-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="pr-faq-q">{item.q}</span>
        <span className={`pr-faq-arrow ${isOpen ? "pr-faq-arrow--open" : ""}`} aria-hidden>
          ↑
        </span>
      </button>
      {isOpen && (
        <div className="pr-faq-body">
          <p>{item.a}</p>
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [currency, setCurrency] = useState("usd");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleFaq = (i) => setOpenFaq((cur) => (cur === i ? -1 : i));
  const symbol = currency === "usd" ? "$" : "€";

  return (
    <div className="ld-root">
      <style>{CSS}</style>

      <Navbar brandName={BRAND_NAME} active="Pricing" scrolled={scrolled} />

      {/* HERO */}
      <section className="ld-hero ld-hero--pricing">
        <div className="ld-hero-bg" aria-hidden="true" />
        <Reveal className="ld-hero-content">
          <div className="ld-pill">
            <span aria-hidden>$</span> Simple, Transparent Pricing
          </div>
          <h1 className="pr-hero-title">
            Plans that scale with you — <span className="pr-hero-title-accent">Monthly</span>,{" "}
            <span className="pr-hero-title-teal">6-Month</span> or Yearly
          </h1>
          <p className="ld-hero-sub pr-hero-sub">
            No hourly tracking, no seat tiers, no course tiers. Every track — Prompt Engineering, RAG, Machine
            Learning, Agentic AI — is included, priced in USD or EUR.
          </p>

          <div className="ld-hero-cta">
            <a href="#plans" className="ld-btn ld-btn--primary">
              See Plans <span aria-hidden>→</span>
            </a>
            <a href="#contact" className="ld-btn ld-btn--outline">
              Get in Touch
            </a>
          </div>
        </Reveal>

        <div className="ld-grid ld-grid--3 ld-hero-stats">
          {HERO_STATS.map((s, i) => (
            <Reveal key={s.value} delay={i * 90} className="ld-hero-stat-card">
              <div className="pr-stat-icon">{s.icon}</div>
              <div className="ld-hero-stat-value">{s.label}</div>
              <div className="ld-hero-stat-sub">{s.value}</div>
              <div className="ld-hero-stat-sub2">{s.sub}</div>
            </Reveal>
          ))}
        </div>

        <Reveal className="pr-fair-billing" delay={200}>
          <span className="pr-warn-icon" aria-hidden>💱</span>
          <p>
            <strong>Currency note:</strong> prices are shown in USD and EUR for convenience. You'll be billed in the
            currency you select at checkout.
          </p>
        </Reveal>
      </section>

      {/* WHY PLANS */}
      <section className="ld-section" id="why-plans">
        <Reveal className="ld-section-head">
          <h2 className="ld-gradient-heading">Why plan-based pricing?</h2>
          <p>Flat, predictable billing that scales with your commitment — not with the clock.</p>
        </Reveal>

        <div className="ld-grid ld-grid--4">
          {WHY_PLANS.map((c, i) => (
            <Reveal key={c.title} delay={i * 80} className="pr-why-card">
              <div className="pr-why-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p className="ld-card-desc">{c.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* INCLUDED / ADD-ONS */}
      <section className="ld-section ld-section--dark" id="included">
        <div className="pr-included-grid">
          <Reveal className="pr-included-col">
            <h3 className="pr-col-heading">
              <span className="pr-tick-lg">✓</span> What&rsquo;s included
            </h3>
            <ul className="pr-included-list">
              {WHATS_INCLUDED.map((item) => (
                <li key={item}>
                  <span className="pr-tick">✓</span> {item}
                </li>
              ))}
            </ul>
            <div className="pr-private-note">
              <span aria-hidden>🔒</span>
              <p>
                <strong>Private by design:</strong> your cohorts and learning data are not public. For compliance
                requirements, contact us.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100} className="pr-included-col">
            <h3 className="pr-col-heading">
              <span aria-hidden>✨</span> Optional add-ons
            </h3>
            <div className="pr-addon-list">
              {ADD_ONS.map((a) => (
                <div key={a.title} className="pr-addon-card">
                  <div className="pr-addon-icon">{a.icon}</div>
                  <div>
                    <h4>{a.title}</h4>
                    <p className="ld-card-desc">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pr-addon-buttons">
              <a href="#plans" className="ld-btn ld-btn--dark">
                See Plans <span aria-hidden>→</span>
              </a>
              <a href="#contact" className="ld-btn ld-btn--outline">
                Request a program plan
              </a>
            </div>
          </Reveal>
        </div>

        {/* PLANS */}
        <Reveal className="pr-estimator" delay={150}>
          <div className="pr-plans-head" id="plans">
            <h3 className="pr-col-heading pr-estimator-title">Choose your plan</h3>
            <div className="pr-currency-toggle" role="group" aria-label="Currency">
              <button
                type="button"
                className={`pr-currency-btn ${currency === "usd" ? "pr-currency-btn--active" : ""}`}
                onClick={() => setCurrency("usd")}
              >
                USD ($)
              </button>
              <button
                type="button"
                className={`pr-currency-btn ${currency === "eur" ? "pr-currency-btn--active" : ""}`}
                onClick={() => setCurrency("eur")}
              >
                EUR (€)
              </button>
            </div>
          </div>

          <div className="ld-grid ld-grid--3">
            {PLANS.map((p) => {
              const price = currency === "usd" ? p.usd : p.eur;
              const perMonth = currency === "usd" ? p.perMonthUsd : p.perMonthEur;
              return (
                <div key={p.id} className={`pr-plan-card ${p.featured ? "pr-plan-card--featured" : ""}`}>
                  {p.badge && <div className="pr-plan-badge">{p.badge}</div>}
                  <div className="pr-plan-name">{p.name}</div>
                  <div className="pr-plan-tagline">{p.tagline}</div>
                  <div className="pr-plan-price">
                    {symbol}
                    {price}
                    <span className="pr-plan-period">{p.period}</span>
                  </div>
                  {perMonth && (
                    <div className="pr-plan-permonth">
                      {symbol}
                      {perMonth}/mo equivalent
                    </div>
                  )}
                  <div className="pr-plan-billed">{p.billedNote}</div>
                  <ul className="pr-plan-features">
                    {p.features.map((f) => (
                      <li key={f}>
                        <span className="pr-tick">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#start" className={`ld-btn ${p.featured ? "ld-btn--primary" : "ld-btn--outline"} pr-plan-cta`}>
                    Choose {p.name} <span aria-hidden>→</span>
                  </a>
                </div>
              );
            })}
          </div>
          <div className="pr-estimator-footnote">
            <span aria-hidden>?</span>
            <p>
              Need something in between, or pricing for a larger team? Email{" "}
              <a href="mailto:hello@brandname.com">hello@brandname.com</a> and we&rsquo;ll put together a custom
              quote.
            </p>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="ld-section pr-faq-section" id="faq">
        <Reveal className="ld-section-head">
          <h2 className="pr-faq-title">Pricing FAQ</h2>
          <p>Everything you need to know about plans, billing cycles, and currency.</p>
        </Reveal>

        <div className="pr-faq-list">
          {FAQS.map((item, i) => (
            <FaqItem key={item.q} index={i} item={item} isOpen={openFaq === i} onToggle={toggleFaq} />
          ))}
        </div>

        <Reveal className="pr-custom-rollout" delay={100}>
          <div className="pr-rollout-icon">⟳</div>
          <h3>Need a custom training rollout?</h3>
          <p>Tell us your team size, target skills, and timeline. We&rsquo;ll recommend a plan mix and currency setup that fits.</p>
          <div className="ld-hero-cta">
            <a href="#contact" className="ld-btn ld-btn--outline">
              Email Us
            </a>
            <a href="#plans" className="ld-btn ld-btn--dark">
              See Plans <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="ld-cta" id="start">
        <Reveal className="ld-cta-inner">
          <h2>Start learning today</h2>
          <p>
            Create an account and choose a Monthly, 6-Month, or Yearly plan, priced in USD or EUR — full access to
            every track either way.
          </p>
          <div className="ld-hero-cta ld-cta-buttons">
            <a href="#plans" className="ld-btn ld-btn--primary">
              See Plans <span aria-hidden>→</span>
            </a>
            <a href="#contact" className="ld-btn ld-btn--outline">
              Get in Touch
            </a>
          </div>
          <div className="ld-cta-note">
            <span className="ld-check">✓</span> Tailor-made curriculum &nbsp;•&nbsp; Hands-on labs &nbsp;•&nbsp; Delivered as workshops
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="ld-footer" id="contact">
        <div className="ld-footer-grid">
          <div>
            <a className="ld-logo" href="/">
              <span className="ld-logo-mark">◤</span> {BRAND_NAME}
            </a>
            <p className="ld-footer-desc">
              Private, instructor-led AI training with a modern LMS. Learn fast with hands-on lessons, projects, and
              real feedback.
            </p>
            <div className="pr-address">
              <span aria-hidden>📍</span>
              <div>
                <div>123 Business Bay, Suite 101</div>
                <div>Dubai</div>
                <div>United Arab Emirates</div>
              </div>
            </div>
            <div className="pr-email-row">
              <span aria-hidden>✉</span> hello@brandname.com
            </div>
            <div className="pr-payment-icons">
              <span>iyzico</span>
              <span>MasterCard</span>
              <span>VISA</span>
              <span>Amex</span>
              <span>Troy</span>
            </div>
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
              <li><a href="#">Cookie Settings</a></li>
            </ul>
          </div>
          <div>
            <h4>Need help?</h4>
            <p className="ld-footer-desc">Email us for training guidance, scheduling, or any account questions. We&rsquo;ll get back as soon as possible.</p>
            <a href="mailto:hello@brandname.com" className="ld-btn ld-btn--email ld-btn--sm">Email Support</a>
            <p className="ld-footer-note">Typical response time: 1–2 business days.</p>
          </div>
        </div>
        <div className="ld-footer-bottom pr-footer-bottom">
          <span>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</span>
          <span>Contact: hello@brandname.com</span>
        </div>
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
.ld-btn--email { background: var(--accent-orange); color: #fff; }
.ld-btn--email:hover { background: #5f1329; }

/* HERO */
.ld-hero { position: relative; padding: 90px 24px 60px; max-width: 1180px; margin: 0 auto; text-align: center; }
.ld-hero-bg { position: absolute; inset: -10% -20% auto -20%; height: 520px; background: radial-gradient(60% 60% at 30% 20%, rgba(122,23,53,0.12), transparent 70%), radial-gradient(50% 50% at 75% 10%, rgba(193,146,47,0.16), transparent 70%); filter: blur(10px); pointer-events: none; z-index: 0; }
.ld-hero-content { position: relative; z-index: 1; }
.ld-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--accent-orange); border: 1px solid rgba(122,23,53,0.30); background: rgba(122,23,53,0.06); padding: 8px 18px; border-radius: 999px; margin-bottom: 26px; }

.pr-hero-title { font-family: var(--font-display); font-size: clamp(2rem, 4.6vw, 3.6rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1.15; margin: 0 0 20px; color: var(--text-0); }
.pr-hero-title-accent { color: var(--accent-orange); }
.pr-hero-title-teal { color: var(--accent-teal); }
.pr-hero-sub { max-width: 720px; }

.ld-hero-sub { font-size: clamp(1rem, 1.6vw, 1.2rem); color: var(--text-1); max-width: 680px; margin: 0 auto 36px; }
.ld-hero-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

.ld-hero-stats { margin-top: 60px; position: relative; z-index: 1; }
.ld-hero-stat-card { background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 30px 24px; text-align: center; box-shadow: var(--shadow-sm); }
.pr-stat-icon { width: 48px; height: 48px; border-radius: 14px; background: var(--bg-1); border: 1px solid var(--card-border); display: flex; align-items: center; justify-content: center; font-size: 18px; margin: 0 auto 18px; }
.ld-hero-stat-label { font-size: 12.5px; color: var(--accent-teal); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 12px; }
.ld-hero-stat-value { font-family: var(--font-display); font-size: 26px; font-weight: 700; margin-bottom: 8px; color: var(--accent-orange); }
.ld-hero-stat-sub { font-size: 15px; color: var(--text-1); }
.ld-hero-stat-sub2 { font-size: 13px; color: var(--text-2); margin-top: 6px; }

.pr-fair-billing { margin-top: 28px; display: flex; align-items: flex-start; gap: 12px; text-align: left; background: rgba(122,23,53,0.06); border: 1px solid rgba(122,23,53,0.22); border-radius: var(--radius-md); padding: 18px 22px; }
.pr-warn-icon { color: var(--accent-orange); font-size: 16px; margin-top: 2px; }
.pr-fair-billing p { margin: 0; color: var(--text-1); font-size: 14px; }
.pr-fair-billing strong { color: var(--text-0); }

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

/* Why-plans cards */
.pr-why-card { background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 30px 26px; box-shadow: var(--shadow-sm); transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
.pr-why-card:hover { transform: translateY(-3px); border-color: rgba(122,23,53,0.28); box-shadow: var(--shadow-md); }
.pr-why-icon { width: 48px; height: 48px; border-radius: 14px; background: var(--bg-1); border: 1px solid var(--card-border); display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 18px; }
.pr-why-card h3 { font-family: var(--font-display); font-size: 18px; margin: 0 0 8px; }
.ld-card-desc { color: var(--text-1); font-size: 14px; margin: 0; }

/* Included / Add-ons */
.pr-included-grid { display: grid; grid-template-columns: 1fr 1.15fr; gap: 40px; margin-bottom: 70px; }
@media (max-width: 900px) { .pr-included-grid { grid-template-columns: 1fr; } }
.pr-included-col { background: transparent; }
.pr-col-heading { font-family: var(--font-display); font-size: 22px; display: flex; align-items: center; gap: 10px; margin: 0 0 26px; color: var(--text-0); }
.pr-tick-lg { color: var(--accent-green); }
.pr-included-list { list-style: none; margin: 0 0 26px; padding: 0; display: flex; flex-direction: column; gap: 18px; }
.pr-included-list li { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; color: var(--text-1); }
.pr-tick { color: var(--accent-green); font-weight: 700; flex-shrink: 0; margin-top: 1px; }
.pr-private-note { display: flex; gap: 12px; align-items: flex-start; border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 18px 20px; background: var(--card); }
.pr-private-note p { margin: 0; font-size: 14px; color: var(--text-1); }
.pr-private-note strong { color: var(--text-0); }

.pr-addon-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 28px; }
.pr-addon-card { display: flex; gap: 16px; align-items: flex-start; border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 20px 22px; background: var(--card); box-shadow: var(--shadow-sm); }
.pr-addon-icon { width: 42px; height: 42px; border-radius: 12px; background: var(--bg-1); border: 1px solid var(--card-border); display: flex; align-items: center; justify-content: center; font-size: 17px; flex-shrink: 0; }
.pr-addon-card h4 { font-size: 15.5px; margin: 0 0 6px; color: var(--text-0); }
.pr-addon-buttons { display: flex; gap: 14px; flex-wrap: wrap; }

/* Plans */
.pr-estimator { border-top: 1px solid var(--card-border); padding-top: 60px; }
.pr-estimator-title { text-align: left; margin-bottom: 0; }
.pr-plans-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 18px; margin-bottom: 30px; }
.pr-currency-toggle { display: inline-flex; border: 1px solid var(--card-border); border-radius: 999px; background: var(--card); padding: 4px; }
.pr-currency-btn { border: none; background: transparent; padding: 8px 18px; border-radius: 999px; font-size: 13.5px; font-weight: 600; color: var(--text-1); cursor: pointer; transition: background .2s ease, color .2s ease; }
.pr-currency-btn--active { background: var(--gradient); color: #ffffff; }

.pr-plan-card { position: relative; background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-lg); padding: 30px 26px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; }
.pr-plan-card--featured { border-color: var(--accent-orange); box-shadow: var(--shadow-md); }
.pr-plan-badge { position: absolute; top: -13px; right: 24px; background: var(--gradient); color: #fff; font-size: 12px; font-weight: 700; padding: 5px 14px; border-radius: 999px; }
.pr-plan-name { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text-0); }
.pr-plan-tagline { font-size: 13.5px; color: var(--text-2); margin: 4px 0 20px; }
.pr-plan-price { font-family: var(--font-display); font-size: 34px; font-weight: 700; color: var(--accent-orange); display: flex; align-items: baseline; gap: 6px; }
.pr-plan-period { font-family: var(--font-body); font-size: 14px; font-weight: 500; color: var(--text-2); }
.pr-plan-permonth { font-size: 13px; color: var(--text-1); margin-top: 6px; }
.pr-plan-billed { font-size: 12.5px; color: var(--text-2); margin-top: 4px; margin-bottom: 20px; }
.pr-plan-features { list-style: none; margin: 0 0 26px; padding: 0; display: flex; flex-direction: column; gap: 10px; flex-grow: 1; }
.pr-plan-features li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: var(--text-1); }
.pr-plan-cta { justify-content: center; width: 100%; }

.pr-estimator-footnote { display: flex; gap: 12px; align-items: flex-start; margin-top: 26px; border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 18px 22px; background: #ffffff; }
.pr-estimator-footnote p { margin: 0; font-size: 13.5px; color: var(--text-2); }
.pr-estimator-footnote a { color: var(--accent-orange); text-decoration: none; }

/* FAQ */
.pr-faq-section { padding-top: 90px; }
.pr-faq-title { font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin: 0 0 16px; color: var(--text-0); }
.pr-faq-list { display: flex; flex-direction: column; gap: 18px; max-width: 900px; margin: 0 auto 60px; }
.pr-faq-item { border: 1px solid var(--card-border); border-radius: var(--radius-lg); background: var(--card); overflow: hidden; box-shadow: var(--shadow-sm); }
.pr-faq-head { width: 100%; display: flex; align-items: center; gap: 20px; text-align: left; background: transparent; border: none; color: var(--text-0); cursor: pointer; padding: 26px 28px; font-family: var(--font-body); }
.pr-faq-num { font-family: var(--font-display); font-size: 13px; color: var(--text-2); border: 1px solid var(--card-border); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pr-faq-q { flex: 1; font-size: 17px; font-weight: 600; }
.pr-faq-arrow { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--card-border); display: flex; align-items: center; justify-content: center; transition: transform .25s ease; flex-shrink: 0; color: var(--text-1); }
.pr-faq-arrow--open { transform: rotate(180deg); }
.pr-faq-body { padding: 0 28px 26px 76px; }
.pr-faq-body p { margin: 0; color: var(--text-1); font-size: 15px; line-height: 1.65; }

/* Custom rollout box */
.pr-custom-rollout { max-width: 900px; margin: 0 auto; text-align: center; border: 1px solid var(--card-border); border-radius: var(--radius-lg); background: var(--card); padding: 56px 40px; box-shadow: var(--shadow-sm); }
.pr-rollout-icon { width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--card-border); display: flex; align-items: center; justify-content: center; margin: 0 auto 22px; font-size: 20px; background: var(--bg-1); }
.pr-custom-rollout h3 { font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2rem); margin: 0 0 14px; color: var(--text-0); }
.pr-custom-rollout p { color: var(--text-1); font-size: 15.5px; margin: 0 0 28px; max-width: 560px; margin-left: auto; margin-right: auto; }

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
.pr-footer-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; text-align: left; }
@media (max-width: 800px) { .ld-footer-grid { grid-template-columns: 1fr; gap: 34px; } .pr-footer-bottom { flex-direction: column; } }

.pr-address { display: flex; gap: 10px; align-items: flex-start; font-size: 13.5px; color: var(--text-1); margin: 16px 0 10px; }
.pr-email-row { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--text-1); margin-bottom: 18px; }
.pr-payment-icons { display: flex; gap: 14px; flex-wrap: wrap; }
.pr-payment-icons span { font-size: 12px; color: var(--text-2); border: 1px solid var(--card-border); border-radius: 6px; padding: 4px 10px; }
`;