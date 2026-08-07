import { BASE_URL } from "./baseUrl";

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
 */
export async function apiRequest(endpoint, options = {}) {
  const {
    params,
    headers,
    body,
    auth = true,
    ...rest
  } = options;

  const url = buildUrl(endpoint, params);
  const token = auth ? getAuthToken() : "";

  const config = {
    ...rest,
    headers: {
      ...(body !== undefined && !(body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
