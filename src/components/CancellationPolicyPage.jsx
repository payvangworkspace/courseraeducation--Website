import React, { useState } from "react";
import Navbar from "./Navbar";
import ContactModal from "./ContactModel";
import { Link } from "react-router-dom";
import {
  XCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Calendar,
  Building,
  RefreshCw,
  Zap,
  ShieldAlert
} from "lucide-react";

const BRAND_NAME = "Coursera Education";

export default function CancellationPolicyPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="policy-root" style={{ backgroundColor: "#FDF6EE", color: "#241417", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar brandName={BRAND_NAME} onCtaClick={() => setContactOpen(true)} />

      {/* Header Banner */}
      <section style={{ background: "linear-gradient(135deg, #241417 0%, #3D141C 60%, #7A1F2B 100%)", color: "#ffffff", padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(201, 154, 61, 0.18)", border: "1px solid rgba(201, 154, 61, 0.35)", borderRadius: "9999px", padding: "6px 16px", fontSize: "12.5px", fontWeight: 700, color: "#C99A3D", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <XCircle style={{ width: 15, height: 15 }} />
            Official Policy Document
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 800, margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>
            Cancellation Policy
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(253, 246, 238, 0.85)", margin: "0 0 20px 0", lineHeight: 1.6 }}>
            Terms and conditions governing course cancellations, subscription terminations, Master Bundle cancellations, and enterprise training adjustments.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "rgba(253, 246, 238, 0.7)", backgroundColor: "rgba(255,255,255,0.06)", padding: "8px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar style={{ width: 14, height: 14, color: "#C99A3D" }} /> Effective Date: 11 August 2026</span>
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

        {/* Policy Content Card */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "24px", padding: "48px 40px", border: "1px solid rgba(122, 31, 43, 0.12)", boxShadow: "0 8px 30px rgba(122, 31, 43, 0.04)" }}>
          
          {/* Section 1 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>1</div>
            <div>
              <h3 style={sectionTitleStyle}>Purpose &amp; Scope</h3>
              <p style={paragraphStyle}>
                This Cancellation Policy sets forth the terms under which learners, individual professionals, and enterprise organizations may cancel course enrollments, Master Combo Bundles, or All-Access Subscriptions with Coursera Education.
              </p>
              <p style={paragraphStyle}>
                Our objective is to ensure total transparency regarding cancellation rights, notice windows, non-fulfillment adjustments, and account terminations in accordance with the e-commerce consumer laws of the United Arab Emirates.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>2</div>
            <div>
              <h3 style={sectionTitleStyle}>Individual Course Track Cancellations</h3>
              <p style={paragraphStyle}>
                Students who purchase single course tracks (priced between $1,000 USD and $2,000 USD / 3,670 AED and 7,340 AED) may request cancellation under the following conditions:
              </p>
              <ul style={listStyle}>
                <li><strong>Cancellation Before Access:</strong> If you request cancellation prior to logging into the LMS or accessing downloadable digital materials, a 100% full refund will be granted.</li>
                <li><strong>Cancellation Within 7 Days (Unused Content):</strong> If you cancel within 7 calendar days of purchase and have completed less than 10% of the course modules, you are eligible for a full refund minus a 5% administrative handling fee.</li>
                <li><strong>Cancellation After 7 Days or &gt;10% Progress:</strong> Once 7 days have elapsed or more than 10% of the course content has been accessed/downloaded, the course fee becomes non-refundable. However, you retain lifetime access to the track.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>3</div>
            <div>
              <h3 style={sectionTitleStyle}>Special Master Combo Offers &amp; Bundles</h3>
              <p style={paragraphStyle}>
                Special Master Combo Offers (e.g., Full-Stack AI Architect Bundle, Enterprise Safety Suite, Deep Learning Pro) combine 3 specialized tracks at discounted bundle rates.
              </p>
              <ul style={listStyle}>
                <li><strong>Unstarted Combo Bundles:</strong> Full cancellation is permitted within 7 days of purchase if no track within the bundle has been started.</li>
                <li><strong>Partial Track Completion:</strong> If 1 track out of the 3 included tracks has been accessed or completed, the bundle cancellation will re-calculate the fee based on the standalone single track price ($1,199 USD), and the remaining balance will be refunded.</li>
                <li><strong>Multiple Track Access:</strong> Once 2 or more tracks in a combo bundle have been accessed, the bundle cannot be cancelled or refunded.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>4</div>
            <div>
              <h3 style={sectionTitleStyle}>All-Access Enterprise Pass Cancellations</h3>
              <p style={paragraphStyle}>
                The All-Access Enterprise Pass ($1,999 USD / Year) provides annual access to all 24 courses and 6 Master Bundles.
              </p>
              <ul style={listStyle}>
                <li><strong>14-Day Money-Back Guarantee:</strong> Annual subscribers may cancel within 14 calendar days of activation for a full refund if fewer than 2 certificates or capstone projects have been claimed.</li>
                <li><strong>Mid-Term Cancellation:</strong> Subscriptions cancelled after the 14-day window will turn off auto-renewal for the subsequent year. Access remains active until the end of the current paid 12-month billing period.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>5</div>
            <div>
              <h3 style={sectionTitleStyle}>Enterprise Team Cohorts &amp; Live Workshop Cancellations</h3>
              <p style={paragraphStyle}>
                For customized enterprise rollouts, live instructor-led workshops, or private corporate training cohorts:
              </p>
              <ul style={listStyle}>
                <li><strong>More than 14 Business Days Notice:</strong> 100% cancellation refund or free rescheduling to a future date.</li>
                <li><strong>7 to 14 Business Days Notice:</strong> 50% refund or rescheduling subject to instructor availability fees.</li>
                <li><strong>Fewer than 7 Business Days Notice:</strong> Live workshop setup fees are non-refundable due to reserved instructor calendar allocation.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>6</div>
            <div>
              <h3 style={sectionTitleStyle}>Course Modifications &amp; Cancellations by Coursera Education</h3>
              <p style={paragraphStyle}>
                Coursera Education reserves the right to reschedule or cancel a live cohort or course track due to unforeseen technical disruption, insufficient enrollment, or instructor illness.
              </p>
              <p style={paragraphStyle}>
                In such rare instances, affected learners will be offered:
              </p>
              <ul style={listStyle}>
                <li>A 100% full refund of the paid course fee; OR</li>
                <li>Free transfer to an alternative specialized AI track of equal or greater value; OR</li>
                <li>Direct credit towards an All-Access Pass or Master Combo Bundle.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section style={{ ...sectionStyle, backgroundColor: "#FAF2E8", borderRadius: "18px", padding: "24px", border: "1px solid rgba(122, 31, 43, 0.12)" }}>
            <div style={{ ...numBadgeStyle, backgroundColor: "#7A1F2B", color: "#ffffff" }}>7</div>
            <div>
              <h3 style={sectionTitleStyle}>How to Submit a Cancellation Request</h3>
              <p style={paragraphStyle}>
                To request a cancellation, please email our Student Support Team:
              </p>
              <div style={{ backgroundColor: "#ffffff", padding: "12px 18px", borderRadius: "12px", border: "1px solid rgba(122, 31, 43, 0.15)", margin: "12px 0 16px 0", display: "inline-flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: 700, color: "#7A1F2B" }}>
                <Mail style={{ width: 18, height: 18, color: "#C99A3D" }} />
                courseraeducationn@gmail.com
              </div>
              <p style={{ ...paragraphStyle, fontWeight: 700, color: "#7A1F2B" }}>
                Please include the following details in your email:
              </p>
              <ul style={listStyle}>
                <li>Student Full Name &amp; Registered Email Address</li>
                <li>Order / Transaction Reference ID (e.g. ORD-10294)</li>
                <li>Course or Combo Title to be cancelled</li>
                <li>Reason for cancellation request</li>
              </ul>
              <p style={paragraphStyle}>
                Our team will review your request within 24–48 business hours and issue confirmation.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>8</div>
            <div>
              <h3 style={sectionTitleStyle}>Refund Timeline &amp; Payment Methods</h3>
              <p style={paragraphStyle}>
                Once a cancellation request is verified and approved:
              </p>
              <ul style={listStyle}>
                <li>Refunds are credited back to the original credit/debit card or bank account used during checkout.</li>
                <li>Processing times typically take <strong>5 to 10 business days</strong> depending on your issuing bank or payment gateway provider.</li>
                <li>Any foreign exchange rates applied by international credit card providers remain governed by your issuing bank.</li>
              </ul>
            </div>
          </section>

          {/* Section 9 */}
          <section style={{ ...sectionStyle, borderBottom: "none", paddingBottom: 0 }}>
            <div style={numBadgeStyle}>9</div>
            <div>
              <h3 style={sectionTitleStyle}>Contact Support &amp; Official Address</h3>
              <p style={paragraphStyle}>
                For any questions or clarification regarding cancellations, please contact:
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
                  Corporate Office:
                </p>
                <p style={{ margin: 0, fontSize: "13.5px", color: "#6b5a56", lineHeight: 1.5 }}>
                  THE BINARY BY OMNIYAT, Office 1912-196<br />
                  Business Bay, Dubai, United Arab Emirates<br />
                  Website: <a href="https://courseraeducation.com" target="_blank" rel="noreferrer" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>courseraeducation.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* UAE Regulatory Banner */}
          <div style={{ marginTop: "48px", backgroundColor: "rgba(201, 154, 61, 0.1)", border: "1px solid rgba(201, 154, 61, 0.3)", borderRadius: "18px", padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <AlertCircle style={{ width: 22, height: 22, color: "#C99A3D", flexShrink: 0, marginTop: "2px" }} />
            <div style={{ fontSize: "13px", color: "#6b5a56", lineHeight: 1.6 }}>
              <strong style={{ color: "#7A1F2B", display: "block", marginBottom: "4px" }}>UAE Consumer Rights Notice</strong>
              Coursera Education operates in full compliance with United Arab Emirates Consumer Protection Laws regarding digital contracts and distance learning service cancellations.
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
            <Link to="/cancellation-policy" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>Cancellation Policy</Link>
            <Link to="/refund-policy" style={{ color: "#6b5a56", textDecoration: "none" }}>Return &amp; Refund Policy</Link>
            <Link to="/pricing" style={{ color: "#6b5a56", textDecoration: "none" }}>Pricing</Link>
            <Link to="/courses" style={{ color: "#6b5a56", textDecoration: "none" }}>Courses</Link>
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
