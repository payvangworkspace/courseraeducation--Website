import { BASE_URL } from "./baseUrl";
import { generateMerchantHash, getCurrentUserEmail } from "../../utils/hashUtil";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "user_role";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";
}

export function setAuthToken(token, { remember = true, role } = {}) {
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(TOKEN_KEY);
    if (role !== undefined) {
      localStorage.setItem(ROLE_KEY, role);
      sessionStorage.removeItem(ROLE_KEY);
    }
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
    if (role !== undefined) {
      sessionStorage.setItem(ROLE_KEY, role);
      localStorage.removeItem(ROLE_KEY);
    }
  }
}

/** Persist login session fields (token, role, email, name, flags). */
export function saveAuthToken(
  token,
  userRole,
  email,
  fullName,
  verified,
  payoutEnabledViaApp,
  { remember = true } = {}
) {
  if (!token) return false;

  const store = remember ? localStorage : sessionStorage;
  const clear = remember ? sessionStorage : localStorage;

  try {
    store.setItem(TOKEN_KEY, String(token));
    store.setItem(ROLE_KEY, String(userRole || ""));
    store.setItem("email", String(email || ""));
    store.setItem("fullName", String(fullName || ""));
    store.setItem("verified", String(verified ?? ""));
    store.setItem("payoutEnabledViaApp", String(payoutEnabledViaApp ?? ""));

    // Drop legacy duplicate keys if present
    ["user_email", "user_fullName", "user_verified"].forEach((key) => {
      store.removeItem(key);
      clear.removeItem(key);
    });

    clear.removeItem(TOKEN_KEY);
    clear.removeItem(ROLE_KEY);
    clear.removeItem("email");
    clear.removeItem("fullName");
    clear.removeItem("verified");
    clear.removeItem("payoutEnabledViaApp");

    // Verify write succeeded
    return Boolean(store.getItem(TOKEN_KEY));
  } catch (err) {
    console.error("[saveAuthToken] failed:", err);
    return false;
  }
}

export function clearAuthToken() {
  [
    TOKEN_KEY,
    ROLE_KEY,
    "email",
    "fullName",
    "verified",
    "payoutEnabledViaApp",
    // legacy keys (cleanup only)
    "user_email",
    "user_fullName",
    "user_verified",
  ].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

/** Normalize list-like API responses into an array. */
export function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  const candidates = [
    data.data,
    data.content,
    data.items,
    data.list,
    data.merchants,
    data.result,
    data.transactions,
    data.wallets,
    data.records,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === "object") {
      const nested =
        candidate.content || candidate.items || candidate.list || candidate.data;
      if (Array.isArray(nested)) return nested;
    }
  }

  return [];
}

/**
 * Build a full URL from BASE_URL + endpoint path (+ optional query).
 */
export function buildUrl(endpoint, params) {
  const path = String(endpoint);
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);

  if (params && typeof params === "object") {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  if (!BASE_URL) {
    return `${url.pathname}${url.search}`;
  }

  return url.toString();
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

/**
 * Shared fetch wrapper used by all domain API files.
 * Generates HMAC-SHA256 merchanthash and attaches Kubergates headers to every request.
 */
export async function apiRequest(endpoint, options = {}) {
  const {
    params,
    headers,
    body,
    auth = true,
    merchantId,
    orderId,
    payableAmount,
    fiatAmount,
    amount,
    secretKey,
    appId,
    merchantAppId,
    merchantSecretId,
    merchantHash,
    includePayVangHeaders = true,
    includeKubergatesHeaders,
    ...rest
  } = options;

  const url = buildUrl(endpoint, params);
  const token = auth ? getAuthToken() : "";

  // Extract parameters for merchantHash: merchantId + orderId + payableAmount
  const parsedBody = body && typeof body === "object" && !(body instanceof FormData) ? body : {};

  const activeMerchantId =
    merchantId ||
    parsedBody.merchantId ||
    parsedBody.merchant_id ||
    parsedBody.userName ||
    parsedBody.email ||
    parsedBody.emailId ||
    getCurrentUserEmail() ||
    import.meta.env?.VITE_MERCHANT_ID ||
    "devendra.kumar@zenithguard.in";

  const activeOrderId =
    orderId ||
    parsedBody.orderId ||
    parsedBody.externalOrderId ||
    parsedBody.referenceId ||
    "";

  const rawAmount =
    payableAmount !== undefined
      ? payableAmount
      : fiatAmount !== undefined
      ? fiatAmount
      : amount !== undefined
      ? amount
      : parsedBody.payableAmount !== undefined
      ? parsedBody.payableAmount
      : parsedBody.fiatAmount !== undefined
      ? parsedBody.fiatAmount
      : parsedBody.amount !== undefined
      ? parsedBody.amount
      : "";
  const activePayableAmount = rawAmount !== undefined && rawAmount !== null ? String(rawAmount) : "";

  const activeSecretKey =
    secretKey ||
    options.merchantSecretId ||
    options.mysecretdev ||
    import.meta.env?.VITE_MERCHANT_SECRET_ID ||
    import.meta.env?.VITE_SECRET_KEY ||
    import.meta.env?.VITE_MYSECRETDEV ||
    "zug3ZTeljmyx59DLURQYX4oSHm+vQiysLnFu4jsyvJg=";

  const activeMerchantSecretId =
    merchantSecretId ||
    options.merchantsecretid ||
    activeSecretKey;

  const activeAppId =
    merchantAppId ||
    appId ||
    options.merchantappid ||
    parsedBody.appid ||
    parsedBody.merchantAppId ||
    getCurrentUserEmail() ||
    import.meta.env?.VITE_MERCHANT_APP_ID ||
    "ZEpNiaTHy20250923123246158";

  // Generate HMAC-SHA256 hash using merchantSecretId and (merchantId + orderId + payableAmount)
  const computedHash =
    merchantHash ||
    generateMerchantHash(
      activeMerchantSecretId,
      activeMerchantId,
      activeOrderId,
      activePayableAmount
    );

  const rawInput = `${activeMerchantId}${activeOrderId}${activePayableAmount}`;

  // Explicit console log of generated merchantHash and raw input
  // Format request body for logging
  const hasBody = body !== undefined && body !== null;
  const formattedBodyData = hasBody
    ? typeof body === "string" || body instanceof FormData
      ? body
      : JSON.stringify(parsedBody, null, 2)
    : undefined;

  // Print structured console log matching PayVang API documentation format

  const payVangHeaders = {
    merchantAppId: activeAppId,
    merchantSecretId: activeMerchantSecretId,
    merchantHash: computedHash,
    // Backward compatibility lowercase aliases:
    merchantappid: activeAppId,
    merchantsecretid: activeMerchantSecretId,
    merchanthash: computedHash,
    mysecretdev: activeSecretKey,
  };

  // Determine if PayVang custom headers should be included in HTTP request
  const shouldAttachHeaders =
    includePayVangHeaders ||
    includeKubergatesHeaders ||
    String(endpoint).includes("/payins") ||
    String(endpoint).includes("/transaction") ||
    String(endpoint).includes("/checkout") ||
    String(endpoint).includes("/CryptoConfig") ||
    String(endpoint).includes("/wallet") ||
    String(endpoint).includes("/payout") ||
    String(endpoint).includes("/generate-token") ||
    String(endpoint).includes("/apiauth");

  const config = {
    ...rest,
    headers: {
      ...(body !== undefined && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(shouldAttachHeaders ? payVangHeaders : {}),
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body =
      typeof body === "string" || body instanceof FormData
        ? body
        : JSON.stringify(body);
  }

  const response = await fetch(url, config);


  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" && data) ||
      `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}


export const apiClient = {
  get: (endpoint, params, options = {}) =>
    apiRequest(endpoint, { ...options, method: "GET", params }),

  post: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: "POST", body }),

  put: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: "PUT", body }),

  patch: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: "PATCH", body }),

  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;
