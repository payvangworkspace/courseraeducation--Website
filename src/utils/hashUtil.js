import CryptoJS from "crypto-js";

export function getCurrentUserEmail() {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem("user_email") ||
    sessionStorage.getItem("user_email") ||
    ""
  ).trim();
}

/**
 * Kubergates Merchant Hash Generator
 * 
 * According to Kubergates Merchant API Documentation:
 * Hash Input Format: MerchantId + OrderId + fiatAmount
 * Example: merchantEmailId@gmail.comORD0717169805100
 * Encryption: HMAC-SHA256 using merchant's secret key (mysecretdev)
 * Output: Hexadecimal string (lower-case)
 * 
 * @param {string} secretKey - Secret Key (mysecretdev)
 * @param {string} merchantId - Merchant ID / Email
 * @param {string} orderId - Order ID
 * @param {string|number} fiatAmount - Fiat Amount
 * @returns {string} Hex-encoded HMAC-SHA256 merchanthash
 */
export function generateMerchantHash(secretKey = "", merchantId = "", orderId = "", fiatAmount = "") {
  const rawData = `${merchantId || ""}${orderId || ""}${fiatAmount !== undefined && fiatAmount !== null ? fiatAmount : ""}`;
  const key = secretKey || "";
  const hash = CryptoJS.HmacSHA256(rawData, key);
  return hash.toString(CryptoJS.enc.Hex);
}

/**
 * Returns authentication headers required by Kubergates API for every request.
 * 
 * Authentication Headers:
 * - merchantappid: <YOUR_MERCHANT_APP_ID>
 * - merchanthash: <YOUR_MERCHANT_HASH>
 * - merchantsecretid: <YOUR_MERCHANT_SECRET_ID>
 * - mysecretdev: <YOUR_SECRET_KEY>
 * - Content-Type: application/json
 */
export function getKubergatesHeaders({
  secretKey = import.meta.env?.VITE_SECRET_KEY || import.meta.env?.VITE_MYSECRETDEV || "YOUR_SECRET_KEY",
  merchantId = getCurrentUserEmail() || import.meta.env?.VITE_MERCHANT_ID || "merchantEmailId@gmail.com",
  orderId = "",
  fiatAmount = "",
  appId = getCurrentUserEmail() || import.meta.env?.VITE_MERCHANT_APP_ID || "MERCHANT_APP_ID",
  merchantSecretId = import.meta.env?.VITE_MERCHANT_SECRET_ID || "MERCHANT_SECRET_ID",
} = {}) {
  const merchanthash = generateMerchantHash(secretKey, merchantId, orderId, fiatAmount);

  return {
    merchantappid: appId,
    merchanthash: merchanthash,
    merchantsecretid: merchantSecretId,
    mysecretdev: secretKey,
    "Content-Type": "application/json",
  };
}

export default generateMerchantHash;
