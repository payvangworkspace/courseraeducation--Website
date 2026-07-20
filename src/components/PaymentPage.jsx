import React, { useMemo, useState } from "react";
import Navbar from "./Navbar";
import ContactModal from "./ContactModel";

/**
 * Payment Page — Light Theme
 * Single-file React component, plain CSS (no Tailwind, no CSS modules).
 * Shares the visual language (colors, type, spacing, shadows) defined
 * in LandingPage.jsx so it can drop into the same app.
 *
 * PAYMENT GATEWAY INTEGRATION
 * ----------------------------------------------------------------
 * This page does NOT call any real payment provider yet. All charge
 * logic is isolated inside `processPayment()` below — that is the
 * single place to wire up a real gateway (Stripe, Razorpay, PayPal,
 * etc.) later. Everything else (form state, validation, UI states)
 * is provider-agnostic and can stay as-is.
 *
 * To integrate Stripe, for example:
 *   1. Load Stripe.js and create a PaymentIntent on your backend.
 *   2. Replace the mock `await new Promise(...)` below with a call
 *      to `stripe.confirmCardPayment(clientSecret, { payment_method: {...} })`.
 *   3. Swap the raw card-number/expiry/cvc inputs for Stripe Elements
 *      (recommended — keeps raw card data off your servers).
 *   4. Keep the same `status` state machine ("idle" | "processing" |
 *      "success" | "error") so the surrounding UI needs no changes.
 * ----------------------------------------------------------------
 */

const BRAND_NAME = "Coursera Education";

const PLAN = {
  name: "Team AI Training — Workshop Track",
  description: "Hands-on, instructor-led AI training tailored to your stack",
  seats: 5,
  pricePerSeat: 249,
  currency: "USD",
  includes: [
    "Custom syllabus & architecture review",
    "Live hands-on workshops",
    "Templates, labs & playbooks",
    "30 days of post-training support",
  ],
};

function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function detectCardBrand(number) {
  const n = number.replace(/\s+/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6(?:011|5)/.test(n)) return "Discover";
  return null;
}

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/**
 * Isolated "charge" function. Currently a mock that simulates network
 * latency and a randomish success outcome. Replace the internals with
 * a real payment-gateway API call — the function signature (returns a
 * Promise that resolves on success / rejects with an Error on failure)
 * is designed to stay stable across that swap.
 */
async function processPayment({ amount, currency, card, billing }) {
  // TODO: replace with real gateway integration, e.g.:
  //   const res = await fetch("/api/create-payment-intent", { ... });
  //   const { clientSecret } = await res.json();
  //   return stripe.confirmCardPayment(clientSecret, { payment_method: { card, billing_details: billing } });
  await new Promise((resolve) => setTimeout(resolve, 1400));

  if (!card.number || card.number.replace(/\s/g, "").length < 12) {
    const err = new Error("Card number looks invalid.");
    throw err;
  }

  return {
    id: `pay_mock_${Math.random().toString(36).slice(2, 11)}`,
    amount,
    currency,
    status: "succeeded",
    createdAt: new Date().toISOString(),
  };
}

export default function PaymentPage() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    country: "United States",
    zip: "",
  });
  const [status, setStatus] = useState("idle"); // idle | processing | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  const subtotal = PLAN.seats * PLAN.pricePerSeat;
  const tax = useMemo(() => Math.round(subtotal * 0.08 * 100) / 100, [subtotal]);
  const total = useMemo(() => Math.round((subtotal + tax) * 100) / 100, [subtotal, tax]);

  const cardBrand = detectCardBrand(form.cardNumber);

  const isFormValid =
    form.email.includes("@") &&
    form.name.trim().length > 1 &&
    form.cardNumber.replace(/\s/g, "").length >= 12 &&
    /^\d{2}\/\d{2}$/.test(form.expiry) &&
    form.cvc.length >= 3 &&
    form.zip.trim().length >= 3;

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function openContact(e) {
    if (e && e.preventDefault) e.preventDefault();
    setContactOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid || status === "processing") return;

    setStatus("processing");
    setErrorMsg("");

    try {
      const result = await processPayment({
        amount: total,
        currency: PLAN.currency,
        card: {
          number: form.cardNumber,
          exp: form.expiry,
          cvc: form.cvc,
        },
        billing: {
          name: form.name,
          email: form.email,
          address: { country: form.country, postal_code: form.zip },
        },
      });
      setReceipt(result);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="ld-root">
      <style>{CSS}</style>

      <Navbar brandName={BRAND_NAME} active="Payment" onCtaClick={openContact} />

      <section className="pay-section">
        <div className="pay-head">
          <div className="ld-pill">
            <span className="ld-dot" /> Secure checkout
          </div>
          <h1>Complete your payment</h1>
          <p>Your training program is one step away. Payment details are used only to process this order.</p>
        </div>

        {status === "success" ? (
          <SuccessPanel receipt={receipt} plan={PLAN} total={total} />
        ) : (
          <div className="pay-grid">
            {/* ORDER SUMMARY */}
            <aside className="pay-summary">
              <h2>Order summary</h2>
              <div className="pay-plan">
                <div className="pay-plan-title">{PLAN.name}</div>
                <p className="pay-plan-desc">{PLAN.description}</p>
                <ul className="ld-check-list">
                  {PLAN.includes.map((p) => (
                    <li key={p}>
                      <span className="ld-check ld-check--tick">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pay-line">
                <span>Seats</span>
                <span>{PLAN.seats}</span>
              </div>
              <div className="pay-line">
                <span>Price per seat</span>
                <span>{formatCurrency(PLAN.pricePerSeat, PLAN.currency)}</span>
              </div>
              <div className="pay-line">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, PLAN.currency)}</span>
              </div>
              <div className="pay-line">
                <span>Estimated tax</span>
                <span>{formatCurrency(tax, PLAN.currency)}</span>
              </div>
              <div className="pay-line pay-line--total">
                <span>Total due today</span>
                <span>{formatCurrency(total, PLAN.currency)}</span>
              </div>

              <div className="pay-secure-note">
                <span className="pay-lock">🔒</span> Payments are encrypted. Card details never touch our servers directly once a real gateway is connected.
              </div>
            </aside>

            {/* PAYMENT FORM */}
            <form className="pay-form" onSubmit={handleSubmit} noValidate>
              <h2>Payment details</h2>

              <div className="pay-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="pay-field">
                <label htmlFor="name">Name on card</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Alex Morgan"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  autoComplete="cc-name"
                  required
                />
              </div>

              <div className="pay-field">
                <label htmlFor="cardNumber">Card number</label>
                <div className="pay-card-input">
                  <input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    onChange={(e) => updateField("cardNumber", formatCardNumber(e.target.value))}
                    autoComplete="cc-number"
                    required
                  />
                  {cardBrand && <span className="pay-card-brand">{cardBrand}</span>}
                </div>
              </div>

              <div className="pay-field-row">
                <div className="pay-field">
                  <label htmlFor="expiry">Expiry</label>
                  <input
                    id="expiry"
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={(e) => updateField("expiry", formatExpiry(e.target.value))}
                    autoComplete="cc-exp"
                    required
                  />
                </div>
                <div className="pay-field">
                  <label htmlFor="cvc">CVC</label>
                  <input
                    id="cvc"
                    type="text"
                    inputMode="numeric"
                    placeholder="123"
                    value={form.cvc}
                    onChange={(e) => updateField("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
                    autoComplete="cc-csc"
                    required
                  />
                </div>
              </div>

              <div className="pay-field-row">
                <div className="pay-field">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                  >
                    <option>United States</option>
                    <option>India</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="pay-field">
                  <label htmlFor="zip">ZIP / Postal code</label>
                  <input
                    id="zip"
                    type="text"
                    placeholder="94105"
                    value={form.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                    autoComplete="postal-code"
                    required
                  />
                </div>
              </div>

              {status === "error" && (
                <div className="pay-alert pay-alert--error">
                  {errorMsg || "Payment failed. Please check your details and try again."}
                </div>
              )}

              <button
                type="submit"
                className="ld-btn ld-btn--primary pay-submit"
                disabled={!isFormValid || status === "processing"}
              >
                {status === "processing" ? (
                  <>
                    <span className="pay-spinner" aria-hidden="true" /> Processing…
                  </>
                ) : (
                  <>Pay {formatCurrency(total, PLAN.currency)} <span aria-hidden>→</span></>
                )}
              </button>

              <p className="pay-fine-print">
                By paying you agree to our Terms and Cancellation Policy. This is a demo checkout — no real charge is made.
              </p>
            </form>
          </div>
        )}
      </section>

      <footer className="ld-footer">
        <div className="ld-footer-bottom">© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</div>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}

function SuccessPanel({ receipt, plan, total }) {
  return (
    <div className="pay-success">
      <div className="pay-success-icon">✓</div>
      <h2>Payment received</h2>
      <p>Thanks — your seats for {plan.name} are confirmed. A receipt has been sent to your email.</p>

      <div className="pay-receipt">
        <div className="pay-line">
          <span>Reference</span>
          <span>{receipt?.id}</span>
        </div>
        <div className="pay-line">
          <span>Amount</span>
          <span>{formatCurrency(total, plan.currency)}</span>
        </div>
        <div className="pay-line">
          <span>Status</span>
          <span className="pay-status-pill">{receipt?.status}</span>
        </div>
      </div>

      <a href="/" className="ld-btn ld-btn--outline">Back to home</a>
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
  --accent-red: #dc2626;
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

.ld-nav { position: sticky; top: 0; z-index: 50; padding: 18px 24px; }
.ld-nav-inner {
  max-width: 1180px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;
  background: #ffffff; border: 1px solid var(--card-border); border-radius: 999px;
  padding: 10px 14px 10px 20px; box-shadow: var(--shadow-sm);
}
.ld-logo { font-family: var(--font-display); font-weight: 700; letter-spacing: 0.02em; color: var(--text-0); text-decoration: none; display: flex; align-items: center; gap: 8px; font-size: 15px; }
.ld-logo-mark { background: var(--gradient); -webkit-background-clip: text; background-clip: text; color: transparent; font-size: 18px; }
.ld-nav-links { display: flex; gap: 28px; }
.ld-nav-links a { color: var(--text-1); text-decoration: none; font-size: 14.5px; font-weight: 500; }
.ld-nav-link--active { color: var(--text-0) !important; }

.ld-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 22px; border-radius: 999px; font-weight: 600; font-size: 14.5px; text-decoration: none;
  border: 1px solid transparent; cursor: pointer; transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  font-family: var(--font-body);
}
.ld-btn:hover { transform: translateY(-1px); }
.ld-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
.ld-btn--sm { padding: 9px 16px; font-size: 13.5px; }
.ld-btn--primary { background: var(--gradient); color: #ffffff; box-shadow: 0 10px 24px -8px rgba(122,23,53,0.45); }
.ld-btn--outline { background: #ffffff; color: var(--text-0); border-color: var(--card-border); }
.ld-btn--outline:hover { background: var(--bg-1); }

.ld-pill { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-1); border: 1px solid var(--card-border); background: #fff; padding: 7px 16px; border-radius: 999px; margin-bottom: 20px; }
.ld-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-teal); display: inline-block; }
.ld-check { color: var(--accent-orange); font-weight: 700; font-size: 12px; }
.ld-check--tick { color: var(--accent-teal); }
.ld-check-list { list-style: none; margin: 0 0 4px; padding: 0; display: flex; flex-direction: column; gap: 9px; }
.ld-check-list li { display: flex; align-items: center; gap: 9px; font-size: 13.5px; color: var(--text-1); }

/* PAYMENT PAGE */
.pay-section { max-width: 1080px; margin: 0 auto; padding: 64px 24px 100px; }
.pay-head { text-align: center; max-width: 560px; margin: 0 auto 48px; }
.pay-head h1 { font-family: var(--font-display); font-size: clamp(1.9rem, 3.4vw, 2.5rem); font-weight: 700; margin: 0 0 12px; letter-spacing: -0.01em; }
.pay-head p { color: var(--text-1); font-size: 16px; }

.pay-grid { display: grid; grid-template-columns: 1fr 1.15fr; gap: 26px; align-items: start; }
@media (max-width: 860px) { .pay-grid { grid-template-columns: 1fr; } }

.pay-summary, .pay-form {
  background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-lg);
  padding: 30px; box-shadow: var(--shadow-sm);
}
.pay-summary h2, .pay-form h2 { font-family: var(--font-display); font-size: 19px; margin: 0 0 20px; }

.pay-plan { background: var(--bg-1); border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 18px; margin-bottom: 22px; }
.pay-plan-title { font-weight: 700; font-size: 15px; margin-bottom: 6px; }
.pay-plan-desc { color: var(--text-1); font-size: 13.5px; margin: 0 0 14px; }

.pay-line { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-1); padding: 9px 0; border-bottom: 1px dashed var(--card-border); }
.pay-line--total { border-bottom: none; padding-top: 14px; font-weight: 700; font-size: 16px; color: var(--text-0); }
.pay-line--total span:last-child { color: var(--accent-orange); }

.pay-secure-note { display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px; color: var(--text-2); margin-top: 20px; }
.pay-lock { font-size: 14px; }

.pay-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.pay-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pay-field label { font-size: 12.5px; font-weight: 600; color: var(--text-1); }
.pay-field input, .pay-field select {
  border: 1px solid var(--card-border); border-radius: 12px; padding: 12px 14px; font-size: 14.5px;
  font-family: var(--font-body); color: var(--text-0); background: #ffffff; outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.pay-field input:focus, .pay-field select:focus { border-color: var(--accent-teal); box-shadow: 0 0 0 3px rgba(193,146,47,0.16); }
.pay-card-input { position: relative; }
.pay-card-brand { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 12px; font-weight: 700; color: var(--accent-teal); }

.pay-alert { border-radius: 12px; padding: 12px 14px; font-size: 13.5px; margin-bottom: 16px; }
.pay-alert--error { background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.25); color: var(--accent-red); }

.pay-submit { width: 100%; padding: 14px 22px; font-size: 15px; margin-top: 6px; }
.pay-spinner { width: 15px; height: 15px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.5); border-top-color: #fff; animation: pay-spin .7s linear infinite; display: inline-block; }
@keyframes pay-spin { to { transform: rotate(360deg); } }

.pay-fine-print { font-size: 12px; color: var(--text-2); text-align: center; margin: 14px 0 0; }

.pay-success {
  max-width: 480px; margin: 0 auto; text-align: center;
  background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius-lg);
  padding: 46px 32px; box-shadow: var(--shadow-md);
}
.pay-success-icon {
  width: 56px; height: 56px; border-radius: 50%; background: var(--gradient); color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700;
  margin: 0 auto 20px;
}
.pay-success h2 { font-family: var(--font-display); font-size: 22px; margin: 0 0 10px; }
.pay-success p { color: var(--text-1); font-size: 14.5px; margin: 0 0 24px; }
.pay-receipt { text-align: left; background: var(--bg-1); border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: 16px 18px; margin-bottom: 26px; }
.pay-status-pill { color: var(--accent-green); font-weight: 700; text-transform: capitalize; }

.ld-footer { padding: 40px 24px 30px; background: var(--bg-1); border-top: 1px solid var(--card-border); }
.ld-footer-bottom { max-width: 1180px; margin: 0 auto; font-size: 12.5px; color: var(--text-2); text-align: center; }

/* CONTACT MODAL */
.ld-modal-overlay { position: fixed; inset: 0; background: rgba(36,20,23,0.55); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 24px; }
.ld-modal { position: relative; background: #ffffff; border-radius: var(--radius-lg); max-width: 480px; width: 100%; padding: 40px; box-shadow: var(--shadow-md); max-height: 90vh; overflow-y: auto; }
.ld-modal-close { position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--card-border); background: #fff; cursor: pointer; font-size: 14px; color: var(--text-1); }
.ld-modal-close:hover { background: var(--bg-1); }
.ld-modal-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: var(--accent-orange); border: 1px solid rgba(122,23,53,0.30); background: rgba(122,23,53,0.06); padding: 8px 18px; border-radius: 999px; margin-bottom: 20px; }
.ld-modal h3 { font-family: var(--font-display); font-size: 26px; margin: 0 0 12px; color: var(--text-0); }
.ld-modal-sub { color: var(--text-1); font-size: 14.5px; margin: 0 0 28px; }
.ld-field { margin-bottom: 20px; }
.ld-field label { display: block; font-size: 14px; font-weight: 600; color: var(--text-0); margin-bottom: 8px; }
.ld-field input, .ld-field textarea { width: 100%; border: 1px solid var(--card-border); background: var(--bg-1); border-radius: 12px; padding: 14px 16px; font-size: 14.5px; font-family: var(--font-body); color: var(--text-0); resize: vertical; }
.ld-field textarea { min-height: 110px; }
.ld-field input:focus, .ld-field textarea:focus { outline: 2px solid var(--accent-teal); outline-offset: 1px; }
.ld-modal-submit { width: 100%; justify-content: center; margin-top: 6px; }
.ld-modal-success { text-align: center; padding: 20px 0; }
.ld-modal-success-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(22,163,74,0.12); color: var(--accent-green); display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 20px; }
`;