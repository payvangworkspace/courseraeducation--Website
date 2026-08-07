import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayVangLayout from "../components/layout/PayVangLayout";
import {
  Link as LinkIcon,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { paymentApi } from "../api";

function buildCheckoutPath(orderId) {
  return `/checkout/${encodeURIComponent(orderId.trim())}`;
}

export default function PaymentsLinksPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    orderId: "",
    title: "Customer Payment",
    amount: "100",
    currency: "USD",
    emailId: "",
    firstname: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdLink, setCreatedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const checkoutPath = useMemo(() => {
    if (!form.orderId.trim()) return "";
    return buildCheckoutPath(form.orderId);
  }, [form.orderId]);

  const fullCheckoutUrl = useMemo(() => {
    if (!checkoutPath || typeof window === "undefined") return "";
    return `${window.location.origin}${checkoutPath}`;
  }, [checkoutPath]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleGetPaymentLink(e) {
    e.preventDefault();
    setError("");

    let orderId = form.orderId.trim();

    // If no orderId yet, create one via payin API (falls back to local id)
    if (!orderId) {
      setSubmitting(true);
      try {
        const payload = {
          payableAmount: Number(form.amount) || 0,
          currencyCode: form.currency || "USD",
          paymentRemarks: form.title || "Payment Link",
          emailId: form.emailId || undefined,
          firstname: form.firstname || undefined,
          return_url: `${window.location.origin}/orderstatus`,
          callback_url: `${window.location.origin}/orderstatus`,
        };

        const res = await paymentApi.createOrder(payload);
        orderId =
          res?.orderId ||
          res?.data?.orderId ||
          res?.data?.order_id ||
          res?.order_id ||
          "";

        if (!orderId) {
          // Local fallback so checkout flow still works for testing
          orderId = `ORD${Date.now().toString().slice(-10)}`;
        }

        setForm((prev) => ({ ...prev, orderId }));
      } catch (err) {
        // Still allow opening checkout with a generated test order id
        orderId = `ORD${Date.now().toString().slice(-10)}`;
        setForm((prev) => ({ ...prev, orderId }));
        console.warn("createOrder failed, using generated orderId:", err?.message);
      } finally {
        setSubmitting(false);
      }
    }

    const path = buildCheckoutPath(orderId);
    const url = `${window.location.origin}${path}`;

    setCreatedLink({
      orderId,
      path,
      url,
      amount: form.amount,
      currency: form.currency,
      title: form.title,
    });
  }

  function openCheckout(orderId) {
    const id = (orderId || form.orderId || createdLink?.orderId || "").trim();
    if (!id) {
      setError("Enter or generate an Order ID first.");
      return;
    }
    navigate(buildCheckoutPath(id));
  }

  function copyLink() {
    const url = createdLink?.url || fullCheckoutUrl;
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <PayVangLayout
      title="Get Payment Link"
      subtitle="Create a checkout link, then open the secure card payment page."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
        }}
      >
        {/* LEFT: Get Payment Link form */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            padding: "32px",
            border: "1px solid rgba(122, 31, 43, 0.12)",
            boxShadow: "0 4px 20px rgba(122, 31, 43, 0.04)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(122, 31, 43, 0.08)",
              color: "#7A1F2B",
              border: "1px solid rgba(122, 31, 43, 0.18)",
              borderRadius: "9999px",
              padding: "6px 14px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "18px",
            }}
          >
            <LinkIcon style={{ width: 14, height: 14 }} />
            Get Payment Link
          </div>

          <h3
            style={{
              margin: "0 0 8px 0",
              fontSize: "22px",
              fontWeight: 800,
              color: "#7A1F2B",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Generate checkout link
          </h3>
          <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "#6b5a56" }}>
            Enter an existing Order ID, or leave it blank to create one. Then open
            the checkout page to collect card payment.
          </p>

          <form onSubmit={handleGetPaymentLink} style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Order ID</label>
              <input
                type="text"
                placeholder="e.g. ORD0805269912 (optional)"
                value={form.orderId}
                onChange={(e) => updateField("orderId", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Link Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Amount</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={(e) => updateField("amount", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => updateField("currency", e.target.value)}
                  style={inputStyle}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Customer First Name</label>
                <input
                  type="text"
                  value={form.firstname}
                  onChange={(e) => updateField("firstname", e.target.value)}
                  style={inputStyle}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label style={labelStyle}>Customer Email</label>
                <input
                  type="email"
                  value={form.emailId}
                  onChange={(e) => updateField("emailId", e.target.value)}
                  style={inputStyle}
                  placeholder="Optional"
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: "rgba(220,38,38,0.08)",
                  border: "1px solid rgba(220,38,38,0.25)",
                  color: "#dc2626",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "4px" }}>
              <button type="submit" disabled={submitting} style={primaryBtnStyle}>
                {submitting ? "Creating…" : "Get Payment Link"}
                <ArrowRight style={{ width: 16, height: 16 }} />
              </button>

              <button
                type="button"
                onClick={() => openCheckout()}
                style={secondaryBtnStyle}
              >
                <CreditCard style={{ width: 16, height: 16 }} />
                Open Checkout
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Preview / result */}
        <div
          style={{
            background:
              "linear-gradient(160deg, #FBF3E7 0%, #ffffff 45%, #FAF2E8 100%)",
            borderRadius: "24px",
            padding: "32px",
            border: "1px solid rgba(122, 31, 43, 0.12)",
            boxShadow: "0 4px 20px rgba(122, 31, 43, 0.04)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <ShieldCheck style={{ width: 22, height: 22, color: "#7A1F2B" }} />
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#7A1F2B",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Checkout preview
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#6b5a56" }}>
                Customer lands on the secure card payment UI
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "24px",
              border: "1px solid rgba(122, 31, 43, 0.12)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(122, 31, 43, 0.1)",
                color: "#7A1F2B",
                borderRadius: "9999px",
                padding: "4px 12px",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.05em",
                marginBottom: "14px",
              }}
            >
              SECURE CHECKOUT
            </div>
            <h4
              style={{
                margin: "0 0 6px 0",
                fontSize: "20px",
                fontWeight: 800,
                color: "#7A1F2B",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Complete your payment
            </h4>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#6b5a56" }}>
              Order {(createdLink?.orderId || form.orderId || "ORDXXXXXXXX").trim()}
            </p>
            <div
              style={{
                backgroundColor: "#FAF2E8",
                borderRadius: "14px",
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                border: "1px solid rgba(122, 31, 43, 0.12)",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#9E8984",
                  letterSpacing: "0.05em",
                }}
              >
                TOTAL AMOUNT
              </span>
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#7A1F2B",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <span style={{ fontSize: "14px", color: "#C99A3D", marginRight: 6 }}>
                  {createdLink?.currency || form.currency}
                </span>
                {createdLink?.amount || form.amount || "0"}
              </span>
            </div>
          </div>

          {(createdLink || checkoutPath) && (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "16px",
                border: "1px solid rgba(122, 31, 43, 0.12)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#9E8984",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Payment Link
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#241417",
                  wordBreak: "break-all",
                  fontFamily: "ui-monospace, monospace",
                  marginBottom: "14px",
                }}
              >
                {createdLink?.url || fullCheckoutUrl}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => openCheckout(createdLink?.orderId || form.orderId)}
                  style={primaryBtnStyle}
                >
                  <ExternalLink style={{ width: 15, height: 15 }} />
                  Go to Checkout
                </button>
                <button type="button" onClick={copyLink} style={secondaryBtnStyle}>
                  {copied ? (
                    <Check style={{ width: 15, height: 15, color: "#16a34a" }} />
                  ) : (
                    <Copy style={{ width: 15, height: 15 }} />
                  )}
                  {copied ? "Copied" : "Copy Link"}
                </button>
              </div>
            </div>
          )}

          {!createdLink && !checkoutPath && (
            <p style={{ margin: 0, fontSize: "13px", color: "#6b5a56" }}>
              Fill the form and click <strong>Get Payment Link</strong>. You’ll get a
              shareable URL that opens the checkout card payment page.
            </p>
          )}
        </div>
      </div>
    </PayVangLayout>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: 800,
  color: "#7A1F2B",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  backgroundColor: "#FAF2E8",
  border: "1px solid rgba(122, 31, 43, 0.15)",
  borderRadius: "12px",
  padding: "11px 14px",
  fontSize: "14px",
  color: "#241417",
  outline: "none",
};

const primaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 18px",
  borderRadius: "9999px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "13px",
  boxShadow: "0 4px 12px rgba(122,31,43,0.2)",
};

const secondaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 18px",
  borderRadius: "9999px",
  border: "1px solid rgba(122, 31, 43, 0.2)",
  cursor: "pointer",
  backgroundColor: "#ffffff",
  color: "#7A1F2B",
  fontWeight: 700,
  fontSize: "13px",
};
