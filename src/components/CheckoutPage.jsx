import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, RefreshCw, AlertCircle, Link2Off, KeyRound } from "lucide-react";
import { paymentApi } from "../api";
import { hasApiKey } from "../api/client/apiKey";

const AFS_RETURN_URL = "https://api.courseraeducation.com/payinwebhook/afsReturn";
const DEFAULT_BRANDS = "VISA MASTER AMEX";

function isExpiredResponse(res) {
  if (!res) return false;
  const message = String(res.message || res.error || "").toLowerCase();
  return (
    res.status === "fail" &&
    (message.includes("no longer available") || message.includes("expired"))
  );
}

function isMissingApiKey(res) {
  if (!res) return false;
  const message = String(res.error || res.message || "").toLowerCase();
  return message.includes("missing api key") || message.includes("api key");
}

export default function CheckoutPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expired, setExpired] = useState(false);
  const [missingKey, setMissingKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const widgetLoaded = useRef(false);
  const formRef = useRef(null);

  useEffect(() => {
    let active = true;
    const targetOrderId = orderId || "ORD0805269912";

    setLoading(true);
    setError(null);
    setExpired(false);
    setMissingKey(false);
    setData(null);
    widgetLoaded.current = false;

    paymentApi
      .getCheckoutParams(targetOrderId)
      .then((res) => {
        if (!active) return;

        if (isMissingApiKey(res) || (!hasApiKey() && res?.error)) {
          setMissingKey(true);
          setError(res.error || res.message || "Missing API key");
          setLoading(false);
          return;
        }

        if (isExpiredResponse(res)) {
          setExpired(true);
          setError(res.message || res.error || "This payment is no longer available");
          setLoading(false);
          return;
        }

        if (res.status === "fail" || res.error) {
          setError(res.message || res.error || "Unable to load payment");
          setLoading(false);
          return;
        }

        if (res.status !== "success" || !res.data) {
          setError(res.message || res.error || "Unable to load payment");
          setLoading(false);
          return;
        }

        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        const message =
          err?.data?.error ||
          err?.data?.message ||
          err?.message ||
          "Unable to load payment";

        if (isMissingApiKey(err?.data) || /missing api key|api key/i.test(message)) {
          setMissingKey(true);
        } else if (
          isExpiredResponse(err?.data) ||
          /no longer available|expired/i.test(message)
        ) {
          setExpired(true);
        }

        setError(message);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  // Load AFS payment widget script using checkoutId from API response
  useEffect(() => {
    if (!data?.checkoutId || widgetLoaded.current) return;
    if (data.aggregator && data.aggregator !== "AFS") return;

    widgetLoaded.current = true;

    const existing = document.querySelector(
      `script[data-checkout-id="${data.checkoutId}"]`
    );
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src =
      data.widgetScript ||
      `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${encodeURIComponent(
        data.checkoutId
      )}`;
    script.async = true;
    script.dataset.checkoutId = data.checkoutId;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [data]);

  const formAction =
    data?.returnUrl && data.returnUrl !== "NA" ? data.returnUrl : AFS_RETURN_URL;

  // Prevent page-level scroll while checkout is open
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div
      style={{
        height: "100dvh",
        maxHeight: "100dvh",
        overflow: "hidden",
        backgroundColor: "#FDF6EE",
        color: "#241417",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "'Inter', system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes checkout-spin {
          to { transform: rotate(360deg); }
        }
        .checkout-spin { animation: checkout-spin 0.8s linear infinite; }
        .paymentWidgets, .wpwl-container, .wpwl-form { width: 100% !important; max-width: 100% !important; }
        .wpwl-container { margin: 0 !important; }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "12px",
          flexShrink: 0,
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            backgroundColor: "#7A1F2B",
            color: "#FDF6EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "16px",
            boxShadow: "0 4px 12px rgba(122,31,43,0.2)",
          }}
        >
          C
        </div>
        <span
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#7A1F2B",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Coursera Education
        </span>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          maxHeight: "calc(100dvh - 72px)",
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "20px 22px",
          border: "1px solid rgba(122, 31, 43, 0.12)",
          boxShadow: "0 8px 30px rgba(122, 31, 43, 0.08)",
          boxSizing: "border-box",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <RefreshCw
              className="checkout-spin"
              style={{ width: 32, height: 32, color: "#7A1F2B" }}
            />
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#6b5a56", margin: 0 }}>
              Loading payment details…
            </p>
          </div>
        )}

        {!loading && missingKey && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "rgba(201, 154, 61, 0.15)",
                color: "#926A18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <KeyRound style={{ width: 32, height: 32 }} />
            </div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#7A1F2B",
                fontFamily: "'Space Grotesk', sans-serif",
                margin: "0 0 10px 0",
              }}
            >
              API Key Required
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#6b5a56",
                margin: "0 0 12px 0",
                lineHeight: 1.55,
              }}
            >
              {error || "Missing API key"}
            </p>
            <p
              style={{
                fontSize: "12.5px",
                color: "#9E8984",
                margin: "0 0 24px 0",
                lineHeight: 1.5,
              }}
            >
              Add your key to <code>.env</code> as{" "}
              <strong style={{ color: "#7A1F2B" }}>VITE_API_KEY=your_key</strong>, then
              restart the dev server.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 24px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !missingKey && expired && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "rgba(122, 31, 43, 0.1)",
                color: "#7A1F2B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <Link2Off style={{ width: 32, height: 32 }} />
            </div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#7A1F2B",
                fontFamily: "'Space Grotesk', sans-serif",
                margin: "0 0 10px 0",
              }}
            >
              Payment Link Expired
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#6b5a56",
                margin: "0 0 8px 0",
                lineHeight: 1.55,
              }}
            >
              {error || "This payment is no longer available"}
            </p>
            <p style={{ fontSize: "12.5px", color: "#9E8984", margin: "0 0 24px 0" }}>
              Order: <strong style={{ color: "#7A1F2B" }}>{orderId || "—"}</strong>
            </p>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "12px 24px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Back to Home
            </button>
          </div>
        )}

        {!loading && !missingKey && !expired && error && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <AlertCircle style={{ width: 32, height: 32 }} />
            </div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#7A1F2B",
                fontFamily: "'Space Grotesk', sans-serif",
                margin: "0 0 8px 0",
              }}
            >
              Payment Unavailable
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#6b5a56",
                margin: "0 0 24px 0",
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "12px 24px",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "13px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !missingKey && !expired && !error && data && (
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(122, 31, 43, 0.1)",
                color: "#7A1F2B",
                border: "1px solid rgba(122, 31, 43, 0.2)",
                borderRadius: "9999px",
                padding: "4px 10px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              <ShieldCheck style={{ width: "13px", height: "13px", color: "#7A1F2B" }} />
              SECURE CHECKOUT
            </div>

            <h1
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#7A1F2B",
                fontFamily: "'Space Grotesk', sans-serif",
                margin: "0 0 4px 0",
                letterSpacing: "-0.01em",
              }}
            >
              Complete your payment
            </h1>
            <p style={{ fontSize: "12px", color: "#6b5a56", margin: "0 0 12px 0" }}>
              Pay securely with your card. Order {data.orderId}
            </p>

            <div style={{ marginBottom: "8px" }}>
              <form
                ref={formRef}
                action={formAction}
                className="paymentWidgets"
                data-brands={data.brands || DEFAULT_BRANDS}
              >
              </form>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(122, 31, 43, 0.12)",
                paddingTop: "10px",
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "#6b5a56",
              }}
            >
              <span>Order Reference:</span>
              <strong
                style={{
                  color: "#7A1F2B",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "13px",
                }}
              >
                {data.orderId}
              </strong>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "11px",
                color: "#9E8984",
                marginTop: "10px",
                textAlign: "center",
                width: "100%",
              }}
            >
              <Lock style={{ width: "12px", height: "12px" }} />
              256-Bit SSL Encrypted Payment Portal
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
