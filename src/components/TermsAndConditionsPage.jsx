import React, { useState } from "react";
import Navbar from "./Navbar";
import ContactModal from "./ContactModel";
import { Link } from "react-router-dom";
import {
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  AlertCircle,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Building,
  Scale,
  Lock,
  BookOpen
} from "lucide-react";

const BRAND_NAME = "Coursera Education";

export default function TermsAndConditionsPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="policy-root" style={{ backgroundColor: "#FDF6EE", color: "#241417", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar brandName={BRAND_NAME} onCtaClick={() => setContactOpen(true)} />

      {/* Header Banner */}
      <section style={{ background: "linear-gradient(135deg, #241417 0%, #3D141C 60%, #7A1F2B 100%)", color: "#ffffff", padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(201, 154, 61, 0.18)", border: "1px solid rgba(201, 154, 61, 0.35)", borderRadius: "9999px", padding: "6px 16px", fontSize: "12.5px", fontWeight: 700, color: "#C99A3D", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <Scale style={{ width: 15, height: 15 }} />
            Legal Terms of Service
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 800, margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(253, 246, 238, 0.85)", margin: "0 0 20px 0", lineHeight: 1.6 }}>
            The legally binding agreement governing your access to Coursera Education platform, digital learning tracks, master bundles, and services.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "rgba(253, 246, 238, 0.7)", backgroundColor: "rgba(255,255,255,0.06)", padding: "8px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar style={{ width: 14, height: 14, color: "#C99A3D" }} /> Last Updated: 11 August 2026</span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Building style={{ width: 14, height: 14, color: "#C99A3D" }} /> UAE Licensed Establishment</span>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 24px 80px" }}>
        
        {/* Company Identity Header Card */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "32px", border: "1px solid rgba(122, 31, 43, 0.12)", boxShadow: "0 8px 30px rgba(122, 31, 43, 0.06)", marginBottom: "40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", fontWeight: 800, color: "#7A1F2B", margin: "0 0 6px 0" }}>
                Coursera Education
              </h2>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#9E8984", margin: "0 0 16px 0" }}>
                Coursera Education &amp; Training Computer Software
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px", color: "#6b5a56" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <MapPin style={{ width: 16, height: 16, color: "#7A1F2B", flexShrink: 0, marginTop: "2px" }} />
                  <span>THE BINARY BY OMNIYAT, Office 1912-196, Business Bay, Dubai, United Arab Emirates</span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: "#FAF2E8", borderRadius: "16px", padding: "20px", border: "1px solid rgba(122, 31, 43, 0.1)", display: "flex", flexDirection: "column", gap: "12px", fontSize: "13.5px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Mail style={{ width: 16, height: 16, color: "#C99A3D" }} />
                <a href="mailto:courseraeducationn@gmail.com" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>courseraeducationn@gmail.com</a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Phone style={{ width: 16, height: 16, color: "#C99A3D" }} />
                <a href="tel:+971552383144" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>+971 55 238 3144</a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Globe style={{ width: 16, height: 16, color: "#C99A3D" }} />
                <a href="https://courseraeducation.com" target="_blank" rel="noreferrer" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>courseraeducation.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Content Card */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "48px 40px", border: "1px solid rgba(122, 31, 43, 0.12)", boxShadow: "0 8px 30px rgba(122, 31, 43, 0.04)" }}>
          
          {/* Section 1 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>1</div>
            <div>
              <h3 style={sectionTitleStyle}>Acceptance of Terms</h3>
              <p style={paragraphStyle}>
                Welcome to <strong>Coursera Education</strong> ("Company", "we", "us", or "our"). By accessing or using our website (<a href="https://courseraeducation.com" target="_blank" rel="noreferrer" style={{ color: "#7A1F2B", fontWeight: 700 }}>courseraeducation.com</a>), learning management system (LMS), mobile applications, digital course materials, or related services, you ("User", "Learner", or "Customer") agree to be bound by these Terms &amp; Conditions.
              </p>
              <p style={paragraphStyle}>
                If you do not agree with any part of these Terms &amp; Conditions, you must immediately discontinue your use of our website and services.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>2</div>
            <div>
              <h3 style={sectionTitleStyle}>Educational Services &amp; Digital Content</h3>
              <p style={paragraphStyle}>
                Coursera Education provides specialized computer software training, practical AI engineering courses, RAG architecture tracks, model fine-tuning modules, and enterprise learning programs.
              </p>
              <ul style={listStyle}>
                <li>Courses are delivered through online digital learning platforms, live virtual workshops, and downloadable code repositories.</li>
                <li>We reserve the right to update, modify, or enhance course curricula, module structures, and learning exercises at any time to maintain alignment with modern industry standards.</li>
                <li>All course materials are intended strictly for educational purposes.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>3</div>
            <div>
              <h3 style={sectionTitleStyle}>User Accounts &amp; Account Security</h3>
              <p style={paragraphStyle}>
                To access purchased courses, you must create a registered student account. You agree to:
              </p>
              <ul style={listStyle}>
                <li>Provide accurate, current, and complete registration information.</li>
                <li>Maintain the confidentiality of your login credentials and password.</li>
                <li>Promptly notify us of any unauthorized access or breach of security regarding your account.</li>
                <li>Not share account credentials, access tokens, or course materials with third parties. Sharing accounts is strictly prohibited and will result in immediate termination without refund.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>4</div>
            <div>
              <h3 style={sectionTitleStyle}>Intellectual Property Rights</h3>
              <p style={paragraphStyle}>
                All digital content on Coursera Education—including text, software code, video lectures, graphics, logos, branding, curriculum structures, and downloadable code assets—is the exclusive intellectual property of <strong>Coursera Education &amp; Training Computer Software</strong> or its licensors and is protected by international copyright, trademark, and UAE intellectual property laws.
              </p>
              <p style={paragraphStyle}>
                You are granted a limited, personal, non-exclusive, non-transferable license to access and view purchased course materials for individual educational use only. You may NOT:
              </p>
              <ul style={listStyle}>
                <li>Republish, sell, rent, sublicense, or redistribute course content to any public or commercial platform;</li>
                <li>Modify, reverse engineer, or create derivative works from our proprietary software or curriculum;</li>
                <li>Record, record-screen, or scrape live sessions, video streams, or interactive sandboxes.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>5</div>
            <div>
              <h3 style={sectionTitleStyle}>Fees, Dual Currency Billing &amp; Payment Gateways</h3>
              <p style={paragraphStyle}>
                Course prices, Special Combo Bundles, and All-Access Subscriptions are clearly listed on our website in <strong>USD ($)</strong> and <strong>AED (د.إ)</strong>.
              </p>
              <ul style={listStyle}>
                <li><strong>Payment Methods:</strong> Payments are securely processed via authorized UAE acquiring payment gateways (including credit cards, debit cards, and corporate transfers).</li>
                <li><strong>Currency Conversion:</strong> Orders billed in USD or AED will be charged the exact stated checkout amount. Any additional bank foreign transaction fees imposed by your issuing bank remain the responsibility of the purchaser.</li>
                <li><strong>Taxes:</strong> Prices are exclusive of applicable Value Added Tax (VAT) or local taxes unless explicitly stated otherwise.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>6</div>
            <div>
              <h3 style={sectionTitleStyle}>Cancellations &amp; Refund Terms</h3>
              <p style={paragraphStyle}>
                Cancellations and refunds are governed by our dedicated policies:
              </p>
              <ul style={listStyle}>
                <li>Refer to our <Link to="/cancellation-policy" style={{ color: "#7A1F2B", fontWeight: 700 }}>Cancellation Policy</Link> for detailed cancellation windows, handling fees, and Master Bundle terms.</li>
                <li>Refer to our <Link to="/refund-policy" style={{ color: "#7A1F2B", fontWeight: 700 }}>Return &amp; Refund Policy</Link> for digital access refund eligibility and processing timelines.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>7</div>
            <div>
              <h3 style={sectionTitleStyle}>Acceptable Use &amp; Code of Conduct</h3>
              <p style={paragraphStyle}>
                When using our LMS platforms, student discussion forums, or live workshops, you agree not to:
              </p>
              <ul style={listStyle}>
                <li>Engage in illegal, fraudulent, or malicious behavior;</li>
                <li>Harass, abuse, or intimidate instructors, staff, or fellow students;</li>
                <li>Upload viruses, malware, or destructive code to our sandbox servers;</li>
                <li>Use automated bots or scrapers to extract course content or student directories.</li>
              </ul>
              <p style={paragraphStyle}>
                We reserve the right to suspend or terminate accounts violating these standards without prior notice or refund.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>8</div>
            <div>
              <h3 style={sectionTitleStyle}>Limitation of Liability &amp; Disclaimers</h3>
              <p style={paragraphStyle}>
                Coursera Education provides high-quality software and AI training "as is" and "as available".
              </p>
              <ul style={listStyle}>
                <li>While we strive for 100% platform uptime, we do not guarantee uninterrupted or error-free server access during third-party cloud maintenance.</li>
                <li>To the maximum extent permitted by UAE law, Coursera Education shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from your use or inability to use our educational services.</li>
                <li>Course completion does not guarantee third-party employment or financial outcomes.</li>
              </ul>
            </div>
          </section>

          {/* Section 9 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>9</div>
            <div>
              <h3 style={sectionTitleStyle}>Governing Law &amp; Dispute Resolution</h3>
              <p style={paragraphStyle}>
                These Terms &amp; Conditions shall be governed by, construed, and enforced in accordance with the federal laws of the <strong>United Arab Emirates</strong> and the emirate of <strong>Dubai</strong>.
              </p>
              <p style={paragraphStyle}>
                Any dispute, claim, or controversy arising out of or relating to these Terms or your use of our services shall be subject to the exclusive jurisdiction of the competent courts in Dubai, UAE.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section style={{ ...sectionStyle, borderBottom: "none", paddingBottom: 0 }}>
            <div style={numBadgeStyle}>10</div>
            <div>
              <h3 style={sectionTitleStyle}>Contact Information &amp; Corporate Address</h3>
              <p style={paragraphStyle}>
                If you have any questions or legal inquiries regarding these Terms &amp; Conditions, please contact us:
              </p>
              <div style={{ backgroundColor: "#FAF2E8", borderRadius: "16px", padding: "24px", border: "1px solid rgba(122, 31, 43, 0.12)", marginTop: "16px" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "18px", fontWeight: 800, color: "#7A1F2B", fontFamily: "'Space Grotesk', sans-serif" }}>
                  Coursera Education
                </h4>
                <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#6b5a56" }}>
                  <strong>Email:</strong> <a href="mailto:courseraeducationn@gmail.com" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>courseraeducationn@gmail.com</a>
                </p>
                <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#6b5a56" }}>
                  <strong>Phone:</strong> <a href="tel:+971552383144" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>+971 55 238 3144</a>
                </p>
                <p style={{ margin: "0 0 4px 0", fontSize: "13.5px", fontWeight: 700, color: "#7A1F2B" }}>
                  Registered Establishment Address:
                </p>
                <p style={{ margin: 0, fontSize: "13.5px", color: "#6b5a56", lineHeight: 1.5 }}>
                  THE BINARY BY OMNIYAT, Office 1912-196<br />
                  Business Bay, Dubai, United Arab Emirates<br />
                  Website: <a href="https://courseraeducation.com" target="_blank" rel="noreferrer" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>courseraeducation.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* Legal Advisory Banner */}
          <div style={{ marginTop: "48px", backgroundColor: "rgba(201, 154, 61, 0.1)", border: "1px solid rgba(201, 154, 61, 0.3)", borderRadius: "18px", padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <AlertCircle style={{ width: 22, height: 22, color: "#C99A3D", flexShrink: 0, marginTop: "2px" }} />
            <div style={{ fontSize: "13px", color: "#6b5a56", lineHeight: 1.6 }}>
              <strong style={{ color: "#7A1F2B", display: "block", marginBottom: "4px" }}>Legal Terms Notice</strong>
              By enrolling in any course or purchasing digital access on Coursera Education, you acknowledge that you have read, understood, and agreed to these Terms &amp; Conditions.
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="ld-footer" style={{ padding: "60px 24px 30px", backgroundColor: "#ffffff", borderTop: "1px solid rgba(122, 31, 43, 0.12)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "24px", fontSize: "13px", color: "#6b5a56" }}>
          <div>
            <strong style={{ color: "#7A1F2B" }}>Coursera Education</strong> © {new Date().getFullYear()}. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/terms-and-conditions" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>Terms &amp; Conditions</Link>
            <Link to="/cancellation-policy" style={{ color: "#6b5a56", textDecoration: "none" }}>Cancellation Policy</Link>
            <Link to="/refund-policy" style={{ color: "#6b5a56", textDecoration: "none" }}>Return &amp; Refund Policy</Link>
            <Link to="/pricing" style={{ color: "#6b5a56", textDecoration: "none" }}>Pricing</Link>
          </div>
        </div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

// Internal Section Styles
const sectionStyle = {
  display: "flex",
  gap: "20px",
  paddingBottom: "36px",
  marginBottom: "36px",
  borderBottom: "1px solid rgba(122, 31, 43, 0.08)",
  alignItems: "flex-start",
};

const numBadgeStyle = {
  width: "34px",
  height: "34px",
  borderRadius: "50%",
  backgroundColor: "rgba(122, 31, 43, 0.08)",
  color: "#7A1F2B",
  fontWeight: 800,
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  marginTop: "2px",
};

const sectionTitleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "20px",
  fontWeight: 800,
  color: "#7A1F2B",
  margin: "0 0 12px 0",
  letterSpacing: "-0.01em",
};

const paragraphStyle = {
  fontSize: "15px",
  lineHeight: 1.7,
  color: "#3D2B2E",
  margin: "0 0 12px 0",
};

const listStyle = {
  margin: "12px 0 16px 20px",
  padding: 0,
  fontSize: "14.5px",
  lineHeight: 1.7,
  color: "#3D2B2E",
};
