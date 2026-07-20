// import React, { useEffect, useRef, useState } from "react";
// import Navbar from "./Navbar";
// import ContactModal from "./ContactModal";
// /**
//  * AI Training Landing Page — Light Theme
//  * Single-file React component, plain CSS (no Tailwind, no CSS modules).
//  * Drop into any CRA / Vite / Next project as a page or component.
//  */

// const BRAND_NAME = "Coursera Education";

// const WHY_CARDS = [
//   {
//     icon: "🎓",
//     title: "Built for AI Builders",
//     desc: "Not theory-heavy. We focus on practical patterns you can ship: prompts, RAG, agents, evaluation, and safety.",
//     points: ["Developer-first curriculum", "Real-world examples", "Production checklists", "Decision frameworks"],
//     stat: "6",
//     statLabel: "Core Tracks",
//   },
//   {
//     icon: "🎯",
//     title: "Tailored to Your Use Case",
//     desc: "Every program is customized: goals, domain constraints, data readiness, compliance, and your preferred tooling.",
//     points: ["Custom syllabus", "Company-specific exercises", "Architecture review", "Roadmap recommendations"],
//     stat: "100%",
//     statLabel: "Custom",
//   },
//   {
//     icon: "🛠️",
//     title: "Hands-on Workshops",
//     desc: "Your team builds during sessions: prototypes, templates, evaluation harnesses, and reusable playbooks.",
//     points: ["Labs + assignments", "Code & templates", "Live debugging", "Team enablement"],
//     stat: "Hands-on",
//     statLabel: "Format",
//   },
//   {
//     icon: "🛡️",
//     title: "Production Safety & Evaluation",
//     desc: "We train for reliability: guardrails, monitoring, prompt/RAG evaluation, and safe tool usage.",
//     points: ["Quality metrics", "Red-teaming basics", "Cost & latency tuning", "Governance-ready"],
//     stat: "E2E",
//     statLabel: "Delivery",
//   },
// ];

// const CAPABILITY_CARDS = [
//   {
//     icon: "🧠",
//     tag: "High",
//     tagLabel: "Relevance",
//     title: "Context-Aware AI Conversations",
//     desc: "Understands intent, history, and tone",
//     points: ["Conversation-level memory", "Intent & sentiment detection", "Context-based replies (not scripted)", "Personalized responses at scale"],
//     accent: "orange",
//   },
//   {
//     icon: "🌐",
//     tag: "25+",
//     tagLabel: "Languages",
//     title: "Multilingual & Cultural Intelligence",
//     desc: "Native-level conversations in 25+ languages",
//     points: ["Automatic language detection", "Cultural context awareness", "Human-like translations", "Mixed-language conversation handling"],
//     accent: "teal",
//   },
//   {
//     icon: "⚡",
//     tag: "Fast",
//     tagLabel: "Handoffs",
//     title: "AI-Driven Smart Routing",
//     desc: "Decides when AI is enough — and when humans are needed",
//     points: ["Intent & complexity scoring", "Auto escalation to agents", "VIP & priority detection", "Skill-based agent matching"],
//     accent: "green",
//   },
//   {
//     icon: "⏱️",
//     tag: "Ongoing",
//     tagLabel: "Iteration",
//     title: "Continuous Improvement",
//     desc: "Gets better through feedback and evaluation",
//     points: ["Feedback loops", "Evaluation-based tuning", "Playbook updates", "Quality guardrails"],
//     accent: "pink",
//   },
//   {
//     icon: "📅",
//     tag: "24/7",
//     tagLabel: "Coverage",
//     title: "Always-On Availability",
//     desc: "Consistent experience across peaks and timezones",
//     points: ["24/7 coverage", "Peak-hour load handling", "Consistent tone & policy", "Human handover without friction"],
//     accent: "blue",
//   },
//   {
//     icon: "📊",
//     tag: "Clear",
//     tagLabel: "Reporting",
//     title: "Insights & Optimization",
//     desc: "Turns conversations into measurable intelligence",
//     points: ["Resolution & success rates", "AI vs human performance", "CSAT signals", "Optimization recommendations"],
//     accent: "lime",
//   },
// ];

// const OUTCOME_STATS = [
//   { icon: "⏱️", value: "1–2 days", label: "Time-to-Prototype", sub: "Faster kickoff" },
//   { icon: "🛡️", value: "Playbooks", label: "Adoption Readiness", sub: "Reusable assets" },
//   { icon: "🎯", value: "Hands-on", label: "Team Confidence", sub: "Build while learning" },
//   { icon: "📈", value: "Cost + Latency", label: "Optimization Focus", sub: "Production mindset" },
// ];

// function useReveal() {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const obs = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           obs.disconnect();
//         }
//       },
//       { threshold: 0.15 }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, []);
//   return [ref, visible];
// }

// function Reveal({ children, className = "", delay = 0 }) {
//   const [ref, visible] = useReveal();
//   return (
//     <div
//       ref={ref}
//       className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
//       style={{ transitionDelay: `${delay}ms` }}
//     >
//       {children}
//     </div>
//   );
// }

// export default function LandingPage() {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <div className="ld-root">
//       <style>{CSS}</style>

//       <Navbar brandName={BRAND_NAME} scrolled={scrolled} />

//       {/* HERO */}
//       <section className="ld-hero" id="top">
//         <div className="ld-hero-bg" aria-hidden="true" />
//         <Reveal className="ld-hero-content">
//           <div className="ld-eyebrow">
//             <span className="ld-dot" /> Hands-on workshops &nbsp;·&nbsp; Tailored to your stack
//           </div>
//           <h1 className="ld-hero-title">Build AI Systems That Actually Ship</h1>
//           <p className="ld-hero-sub">Practical training for teams building real products</p>

//           <div className="ld-hero-cta">
//             <a href="#contact" className="ld-btn ld-btn--primary">
//               Get in Touch <span aria-hidden>→</span>
//             </a>
//             <a href="#capabilities" className="ld-btn ld-btn--ghost">
//               See Capabilities
//             </a>
//           </div>
//         </Reveal>

//         <Reveal delay={150} className="ld-mock-wrap">
//           <div className="ld-mock">
//             <div className="ld-mock-titlebar">
//               <span className="dot red" />
//               <span className="dot yellow" />
//               <span className="dot green" />
//               <div className="ld-mock-url">AI Training Dashboard</div>
//             </div>
//             <div className="ld-mock-body">
//               <div className="ld-mock-topbar">
//                 <div>
//                   <div className="ld-mock-h">AI Training Dashboard</div>
//                   <div className="ld-mock-sub">Welcome back, Alex!</div>
//                 </div>
//                 <div className="ld-mock-avatar">
//                   <div className="ld-avatar-circle">A</div>
//                   <div>
//                     <div className="ld-mock-name">Alex Morgan</div>
//                     <div className="ld-mock-role">Lead Instructor</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="ld-mock-stats">
//                 <div className="ld-stat-card">
//                   <div className="ld-stat-label">Active Students</div>
//                   <div className="ld-stat-value">247 <span className="up">+12%</span></div>
//                 </div>
//                 <div className="ld-stat-card">
//                   <div className="ld-stat-label">Training Modules</div>
//                   <div className="ld-stat-value">12 <span className="up">+2 new</span></div>
//                 </div>
//                 <div className="ld-stat-card">
//                   <div className="ld-stat-label">Completion Rate</div>
//                   <div className="ld-stat-value">89.3%</div>
//                 </div>
//                 <div className="ld-stat-card">
//                   <div className="ld-stat-label">Live Sessions</div>
//                   <div className="ld-stat-value">03 <span className="live">● Live</span></div>
//                 </div>
//               </div>

//               <div className="ld-mock-chart">
//                 <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="ld-chart-svg">
//                   <polyline
//                     fill="none"
//                     stroke="var(--accent-orange)"
//                     strokeWidth="2.5"
//                     points="0,80 50,40 100,55 150,30 200,60 250,35 300,50 350,20 400,45"
//                   />
//                   <polyline
//                     fill="none"
//                     stroke="var(--accent-teal)"
//                     strokeWidth="2.5"
//                     points="0,100 50,70 100,30 150,50 200,25 250,55 300,20 350,45 400,15"
//                   />
//                   <polyline
//                     fill="none"
//                     stroke="var(--accent-blue)"
//                     strokeWidth="2.5"
//                     points="0,110 50,95 100,90 150,70 200,85 250,60 300,75 350,55 400,65"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </Reveal>
//       </section>

//       {/* WHY */}
//       <section className="ld-section" id="features">
//         <Reveal className="ld-section-head">
//           <div className="ld-pill">
//             <span className="ld-dot" /> Training-first. Outcome-driven.
//           </div>
//           <h2>Why {BRAND_NAME}?</h2>
//           <p>Hands-on, custom AI training designed around your team, your stack, and your real production goals.</p>
//         </Reveal>

//         <div className="ld-grid ld-grid--4">
//           {WHY_CARDS.map((c, i) => (
//             <Reveal key={c.title} delay={i * 90} className="ld-card">
//               <div className="ld-card-icon">{c.icon}</div>
//               <h3>{c.title}</h3>
//               <p className="ld-card-desc">{c.desc}</p>
//               <ul className="ld-check-list">
//                 {c.points.map((p) => (
//                   <li key={p}>
//                     <span className="ld-check">✓</span> {p}
//                   </li>
//                 ))}
//               </ul>
//               <div className="ld-card-stat">
//                 <div className="ld-card-stat-value">{c.stat}</div>
//                 <div className="ld-card-stat-label">{c.statLabel}</div>
//               </div>
//             </Reveal>
//           ))}
//         </div>
//       </section>

//       {/* CAPABILITIES */}
//       <section className="ld-section ld-section--dark" id="capabilities">
//         <Reveal className="ld-section-head">
//           <div className="ld-pill">
//             <span className="ld-dot ld-dot--orange" /> Platform Capabilities
//           </div>
//           <h2>Advanced AI Capabilities</h2>
//           <p>Smart, consistent, measurable conversations across channels — with routing, evaluation and insights built in.</p>
//         </Reveal>

//         <div className="ld-grid ld-grid--3">
//           {CAPABILITY_CARDS.map((c, i) => (
//             <Reveal key={c.title} delay={i * 70} className={`ld-cap-card accent-${c.accent}`}>
//               <div className="ld-cap-top">
//                 <div className="ld-cap-icon">{c.icon}</div>
//                 <div className="ld-cap-tag">
//                   <div className="ld-cap-tag-value">{c.tag}</div>
//                   <div className="ld-cap-tag-label">{c.tagLabel}</div>
//                 </div>
//               </div>
//               <h3>{c.title}</h3>
//               <p className="ld-card-desc">{c.desc}</p>
//               <ul className="ld-check-list ld-check-list--tick">
//                 {c.points.map((p) => (
//                   <li key={p}>
//                     <span className="ld-check ld-check--tick">✓</span> {p}
//                   </li>
//                 ))}
//               </ul>
//             </Reveal>
//           ))}
//         </div>
//       </section>

//       {/* OUTCOMES */}
//       <section className="ld-section" id="outcomes">
//         <Reveal className="ld-section-head">
//           <h2>Training Outcomes That Matter</h2>
//           <p>Workshops are designed to leave your team with prototypes, templates, and a clear path to production.</p>
//         </Reveal>

//         <div className="ld-grid ld-grid--4">
//           {OUTCOME_STATS.map((s, i) => (
//             <Reveal key={s.label} delay={i * 80} className="ld-outcome-card">
//               <div className="ld-outcome-icon">{s.icon}</div>
//               <div className="ld-outcome-value">{s.value}</div>
//               <div className="ld-outcome-label">{s.label}</div>
//               <div className="ld-outcome-sub">{s.sub}</div>
//             </Reveal>
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="ld-cta" id="contact">
//         <Reveal className="ld-cta-inner">
//           <h2>Get a Custom AI Training Plan</h2>
//           <p>Tell us your team, tools, and goals — we&rsquo;ll propose a tailored curriculum and a hands-on workshop format.</p>
//           <div className="ld-hero-cta ld-cta-buttons">
//             <a href="#contact" className="ld-btn ld-btn--primary">
//               Get in Touch <span aria-hidden>→</span>
//             </a>
//             <a href="#contact" className="ld-btn ld-btn--outline">
//               Request Syllabus
//             </a>
//           </div>
//           <div className="ld-cta-note">
//             <span className="ld-check">✓</span> Tailor-made curriculum &nbsp;•&nbsp; Hands-on labs &nbsp;•&nbsp; Delivered as workshops
//           </div>
//         </Reveal>
//       </section>

//       {/* FOOTER */}
//       <footer className="ld-footer">
//         <div className="ld-footer-grid">
//           <div>
//             <a className="ld-logo" href="/">
//               <span className="ld-logo-mark">◤</span> {BRAND_NAME}
//             </a>
//             <p className="ld-footer-desc">
//               Private, instructor-led AI training with a modern LMS. Learn fast with hands-on lessons, projects, and real feedback.
//             </p>
//           </div>
//           <div>
//             <h4>Policies</h4>
//             <p className="ld-footer-desc">Review our legal and privacy documents. You can also manage your cookie preferences anytime.</p>
//             <ul className="ld-footer-links">
//               <li><a href="#">Privacy Policy</a></li>
//               <li><a href="#">Terms and Conditions</a></li>
//               <li><a href="#">Cancellation Policy</a></li>
//             </ul>
//           </div>
//           <div>
//             <h4>Need help?</h4>
//             <p className="ld-footer-desc">Email us for training guidance, scheduling, or any account questions.</p>
//             <a href="mailto:hello@brandname.com" className="ld-btn ld-btn--primary ld-btn--sm">Email Support</a>
//             <p className="ld-footer-note">Typical response time: 1–2 business days.</p>
//           </div>
//         </div>
//         <div className="ld-footer-bottom">© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</div>
//       </footer>
//     </div>
//   );
// }

// const CSS = `
// :root {
//   --bg-0: #ffffff;
//   --bg-1: #f9f0e7;
//   --bg-2: #f3e2d0;
//   --card: #ffffff;
//   --card-border: rgba(122,23,53,0.12);
//   --text-0: #241417;
//   --text-1: #6b5a56;
//   --text-2: #a3908b;
//   --accent-orange: #7a1735;
//   --accent-teal: #c1922f;
//   --accent-green: #16a34a;
//   --accent-pink: #a63d63;
//   --accent-blue: #7a4a1f;
//   --accent-lime: #b8892f;
//   --gradient: linear-gradient(90deg, var(--accent-orange), var(--accent-teal));
//   --radius-lg: 22px;
//   --radius-md: 16px;
//   --shadow-sm: 0 1px 2px rgba(36,20,23,0.04);
//   --shadow-md: 0 14px 34px -18px rgba(36,20,23,0.20);
//   --font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;
//   --font-body: 'Inter', system-ui, -apple-system, sans-serif;
// }

// .ld-root {
//   background: var(--bg-0);
//   color: var(--text-0);
//   font-family: var(--font-body);
//   overflow-x: hidden;
//   line-height: 1.5;
// }

// .ld-root * { box-sizing: border-box; }

// /* reveal animation */
// .reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
// .reveal-visible { opacity: 1; transform: translateY(0); }
// @media (prefers-reduced-motion: reduce) {
//   .reveal { opacity: 1; transform: none; transition: none; }
// }

// /* NAV */
// .ld-nav {
//   position: sticky; top: 0; z-index: 50;
//   padding: 18px 24px;
//   transition: background .3s ease, backdrop-filter .3s ease, padding .3s ease;
// }
// .ld-nav--scrolled {
//   padding: 10px 24px;
//   background: rgba(255,255,255,0.85);
//   backdrop-filter: blur(14px);
//   border-bottom: 1px solid var(--card-border);
// }
// .ld-nav-inner {
//   max-width: 1180px; margin: 0 auto;
//   display: flex; align-items: center; justify-content: space-between;
//   background: #ffffff;
//   border: 1px solid var(--card-border);
//   border-radius: 999px;
//   padding: 10px 14px 10px 20px;
//   box-shadow: var(--shadow-sm);
// }
// .ld-logo {
//   font-family: var(--font-display);
//   font-weight: 700; letter-spacing: 0.02em;
//   color: var(--text-0); text-decoration: none;
//   display: flex; align-items: center; gap: 8px; font-size: 15px;
// }
// .ld-logo-mark {
//   background: var(--gradient);
//   -webkit-background-clip: text; background-clip: text; color: transparent;
//   font-size: 18px;
// }
// .ld-nav-links { display: flex; gap: 28px; }
// .ld-nav-links a {
//   color: var(--text-1); text-decoration: none; font-size: 14.5px; font-weight: 500;
//   transition: color .2s ease;
// }
// .ld-nav-links a:hover { color: var(--text-0); }

// .ld-btn {
//   display: inline-flex; align-items: center; gap: 8px;
//   padding: 12px 22px; border-radius: 999px;
//   font-weight: 600; font-size: 14.5px; text-decoration: none;
//   border: 1px solid transparent; cursor: pointer;
//   transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
// }
// .ld-btn:hover { transform: translateY(-1px); }
// .ld-btn:focus-visible { outline: 2px solid var(--accent-teal); outline-offset: 3px; }
// .ld-btn--sm { padding: 9px 16px; font-size: 13.5px; }
// .ld-btn--primary { background: var(--gradient); color: #ffffff; box-shadow: 0 10px 24px -8px rgba(122,23,53,0.45); }
// .ld-btn--ghost { background: transparent; color: var(--text-0); border-color: var(--card-border); }
// .ld-btn--ghost:hover { background: var(--bg-1); }
// .ld-btn--outline { background: #ffffff; color: var(--text-0); border-color: var(--card-border); }
// .ld-btn--outline:hover { background: var(--bg-1); }

// /* HERO */
// .ld-hero {
//   position: relative;
//   padding: 90px 24px 60px;
//   max-width: 1180px; margin: 0 auto;
//   text-align: center;
// }
// .ld-hero-bg {
//   position: absolute; inset: -10% -20% auto -20%; height: 520px;
//   background: radial-gradient(60% 60% at 30% 20%, rgba(122,23,53,0.12), transparent 70%),
//               radial-gradient(50% 50% at 75% 10%, rgba(193,146,47,0.16), transparent 70%);
//   filter: blur(10px);
//   pointer-events: none;
//   z-index: 0;
// }
// .ld-hero-content { position: relative; z-index: 1; }
// .ld-eyebrow {
//   display: inline-flex; align-items: center; gap: 8px;
//   font-size: 13px; color: var(--text-1);
//   border: 1px solid var(--card-border);
//   background: #fff;
//   padding: 7px 16px; border-radius: 999px; margin-bottom: 26px;
// }
// .ld-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-teal); display: inline-block; }
// .ld-dot--orange { background: var(--accent-orange); }

// .ld-hero-title {
//   font-family: var(--font-display);
//   font-size: clamp(2.4rem, 5.4vw, 4.4rem);
//   font-weight: 700; letter-spacing: -0.02em; line-height: 1.06;
//   margin: 0 0 20px;
//   color: var(--text-0);
// }
// .ld-hero-sub {
//   font-size: clamp(1rem, 1.6vw, 1.25rem);
//   color: var(--text-1); max-width: 560px; margin: 0 auto 36px;
// }
// .ld-hero-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

// /* HERO MOCK */
// .ld-mock-wrap { margin-top: 64px; position: relative; z-index: 1; }
// .ld-mock {
//   max-width: 980px; margin: 0 auto;
//   border-radius: var(--radius-lg);
//   border: 1px solid var(--card-border);
//   background: #ffffff;
//   box-shadow: var(--shadow-md);
//   overflow: hidden;
//   text-align: left;
// }
// .ld-mock-titlebar {
//   display: flex; align-items: center; gap: 8px;
//   padding: 12px 16px; background: var(--bg-1); border-bottom: 1px solid var(--card-border);
// }
// .ld-mock-titlebar .dot { width: 10px; height: 10px; border-radius: 50%; }
// .dot.red { background: #ff5f56; } .dot.yellow { background: #ffbd2e; } .dot.green { background: #27c93f; }
// .ld-mock-url { margin-left: 14px; font-size: 12.5px; color: var(--text-2); }
// .ld-mock-body { padding: 26px 28px 30px; }
// .ld-mock-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
// .ld-mock-h { font-family: var(--font-display); font-weight: 700; font-size: 20px; }
// .ld-mock-sub { color: var(--text-2); font-size: 13px; }
// .ld-mock-avatar { display: flex; align-items: center; gap: 10px; }
// .ld-avatar-circle {
//   width: 34px; height: 34px; border-radius: 50%;
//   background: var(--gradient); display: flex; align-items: center; justify-content: center;
//   font-weight: 700; color: #ffffff; font-size: 13px;
// }
// .ld-mock-name { font-size: 13px; font-weight: 600; }
// .ld-mock-role { font-size: 11.5px; color: var(--text-2); }

// .ld-mock-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
// .ld-stat-card { background: var(--bg-1); border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 16px; }
// .ld-stat-label { font-size: 12px; color: var(--text-2); margin-bottom: 8px; }
// .ld-stat-value { font-family: var(--font-display); font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
// .ld-stat-value .up { font-size: 11px; color: var(--accent-teal); font-weight: 600; background: rgba(193,146,47,0.12); padding: 2px 7px; border-radius: 999px; }
// .ld-stat-value .live { font-size: 11px; color: #dc2626; font-weight: 600; }

// .ld-mock-chart { background: var(--bg-1); border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 16px; }
// .ld-chart-svg { width: 100%; height: 120px; display: block; }

// @media (max-width: 720px) {
//   .ld-mock-stats { grid-template-columns: repeat(2, 1fr); }
//   .ld-nav-links { display: none; }
// }

// /* SECTIONS */
// .ld-section { max-width: 1180px; margin: 0 auto; padding: 96px 24px; }
// .ld-section--dark { max-width: 100%; background: var(--bg-1); border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border); }
// .ld-section--dark > * { max-width: 1180px; margin-left: auto; margin-right: auto; }

// .ld-section-head { text-align: center; max-width: 640px; margin: 0 auto 56px; }
// .ld-pill {
//   display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-1);
//   border: 1px solid var(--card-border); background: #fff; padding: 7px 16px; border-radius: 999px; margin-bottom: 20px;
// }
// .ld-section-head h2 { font-family: var(--font-display); font-size: clamp(1.9rem, 3.4vw, 2.6rem); font-weight: 700; margin: 0 0 14px; letter-spacing: -0.01em; color: var(--text-0); }
// .ld-section-head p { color: var(--text-1); font-size: 16.5px; }

// .ld-grid { display: grid; gap: 22px; }
// .ld-grid--4 { grid-template-columns: repeat(4, 1fr); }
// .ld-grid--3 { grid-template-columns: repeat(3, 1fr); }
// @media (max-width: 980px) { .ld-grid--4, .ld-grid--3 { grid-template-columns: repeat(2, 1fr); } }
// @media (max-width: 620px) { .ld-grid--4, .ld-grid--3 { grid-template-columns: 1fr; } }

// .ld-card {
//   background: var(--bg-1); border: 1px solid var(--card-border); border-radius: var(--radius-lg);
//   padding: 26px 22px; display: flex; flex-direction: column;
//   box-shadow: var(--shadow-sm);
//   transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease;
// }
// .ld-card:hover { border-color: rgba(122,23,53,0.28); transform: translateY(-3px); box-shadow: var(--shadow-md); }
// .ld-card-icon { font-size: 26px; margin-bottom: 16px; }
// .ld-card h3 { font-family: var(--font-display); font-size: 18px; margin: 0 0 10px; }
// .ld-card-desc { color: var(--text-1); font-size: 14px; margin: 0 0 16px; flex-grow: 0; }
// .ld-check-list { list-style: none; margin: 0 0 20px; padding: 0; display: flex; flex-direction: column; gap: 9px; }
// .ld-check-list li { display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: var(--text-1); }
// .ld-check { color: var(--accent-orange); font-weight: 700; font-size: 12px; }
// .ld-check--tick { color: var(--accent-teal); }
// .ld-card-stat { margin-top: auto; border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 14px; text-align: center; background: #ffffff; }
// .ld-card-stat-value { font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--accent-orange); }
// .ld-card-stat-label { font-size: 10.5px; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }

// /* capability cards */
// .ld-cap-card {
//   background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-lg);
//   padding: 26px; border-top: 3px solid transparent;
//   box-shadow: var(--shadow-sm);
//   transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
// }
// .ld-cap-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
// .accent-orange { border-top-color: var(--accent-orange); }
// .accent-teal { border-top-color: var(--accent-teal); }
// .accent-green { border-top-color: var(--accent-green); }
// .accent-pink { border-top-color: var(--accent-pink); }
// .accent-blue { border-top-color: var(--accent-blue); }
// .accent-lime { border-top-color: var(--accent-lime); }
// .ld-cap-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
// .ld-cap-icon {
//   width: 44px; height: 44px; border-radius: 12px; background: var(--bg-1);
//   display: flex; align-items: center; justify-content: center; font-size: 20px;
// }
// .ld-cap-tag { text-align: right; }
// .ld-cap-tag-value { font-family: var(--font-display); font-weight: 700; font-size: 20px; }
// .ld-cap-tag-label { font-size: 11px; color: var(--text-2); }
// .ld-cap-card h3 { font-family: var(--font-display); font-size: 17px; margin: 0 0 8px; }

// /* outcome cards */
// .ld-outcome-card {
//   background: var(--bg-1); border: 1px solid var(--card-border); border-radius: var(--radius-lg);
//   padding: 30px 20px; text-align: center;
//   box-shadow: var(--shadow-sm);
// }
// .ld-outcome-icon { font-size: 22px; margin-bottom: 14px; }
// .ld-outcome-value { font-family: var(--font-display); font-size: 24px; font-weight: 700; margin-bottom: 6px; color: var(--accent-orange); }
// .ld-outcome-label { font-size: 14px; color: var(--text-1); }
// .ld-outcome-sub { font-size: 12px; color: var(--text-2); margin-top: 2px; }

// /* CTA */
// .ld-cta { padding: 100px 24px; text-align: center; background: var(--bg-1); border-top: 1px solid var(--card-border); }
// .ld-cta-inner { max-width: 620px; margin: 0 auto; }
// .ld-cta h2 { font-family: var(--font-display); font-size: clamp(1.9rem, 3.4vw, 2.6rem); margin: 0 0 14px; color: var(--text-0); }
// .ld-cta p { color: var(--text-1); font-size: 16.5px; margin-bottom: 34px; }
// .ld-cta-buttons { margin-bottom: 20px; }
// .ld-cta-note { font-size: 13px; color: var(--text-2); display: flex; align-items: center; justify-content: center; gap: 6px; }

// /* FOOTER */
// .ld-footer { padding: 70px 24px 30px; background: var(--bg-1); border-top: 1px solid var(--card-border); }
// .ld-footer-grid { max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 50px; }
// .ld-footer h4 { font-size: 14px; margin: 0 0 12px; color: var(--text-0); }
// .ld-footer-desc { color: var(--text-2); font-size: 13.5px; line-height: 1.6; margin: 12px 0; }
// .ld-footer-links { list-style: none; padding: 0; margin: 10px 0 0; display: flex; flex-direction: column; gap: 8px; }
// .ld-footer-links a { color: var(--text-1); text-decoration: none; font-size: 13.5px; }
// .ld-footer-links a:hover { color: var(--text-0); }
// .ld-footer-note { font-size: 12px; color: var(--text-2); margin-top: 10px; }
// .ld-footer-bottom { max-width: 1180px; margin: 50px auto 0; padding-top: 24px; border-top: 1px solid var(--card-border); font-size: 12.5px; color: var(--text-2); text-align: center; }
// @media (max-width: 800px) { .ld-footer-grid { grid-template-columns: 1fr; gap: 34px; } }
// `;

import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import ContactModal from "./ContactModel";

/**
 * AI Training Landing Page — Light Theme
 * Single-file React component, plain CSS (no Tailwind, no CSS modules).
 * Drop into any CRA / Vite / Next project as a page or component.
 */

const BRAND_NAME = "Coursera Education";

const WHY_CARDS = [
  {
    icon: "🎓",
    title: "Built for AI Builders",
    desc: "Not theory-heavy. We focus on practical patterns you can ship: prompts, RAG, agents, evaluation, and safety.",
    points: ["Developer-first curriculum", "Real-world examples", "Production checklists", "Decision frameworks"],
    stat: "6",
    statLabel: "Core Tracks",
  },
  {
    icon: "🎯",
    title: "Tailored to Your Use Case",
    desc: "Every program is customized: goals, domain constraints, data readiness, compliance, and your preferred tooling.",
    points: ["Custom syllabus", "Company-specific exercises", "Architecture review", "Roadmap recommendations"],
    stat: "100%",
    statLabel: "Custom",
  },
  {
    icon: "🛠️",
    title: "Hands-on Workshops",
    desc: "Your team builds during sessions: prototypes, templates, evaluation harnesses, and reusable playbooks.",
    points: ["Labs + assignments", "Code & templates", "Live debugging", "Team enablement"],
    stat: "Hands-on",
    statLabel: "Format",
  },
  {
    icon: "🛡️",
    title: "Production Safety & Evaluation",
    desc: "We train for reliability: guardrails, monitoring, prompt/RAG evaluation, and safe tool usage.",
    points: ["Quality metrics", "Red-teaming basics", "Cost & latency tuning", "Governance-ready"],
    stat: "E2E",
    statLabel: "Delivery",
  },
];

const CAPABILITY_CARDS = [
  {
    icon: "🧠",
    tag: "High",
    tagLabel: "Relevance",
    title: "Context-Aware AI Conversations",
    desc: "Understands intent, history, and tone",
    points: ["Conversation-level memory", "Intent & sentiment detection", "Context-based replies (not scripted)", "Personalized responses at scale"],
    accent: "orange",
  },
  {
    icon: "🌐",
    tag: "25+",
    tagLabel: "Languages",
    title: "Multilingual & Cultural Intelligence",
    desc: "Native-level conversations in 25+ languages",
    points: ["Automatic language detection", "Cultural context awareness", "Human-like translations", "Mixed-language conversation handling"],
    accent: "teal",
  },
  {
    icon: "⚡",
    tag: "Fast",
    tagLabel: "Handoffs",
    title: "AI-Driven Smart Routing",
    desc: "Decides when AI is enough — and when humans are needed",
    points: ["Intent & complexity scoring", "Auto escalation to agents", "VIP & priority detection", "Skill-based agent matching"],
    accent: "green",
  },
  {
    icon: "⏱️",
    tag: "Ongoing",
    tagLabel: "Iteration",
    title: "Continuous Improvement",
    desc: "Gets better through feedback and evaluation",
    points: ["Feedback loops", "Evaluation-based tuning", "Playbook updates", "Quality guardrails"],
    accent: "pink",
  },
  {
    icon: "📅",
    tag: "24/7",
    tagLabel: "Coverage",
    title: "Always-On Availability",
    desc: "Consistent experience across peaks and timezones",
    points: ["24/7 coverage", "Peak-hour load handling", "Consistent tone & policy", "Human handover without friction"],
    accent: "blue",
  },
  {
    icon: "📊",
    tag: "Clear",
    tagLabel: "Reporting",
    title: "Insights & Optimization",
    desc: "Turns conversations into measurable intelligence",
    points: ["Resolution & success rates", "AI vs human performance", "CSAT signals", "Optimization recommendations"],
    accent: "lime",
  },
];

const OUTCOME_STATS = [
  { icon: "⏱️", value: "1–2 days", label: "Time-to-Prototype", sub: "Faster kickoff" },
  { icon: "🛡️", value: "Playbooks", label: "Adoption Readiness", sub: "Reusable assets" },
  { icon: "🎯", value: "Hands-on", label: "Team Confidence", sub: "Build while learning" },
  { icon: "📈", value: "Cost + Latency", label: "Optimization Focus", sub: "Production mindset" },
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

export default function LandingPage() {
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

      <Navbar brandName={BRAND_NAME} scrolled={scrolled} onCtaClick={() => setContactOpen(true)} />

      {/* HERO */}
      <section className="ld-hero" id="top">
        <div className="ld-hero-bg" aria-hidden="true" />
        <Reveal className="ld-hero-content">
          <div className="ld-eyebrow">
            <span className="ld-dot" /> Hands-on workshops &nbsp;·&nbsp; Tailored to your stack
          </div>
          <h1 className="ld-hero-title">Build AI Systems That Actually Ship</h1>
          <p className="ld-hero-sub">Practical training for teams building real products</p>

          <div className="ld-hero-cta">
            <button className="ld-btn ld-btn--primary" onClick={() => setContactOpen(true)}>
              Get in Touch <span aria-hidden>→</span>
            </button>
            <a href="#capabilities" className="ld-btn ld-btn--ghost">
              See Capabilities
            </a>
          </div>
        </Reveal>

        <Reveal delay={150} className="ld-mock-wrap">
          <div className="ld-mock">
            <div className="ld-mock-titlebar">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
              <div className="ld-mock-url">AI Training Dashboard</div>
            </div>
            <div className="ld-mock-body">
              <div className="ld-mock-topbar">
                <div>
                  <div className="ld-mock-h">AI Training Dashboard</div>
                  <div className="ld-mock-sub">Welcome back, Alex!</div>
                </div>
                <div className="ld-mock-avatar">
                  <div className="ld-avatar-circle">A</div>
                  <div>
                    <div className="ld-mock-name">Alex Morgan</div>
                    <div className="ld-mock-role">Lead Instructor</div>
                  </div>
                </div>
              </div>

              <div className="ld-mock-stats">
                <div className="ld-stat-card">
                  <div className="ld-stat-label">Active Students</div>
                  <div className="ld-stat-value">247 <span className="up">+12%</span></div>
                </div>
                <div className="ld-stat-card">
                  <div className="ld-stat-label">Training Modules</div>
                  <div className="ld-stat-value">12 <span className="up">+2 new</span></div>
                </div>
                <div className="ld-stat-card">
                  <div className="ld-stat-label">Completion Rate</div>
                  <div className="ld-stat-value">89.3%</div>
                </div>
                <div className="ld-stat-card">
                  <div className="ld-stat-label">Live Sessions</div>
                  <div className="ld-stat-value">03 <span className="live">● Live</span></div>
                </div>
              </div>

              <div className="ld-mock-chart">
                <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="ld-chart-svg">
                  <polyline
                    fill="none"
                    stroke="var(--accent-orange)"
                    strokeWidth="2.5"
                    points="0,80 50,40 100,55 150,30 200,60 250,35 300,50 350,20 400,45"
                  />
                  <polyline
                    fill="none"
                    stroke="var(--accent-teal)"
                    strokeWidth="2.5"
                    points="0,100 50,70 100,30 150,50 200,25 250,55 300,20 350,45 400,15"
                  />
                  <polyline
                    fill="none"
                    stroke="var(--accent-blue)"
                    strokeWidth="2.5"
                    points="0,110 50,95 100,90 150,70 200,85 250,60 300,75 350,55 400,65"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* WHY */}
      <section className="ld-section" id="features">
        <Reveal className="ld-section-head">
          <div className="ld-pill">
            <span className="ld-dot" /> Training-first. Outcome-driven.
          </div>
          <h2>Why {BRAND_NAME}?</h2>
          <p>Hands-on, custom AI training designed around your team, your stack, and your real production goals.</p>
        </Reveal>

        <div className="ld-grid ld-grid--4">
          {WHY_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 90} className="ld-card">
              <div className="ld-card-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p className="ld-card-desc">{c.desc}</p>
              <ul className="ld-check-list">
                {c.points.map((p) => (
                  <li key={p}>
                    <span className="ld-check">✓</span> {p}
                  </li>
                ))}
              </ul>
              <div className="ld-card-stat">
                <div className="ld-card-stat-value">{c.stat}</div>
                <div className="ld-card-stat-label">{c.statLabel}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="ld-section ld-section--dark" id="capabilities">
        <Reveal className="ld-section-head">
          <div className="ld-pill">
            <span className="ld-dot ld-dot--orange" /> Platform Capabilities
          </div>
          <h2>Advanced AI Capabilities</h2>
          <p>Smart, consistent, measurable conversations across channels — with routing, evaluation and insights built in.</p>
        </Reveal>

        <div className="ld-grid ld-grid--3">
          {CAPABILITY_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 70} className={`ld-cap-card accent-${c.accent}`}>
              <div className="ld-cap-top">
                <div className="ld-cap-icon">{c.icon}</div>
                <div className="ld-cap-tag">
                  <div className="ld-cap-tag-value">{c.tag}</div>
                  <div className="ld-cap-tag-label">{c.tagLabel}</div>
                </div>
              </div>
              <h3>{c.title}</h3>
              <p className="ld-card-desc">{c.desc}</p>
              <ul className="ld-check-list ld-check-list--tick">
                {c.points.map((p) => (
                  <li key={p}>
                    <span className="ld-check ld-check--tick">✓</span> {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="ld-section" id="outcomes">
        <Reveal className="ld-section-head">
          <h2>Training Outcomes That Matter</h2>
          <p>Workshops are designed to leave your team with prototypes, templates, and a clear path to production.</p>
        </Reveal>

        <div className="ld-grid ld-grid--4">
          {OUTCOME_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="ld-outcome-card">
              <div className="ld-outcome-icon">{s.icon}</div>
              <div className="ld-outcome-value">{s.value}</div>
              <div className="ld-outcome-label">{s.label}</div>
              <div className="ld-outcome-sub">{s.sub}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ld-cta" id="contact">
        <Reveal className="ld-cta-inner">
          <h2>Get a Custom AI Training Plan</h2>
          <p>Tell us your team, tools, and goals — we&rsquo;ll propose a tailored curriculum and a hands-on workshop format.</p>
          <div className="ld-hero-cta ld-cta-buttons">
            <button className="ld-btn ld-btn--primary" onClick={() => setContactOpen(true)}>
              Get in Touch <span aria-hidden>→</span>
            </button>
            <button className="ld-btn ld-btn--outline" onClick={() => setContactOpen(true)}>
              Request Syllabus
            </button>
          </div>
          <div className="ld-cta-note">
            <span className="ld-check">✓</span> Tailor-made curriculum &nbsp;•&nbsp; Hands-on labs &nbsp;•&nbsp; Delivered as workshops
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
              Private, instructor-led AI training with a modern LMS. Learn fast with hands-on lessons, projects, and real feedback.
            </p>
          </div>
          <div>
            <h4>Policies</h4>
            <p className="ld-footer-desc">Review our legal and privacy documents. You can also manage your cookie preferences anytime.</p>
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

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
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
  --accent-pink: #a63d63;
  --accent-blue: #7a4a1f;
  --accent-lime: #b8892f;
  --gradient: linear-gradient(90deg, var(--accent-orange), var(--accent-teal));
  --radius-lg: 22px;
  --radius-md: 16px;
  --shadow-sm: 0 1px 2px rgba(36,20,23,0.04);
  --shadow-md: 0 14px 34px -18px rgba(36,20,23,0.20);
  --font-display: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
}

.ld-root {
  background: var(--bg-0);
  color: var(--text-0);
  font-family: var(--font-body);
  overflow-x: hidden;
  line-height: 1.5;
}

.ld-root * { box-sizing: border-box; }

/* reveal animation */
.reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
.reveal-visible { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}

/* NAV */
.ld-nav {
  position: sticky; top: 0; z-index: 50;
  padding: 18px 24px;
  transition: background .3s ease, backdrop-filter .3s ease, padding .3s ease;
}
.ld-nav--scrolled {
  padding: 10px 24px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--card-border);
}
.ld-nav-inner {
  max-width: 1180px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  background: #ffffff;
  border: 1px solid var(--card-border);
  border-radius: 999px;
  padding: 10px 14px 10px 20px;
  box-shadow: var(--shadow-sm);
}
.ld-logo {
  font-family: var(--font-display);
  font-weight: 700; letter-spacing: 0.02em;
  color: var(--text-0); text-decoration: none;
  display: flex; align-items: center; gap: 8px; font-size: 15px;
}
.ld-logo-mark {
  background: var(--gradient);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  font-size: 18px;
}
.ld-nav-links { display: flex; gap: 28px; }
.ld-nav-links a {
  color: var(--text-1); text-decoration: none; font-size: 14.5px; font-weight: 500;
  transition: color .2s ease;
}
.ld-nav-links a:hover { color: var(--text-0); }

.ld-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 22px; border-radius: 999px;
  font-weight: 600; font-size: 14.5px; text-decoration: none;
  border: 1px solid transparent; cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  font-family: var(--font-body);
}
.ld-btn:hover { transform: translateY(-1px); }
.ld-btn:focus-visible { outline: 2px solid var(--accent-teal); outline-offset: 3px; }
.ld-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
.ld-btn--sm { padding: 9px 16px; font-size: 13.5px; }
.ld-btn--primary { background: var(--gradient); color: #ffffff; box-shadow: 0 10px 24px -8px rgba(122,23,53,0.45); }
.ld-btn--ghost { background: transparent; color: var(--text-0); border-color: var(--card-border); }
.ld-btn--ghost:hover { background: var(--bg-1); }
.ld-btn--outline { background: #ffffff; color: var(--text-0); border-color: var(--card-border); }
.ld-btn--outline:hover { background: var(--bg-1); }

/* HERO */
.ld-hero {
  position: relative;
  padding: 90px 24px 60px;
  max-width: 1180px; margin: 0 auto;
  text-align: center;
}
.ld-hero-bg {
  position: absolute; inset: -10% -20% auto -20%; height: 520px;
  background: radial-gradient(60% 60% at 30% 20%, rgba(122,23,53,0.12), transparent 70%),
              radial-gradient(50% 50% at 75% 10%, rgba(193,146,47,0.16), transparent 70%);
  filter: blur(10px);
  pointer-events: none;
  z-index: 0;
}
.ld-hero-content { position: relative; z-index: 1; }
.ld-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--text-1);
  border: 1px solid var(--card-border);
  background: #fff;
  padding: 7px 16px; border-radius: 999px; margin-bottom: 26px;
}
.ld-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-teal); display: inline-block; }
.ld-dot--orange { background: var(--accent-orange); }

.ld-hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5.4vw, 4.4rem);
  font-weight: 700; letter-spacing: -0.02em; line-height: 1.06;
  margin: 0 0 20px;
  color: var(--text-0);
}
.ld-hero-sub {
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  color: var(--text-1); max-width: 560px; margin: 0 auto 36px;
}
.ld-hero-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

/* HERO MOCK */
.ld-mock-wrap { margin-top: 64px; position: relative; z-index: 1; }
.ld-mock {
  max-width: 980px; margin: 0 auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--card-border);
  background: #ffffff;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  text-align: left;
}
.ld-mock-titlebar {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px; background: var(--bg-1); border-bottom: 1px solid var(--card-border);
}
.ld-mock-titlebar .dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red { background: #ff5f56; } .dot.yellow { background: #ffbd2e; } .dot.green { background: #27c93f; }
.ld-mock-url { margin-left: 14px; font-size: 12.5px; color: var(--text-2); }
.ld-mock-body { padding: 26px 28px 30px; }
.ld-mock-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; }
.ld-mock-h { font-family: var(--font-display); font-weight: 700; font-size: 20px; }
.ld-mock-sub { color: var(--text-2); font-size: 13px; }
.ld-mock-avatar { display: flex; align-items: center; gap: 10px; }
.ld-avatar-circle {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--gradient); display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: #ffffff; font-size: 13px;
}
.ld-mock-name { font-size: 13px; font-weight: 600; }
.ld-mock-role { font-size: 11.5px; color: var(--text-2); }

.ld-mock-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
.ld-stat-card { background: var(--bg-1); border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 16px; }
.ld-stat-label { font-size: 12px; color: var(--text-2); margin-bottom: 8px; }
.ld-stat-value { font-family: var(--font-display); font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.ld-stat-value .up { font-size: 11px; color: var(--accent-teal); font-weight: 600; background: rgba(193,146,47,0.12); padding: 2px 7px; border-radius: 999px; }
.ld-stat-value .live { font-size: 11px; color: #dc2626; font-weight: 600; }

.ld-mock-chart { background: var(--bg-1); border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 16px; }
.ld-chart-svg { width: 100%; height: 120px; display: block; }

@media (max-width: 720px) {
  .ld-mock-stats { grid-template-columns: repeat(2, 1fr); }
  .ld-nav-links { display: none; }
}

/* SECTIONS */
.ld-section { max-width: 1180px; margin: 0 auto; padding: 96px 24px; }
.ld-section--dark { max-width: 100%; background: var(--bg-1); border-top: 1px solid var(--card-border); border-bottom: 1px solid var(--card-border); }
.ld-section--dark > * { max-width: 1180px; margin-left: auto; margin-right: auto; }

.ld-section-head { text-align: center; max-width: 640px; margin: 0 auto 56px; }
.ld-pill {
  display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-1);
  border: 1px solid var(--card-border); background: #fff; padding: 7px 16px; border-radius: 999px; margin-bottom: 20px;
}
.ld-section-head h2 { font-family: var(--font-display); font-size: clamp(1.9rem, 3.4vw, 2.6rem); font-weight: 700; margin: 0 0 14px; letter-spacing: -0.01em; color: var(--text-0); }
.ld-section-head p { color: var(--text-1); font-size: 16.5px; }

.ld-grid { display: grid; gap: 22px; }
.ld-grid--4 { grid-template-columns: repeat(4, 1fr); }
.ld-grid--3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 980px) { .ld-grid--4, .ld-grid--3 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px) { .ld-grid--4, .ld-grid--3 { grid-template-columns: 1fr; } }

.ld-card {
  background: var(--bg-1); border: 1px solid var(--card-border); border-radius: var(--radius-lg);
  padding: 26px 22px; display: flex; flex-direction: column;
  box-shadow: var(--shadow-sm);
  transition: border-color .25s ease, transform .25s ease, box-shadow .25s ease;
}
.ld-card:hover { border-color: rgba(122,23,53,0.28); transform: translateY(-3px); box-shadow: var(--shadow-md); }
.ld-card-icon { font-size: 26px; margin-bottom: 16px; }
.ld-card h3 { font-family: var(--font-display); font-size: 18px; margin: 0 0 10px; }
.ld-card-desc { color: var(--text-1); font-size: 14px; margin: 0 0 16px; flex-grow: 0; }
.ld-check-list { list-style: none; margin: 0 0 20px; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.ld-check-list li { display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: var(--text-1); }
.ld-check { color: var(--accent-orange); font-weight: 700; font-size: 12px; }
.ld-check--tick { color: var(--accent-teal); }
.ld-card-stat { margin-top: auto; border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 14px; text-align: center; background: #ffffff; }
.ld-card-stat-value { font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--accent-orange); }
.ld-card-stat-label { font-size: 10.5px; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 2px; }

/* capability cards */
.ld-cap-card {
  background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-lg);
  padding: 26px; border-top: 3px solid transparent;
  box-shadow: var(--shadow-sm);
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}
.ld-cap-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.accent-orange { border-top-color: var(--accent-orange); }
.accent-teal { border-top-color: var(--accent-teal); }
.accent-green { border-top-color: var(--accent-green); }
.accent-pink { border-top-color: var(--accent-pink); }
.accent-blue { border-top-color: var(--accent-blue); }
.accent-lime { border-top-color: var(--accent-lime); }
.ld-cap-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
.ld-cap-icon {
  width: 44px; height: 44px; border-radius: 12px; background: var(--bg-1);
  display: flex; align-items: center; justify-content: center; font-size: 20px;
}
.ld-cap-tag { text-align: right; }
.ld-cap-tag-value { font-family: var(--font-display); font-weight: 700; font-size: 20px; }
.ld-cap-tag-label { font-size: 11px; color: var(--text-2); }
.ld-cap-card h3 { font-family: var(--font-display); font-size: 17px; margin: 0 0 8px; }

/* outcome cards */
.ld-outcome-card {
  background: var(--bg-1); border: 1px solid var(--card-border); border-radius: var(--radius-lg);
  padding: 30px 20px; text-align: center;
  box-shadow: var(--shadow-sm);
}
.ld-outcome-icon { font-size: 22px; margin-bottom: 14px; }
.ld-outcome-value { font-family: var(--font-display); font-size: 24px; font-weight: 700; margin-bottom: 6px; color: var(--accent-orange); }
.ld-outcome-label { font-size: 14px; color: var(--text-1); }
.ld-outcome-sub { font-size: 12px; color: var(--text-2); margin-top: 2px; }

/* CTA */
.ld-cta { padding: 100px 24px; text-align: center; background: var(--bg-1); border-top: 1px solid var(--card-border); }
.ld-cta-inner { max-width: 620px; margin: 0 auto; }
.ld-cta h2 { font-family: var(--font-display); font-size: clamp(1.9rem, 3.4vw, 2.6rem); margin: 0 0 14px; color: var(--text-0); }
.ld-cta p { color: var(--text-1); font-size: 16.5px; margin-bottom: 34px; }
.ld-cta-buttons { margin-bottom: 20px; }
.ld-cta-note { font-size: 13px; color: var(--text-2); display: flex; align-items: center; justify-content: center; gap: 6px; }

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

/* CONTACT MODAL */
.ld-modal-overlay {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(36,20,23,0.55); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
  animation: ld-fade-in .2s ease;
}
.ld-modal {
  background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--card-border);
  box-shadow: var(--shadow-md); max-width: 460px; width: 100%;
  padding: 36px 32px 32px; position: relative;
  animation: ld-modal-in .3s ease;
}
.ld-modal-close {
  position: absolute; top: 16px; right: 16px; width: 34px; height: 34px; border-radius: 50%;
  border: 1px solid var(--card-border); background: var(--bg-1);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  color: var(--text-1); font-size: 14px; transition: background .2s ease, transform .2s ease;
}
.ld-modal-close:hover { background: #f3e2d0; transform: rotate(90deg); }
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
  outline: none; border-color: var(--accent-teal); box-shadow: 0 0 0 3px rgba(193,146,47,0.18); background: #ffffff;
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