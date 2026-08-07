import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ArrowRight, RefreshCw } from "lucide-react";
import { paymentApi } from "../api";

/** Default order used to fetch checkout params and redirect */
const DEFAULT_ORDER_ID = "ORD0805269913";

/**
 * Minimal Get Payment Link page.
 * Button → GET /checkout/params/{orderId} → redirect /checkout/{orderId}
 */
export default function GetPaymentLinkPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  async function handleGetPaymentLinkAndPay() {
    setLoading(true);
    setError("");

    try {
      const res = await paymentApi.getCheckoutParams(DEFAULT_ORDER_ID);

      if (res?.error || res?.status === "fail" || res?.status !== "success" || !res?.data) {
        throw new Error(
          res?.error || res?.message || "Unable to get payment link"
        );
      }

      const orderId = res.data.orderId || DEFAULT_ORDER_ID;
      navigate(`/checkout/${encodeURIComponent(orderId)}`);
    } catch (err) {
      setError(err?.message || "Unable to get payment link");
      setLoading(false);
    }
  }

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
          flexShrink: 0,
          cursor: "pointer",
        }}
        onClick={() => navigate("/")}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "#7A1F2B",
            color: "#FDF6EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "18px",
          }}
        >
          C
        </div>
        <span
          style={{
            fontSize: "20px",
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
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          padding: "40px 32px",
          border: "1px solid rgba(122, 31, 43, 0.12)",
          boxShadow: "0 8px 30px rgba(122, 31, 43, 0.08)",
          textAlign: "center",
        }}
      >
        <button
          type="button"
          onClick={handleGetPaymentLinkAndPay}
          disabled={loading}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "16px 22px",
            borderRadius: "9999px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.75 : 1,
            background: "linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "15px",
            boxShadow: "0 4px 12px rgba(122,31,43,0.2)",
          }}
        >
          {loading ? (
            <>
              <RefreshCw
                style={{
                  width: 18,
                  height: 18,
                  animation: "spin 0.8s linear infinite",
                }}
              />
              Loading…
            </>
          ) : (
            <>
              <CreditCard style={{ width: 18, height: 18 }} />
              Get Payment Link &amp; Pay
              <ArrowRight style={{ width: 18, height: 18 }} />
            </>
          )}
        </button>

        {error && (
          <p
            style={{
              margin: "16px 0 0 0",
              fontSize: "13px",
              color: "#dc2626",
              lineHeight: 1.5,
            }}
          >
            {error}
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
