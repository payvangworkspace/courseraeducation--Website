import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayVangLayout from "../components/layout/PayVangLayout";
import {
  Link as LinkIcon,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { merchantApi, paymentApi, unwrapList } from "../api";
import { generateMerchantHash } from "../utils/hashUtil";

function makeOrderId() {
  return `ORD${Date.now().toString().slice(-10)}`;
}

function getPayinMerchantConfig() {
  return {
    merchantAppId:
      import.meta.env.VITE_MERCHANT_APP_ID || "ZEpNIaTHy20260712080032636",
    merchantSecretId:
      import.meta.env.VITE_MERCHANT_SECRET_ID ||
      "NCb+aCsOPig2sbMDbjhOP4xnd2ZPuzjt1f6s6o2nB4g=",
  };
}

const INITIAL_FORM = {
  merchantId: "",
  txnType: "PAYIN",
  paymentMode: "",
  countryCode: "",
  currencyCode: "",
  payableAmount: "",
  orderId: makeOrderId(),
  customerName: "",
  emailId: "",
  mobileNo: "",
  vpaId: "",
  paymentRemarks: "",
};

const PAYMENT_MODES = ["ONLINE", "UPI", "CARD", "NETBANKING", "WALLET"];
const COUNTRIES = [
  { code: "UAE", label: "UAE" },
  { code: "IN", label: "India" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
];
const CURRENCIES = ["USD", "AED", "INR", "EUR", "GBP"];

const labelStyle = {
  display: "block",
  fontSize: "11.5px",
  fontWeight: 800,
  color: "#7A1F2B",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "8px",
};

const fieldStyle = {
  width: "100%",
  height: "44px",
  backgroundColor: "#FAF2E8",
  border: "1px solid rgba(122, 31, 43, 0.15)",
  color: "#241417",
  fontSize: "13.5px",
  fontWeight: 500,
  borderRadius: "12px",
  padding: "0 16px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const selectStyle = {
  ...fieldStyle,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237A1F2B' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: "40px",
  cursor: "pointer",
};

function Field({ label, required, error, children, full }) {
  return (
    <div className={full ? "sm:col-span-2" : undefined} style={{ minWidth: 0 }}>
      <label style={labelStyle}>
        {label}
        {required ? <span style={{ color: "#C99A3D", marginLeft: 4 }}>*</span> : null}
      </label>
      {children}
      {error ? (
        <p style={{ margin: "6px 0 0", fontSize: "12px", fontWeight: 600, color: "#b91c1c" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function themedFocus(hasError) {
  return {
    onFocus: (e) => {
      e.target.style.borderColor = hasError ? "#dc2626" : "#7A1F2B";
      e.target.style.boxShadow = hasError
        ? "0 0 0 3px rgba(220, 38, 38, 0.12)"
        : "0 0 0 3px rgba(122, 31, 43, 0.14)";
      e.target.style.backgroundColor = "#fffdf9";
    },
    onBlur: (e) => {
      e.target.style.borderColor = hasError
        ? "rgba(220, 38, 38, 0.45)"
        : "rgba(122, 31, 43, 0.15)";
      e.target.style.boxShadow = "none";
      e.target.style.backgroundColor = "#FAF2E8";
    },
  };
}

export default function PaymentsLinksPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [merchants, setMerchants] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [createdLink, setCreatedLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [vpaVerified, setVpaVerified] = useState(false);

  useEffect(() => {
    merchantApi
      .getAllMerchantList({ start: 0, size: "25", keyword: "" })
      .then((res) => {
        const list = unwrapList(res).map((m) => {
          const id = m.userId || m.id || m.merchantId || m.email || "";
          const name = m.fullName || m.name || m.businessName || id;
          return { id, name };
        });
        setMerchants(list.filter((m) => m.id));
      })
      .catch(() => setMerchants([]));
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    setServerError("");
    if (field === "vpaId") setVpaVerified(false);
  }

  function validate() {
    const next = {};
    if (!form.merchantId) next.merchantId = "Select a merchant";
    if (!form.txnType) next.txnType = "Transaction type is required";
    if (!form.paymentMode) next.paymentMode = "Payment mode is required";
    if (!form.countryCode) next.countryCode = "Country is required";
    if (!form.currencyCode) next.currencyCode = "Currency is required";
    if (!form.payableAmount || Number(form.payableAmount) <= 0) {
      next.payableAmount = "Enter a valid payable amount";
    }
    if (!form.orderId.trim()) next.orderId = "Order Request ID is required";
    if (!form.customerName.trim()) next.customerName = "Customer name is required";
    if (!form.emailId.trim() || !form.emailId.includes("@")) {
      next.emailId = "Valid customer email is required";
    }
    if (!form.mobileNo.trim() || form.mobileNo.trim().length < 8) {
      next.mobileNo = "Valid contact number is required";
    }
    if (!form.vpaId.trim()) next.vpaId = "VPA ID is required";
    if (!form.paymentRemarks.trim()) next.paymentRemarks = "Payment remark is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleClear() {
    setForm({ ...INITIAL_FORM, orderId: makeOrderId() });
    setErrors({});
    setServerError("");
    setCreatedLink(null);
    setVpaVerified(false);
  }

  function handleVerifyVpa() {
    if (!form.vpaId.trim()) {
      setErrors((prev) => ({ ...prev, vpaId: "Enter VPA to verify" }));
      return;
    }
    setVpaVerified(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");
    setCreatedLink(null);

    const { merchantAppId, merchantSecretId } = getPayinMerchantConfig();
    const orderId = form.orderId.trim();
    const payableAmount = String(form.payableAmount).trim();
    const merchantId = form.merchantId.trim();
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://courseraeducation.com";

    const nameParts = form.customerName.trim().split(/\s+/);
    const firstname = nameParts[0] || "";
    const lastname = nameParts.slice(1).join(" ") || "User";

    const merchantHash = generateMerchantHash(
      merchantSecretId,
      merchantId,
      orderId,
      payableAmount
    );

    const payload = {
      appid: merchantAppId,
      callback_url:
        import.meta.env.VITE_PAYIN_CALLBACK_URL ||
        "https://api.courseraeducation.com/payinwebhook/afsReturn",
      cancel_url:
        import.meta.env.VITE_PAYIN_CANCEL_URL ||
        "https://webhook.site/929ae74c-d41c-460f-8ae1-c43882b33e7a",
      countryCode: form.countryCode,
      currencyCode: form.currencyCode,
      emailId: form.emailId.trim(),
      firstname,
      lastname,
      merchantId,
      mobileNo: form.mobileNo.trim(),
      orderId,
      payableAmount,
      paymentMode: form.paymentMode,
      paymentRemarks: form.paymentRemarks.trim(),
      return_url:
        import.meta.env.VITE_PAYIN_RETURN_URL || `${origin}/orderstatus`,
      txnType: form.txnType,
      udf1: "CustomField1",
      udf2: "CustomField2",
      udf3: "CustomField3",
      udf4: "CustomField4",
      udf5: "CustomField5",
      vpaId: form.vpaId.trim(),
    };

    try {
      const res = await paymentApi.createOrder(payload, {
        auth: false,
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
      const createdOrderId = data?.orderId || orderId;
      const paymentUrl =
        data?.paymentlink ||
        data?.paymentLink ||
        data?.paymentUrl ||
        res?.paymentlink ||
        "";

      const path = `/checkoutpage/${encodeURIComponent(createdOrderId)}`;
      const url =
        paymentUrl ||
        `${typeof window !== "undefined" ? window.location.origin : ""}${path}`;

      setCreatedLink({
        orderId: createdOrderId,
        url,
        amount: data?.amount || payableAmount,
        currency: form.currencyCode,
        emailId: data?.emailId || form.emailId,
        mobileNo: data?.mobileNo || form.mobileNo,
        ordRequestId: data?.ordRequestId || "",
        statusMessage: data?.message || res?.message || "successfully created checkout",
        statusCode: data?.statusCode || "",
        apiStatus: res?.status || "success",
      });
    } catch (err) {
      setServerError(
        err?.message ||
          err?.data?.message ||
          err?.data?.error ||
          "Failed to create payment order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function openCheckout() {
    if (createdLink?.url?.startsWith("http")) {
      window.open(createdLink.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (createdLink?.orderId) {
      navigate(`/checkoutpage/${encodeURIComponent(createdLink.orderId)}`);
    }
  }

  function copyLink() {
    if (!createdLink?.url) return;
    navigator.clipboard.writeText(createdLink.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const inputBorder = (hasError) => ({
    ...fieldStyle,
    borderColor: hasError ? "rgba(220, 38, 38, 0.45)" : "rgba(122, 31, 43, 0.15)",
  });

  const selectBorder = (hasError) => ({
    ...selectStyle,
    borderColor: hasError ? "rgba(220, 38, 38, 0.45)" : "rgba(122, 31, 43, 0.15)",
  });

  return (
    <PayVangLayout
      title="Get Payment Link"
      subtitle="Create a checkout link, then open the secure card payment page."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(280px, 0.8fr)",
          gap: "24px",
          alignItems: "start",
        }}
        className="max-[980px]:!grid-cols-1"
      >
        {/* FORM CARD */}
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "24px",
            padding: "28px 32px 32px",
            border: "1px solid rgba(122, 31, 43, 0.12)",
            boxShadow: "0 4px 20px rgba(122, 31, 43, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "22px",
              paddingBottom: "16px",
              borderBottom: "1px solid rgba(122, 31, 43, 0.1)",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "12px",
                  backgroundColor: "rgba(122, 31, 43, 0.08)",
                  color: "#7A1F2B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LinkIcon style={{ width: 18, height: 18 }} />
              </div>
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
                  Create Payment Order
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6b5a56" }}>
                  All fields map to <code>POST /payins/createOrder</code>
                </p>
              </div>
            </div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: "#7A1F2B",
                backgroundColor: "rgba(122, 31, 43, 0.08)",
                border: "1px solid rgba(122, 31, 43, 0.15)",
                padding: "6px 12px",
                borderRadius: "9999px",
              }}
            >
              PAYIN FORM
            </span>
          </div>

          {serverError && (
            <div
              style={{
                marginBottom: "18px",
                padding: "12px 14px",
                borderRadius: "12px",
                backgroundColor: "rgba(220,38,38,0.08)",
                border: "1px solid rgba(220,38,38,0.25)",
                color: "#b91c1c",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
              <Field label="Select Merchant" required error={errors.merchantId}>
                <select
                  value={form.merchantId}
                  onChange={(e) => updateField("merchantId", e.target.value)}
                  style={selectBorder(!!errors.merchantId)}
                  {...themedFocus(!!errors.merchantId)}
                >
                  <option value="">Select Merchant</option>
                  {merchants.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.id})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Select Transaction Type" required error={errors.txnType}>
                <select
                  value={form.txnType}
                  onChange={(e) => updateField("txnType", e.target.value)}
                  style={selectBorder(!!errors.txnType)}
                  {...themedFocus(!!errors.txnType)}
                >
                  <option value="PAYIN">PAYIN</option>
                  <option value="PAYOUT">PAYOUT</option>
                </select>
              </Field>

              <Field label="Select Payment Mode" required error={errors.paymentMode}>
                <select
                  value={form.paymentMode}
                  onChange={(e) => updateField("paymentMode", e.target.value)}
                  style={selectBorder(!!errors.paymentMode)}
                  {...themedFocus(!!errors.paymentMode)}
                >
                  <option value="">Select Payment Type</option>
                  {PAYMENT_MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Country" required error={errors.countryCode}>
                <select
                  value={form.countryCode}
                  onChange={(e) => updateField("countryCode", e.target.value)}
                  style={selectBorder(!!errors.countryCode)}
                  {...themedFocus(!!errors.countryCode)}
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Currency" required error={errors.currencyCode}>
                <select
                  value={form.currencyCode}
                  onChange={(e) => updateField("currencyCode", e.target.value)}
                  style={selectBorder(!!errors.currencyCode)}
                  {...themedFocus(!!errors.currencyCode)}
                >
                  <option value="">Select Currency</option>
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Payable Amount" required error={errors.payableAmount}>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Enter payable amount"
                  value={form.payableAmount}
                  onChange={(e) => updateField("payableAmount", e.target.value)}
                  style={inputBorder(!!errors.payableAmount)}
                  {...themedFocus(!!errors.payableAmount)}
                />
              </Field>

              <Field label="Order Request ID" required error={errors.orderId}>
                <input
                  type="text"
                  value={form.orderId}
                  onChange={(e) => updateField("orderId", e.target.value)}
                  style={inputBorder(!!errors.orderId)}
                  {...themedFocus(!!errors.orderId)}
                />
              </Field>

              <Field label="Customer Name" required error={errors.customerName}>
                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={form.customerName}
                  onChange={(e) => updateField("customerName", e.target.value)}
                  style={inputBorder(!!errors.customerName)}
                  {...themedFocus(!!errors.customerName)}
                />
              </Field>

              <Field label="Customer Email ID" required error={errors.emailId}>
                <input
                  type="email"
                  placeholder="Enter customer email id"
                  value={form.emailId}
                  onChange={(e) => updateField("emailId", e.target.value)}
                  style={inputBorder(!!errors.emailId)}
                  {...themedFocus(!!errors.emailId)}
                />
              </Field>

              <Field label="Customer Contact Number" required error={errors.mobileNo}>
                <input
                  type="text"
                  placeholder="Enter customer contact number"
                  value={form.mobileNo}
                  onChange={(e) => updateField("mobileNo", e.target.value)}
                  style={inputBorder(!!errors.mobileNo)}
                  {...themedFocus(!!errors.mobileNo)}
                />
              </Field>

              <Field label="VPA ID" required error={errors.vpaId}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    placeholder="Enter VPA"
                    value={form.vpaId}
                    onChange={(e) => updateField("vpaId", e.target.value)}
                    style={{ ...inputBorder(!!errors.vpaId), flex: 1 }}
                    {...themedFocus(!!errors.vpaId)}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyVpa}
                    style={{
                      height: "44px",
                      padding: "0 16px",
                      borderRadius: "12px",
                      border: "1px solid rgba(122, 31, 43, 0.2)",
                      backgroundColor: vpaVerified ? "rgba(22,163,74,0.12)" : "#FBF3E7",
                      color: vpaVerified ? "#15803d" : "#7A1F2B",
                      fontWeight: 700,
                      fontSize: "12px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {vpaVerified ? "Verified" : "Verify"}
                  </button>
                </div>
              </Field>

              <Field label="Payment Remark" required error={errors.paymentRemarks}>
                <input
                  type="text"
                  placeholder="Enter payment remark"
                  value={form.paymentRemarks}
                  onChange={(e) => updateField("paymentRemarks", e.target.value)}
                  style={inputBorder(!!errors.paymentRemarks)}
                  {...themedFocus(!!errors.paymentRemarks)}
                />
              </Field>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                marginTop: "28px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(122, 31, 43, 0.1)",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  height: "42px",
                  padding: "0 20px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(122, 31, 43, 0.2)",
                  backgroundColor: "#ffffff",
                  color: "#7A1F2B",
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <ArrowLeft style={{ width: 15, height: 15 }} />
                Back
              </button>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    height: "42px",
                    padding: "0 20px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(158, 137, 132, 0.45)",
                    backgroundColor: "#FAF2E8",
                    color: "#6b5a56",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    height: "42px",
                    padding: "0 24px",
                    borderRadius: "9999px",
                    border: "none",
                    background: submitting
                      ? "rgba(122, 31, 43, 0.45)"
                      : "linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "13px",
                    cursor: submitting ? "not-allowed" : "pointer",
                    boxShadow: submitting ? "none" : "0 4px 12px rgba(122, 31, 43, 0.22)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {submitting ? (
                    <>
                      <RefreshCw
                        style={{ width: 15, height: 15, animation: "spin 0.8s linear infinite" }}
                      />
                      Submitting…
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* RESULT / PREVIEW */}
        <div
          style={{
            background:
              "linear-gradient(160deg, #FBF3E7 0%, #ffffff 45%, #FAF2E8 100%)",
            borderRadius: "24px",
            padding: "28px",
            border: "1px solid rgba(122, 31, 43, 0.12)",
            boxShadow: "0 4px 20px rgba(122, 31, 43, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <ShieldCheck style={{ width: 22, height: 22, color: "#7A1F2B" }} />
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#7A1F2B",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Checkout preview
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6b5a56" }}>
                Payment link from API response
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "18px",
              padding: "20px",
              border: "1px solid rgba(122, 31, 43, 0.12)",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                backgroundColor: "rgba(122, 31, 43, 0.1)",
                color: "#7A1F2B",
                borderRadius: "9999px",
                padding: "4px 12px",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.05em",
                marginBottom: "12px",
              }}
            >
              SECURE CHECKOUT
            </div>
            <h4
              style={{
                margin: "0 0 6px",
                fontSize: "18px",
                fontWeight: 800,
                color: "#7A1F2B",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Complete your payment
            </h4>
            <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#6b5a56" }}>
              Order {createdLink?.orderId || form.orderId || "ORDXXXXXXXX"}
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
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#9E8984" }}>
                TOTAL AMOUNT
              </span>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: "#7A1F2B",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <span style={{ fontSize: "13px", color: "#C99A3D", marginRight: 6 }}>
                  {createdLink?.currency || form.currencyCode || "—"}
                </span>
                {createdLink?.amount || form.payableAmount || "0"}
              </span>
            </div>
          </div>

          {createdLink ? (
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
                {createdLink.statusMessage}
                {createdLink.statusCode ? ` (${createdLink.statusCode})` : ""}
              </div>

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
                {createdLink.url}
              </div>

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
                  <strong style={{ color: "#7A1F2B" }}>Order ID:</strong> {createdLink.orderId}
                </div>
                {createdLink.ordRequestId ? (
                  <div>
                    <strong style={{ color: "#7A1F2B" }}>Request ID:</strong>{" "}
                    <span style={{ wordBreak: "break-all" }}>{createdLink.ordRequestId}</span>
                  </div>
                ) : null}
                {createdLink.emailId ? (
                  <div>
                    <strong style={{ color: "#7A1F2B" }}>Email:</strong> {createdLink.emailId}
                  </div>
                ) : null}
                {createdLink.mobileNo ? (
                  <div>
                    <strong style={{ color: "#7A1F2B" }}>Mobile:</strong> {createdLink.mobileNo}
                  </div>
                ) : null}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <button
                  type="button"
                  onClick={openCheckout}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "11px 16px",
                    borderRadius: "9999px",
                    border: "none",
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  <ExternalLink style={{ width: 15, height: 15 }} />
                  Go to Checkout
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "11px 16px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(122, 31, 43, 0.2)",
                    cursor: "pointer",
                    backgroundColor: "#ffffff",
                    color: "#7A1F2B",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  {copied ? (
                    <Check style={{ width: 15, height: 15, color: "#16a34a" }} />
                  ) : (
                    <Copy style={{ width: 15, height: 15 }} />
                  )}
                  {copied ? "Copied" : "Copy Link"}
                </button>
              </div>
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: "13px", color: "#6b5a56", lineHeight: 1.6 }}>
              Fill the form and click <strong>Submit</strong>. The payment link from the
              API response will appear here.
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 980px) {
          .max-\\[980px\\]\\:\\!grid-cols-1 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </PayVangLayout>
  );
}
