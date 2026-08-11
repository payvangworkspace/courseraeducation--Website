import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ContactModal from "./ContactModel";
import { CheckCircle, Sparkles, Zap, ArrowRight, ShieldCheck, HelpCircle, BookOpen, Layers, Award, Users } from "lucide-react";

/**
 * Pricing Page — /pricing — Light Luxury Theme
 * Single-file React component aligned with Coursera Education branding.
 * Features $1000-$2000 USD pricing structure, USD/AED currency toggling,
 * 3 pricing tiers, Special Combo Bundles, feature comparison, and FAQs.
 */

const BRAND_NAME = "Coursera Education";

const HERO_STATS = [
  { icon: "🎯", label: "24 Practical Tracks", value: "$1,000 – $2,000 USD", sub: "Production AI engineering, RAG & agentic systems" },
  { icon: "💱", label: "Dual Currency", value: "USD ($) & AED", sub: "Transparent pricing with zero hidden fees" },
  { icon: "⚡", label: "Master Bundles", value: "Save Up To 94%", sub: "Bundle multiple tracks or get an All-Access Pass" },
];

const WHY_PLANS = [
  {
    icon: "🎓",
    title: "Production-Grade AI Engineering",
    desc: "Every track is built for real-world deployment — from Pydantic directives and vLLM hosting to LangGraph multi-agent systems.",
  },
  {
    icon: "✨",
    title: "100% Customizable Content",
    desc: "All courses and bundles can be tailored to align directly with your enterprise stack, data rules, and team objectives.",
  },
  {
    icon: "💱",
    title: "Transparent Dual Currency",
    desc: "Toggle seamlessly between USD ($) and AED (د.إ) with clear billing in whichever currency fits your organization.",
  },
  {
    icon: "♾️",
    title: "Lifetime Access & Updates",
    desc: "No time limits or surprise monthly meters. Enjoy continuous model updates, code repo access, and completion certificates.",
  },
];

const WHATS_INCLUDED = [
  "Full lifetime access to interactive LMS lessons, code sandboxes & checkpoints",
  "Production capstone projects & downloadable GitHub code repositories",
  "Detailed learning analytics & skill progress tracking",
  "Official Verifiable Certificate of Completion for every completed track",
  "Direct 1-on-1 instructor email & priority Q&A support",
  "Free access to model architecture updates & prompt optimization packs",
];

const ADD_ONS = [
  {
    icon: "👥",
    title: "Dedicated Team Cohorts & Live Workshops",
    desc: "Live instructor-led sessions, team code reviews, and weekly office hours for enterprise engineering teams.",
  },
  {
    icon: "✨",
    title: "Custom Enterprise Curriculum Design",
    desc: "Tailored learning paths customized around your company's proprietary data pipelines and tech stack.",
  },
  {
    icon: "📄",
    title: "Enterprise Assessment & Reporting Pack",
    desc: "Custom grading rubrics, pass threshold benchmarks, and exportable team competency reports.",
  },
  {
    icon: "🛡️",
    title: "Private On-Premise & Data Privacy Deployment",
    desc: "Deploy course sandboxes behind your corporate VPN with strict data residency and HIPAA/GDPR compliance.",
  },
];

const PLANS = [
  {
    id: "single-course",
    name: "Single Track Pass",
    tagline: "Ideal for individual engineers focusing on a specific AI domain",
    usd: 1199,
    aed: 4400,
    period: " / course",
    billedNote: "One-time payment • Lifetime access",
    badge: "STANDARD TRACK",
    badgeColor: "#6b5a56",
    features: [
      "Full lifetime access to 1 chosen course track",
      "All modules, coding labs & capstone projects",
      "Official Certificate of Completion",
      "Direct instructor Q&A support",
      "100% customizable curriculum option",
    ],
  },
  {
    id: "master-bundle",
    name: "Full-Stack Master Bundle",
    tagline: "Best value for mastering 3 complementary AI specialization tracks",
    usd: 1899,
    aed: 6969,
    period: " / bundle",
    billedNote: "One-time payment • Lifetime access to 3 tracks",
    badge: "SAVE UP TO 62%",
    badgeColor: "#7A1F2B",
    featured: true,
    features: [
      "Full access to 3 specialized AI tracks of choice",
      "Over 25+ modules & hands-on capstone projects",
      "Priority 1-on-1 mentor code reviews",
      "Production deployment code templates & repositories",
      "Lifetime access & completion certificates for all 3 tracks",
    ],
  },
  {
    id: "all-access-pass",
    name: "All-Access Enterprise Pass",
    tagline: "Unlimited access to all 24 tracks & future 2026 releases",
    usd: 1999,
    aed: 7336,
    period: " / year",
    billedNote: "Billed annually • Unlimited access to everything",
    perMonthUsd: "166.58",
    perMonthAed: "611.33",
    badge: "SAVE 94% • ULTIMATE PASS",
    badgeColor: "#2563EB",
    features: [
      "Unlimited access to ALL 24 current & future course tracks",
      "Unlimited access to ALL 6 Master Combo Bundles",
      "Direct 1-on-1 Senior AI Engineering mentorship",
      "Custom team curriculum alignment & multi-seat management",
      "Private VIP Discord channel & live monthly Q&A workshops",
    ],
  },
];

const COMBO_SUMMARY = [
  { name: "Full-Stack AI Architect Master Bundle", priceUSD: 1999, originalUSD: 4547, savings: "56% OFF", icon: "🔥" },
  { name: "Enterprise AI Safety & Governance Suite", priceUSD: 1699, originalUSD: 3697, savings: "54% OFF", icon: "🛡️" },
  { name: "Deep Learning & LLM Fine-Tuning Pro Bundle", priceUSD: 1899, originalUSD: 5047, savings: "62% OFF", icon: "⚡" },
  { name: "All-Access Enterprise Learning Pass", priceUSD: 1999, originalUSD: 36000, savings: "94% OFF", icon: "🌟" },
  { name: "Neural Search & Knowledge Graph Bundle", priceUSD: 1799, originalUSD: 4457, savings: "60% OFF", icon: "🕸️" },
  { name: "Edge AI & Multimodal Vision Suite", priceUSD: 1849, originalUSD: 4547, savings: "59% OFF", icon: "📱" },
];

const FAQS = [
  {
    q: "How much do individual courses cost?",
    a: "Every individual course track is priced between $1,000 USD and $2,000 USD (e.g., $1,099 – $1,899 USD / 4,033 – 6,969 AED). All pricing is transparent with no hidden subscription fees.",
  },
  {
    q: "What is included in a Special Combo Offer?",
    a: "Special Combo Offers bundle 3 complementary tracks together at a deep discount (saving up to 62% off individual prices). For example, the Full-Stack AI Architect Bundle includes Prompt Engineering, Enterprise RAG, and Agentic AI for just $1,999 USD.",
  },
  {
    q: "What currencies are accepted?",
    a: "We support USD ($) and AED (د.إ) natively across all checkouts. You can switch between currencies anytime using the toggle button on this page.",
  },
  {
    q: "Can courses be customized for our enterprise team?",
    a: "Yes! Every single course and bundle can be customized based on your organization's specific tech stack, security protocols, and target use cases. Click 'Get in Touch' to request a customized program.",
  },
  {
    q: "What is the All-Access Enterprise Pass?",
    a: "The All-Access Pass gives your team unlimited access to all 24 professional AI engineering courses and all 6 Master Combo Bundles for $1,999 USD / year, complete with 1-on-1 mentorship and priority code reviews.",
  },
  {
    q: "Will I receive an official certificate?",
    a: "Yes. Every student who completes a course track or master bundle receives a verifiable digital Certificate of Completion to showcase on LinkedIn or resume credentials.",
  },
  {
    q: "Do you offer multi-seat team volume discounts?",
    a: "Yes. For corporate rollouts of 5 or more engineers, we offer multi-seat enterprise licensing. Contact us at Courseraeducationn@gmail.com for a custom volume proposal.",
  },
];

function FaqItem({ index, item, isOpen, onToggle }) {
  return (
    <div style={{ backgroundColor: "#ffffff", border: "1px solid rgba(122, 31, 43, 0.12)", borderRadius: "18px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
      <button
        onClick={() => onToggle(index)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          textAlign: "left",
          background: "none",
          border: "none",
          padding: "20px 24px",
          cursor: "pointer",
          color: "#241417",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        <span style={{ fontSize: "13px", fontWeight: 800, color: "#C99A3D", border: "1px solid rgba(201, 154, 61, 0.3)", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyCenter: "center", flexShrink: 0, justifyContent: "center" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span style={{ flex: 1, fontSize: "16.5px", fontWeight: 700, color: "#7A1F2B" }}>{item.q}</span>
        <span style={{ fontSize: "18px", transition: "transform 0.25s ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", color: "#7A1F2B" }}>
          ↓
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: "0 24px 22px 70px", color: "#6b5a56", fontSize: "15px", lineHeight: 1.65 }}>
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState("usd");
  const [openFaq, setOpenFaq] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);

  const toggleFaq = (i) => setOpenFaq((cur) => (cur === i ? -1 : i));
  const isUsd = currency === "usd";
  const symbol = isUsd ? "$" : "AED ";

  const handleSelectPlan = (plan) => {
    navigate("/courses");
  };

  return (
    <div style={{ backgroundColor: "#FDF6EE", color: "#241417", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar brandName={BRAND_NAME} active="Pricing" onCtaClick={() => setContactOpen(true)} />

      {/* HERO SECTION */}
      <section style={{ background: "linear-gradient(135deg, #241417 0%, #3D141C 60%, #7A1F2B 100%)", color: "#ffffff", padding: "75px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div style={{ maxWidth: "880px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(201, 154, 61, 0.18)", border: "1px solid rgba(201, 154, 61, 0.35)", borderRadius: "9999px", padding: "6px 20px", fontSize: "13px", fontWeight: 700, color: "#C99A3D", marginBottom: "22px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <Sparkles style={{ width: 16, height: 16 }} />
            TRANSPARENT ENTERPRISE PRICING
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)", fontWeight: 800, margin: "0 0 18px 0", letterSpacing: "-0.02em", lineHeight: 1.15, color: "#ffffff" }}>
            Investment Plans <span style={{ background: "linear-gradient(90deg, #FDF6EE 0%, #F5D07F 50%, #C99A3D 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Built for Real Impact</span>
          </h1>
          <p style={{ fontSize: "16.5px", color: "rgba(253, 246, 238, 0.88)", margin: "0 0 28px 0", lineHeight: 1.6, maxWidth: "760px", marginLeft: "auto", marginRight: "auto" }}>
            Choose individual course tracks ($1,000–$2,000 USD), save up to 62% with our Special Combo Master Bundles, or get unlimited access with the All-Access Pass.
          </p>

          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/courses")}
              style={{ backgroundColor: "#C99A3D", color: "#241417", border: "none", borderRadius: "9999px", padding: "14px 28px", fontSize: "15px", fontWeight: 800, cursor: "pointer", boxShadow: "0 6px 20px rgba(201, 154, 61, 0.3)", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              Explore All Courses <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => setContactOpen(true)}
              style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "9999px", padding: "14px 28px", fontSize: "15px", fontWeight: 700, cursor: "pointer" }}
            >
              Get Custom Proposal
            </button>
          </div>
        </div>

        {/* HERO STATS */}
        <div style={{ maxWidth: "1150px", margin: "50px auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", position: "relative", zIndex: 1 }}>
          {HERO_STATS.map((s, i) => (
            <div key={i} style={{ backgroundColor: "rgba(255, 255, 255, 0.07)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "20px", padding: "24px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
              <div style={{ fontSize: "12px", color: "#C99A3D", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>{s.label}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "20px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.7)" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px 90px" }}>

        {/* CURRENCY TOGGLE & SECTION HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "36px" }}>
          <div>
            <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#C99A3D", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "4px" }}>Select Tier</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "30px", fontWeight: 800, color: "#7A1F2B", margin: 0 }}>
              Choose Your Learning Pass
            </h2>
          </div>

          <div style={{ display: "inline-flex", backgroundColor: "#ffffff", border: "1.5px solid rgba(201, 154, 61, 0.35)", borderRadius: "9999px", padding: "5px", boxShadow: "0 4px 14px rgba(122,31,43,0.05)" }}>
            <button
              onClick={() => setCurrency("usd")}
              style={{
                padding: "8px 22px",
                borderRadius: "9999px",
                fontSize: "13.5px",
                fontWeight: 800,
                border: "none",
                backgroundColor: isUsd ? "#7A1F2B" : "transparent",
                color: isUsd ? "#ffffff" : "#6b5a56",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency("aed")}
              style={{
                padding: "8px 22px",
                borderRadius: "9999px",
                fontSize: "13.5px",
                fontWeight: 800,
                border: "none",
                backgroundColor: !isUsd ? "#7A1F2B" : "transparent",
                color: !isUsd ? "#ffffff" : "#6b5a56",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              AED (د.إ)
            </button>
          </div>
        </div>

        {/* PRICING TIER CARDS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "30px", marginBottom: "80px" }}>
          {PLANS.map((plan) => {
            const displayPrice = isUsd ? plan.usd.toLocaleString() : plan.aed.toLocaleString();
            const perMonth = isUsd ? plan.perMonthUsd : plan.perMonthAed;
            return (
              <div
                key={plan.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "28px",
                  border: plan.featured ? "2px solid #7A1F2B" : "1.5px solid rgba(201, 154, 61, 0.35)",
                  boxShadow: plan.featured ? "0 16px 40px rgba(122, 31, 43, 0.14)" : "0 10px 32px rgba(122, 31, 43, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* BADGE */}
                <div style={{ padding: "24px 28px 18px", backgroundColor: plan.featured ? "#FAF2E8" : "#ffffff", borderBottom: "1px solid rgba(122, 31, 43, 0.08)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <span style={{ backgroundColor: plan.badgeColor, color: "#ffffff", fontSize: "11px", fontWeight: 800, textTransform: "uppercase", padding: "5px 14px", borderRadius: "9999px", letterSpacing: "0.05em" }}>
                      {plan.badge}
                    </span>
                    {plan.featured && (
                      <span style={{ fontSize: "12px", fontWeight: 800, color: "#7A1F2B", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Zap style={{ width: 14, height: 14, color: "#C99A3D" }} /> MOST POPULAR
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 6px 0" }}>
                    {plan.name}
                  </h3>
                  <p style={{ fontSize: "13.5px", color: "#6b5a56", margin: 0, lineHeight: 1.45 }}>
                    {plan.tagline}
                  </p>
                </div>

                {/* PRICING BODY */}
                <div style={{ padding: "24px 28px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ marginBottom: "22px" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "36px", fontWeight: 800, color: "#7A1F2B" }}>
                          {symbol}{displayPrice}
                        </span>
                        <span style={{ fontSize: "14px", color: "#9E8984", fontWeight: 600 }}>{plan.period}</span>
                      </div>
                      {perMonth && (
                        <div style={{ fontSize: "13px", color: "#16A34A", fontWeight: 700, marginTop: "4px" }}>
                          Equivalent to {symbol}{perMonth}/month
                        </div>
                      )}
                      <div style={{ fontSize: "12.5px", color: "#6b5a56", marginTop: "4px" }}>{plan.billedNote}</div>
                    </div>

                    {/* FEATURES LIST */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 800, color: "#9E8984", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>Features &amp; Benefits:</span>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "#241417", fontWeight: 600, lineHeight: 1.4 }}>
                          <CheckCircle style={{ width: 16, height: 16, color: "#C99A3D", flexShrink: 0, marginTop: "1px" }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    style={{
                      width: "100%",
                      background: plan.featured ? "linear-gradient(135deg, #7A1F2B 0%, #4A101A 100%)" : "#FAF2E8",
                      color: plan.featured ? "#ffffff" : "#7A1F2B",
                      border: plan.featured ? "none" : "1.5px solid rgba(122, 31, 43, 0.2)",
                      borderRadius: "14px",
                      padding: "14px",
                      fontSize: "14.5px",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: plan.featured ? "0 6px 18px rgba(122, 31, 43, 0.25)" : "none"
                    }}
                  >
                    Select Plan <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* SPECIAL COMBO OFFERS SHOWCASE BANNER */}
        <div style={{ backgroundColor: "#FAF2E8", border: "2px solid rgba(201, 154, 61, 0.4)", borderRadius: "28px", padding: "40px 32px", marginBottom: "80px", boxShadow: "0 10px 30px rgba(122,31,43,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "#7A1F2B", color: "#ffffff", borderRadius: "9999px", padding: "4px 14px", fontSize: "11.5px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                <Zap style={{ width: 14, height: 14, color: "#C99A3D" }} /> SPECIAL BUNDLES
              </div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", fontWeight: 800, color: "#7A1F2B", margin: 0 }}>
                Featured Special Combo Offers
              </h3>
            </div>
            <button
              onClick={() => navigate("/courses")}
              style={{ backgroundColor: "#7A1F2B", color: "#ffffff", border: "none", borderRadius: "9999px", padding: "10px 22px", fontSize: "13.5px", fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
            >
              View All 6 Bundles on Courses Page <ArrowRight style={{ width: 15, height: 15 }} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {COMBO_SUMMARY.map((combo, idx) => (
              <div key={idx} style={{ backgroundColor: "#ffffff", borderRadius: "18px", padding: "20px", border: "1px solid rgba(122, 31, 43, 0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "22px" }}>{combo.icon}</span>
                  <span style={{ backgroundColor: "rgba(22, 163, 74, 0.12)", color: "#16A34A", fontSize: "11px", fontWeight: 800, padding: "3px 10px", borderRadius: "6px" }}>
                    {combo.savings}
                  </span>
                </div>
                <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15.5px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 10px 0", lineHeight: 1.3 }}>
                  {combo.name}
                </h4>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#9E8984", textDecoration: "line-through" }}>${combo.originalUSD.toLocaleString()}</span>
                  <span style={{ fontSize: "20px", fontWeight: 800, color: "#7A1F2B" }}>${combo.priceUSD.toLocaleString()}</span>
                  <span style={{ fontSize: "11.5px", color: "#9E8984" }}>USD</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WHY PLAN PRICING GRID */}
        <div style={{ marginBottom: "80px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 8px 0" }}>
              Why Engineers &amp; Teams Choose Coursera Education
            </h2>
            <p style={{ fontSize: "15px", color: "#6b5a56", margin: 0 }}>Practical hands-on learning designed for immediate production deployment.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            {WHY_PLANS.map((c, i) => (
              <div key={i} style={{ backgroundColor: "#ffffff", borderRadius: "20px", padding: "26px 22px", border: "1px solid rgba(122, 31, 43, 0.12)", boxShadow: "0 4px 16px rgba(122,31,43,0.03)" }}>
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{c.icon}</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 8px 0" }}>{c.title}</h3>
                <p style={{ fontSize: "13.5px", color: "#6b5a56", margin: 0, lineHeight: 1.5 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* INCLUDED & ADD-ONS DUAL COLUMN */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "36px", marginBottom: "80px" }}>
          {/* WHAT'S INCLUDED */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "32px 28px", border: "1px solid rgba(122, 31, 43, 0.12)", boxShadow: "0 6px 20px rgba(122,31,43,0.04)" }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "10px" }}>
              <ShieldCheck style={{ width: 22, height: 22, color: "#16A34A" }} /> What's Included in Every Track
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {WHATS_INCLUDED.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "#241417", fontWeight: 500, lineHeight: 1.5 }}>
                  <CheckCircle style={{ width: 16, height: 16, color: "#16A34A", flexShrink: 0, marginTop: "2px" }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ENTERPRISE ADD-ONS */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "32px 28px", border: "1px solid rgba(122, 31, 43, 0.12)", boxShadow: "0 6px 20px rgba(122,31,43,0.04)" }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "10px" }}>
              <Sparkles style={{ width: 22, height: 22, color: "#C99A3D" }} /> Enterprise Add-Ons &amp; Services
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {ADD_ONS.map((addon, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span style={{ fontSize: "20px" }}>{addon.icon}</span>
                  <div>
                    <h4 style={{ fontSize: "14.5px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 2px 0" }}>{addon.title}</h4>
                    <p style={{ fontSize: "13px", color: "#6b5a56", margin: 0, lineHeight: 1.4 }}>{addon.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRICING FAQ SECTION */}
        <div style={{ maxWidth: "900px", margin: "0 auto 60px" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "28px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 8px 0" }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: "15px", color: "#6b5a56", margin: 0 }}>Everything you need to know about pricing, billing, and course access.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {FAQS.map((item, i) => (
              <FaqItem key={i} index={i} item={item} isOpen={openFaq === i} onToggle={toggleFaq} />
            ))}
          </div>
        </div>

        {/* CUSTOM ROLLOUT BANNER */}
        <div style={{ backgroundColor: "#FAF2E8", border: "2px solid rgba(201, 154, 61, 0.4)", borderRadius: "24px", padding: "40px 32px", textAlign: "center", maxWidth: "850px", margin: "0 auto" }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "24px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 10px 0" }}>
            Need a Custom AI Training Rollout for Your Team?
          </h3>
          <p style={{ fontSize: "15px", color: "#6b5a56", margin: "0 0 24px 0", maxWidth: "580px", marginLeft: "auto", marginRight: "auto" }}>
            Tell us your team size, target AI architecture, and timeline. We'll design a customized learning path and volume pricing package for your engineering group.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setContactOpen(true)}
              style={{ backgroundColor: "#7A1F2B", color: "#ffffff", border: "none", borderRadius: "9999px", padding: "12px 26px", fontSize: "14.5px", fontWeight: 800, cursor: "pointer" }}
            >
              Contact Enterprise Sales
            </button>
            <button
              onClick={() => navigate("/courses")}
              style={{ backgroundColor: "#ffffff", color: "#7A1F2B", border: "1.5px solid rgba(122, 31, 43, 0.3)", borderRadius: "9999px", padding: "12px 26px", fontSize: "14.5px", fontWeight: 700, cursor: "pointer" }}
            >
              Browse 24 Courses
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#241417", color: "#ffffff", padding: "60px 24px 30px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "40px", marginBottom: "40px" }}>
          <div>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", fontWeight: 800, color: "#C99A3D", margin: "0 0 14px 0" }}>
              {BRAND_NAME}
            </h4>
            <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: "0 0 12px 0" }}>
              Coursera Education &amp; Training Computer Software
            </p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "0 0 4px 0" }}>THE BINARY BY OMNIYAT, Office 1912-196</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "0 0 4px 0" }}>Business Bay, Dubai</p>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: "0 0 16px 0" }}>United Arab Emirates</p>
            <p style={{ fontSize: "13px", color: "#C99A3D", margin: 0 }}>✉ Courseraeducationn@gmail.com</p>
          </div>

          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", margin: "0 0 14px 0" }}>Legal &amp; Policies</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px" }}>
              <a href="/refund-policy" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Return &amp; Refund Policy</a>
              <a href="/cancellation-policy" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Cancellation Policy</a>
              <a href="/terms-and-conditions" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Terms &amp; Conditions</a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff", margin: "0 0 14px 0" }}>Need Help?</h4>
            <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: "0 0 16px 0" }}>
              Reach out to our education advisory team for training guidance or custom proposals.
            </p>
            <button
              onClick={() => setContactOpen(true)}
              style={{ backgroundColor: "#7A1F2B", color: "#ffffff", border: "none", borderRadius: "9999px", padding: "10px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
            >
              Contact Support
            </button>
          </div>
        </div>

        <div style={{ maxWidth: "1180px", margin: "0 auto", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", fontSize: "12.5px", color: "rgba(255,255,255,0.5)" }}>
          <span>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</span>
          <span>Contact: Courseraeducationn@gmail.com</span>
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}