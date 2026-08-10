import React, { useState, useMemo, useEffect } from "react";
import {
  Key,
  Lock,
  Hash,
  Send,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  Coins,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import PayVangLayout from "./layout/PayVangLayout";
import {
  generateMerchantHash,
  getKubergatesHeaders,
  getCurrentUserEmail,
} from "../utils/hashUtil";
import { paymentApi } from "../api";

export default function PaymentGatewayForm() {
  const currentUserEmail = getCurrentUserEmail();

  // Merchant authentication credentials
  const [credentials, setCredentials] = useState({
    merchantId: currentUserEmail || "",
    secretKey: import.meta.env?.VITE_SECRET_KEY || import.meta.env?.VITE_MYSECRETDEV || "YOUR_SECRET_KEY",
    appId: currentUserEmail || "",
    merchantSecretId: import.meta.env?.VITE_MERCHANT_SECRET_ID || "MERCHANT_SECRET_ID",
  });

  useEffect(() => {
    if (!currentUserEmail) return;
    setCredentials((prev) => ({
      ...prev,
      merchantId: prev.merchantId || currentUserEmail,
      appId: prev.appId || currentUserEmail,
    }));
  }, [currentUserEmail]);

  // Crypto Order details
  const [formData, setFormData] = useState({
    orderId: "ORD0717169805",
    fiatAmount: "100",
    fiatCurrCode: "USD",
    chainType: "Ethereum",
    coinType: "USDT",
    firstName: "John",
    lastName: "Doe",
    emailId: "example@kubergates.com",
    walletAddress: "0xf66009849204820482048204",
    sessionExpiryMinutes: 15,
  });

  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [orderStatusRes, setOrderStatusRes] = useState(null);
  const [error, setError] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Real-time calculation of raw input string and HMAC-SHA256 merchanthash
  const rawHashInput = useMemo(() => {
    return `${credentials.merchantId || ""}${formData.orderId || ""}${formData.fiatAmount || ""}`;
  }, [credentials.merchantId, formData.orderId, formData.fiatAmount]);

  const merchantHash = useMemo(() => {
    return generateMerchantHash(
      credentials.secretKey,
      credentials.merchantId,
      formData.orderId,
      formData.fiatAmount
    );
  }, [credentials.secretKey, credentials.merchantId, formData.orderId, formData.fiatAmount]);

  // Headers that are sent with every request
  const requestHeaders = useMemo(() => {
    return getKubergatesHeaders({
      secretKey: credentials.secretKey,
      merchantId: credentials.merchantId,
      orderId: formData.orderId,
      fiatAmount: formData.fiatAmount,
      appId: credentials.appId,
      merchantSecretId: credentials.merchantSecretId,
    });
  }, [credentials, formData.orderId, formData.fiatAmount]);

  function handleCredentialChange(field, value) {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  }

  function handleFormChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  // Create Crypto Order request handler
  async function handleCreateCryptoOrder(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);

    const payload = {
      appid: credentials.appId,
      chainType: formData.chainType,
      coinType: formData.coinType,
      emailId: formData.emailId,
      externalOrderId: formData.orderId,
      fiatAmount: String(formData.fiatAmount),
      fiatCurrCode: formData.fiatCurrCode,
      firstName: formData.firstName,
      lastName: formData.lastName,
      merchantId: credentials.merchantId,
      orderId: formData.orderId,
      referenceId: formData.orderId,
      sessionExpiryMinutes: Number(formData.sessionExpiryMinutes) || 15,
      walletAddress: formData.walletAddress,
    };

    const requestOptions = {
      merchantId: credentials.merchantId,
      orderId: formData.orderId,
      fiatAmount: formData.fiatAmount,
      secretKey: credentials.secretKey,
      appId: credentials.appId,
      merchantSecretId: credentials.merchantSecretId,
    };

    try {
      const res = await paymentApi.createCryptoOrder(payload, requestOptions);
      setResponse(res);
    } catch (err) {
      setError(err?.message || "Failed to create crypto order");
    } finally {
      setLoading(false);
    }
  }

  // Check Order Status request handler
  async function handleCheckOrderStatus() {
    setStatusLoading(true);
    setOrderStatusRes(null);
    try {
      const payload = { orderId: formData.orderId };
      const requestOptions = {
        merchantId: credentials.merchantId,
        orderId: formData.orderId,
        fiatAmount: formData.fiatAmount,
        secretKey: credentials.secretKey,
        appId: credentials.appId,
        merchantSecretId: credentials.merchantSecretId,
      };
      const res = await paymentApi.checkCryptoOrderStatus(payload, requestOptions);
      setOrderStatusRes(res);
    } catch (err) {
      setError(err?.message || "Failed to check order status");
    } finally {
      setStatusLoading(false);
    }
  }

  function copyToClipboard(text, type) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "hash") {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  return (
    <PayVangLayout
      title="Kubergates Merchant Gateway"
      subtitle="HMAC-SHA256 Hash Generator & Crypto Order Payment Link Integration"
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
        
        {/* LEFT COLUMN: Credentials & Order Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Merchant Credentials Section */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={iconBadgeStyle}>
                <Key style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <h3 style={titleStyle}>Authentication &amp; Secret Keys</h3>
                <p style={subtitleStyle}>Headers used for HMAC encryption and API authorization</p>
              </div>
            </div>

            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Merchant ID (merchantId)</label>
                <input
                  type="text"
                  value={credentials.merchantId}
                  onChange={(e) => handleCredentialChange("merchantId", e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. merchantEmailId@gmail.com"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Secret Key (mysecretdev)</label>
                  <input
                    type="password"
                    value={credentials.secretKey}
                    onChange={(e) => handleCredentialChange("secretKey", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>App ID (merchantappid)</label>
                  <input
                    type="text"
                    value={credentials.appId}
                    onChange={(e) => handleCredentialChange("appId", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Merchant Secret ID (merchantsecretid)</label>
                <input
                  type="text"
                  value={credentials.merchantSecretId}
                  onChange={(e) => handleCredentialChange("merchantSecretId", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Crypto Order Form Section */}
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={{ ...iconBadgeStyle, backgroundColor: "rgba(201, 154, 61, 0.12)", color: "#C99A3D" }}>
                <Coins style={{ width: 16, height: 16 }} />
              </div>
              <div>
                <h3 style={titleStyle}>Create Crypto Order Parameters</h3>
                <p style={subtitleStyle}>Configure payment parameters for /payins/createCryptoOrder</p>
              </div>
            </div>

            <form onSubmit={handleCreateCryptoOrder} style={{ display: "grid", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Order ID (orderId)</label>
                  <input
                    type="text"
                    required
                    value={formData.orderId}
                    onChange={(e) => handleFormChange("orderId", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Fiat Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.fiatAmount}
                    onChange={(e) => handleFormChange("fiatAmount", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Fiat Currency</label>
                  <select
                    value={formData.fiatCurrCode}
                    onChange={(e) => handleFormChange("fiatCurrCode", e.target.value)}
                    style={inputStyle}
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                    <option value="AED">AED</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Blockchain</label>
                  <select
                    value={formData.chainType}
                    onChange={(e) => handleFormChange("chainType", e.target.value)}
                    style={inputStyle}
                  >
                    <option value="Ethereum">Ethereum</option>
                    <option value="Tron">Tron</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Bitcoin">Bitcoin</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Coin Type</label>
                  <select
                    value={formData.coinType}
                    onChange={(e) => handleFormChange("coinType", e.target.value)}
                    style={inputStyle}
                  >
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={labelStyle}>Customer First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleFormChange("firstName", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Customer Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleFormChange("lastName", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Customer Email</label>
                <input
                  type="email"
                  value={formData.emailId}
                  onChange={(e) => handleFormChange("emailId", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Wallet Address</label>
                <input
                  type="text"
                  value={formData.walletAddress}
                  onChange={(e) => handleFormChange("walletAddress", e.target.value)}
                  style={{ ...inputStyle, fontFamily: "ui-monospace, monospace", fontSize: "13px" }}
                />
              </div>

              {error && (
                <div style={errorStyle}>
                  <AlertCircle style={{ width: 16, height: 16 }} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} style={primaryBtnStyle}>
                {loading ? (
                  <>
                    <RefreshCw style={{ width: 16, height: 16, animation: "spin 0.8s linear infinite" }} />
                    Generating Crypto Order…
                  </>
                ) : (
                  <>
                    <Send style={{ width: 16, height: 16 }} />
                    Create Crypto Order with Merchanthash
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Hash Generator & Headers Inspector */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Real-Time Hash Generator Box */}
          <div style={{ ...cardStyle, background: "linear-gradient(160deg, #1C1215 0%, #29171C 100%)", color: "#FDF6EE" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Hash style={{ width: 20, height: 20, color: "#C99A3D" }} />
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#ffffff", fontFamily: "'Space Grotesk', sans-serif" }}>
                  HMAC-SHA256 Hash Generator
                </h3>
              </div>
              <span style={{ fontSize: "10px", fontWeight: 800, backgroundColor: "rgba(201, 154, 61, 0.2)", color: "#C99A3D", padding: "4px 10px", borderRadius: "9999px" }}>
                LIVE CALCULATION
              </span>
            </div>

            <p style={{ fontSize: "12px", color: "rgba(253, 246, 238, 0.7)", margin: "0 0 16px 0", lineHeight: 1.5 }}>
              Formula: <code>MerchantId + OrderId + fiatAmount</code> encrypted with HMAC-SHA256 using merchant secret key.
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              <div>
                <span style={codeLabelStyle}>Raw Input String (MerchantId+OrderId+fiatAmount):</span>
                <div style={codeBoxStyle}>
                  {rawHashInput || <span style={{ opacity: 0.4 }}>Empty</span>}
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={codeLabelStyle}>Generated merchanthash:</span>
                  <button
                    onClick={() => copyToClipboard(merchantHash, "hash")}
                    style={{ background: "none", border: "none", color: "#C99A3D", cursor: "pointer", fontSize: "11px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    {copiedHash ? <Check style={{ width: 12, height: 12, color: "#16a34a" }} /> : <Copy style={{ width: 12, height: 12 }} />}
                    {copiedHash ? "Copied" : "Copy Hash"}
                  </button>
                </div>
                <div style={{ ...codeBoxStyle, border: "1px solid rgba(201, 154, 61, 0.4)", color: "#C99A3D", fontWeight: 700 }}>
                  {merchantHash}
                </div>
              </div>
            </div>
          </div>

          {/* Request Headers Inspector */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ShieldCheck style={{ width: 20, height: 20, color: "#7A1F2B" }} />
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800, color: "#7A1F2B", fontFamily: "'Space Grotesk', sans-serif" }}>
                  Request Headers Included
                </h3>
              </div>
              <span style={{ fontSize: "10px", fontWeight: 800, backgroundColor: "rgba(122, 31, 43, 0.1)", color: "#7A1F2B", padding: "4px 10px", borderRadius: "9999px" }}>
                SENT WITH EVERY REQUEST
              </span>
            </div>

            <pre style={jsonPreStyle}>
              {JSON.stringify(requestHeaders, null, 2)}
            </pre>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button
                type="button"
                onClick={handleCheckOrderStatus}
                disabled={statusLoading}
                style={secondaryBtnStyle}
              >
                {statusLoading ? (
                  <RefreshCw style={{ width: 14, height: 14, animation: "spin 0.8s linear infinite" }} />
                ) : (
                  <Zap style={{ width: 14, height: 14 }} />
                )}
                Check Order Status (/payins/OrderStatus)
              </button>
            </div>
          </div>

          {/* API Response Display */}
          {(response || orderStatusRes) && (
            <div style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <CheckCircle style={{ width: 18, height: 18, color: "#16a34a" }} />
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#16a34a", fontFamily: "'Space Grotesk', sans-serif" }}>
                  API Response Received
                </h3>
              </div>

              {response?.data?.paymentlink && (
                <div style={{ backgroundColor: "#FAF2E8", borderRadius: "14px", padding: "16px", marginBottom: "16px", border: "1px solid rgba(122, 31, 43, 0.15)" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#7A1F2B", textTransform: "uppercase" }}>Generated Payment Link</span>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#241417", wordBreak: "break-all", margin: "6px 0 12px 0", fontFamily: "ui-monospace, monospace" }}>
                    {response.data.paymentlink}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <a
                      href={response.data.paymentlink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={primaryBtnStyle}
                    >
                      <ExternalLink style={{ width: 14, height: 14 }} />
                      Open Crypto Payment Page
                    </a>
                    <button
                      onClick={() => copyToClipboard(response.data.paymentlink, "link")}
                      style={secondaryBtnStyle}
                    >
                      {copiedLink ? <Check style={{ width: 14, height: 14, color: "#16a34a" }} /> : <Copy style={{ width: 14, height: 14 }} />}
                      {copiedLink ? "Copied" : "Copy Link"}
                    </button>
                  </div>
                </div>
              )}

              <pre style={jsonPreStyle}>
                {JSON.stringify(response || orderStatusRes, null, 2)}
              </pre>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PayVangLayout>
  );
}

// Styling Constants
const cardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  padding: "28px",
  border: "1px solid rgba(122, 31, 43, 0.12)",
  boxShadow: "0 4px 20px rgba(122, 31, 43, 0.04)",
};

const cardHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "20px",
};

const iconBadgeStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "12px",
  backgroundColor: "rgba(122, 31, 43, 0.08)",
  color: "#7A1F2B",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const titleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: 800,
  color: "#7A1F2B",
  fontFamily: "'Space Grotesk', sans-serif",
};

const subtitleStyle = {
  margin: "2px 0 0 0",
  fontSize: "12px",
  color: "#6b5a56",
};

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
  padding: "10px 14px",
  fontSize: "13.5px",
  color: "#241417",
  outline: "none",
};

const primaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "12px 20px",
  borderRadius: "9999px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(135deg, #7A1F2B 0%, #C99A3D 100%)",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "13px",
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(122,31,43,0.2)",
};

const secondaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  padding: "10px 16px",
  borderRadius: "9999px",
  border: "1px solid rgba(122, 31, 43, 0.2)",
  cursor: "pointer",
  backgroundColor: "#ffffff",
  color: "#7A1F2B",
  fontWeight: 700,
  fontSize: "12.5px",
};

const codeLabelStyle = {
  fontSize: "11px",
  fontWeight: 700,
  color: "rgba(253, 246, 238, 0.6)",
  display: "block",
  marginBottom: "4px",
};

const codeBoxStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  borderRadius: "10px",
  padding: "10px 12px",
  fontFamily: "ui-monospace, monospace",
  fontSize: "12.5px",
  wordBreak: "break-all",
};

const jsonPreStyle = {
  backgroundColor: "#FAF2E8",
  borderRadius: "14px",
  padding: "14px",
  fontFamily: "ui-monospace, monospace",
  fontSize: "12px",
  color: "#241417",
  margin: 0,
  overflowX: "auto",
  border: "1px solid rgba(122, 31, 43, 0.12)",
};

const errorStyle = {
  backgroundColor: "rgba(220, 38, 38, 0.08)",
  border: "1px solid rgba(220, 38, 38, 0.25)",
  color: "#dc2626",
  borderRadius: "12px",
  padding: "10px 12px",
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};
