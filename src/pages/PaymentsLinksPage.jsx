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
import { generateMerchantHash } from "../utils/hashUtil";

function buildCheckoutPath(orderId) {
  return `/checkout/${encodeURIComponent(orderId.trim())}`;
}

function makeOrderId() {
  return `ORD${Date.now().toString().slice(-10)}`;
}

/** PayVang merchant credentials — match createOrder curl headers */
function getPayinMerchantConfig() {
  return {
    merchantAppId:
      import.meta.env.VITE_MERCHANT_APP_ID || "ZEpNIaTHy20260712080032636",
    merchantSecretId:
      import.meta.env.VITE_MERCHANT_SECRET_ID ||
      "NCb+aCsOPig2sbMDbjhOP4xnd2ZPuzjt1f6s6o2nB4g=",
    merchantId:
      import.meta.env.VITE_MERCHANT_ID || "devendra@payvang.com",
  };
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
    setSubmitting(true);
    setCreatedLink(null);

    const { merchantAppId, merchantSecretId, merchantId } = getPayinMerchantConfig();
    const orderId = form.orderId.trim() || makeOrderId();
    const payableAmount = String(form.amount || "100");
    const origin = typeof window !== "undefined" ? window.location.origin : "https://courseraeducation.com";

    const merchantHash = generateMerchantHash(
      merchantSecretId,
      merchantId,
      orderId,
      payableAmount
    );

    // Same shape as:
    // POST /payins/createOrder with merchantAppId / merchantSecretId / merchantHash
    const payload = {
      appid: merchantAppId,
      callback_url:
        import.meta.env.VITE_PAYIN_CALLBACK_URL ||
        "https://api.courseraeducation.com/payinwebhook/afsReturn",
      cancel_url:
        import.meta.env.VITE_PAYIN_CANCEL_URL ||
        "https://webhook.site/929ae74c-d41c-460f-8ae1-c43882b33e7a",
      countryCode: form.currency === "AED" ? "UAE" : form.currency === "INR" ? "IN" : "UAE",
      currencyCode: form.currency || "USD",
      emailId: form.emailId.trim() || "dev@gmail.com",
      firstname: form.firstname.trim() || "Customer",
      lastname: "User",
      merchantId,
      mobileNo: "9716184021",
      orderId,
      payableAmount,
      paymentMode: "ONLINE",
      paymentRemarks: form.title.trim() || "Test payment",
      return_url:
        import.meta.env.VITE_PAYIN_RETURN_URL ||
        `${origin}/orderstatus`,
      txnType: "PAYIN",
      udf1: "CustomField1",
      udf2: "CustomField2",
      udf3: "CustomField3",
      udf4: "CustomField4",
      udf5: "CustomField5",
      vpaId: "9716184020@ptyes",
    };

    try {
      const res = await paymentApi.createOrder(payload, {
        auth: false,
        // Send exact curl header names only (avoid camelCase + lowercase duplicates)
        includePayVangHeaders: false,
        headers: {
          merchantAppId,
          merchantSecretId,
          merchantHash,
        },
      });

      if (res?.status === "fail" || res?.error) {
        throw new Error(res?.message || res?.error || "Order creation failed");
      }

      const data = res?.data && typeof res.data === "object" ? res.data : res;

      const createdOrderId =
        data?.orderId ||
        res?.orderId ||
        data?.order_id ||
        orderId;

      const paymentUrl =
        data?.paymentlink ||
        data?.paymentLink ||
        data?.paymentUrl ||
        res?.paymentlink ||
        res?.paymentUrl ||
        "";

      const responseAmount = data?.amount || form.amount;
      const responseEmail = data?.emailId || form.emailId;
      const responseMobile = data?.mobileNo || "";
      const ordRequestId = data?.ordRequestId || "";
      const statusMessage =
        data?.message || res?.message || "successfully created checkout";
      const statusCode = data?.statusCode || "";

      setForm((prev) => ({ ...prev, orderId: createdOrderId }));

      const path = `/checkoutpage/${encodeURIComponent(createdOrderId)}`;
      const url =
        paymentUrl ||
        `${typeof window !== "undefined" ? window.location.origin : ""}${path}`;

      setCreatedLink({
        orderId: createdOrderId,
        path,
        url,
        amount: responseAmount,
        currency: form.currency,
        title: form.title,
        emailId: responseEmail,
        mobileNo: responseMobile,
        ordRequestId,
        statusMessage,
        statusCode,
        apiStatus: res?.status || "success",
        apiResponse: res,
      });
    } catch (err) {
      console.error("createOrder failed:", err);
      setError(
        err?.message ||
          err?.data?.message ||
          err?.data?.error ||
          "Failed to create payment order. Check merchant credentials and API base URL."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function openCheckout(orderId) {
    // Prefer API paymentlink (absolute URL)
    if (createdLink?.url?.startsWith("http")) {
      window.open(createdLink.url, "_blank", "noopener,noreferrer");
      return;
    }

    const id = (orderId || form.orderId || createdLink?.orderId || "").trim();
    if (!id) {
      setError("Create a payment link first (Get Payment Link).");
      return;
    }
    navigate(`/checkoutpage/${encodeURIComponent(id)}`);
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
            Calls <code style={{ color: "#7A1F2B" }}>POST /payins/createOrder</code> with
            merchantAppId, merchantSecretId, and merchantHash — same as your curl.
          </p>

          <form onSubmit={handleGetPaymentLink} style={{ display: "grid", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Order ID</label>
              <input
                type="text"
                placeholder="e.g. ORD0805269915 (auto if empty)"
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
              {createdLink?.apiStatus === "success" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "rgba(22, 163, 74, 0.08)",
                    border: "1px solid rgba(22, 163, 74, 0.25)",
                    color: "#15803d",
                    borderRadius: "12px",
                    padding: "10px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "14px",
                  }}
                >
                  <Check style={{ width: 15, height: 15 }} />
                  {createdLink.statusMessage || "successfully created checkout"}
                  {createdLink.statusCode ? (
                    <span style={{ fontWeight: 600, opacity: 0.85 }}>
                      ({createdLink.statusCode})
                    </span>
                  ) : null}
                </div>
              )}

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
                  marginBottom: "12px",
                  lineHeight: 1.5,
                }}
              >
                {createdLink?.url || fullCheckoutUrl}
              </div>

              {createdLink && (
                <div
                  style={{
                    display: "grid",
                    gap: "6px",
                    marginBottom: "14px",
                    fontSize: "12px",
                    color: "#6b5a56",
                  }}
                >
                  <div>
                    <strong style={{ color: "#7A1F2B" }}>Order ID:</strong>{" "}
                    {createdLink.orderId}
                  </div>
                  {createdLink.ordRequestId ? (
                    <div>
                      <strong style={{ color: "#7A1F2B" }}>Request ID:</strong>{" "}
                      <span style={{ wordBreak: "break-all" }}>
                        {createdLink.ordRequestId}
                      </span>
                    </div>
                  ) : null}
                  {createdLink.emailId ? (
                    <div>
                      <strong style={{ color: "#7A1F2B" }}>Email:</strong>{" "}
                      {createdLink.emailId}
                    </div>
                  ) : null}
                  {createdLink.mobileNo ? (
                    <div>
                      <strong style={{ color: "#7A1F2B" }}>Mobile:</strong>{" "}
                      {createdLink.mobileNo}
                    </div>
                  ) : null}
                  <div>
                    <strong style={{ color: "#7A1F2B" }}>Amount:</strong>{" "}
                    {createdLink.currency} {createdLink.amount}
                  </div>
                </div>
              )}

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
