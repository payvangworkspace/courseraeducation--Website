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

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(ROLE_KEY);
}

/** Normalize list-like API responses into an array. */
export function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  return (
    data.data ||
    data.content ||
    data.items ||
    data.list ||
    data.merchants ||
    data.result ||
    []
  );
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
    fiatAmount,
    secretKey,
    appId,
    merchantSecretId,
    ...rest
  } = options;

  const url = buildUrl(endpoint, params);
  const token = auth ? getAuthToken() : "";

  // Extract parameters for merchanthash: MerchantId + OrderId + fiatAmount
  const parsedBody = body && typeof body === "object" && !(body instanceof FormData) ? body : {};
  const activeMerchantId =
    merchantId ||
    parsedBody.merchantId ||
    parsedBody.merchant_id ||
    getCurrentUserEmail() ||
    import.meta.env?.VITE_MERCHANT_ID ||
    "merchantEmailId@gmail.com";
  const activeOrderId =
    orderId ||
    parsedBody.orderId ||
    parsedBody.externalOrderId ||
    parsedBody.referenceId ||
    "";
  const activeFiatAmount =
    fiatAmount !== undefined
      ? String(fiatAmount)
      : parsedBody.fiatAmount !== undefined
      ? String(parsedBody.fiatAmount)
      : parsedBody.amount !== undefined
      ? String(parsedBody.amount)
      : "";
  const activeSecretKey =
    secretKey ||
    options.mysecretdev ||
    import.meta.env?.VITE_SECRET_KEY ||
    import.meta.env?.VITE_MYSECRETDEV ||
    "YOUR_SECRET_KEY";
  const activeAppId =
    appId ||
    options.merchantappid ||
    parsedBody.appid ||
    getCurrentUserEmail() ||
    import.meta.env?.VITE_MERCHANT_APP_ID ||
    "YOUR_MERCHANT_APP_ID";
  const activeMerchantSecretId =
    merchantSecretId ||
    options.merchantsecretid ||
    import.meta.env?.VITE_MERCHANT_SECRET_ID ||
    "YOUR_MERCHANT_SECRET_ID";

  // Generate HMAC-SHA256 hash using merchant secret key
  const merchanthash = generateMerchantHash(
    activeSecretKey,
    activeMerchantId,
    activeOrderId,
    activeFiatAmount
  );

  const rawInput = `${activeMerchantId}${activeOrderId}${activeFiatAmount}`;

  // Log hash and headers for EVERY request as requested
  console.log(`[Kubergates Hash] ${options.method || "GET"} ${endpoint}`, {
    endpoint,
    merchanthash,
    rawInput,
    merchantId: activeMerchantId,
    orderId: activeOrderId,
    fiatAmount: activeFiatAmount,
    secretKey: activeSecretKey,
    appId: activeAppId,
    merchantSecretId: activeMerchantSecretId,
  });

  const kubergatesHeaders = {
    merchantappid: activeAppId,
    merchanthash: merchanthash,
    merchantsecretid: activeMerchantSecretId,
    mysecretdev: activeSecretKey,
  };

  // Determine if Kubergates custom headers should be included in HTTP request
  const isKubergatesEndpoint =
    options.includeKubergatesHeaders ||
    String(endpoint).includes("/payins") ||
    String(endpoint).includes("/transaction") ||
    String(endpoint).includes("/checkout") ||
    String(endpoint).includes("/CryptoConfig") ||
    String(endpoint).includes("/wallet") ||
    String(endpoint).includes("/payout");

  const config = {
    ...rest,
    headers: {
      ...(body !== undefined && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isKubergatesEndpoint ? kubergatesHeaders : {}),
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
