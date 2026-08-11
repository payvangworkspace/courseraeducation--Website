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
  * PayVang Payment Gateway Merchant Hash Generator
  * 
  * According to PayVang API Documentation:
  * Signature Creation:
  * Plain Text: merchantId + orderId + payableAmount
  * Example: devendra.kumar@zenithguard.inORD025111710302545177101
  * Encryption: HMAC-SHA256 (256 BYTE) using merchantSecretId
  * Output: Hexadecimal string (lower-case)
  * 
  * @param {string} merchantSecretId - Merchant Secret ID / Secret Key
  * @param {string} merchantId - Merchant ID / Email
  * @param {string} orderId - Order ID
  * @param {string|number} payableAmount - Payable Amount / Fiat Amount
  * @returns {string} Hex-encoded HMAC-SHA256 merchantHash
  */
export function generateMerchantHash(merchantSecretId = "", merchantId = "", orderId = "", payableAmount = "") {
  const rawData = `${merchantId || ""}${orderId || ""}${payableAmount !== undefined && payableAmount !== null ? payableAmount : ""}`;
  const key = merchantSecretId || "";
  const hash = CryptoJS.HmacSHA256(rawData, key);
  return hash.toString(CryptoJS.enc.Hex);
}

/**
  * Returns PayVang API authentication headers required for PayVang payment gateway API calls.
  * 
  * Required Headers:
  * - merchantAppId: <YOUR_MERCHANT_APP_ID>
  * - merchantSecretId: <YOUR_MERCHANT_SECRET_ID>
  * - merchantHash: <YOUR_MERCHANT_HASH>
  * - Content-Type: application/json
  */
export function getPayVangHeaders({
  secretKey = import.meta.env?.VITE_SECRET_KEY || import.meta.env?.VITE_MYSECRETDEV || "zug3ZTeljmyx59DLURQYX4oSHm+vQiysLnFu4jsyvJg=",
  merchantSecretId = import.meta.env?.VITE_MERCHANT_SECRET_ID || secretKey,
  merchantId = getCurrentUserEmail() || import.meta.env?.VITE_MERCHANT_ID || "devendra.kumar@zenithguard.in",
  orderId = "",
  payableAmount = "",
  fiatAmount = payableAmount,
  appId = import.meta.env?.VITE_MERCHANT_APP_ID || "ZEpNiaTHy20250923123246158",
  merchantAppId = appId,
} = {}) {
  const amount = payableAmount !== undefined && payableAmount !== "" ? payableAmount : fiatAmount;
  const merchantHash = generateMerchantHash(merchantSecretId, merchantId, orderId, amount);

  return {
    merchantAppId: merchantAppId,
    merchantSecretId: merchantSecretId,
    merchantHash: merchantHash,
    // Lowercase aliases for backward compatibility:
    merchantappid: merchantAppId,
    merchantsecretid: merchantSecretId,
    merchanthash: merchantHash,
    mysecretdev: merchantSecretId,
    "Content-Type": "application/json",
  };
}

export function getKubergatesHeaders(options) {
  return getPayVangHeaders(options);
}

export default generateMerchantHash;
