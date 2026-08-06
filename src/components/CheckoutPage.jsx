import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

export default function CheckoutPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const loaded = useRef(false);

  useEffect(() => {
    let active = true;
    const targetOrderId = orderId || "ORD0805269910";

    // Call local proxied endpoint (/api/checkout/params/:orderId) which bypasses CORS server-side
    fetch(`/api/checkout/params/${targetOrderId}`)
      .then((r) => r.json())
      .then((res) => {
        if (!active) return;
        if (res.status !== "success") {
          setError(res.message || "Unable to load payment");
          return;
        }
        setData(res.data);
      })
      .catch(() => {
        if (active) setError("Unable to load payment");
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  useEffect(() => {
    if (!data || data.aggregator !== "AFS" || loaded.current) return;
    loaded.current = true; // StrictMode double-mounts; load once

    if (data.widgetScript) {
      const s = document.createElement("script");
      s.src = data.widgetScript;
      s.async = true;
      document.body.appendChild(s);
    }
  }, [data]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF6EE', color: '#241417', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: "'Inter', sans-serif" }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#7A1F2B', color: '#FDF6EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', boxShadow: '0 4px 12px rgba(122,31,43,0.2)' }}>
          C
        </div>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif" }}>
          Coursera Education
        </span>
      </div>

      {/* Main Payment Container Card */}
      <div style={{ width: '100%', maxWidth: '480px', backgroundColor: '#ffffff', borderRadius: '24px', padding: '36px', border: '1px solid rgba(122, 31, 43, 0.12)', boxShadow: '0 8px 30px rgba(122, 31, 43, 0.08)' }}>
        {error && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 8px 0' }}>
              Payment Unavailable
            </h2>
            <p style={{ fontSize: '14px', color: '#6b5a56', margin: '0 0 24px 0', lineHeight: 1.5 }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '12px 24px', borderRadius: '9999px', background: 'linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)', color: '#ffffff', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(122,31,43,0.2)' }}
            >
              Try Again
            </button>
          </div>
        )}

        {!error && !data && (
          <div style={{ textAlign: 'center', padding: '48px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <RefreshCw className="w-8 h-8 text-[#7A1F2B] animate-spin" />
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#6b5a56', margin: 0 }}>
              Loading payment details…
            </p>
          </div>
        )}

        {!error && data && (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(122, 31, 43, 0.1)', color: '#7A1F2B', border: '1px solid rgba(122, 31, 43, 0.2)', borderRadius: '9999px', padding: '4px 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '20px' }}>
              <ShieldCheck style={{ width: '14px', height: '14px', color: '#7A1F2B' }} />
              SECURE CHECKOUT
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
              Complete your payment
            </h1>
            <p style={{ fontSize: '13px', color: '#6b5a56', margin: '0 0 24px 0' }}>
              Verify your order parameters and proceed with payment checkout.
            </p>

            {/* Amount Banner */}
            <div style={{ backgroundColor: '#FAF2E8', borderRadius: '18px', padding: '20px 24px', border: '1px solid rgba(122, 31, 43, 0.15)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#9E8984', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount</span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif" }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#C99A3D', marginRight: '6px' }}>{data.currency}</span>
                {data.amount}
              </div>
            </div>

            {/* The widget replaces this form element once the script loads */}
            <div style={{ minHeight: '180px', marginBottom: '20px' }}>
              <form
                action={data.returnUrl}
                className="paymentWidgets"
                data-brands={data.brands}
              ></form>
            </div>

            {/* Order Reference Footer */}
            <div style={{ borderTop: '1px solid rgba(122, 31, 43, 0.12)', paddingTop: '16px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', color: '#6b5a56' }}>
              <span>Order Reference:</span>
              <strong style={{ color: '#7A1F2B', fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px' }}>{data.orderId}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11.5px', color: '#9E8984', marginTop: '16px', textAlign: 'center', width: '100%' }}>
              <Lock style={{ width: '12px', height: '12px' }} />
              256-Bit SSL Encrypted Payment Portal
            </div>
          </div>
        )}
      </div>
    </div>
  );
}