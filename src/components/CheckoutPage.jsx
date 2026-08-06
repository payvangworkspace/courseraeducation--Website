// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";

// export default function Payment() {
//   const { orderId } = useParams();
//   const [data, setData]   = useState(null);
//   const [error, setError] = useState(null);
//   const loaded = useRef(false);

//   useEffect(() => {
//     fetch(`https://api.courseraeducation.com/checkout/params/${orderId}`)
//       .then(r => r.json())
//       .then(res => {
//         if (res.status !== "success") { setError(res.message); return; }
//         setData(res.data);
//       })
//       .catch(() => setError("Unable to load payment"));
//   }, [orderId]);

//   useEffect(() => {
//     if (!data || data.aggregator !== "AFS" || loaded.current) return;
//     loaded.current = true;                    // StrictMode double-mounts; load once

//     const s = document.createElement("script");
//     s.src = data.widgetScript;
//     s.async = true;
//     document.body.appendChild(s);
//   }, [data]);

//   if (error) return <div className="pay-error">{error}</div>;
//   if (!data) return <div className="pay-loading">Loading…</div>;

//   return (
//     <div className="pay-wrap">
//       <h1>Complete your payment</h1>
//       <div className="pay-amount">{data.currency} {data.amount}</div>

//       {/* The widget replaces this form element once the script loads. */}
//       <form action={data.returnUrl}
//             className="paymentWidgets"
//             data-brands={data.brands}></form>

//       <p className="pay-ref">Order {data.orderId}</p>
//     </div>
//   );
// }

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

export default function Payment() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [scriptError, setScriptError] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`https://api.courseraeducation.com/checkout/params/${orderId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((res) => {
        if (cancelled) return;
        if (res.status !== "success") {
          setError(res.message || "We couldn't find that order.");
          return;
        }
        setData(res.data);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load your payment details.");
      });

    return () => { cancelled = true; };
  }, [orderId]);

  useEffect(() => {
    if (!data || data.aggregator !== "AFS" || loaded.current) return;
    loaded.current = true;

    const s = document.createElement("script");
    s.src = data.widgetScript;
    s.async = true;
    s.onerror = () => setScriptError(true);
    document.body.appendChild(s);

    return () => { document.body.removeChild(s); };
  }, [data]);

  return (
    <div className="ce-page">
      <style>{`
        .ce-page {
          min-height: 100vh;
          background: radial-gradient(120% 100% at 50% 0%, #FDF9F1 0%, #F7EFE1 55%, #F3E7D3 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #2B1810;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 20px 80px;
        }

        .ce-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
        }
        .ce-mark {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: conic-gradient(from 220deg, #7A1F3D, #C97A2E 50%, #E3B24D 75%, #7A1F3D);
          box-shadow: 0 2px 6px rgba(122,31,61,0.25);
        }
        .ce-brand-name {
          font-weight: 800;
          font-size: 18px;
          letter-spacing: -0.01em;
        }
        .ce-brand-name span { color: #A05A28; font-weight: 600; }

        .ce-card {
          width: 100%;
          max-width: 460px;
          background: #FFFFFF;
          border: 1px solid #EFE3CE;
          border-radius: 24px;
          box-shadow: 0 20px 50px -18px rgba(122,31,61,0.18), 0 2px 8px rgba(43,24,16,0.04);
          padding: 40px 36px;
        }

        .ce-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #A05A28;
          background: #FBF0DD;
          padding: 6px 12px;
          border-radius: 999px;
          margin-bottom: 20px;
        }
        .ce-eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #C97A2E;
        }

        .ce-title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 6px;
        }
        .ce-sub {
          font-size: 14px;
          color: #7A6A5C;
          margin: 0 0 28px;
        }

        .ce-amount-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding: 22px 24px;
          background: linear-gradient(135deg, #FBF3E3, #F6E7CC);
          border-radius: 16px;
          border: 1px solid #EFDDBB;
          margin-bottom: 28px;
        }
        .ce-currency {
          font-size: 15px;
          font-weight: 700;
          color: #A05A28;
        }
        .ce-amount {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #2B1810;
        }

        .ce-form-wrap {
          margin-bottom: 20px;
        }
        .paymentWidgets {
          min-height: 180px;
        }

        .ce-ref {
          font-size: 12.5px;
          color: #9C8C7C;
          text-align: center;
          margin: 8px 0 0;
        }
        .ce-ref b { color: #5A4A3C; }

        .ce-secure {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: #9C8C7C;
          margin-top: 18px;
        }

        /* Loading state */
        .ce-loading-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          padding: 60px 36px;
        }
        .ce-spinner {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, #7A1F3D, #E3B24D, #7A1F3D);
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px));
          mask: radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px));
          animation: ce-spin 0.9s linear infinite;
        }
        @keyframes ce-spin { to { transform: rotate(360deg); } }
        .ce-loading-text {
          font-size: 14px;
          color: #7A6A5C;
        }

        /* Error state */
        .ce-error-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 6px;
          padding: 48px 36px;
        }
        .ce-error-icon {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: #FBEAEA;
          color: #A03535;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 12px;
        }
        .ce-error-title {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 4px;
        }
        .ce-error-msg {
          font-size: 14px;
          color: #7A6A5C;
          margin: 0 0 22px;
          max-width: 320px;
        }
        .ce-retry-btn {
          appearance: none;
          border: none;
          cursor: pointer;
          padding: 12px 24px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          color: #FFF;
          background: linear-gradient(100deg, #7A1F3D, #C97A2E 70%, #E3B24D);
          box-shadow: 0 8px 20px -8px rgba(122,31,61,0.5);
        }

        .ce-banner {
          background: #FBEAEA;
          border: 1px solid #F3D2D2;
          color: #A03535;
          font-size: 13px;
          padding: 12px 14px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        @media (max-width: 480px) {
          .ce-card { padding: 32px 22px; border-radius: 20px; }
          .ce-amount { font-size: 28px; }
        }
      `}</style>

      <div className="ce-brand">
        <div className="ce-mark" />
        <div className="ce-brand-name">Coursera <span>Education</span></div>
      </div>

      {error && (
        <div className="ce-card ce-error-card">
          <div className="ce-error-icon">!</div>
          <h1 className="ce-error-title">Order not found</h1>
          <p className="ce-error-msg">{error}</p>
          <button className="ce-retry-btn" onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      )}

      {!error && !data && (
        <div className="ce-card ce-loading-card">
          <div className="ce-spinner" />
          <p className="ce-loading-text">Loading your payment details…</p>
        </div>
      )}

      {!error && data && (
        <div className="ce-card">
          <span className="ce-eyebrow">
            <span className="ce-eyebrow-dot" />
            Secure checkout
          </span>
          <h1 className="ce-title">Complete your payment</h1>
          <p className="ce-sub">You're one step away from getting started.</p>

          <div className="ce-amount-row">
            <span className="ce-currency">{data.currency}</span>
            <span className="ce-amount">{data.amount}</span>
          </div>

          {scriptError && (
            <div className="ce-banner">
              The payment widget couldn't load. Please refresh the page or try again shortly.
            </div>
          )}

          <div className="ce-form-wrap">
            <form
              action={data.returnUrl}
              className="paymentWidgets"
              data-brands={data.brands}
            ></form>
          </div>

          <p className="ce-ref">Order <b>{data.orderId}</b></p>

          <div className="ce-secure">🔒 Payments encrypted end-to-end</div>
        </div>
      )}
    </div>
  );
}