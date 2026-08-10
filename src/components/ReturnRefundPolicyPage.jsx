import React, { useState } from "react";
import Navbar from "./Navbar";
import ContactModal from "./ContactModel";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  RotateCcw,
  BookOpen,
  Building,
  Calendar
} from "lucide-react";

const BRAND_NAME = "Coursera Education";

export default function ReturnRefundPolicyPage() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="policy-root" style={{ backgroundColor: "#FDF6EE", color: "#241417", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar brandName={BRAND_NAME} onCtaClick={() => setContactOpen(true)} />

      {/* Header Banner */}
      <section style={{ background: "linear-gradient(135deg, #241417 0%, #3D141C 60%, #7A1F2B 100%)", color: "#ffffff", padding: "80px 24px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(201, 154, 61, 0.18)", border: "1px solid rgba(201, 154, 61, 0.35)", borderRadius: "9999px", padding: "6px 16px", fontSize: "12.5px", fontWeight: 700, color: "#C99A3D", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <RotateCcw style={{ width: 15, height: 15 }} />
            Official Policy Document
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 800, margin: "0 0 16px 0", letterSpacing: "-0.02em" }}>
            Return &amp; Refund Policy
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(253, 246, 238, 0.8)", margin: "0 0 20px 0", lineHeight: 1.6 }}>
            Comprehensive guidelines on cancellations, digital course access, refund eligibility, and student consumer rights under UAE regulations.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "rgba(253, 246, 238, 0.7)", backgroundColor: "rgba(255,255,255,0.06)", padding: "8px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar style={{ width: 14, height: 14, color: "#C99A3D" }} /> Effective Date: 10 August 2026</span>
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
              <h3 style={sectionTitleStyle}>Overview</h3>
              <p style={paragraphStyle}>
                At Coursera Education, we are committed to providing students with quality online education and training programs.
              </p>
              <p style={paragraphStyle}>
                This Return &amp; Refund Policy explains the circumstances under which a student may request cancellation or a refund for an online course or training program purchased through our website.
              </p>
              <p style={paragraphStyle}>
                By purchasing a course, the student acknowledges that they have reviewed the applicable course description, price, duration, learning format and other relevant information before completing the purchase.
              </p>
              <p style={paragraphStyle}>
                This policy is subject to applicable laws and regulations of the United Arab Emirates.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>2</div>
            <div>
              <h3 style={sectionTitleStyle}>Online Digital Courses</h3>
              <p style={paragraphStyle}>
                Our courses are primarily delivered through online and digital learning platforms and may include:
              </p>
              <ul style={listStyle}>
                <li>Video lessons</li>
                <li>Digital course materials</li>
                <li>Online learning modules</li>
                <li>Assignments and exercises</li>
                <li>Assessments or quizzes</li>
                <li>Downloadable educational materials</li>
                <li>Other digital learning resources</li>
              </ul>
              <p style={paragraphStyle}>
                Because digital educational content may be accessed immediately after purchase, the refund eligibility may depend on whether course access or digital content has already been provided.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>3</div>
            <div>
              <h3 style={sectionTitleStyle}>Cancellation Before Course Access</h3>
              <p style={paragraphStyle}>
                A student may request cancellation and a refund before accessing or receiving the digital course content, subject to verification of the purchase and applicable terms.
              </p>
              <p style={paragraphStyle}>
                Where approved, the refund will normally be made to the original payment method used for the transaction.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>4</div>
            <div>
              <h3 style={sectionTitleStyle}>Refund After Course Access</h3>
              <p style={paragraphStyle}>
                Once a student has accessed, downloaded or commenced the digital course content, refunds may generally not be available because the educational service and digital content have already been supplied.
              </p>
              <p style={paragraphStyle}>
                However, this restriction does not affect any statutory consumer rights or remedies that may apply where the service is defective, materially different from its description, or otherwise not provided as agreed.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>5</div>
            <div>
              <h3 style={sectionTitleStyle}>Technical Problems</h3>
              <p style={paragraphStyle}>
                If a student experiences a genuine technical problem that prevents them from accessing a purchased course, they should contact us as soon as possible.
              </p>
              <p style={paragraphStyle}>
                We will first attempt to resolve the technical issue and restore access.
              </p>
              <p style={paragraphStyle}>
                If the issue cannot reasonably be resolved and the purchased service cannot be provided, Coursera Education will review the matter and may provide an appropriate remedy, which may include:
              </p>
              <ul style={listStyle}>
                <li>Restoring course access;</li>
                <li>Extending the course access period;</li>
                <li>Providing an alternative solution; or</li>
                <li>Providing a refund where appropriate.</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>6</div>
            <div>
              <h3 style={sectionTitleStyle}>Course Cancellation by Coursera Education</h3>
              <p style={paragraphStyle}>
                If Coursera Education cancels a course before the student has received the purchased service, the student may be eligible for a refund of the amount paid for that course.
              </p>
              <p style={paragraphStyle}>
                Where possible, students may alternatively be offered:
              </p>
              <ul style={listStyle}>
                <li>An alternative course;</li>
                <li>A revised course schedule; or</li>
                <li>An extension or replacement learning arrangement.</li>
              </ul>
              <p style={paragraphStyle}>
                The student may choose the available option applicable to the circumstances.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>7</div>
            <div>
              <h3 style={sectionTitleStyle}>Duplicate or Incorrect Payments</h3>
              <p style={paragraphStyle}>
                If a student has accidentally made a duplicate payment for the same course, they should contact us immediately.
              </p>
              <p style={paragraphStyle}>
                After verification, an eligible duplicate payment may be refunded to the original payment method.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>8</div>
            <div>
              <h3 style={sectionTitleStyle}>Incorrect Course Purchase</h3>
              <p style={paragraphStyle}>
                If a student accidentally purchases the wrong course, they should contact Coursera Education as soon as possible before accessing the course content.
              </p>
              <p style={paragraphStyle}>
                We may, at our discretion and subject to the circumstances, allow the student to transfer the payment to another available course of equal or similar value.
              </p>
              <p style={paragraphStyle}>
                Any difference in course price may need to be settled before the transfer is completed.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section style={{ ...sectionStyle, backgroundColor: "#FAF2E8", borderRadius: "18px", padding: "24px", border: "1px solid rgba(122, 31, 43, 0.12)" }}>
            <div style={{ ...numBadgeStyle, backgroundColor: "#7A1F2B", color: "#ffffff" }}>9</div>
            <div>
              <h3 style={sectionTitleStyle}>Refund Request Procedure</h3>
              <p style={paragraphStyle}>
                To request a refund, the student should email:
              </p>
              <div style={{ backgroundColor: "#ffffff", padding: "12px 18px", borderRadius: "12px", border: "1px solid rgba(122, 31, 43, 0.15)", margin: "12px 0 16px 0", display: "inline-flex", alignItems: "center", gap: "10px", fontSize: "15px", fontWeight: 700, color: "#7A1F2B" }}>
                <Mail style={{ width: 18, height: 18, color: "#C99A3D" }} />
                courseraeducationn@gmail.com
              </div>
              <p style={{ ...paragraphStyle, fontWeight: 700, color: "#7A1F2B" }}>
                The request should include:
              </p>
              <ul style={listStyle}>
                <li>Student’s full name</li>
                <li>Email address used for enrollment</li>
                <li>Course/program name</li>
                <li>Transaction/order reference</li>
                <li>Date of purchase</li>
                <li>Amount paid</li>
                <li>Reason for the refund request</li>
                <li>Any relevant supporting information</li>
              </ul>
              <p style={paragraphStyle}>
                We may request additional information to verify the transaction and assess the request.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>10</div>
            <div>
              <h3 style={sectionTitleStyle}>Refund Processing</h3>
              <p style={paragraphStyle}>
                Once a refund has been approved, the refund will normally be processed to the original payment method.
              </p>
              <p style={paragraphStyle}>
                The time taken for the funds to appear in the student’s account may depend on the payment provider, card issuer or financial institution.
              </p>
              <p style={paragraphStyle}>
                Coursera Education is not responsible for delays caused by banks, card networks or payment service providers after the refund has been initiated.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>11</div>
            <div>
              <h3 style={sectionTitleStyle}>Non-Refundable Situations</h3>
              <p style={paragraphStyle}>
                Subject to applicable consumer rights, a refund may generally not be available where:
              </p>
              <ul style={listStyle}>
                <li>The student has already accessed or downloaded substantial digital course content;</li>
                <li>The student has completed or substantially completed the course;</li>
                <li>The student simply changes their mind after accessing the digital content;</li>
                <li>The student fails to participate in the course after receiving valid access;</li>
                <li>The student provides incorrect information that prevents successful enrollment or delivery;</li>
                <li>The student violates the applicable course terms or conditions.</li>
              </ul>
              <p style={paragraphStyle}>
                These exclusions do not limit any mandatory rights or remedies available to consumers under applicable law.
              </p>
            </div>
          </section>

          {/* Section 12 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>12</div>
            <div>
              <h3 style={sectionTitleStyle}>Promotional Offers and Discounts</h3>
              <p style={paragraphStyle}>
                Courses purchased through promotional offers, discounts or special pricing may be subject to additional terms stated at the time of purchase.
              </p>
              <p style={paragraphStyle}>
                Where a promotional offer has specific refund conditions, those conditions will be communicated to the student before purchase.
              </p>
            </div>
          </section>

          {/* Section 13 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>13</div>
            <div>
              <h3 style={sectionTitleStyle}>Currency</h3>
              <p style={paragraphStyle}>
                Course prices may be displayed and charged in USD, particularly for international students.
              </p>
              <p style={paragraphStyle}>
                Where a refund is approved, the refund amount will generally correspond to the amount actually charged for the relevant transaction, subject to applicable adjustments required by the payment provider or applicable law.
              </p>
              <p style={paragraphStyle}>
                Any foreign-exchange difference resulting from currency conversion by a card issuer or financial institution may be outside Coursera Education’s control.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section style={sectionStyle}>
            <div style={numBadgeStyle}>14</div>
            <div>
              <h3 style={sectionTitleStyle}>Consumer Rights</h3>
              <p style={paragraphStyle}>
                Nothing in this policy is intended to exclude, restrict or waive any consumer rights or remedies that cannot legally be excluded under applicable UAE law.
              </p>
              <p style={paragraphStyle}>
                Coursera Education will handle legitimate consumer complaints and disputes fairly and in accordance with applicable legal requirements. The UAE Government confirms that consumers have rights relating to the quality and adequacy of services and that suppliers must provide clear information regarding their services, payment terms and contractual conditions.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section style={{ ...sectionStyle, borderBottom: "none", paddingBottom: 0 }}>
            <div style={numBadgeStyle}>15</div>
            <div>
              <h3 style={sectionTitleStyle}>Contact Us</h3>
              <p style={paragraphStyle}>
                For questions regarding cancellations, returns or refunds, please contact:
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
                  Office Location:
                </p>
                <p style={{ margin: 0, fontSize: "13.5px", color: "#6b5a56", lineHeight: 1.5 }}>
                  THE BINARY BY OMNIYAT, Office 1912-196<br />
                  Business Bay, Dubai, United Arab Emirates<br />
                  Website: <a href="https://courseraeducation.com" target="_blank" rel="noreferrer" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>courseraeducation.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* Legal Compliance Advisory Banner */}
          <div style={{ marginTop: "48px", backgroundColor: "rgba(201, 154, 61, 0.1)", border: "1px solid rgba(201, 154, 61, 0.3)", borderRadius: "18px", padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <AlertCircle style={{ width: 22, height: 22, color: "#C99A3D", flexShrink: 0, marginTop: "2px" }} />
            <div style={{ fontSize: "13px", color: "#6b5a56", lineHeight: 1.6 }}>
              <strong style={{ color: "#7A1F2B", display: "block", marginBottom: "4px" }}>Important UAE E-Commerce Compliance Notice</strong>
              As a UAE-licensed online education business, this policy adheres to United Arab Emirates consumer protection frameworks requiring e-commerce platforms to provide clear information regarding suppliers, digital service access, payment conditions, and refund procedures.
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
            <Link to="/refund-policy" style={{ color: "#7A1F2B", fontWeight: 700, textDecoration: "none" }}>Return &amp; Refund Policy</Link>
            <Link to="/lessons" style={{ color: "#6b5a56", textDecoration: "none" }}>Lessons</Link>
            <Link to="/pricing" style={{ color: "#6b5a56", textDecoration: "none" }}>Pricing</Link>
            <Link to="/contact" style={{ color: "#6b5a56", textDecoration: "none" }}>Contact</Link>
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
