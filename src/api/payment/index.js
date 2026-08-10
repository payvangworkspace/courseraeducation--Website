import { apiClient } from "../client/apiClient";
import { BASE_URL } from "../client/baseUrl";
import { getApiKeyHeaders } from "../client/apiKey";

/** payin-controller + transaction-controller + checkout-page-controller */
export const PAYMENT_ENDPOINTS = {
  // Payin
  CREATE_ORDER: "/payins/createOrder",
  CREATE_CRYPTO_ORDER: "/payins/createCryptoOrder",
  ORDER_STATUS: "/payins/payinOrderStatus",
  CHECK_ORDER_STATUS: "/payins/CheckOrderStatus",
  TEST_PAYIN: "/payins/TestPayin",

  // Transactions
  TRANSACTIONS: "/transaction",
  PAYIN_TXN_DETAILS: "/transaction/getPayinTxndetails",
  CRYPTO_PAYIN_TXN_DETAILS: "/transaction/getPayinCryptoTxndetails",
  GENERATE_REPORT: "/transaction/generateReport",

  // Checkout
  CHECKOUT_PARAMS: (orderId) =>
    `/checkout/params/${encodeURIComponent(String(orderId).trim())}`,
};

async function fetchCheckoutJson(url, headers) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "*/*",
      ...headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  // If SPA HTML is returned (misconfigured proxy), treat as failure
  if (contentType.includes("text/html")) {
    throw new Error("Checkout API returned HTML instead of JSON");
  }

  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export const paymentApi = {
  createOrder: (body, options = {}) =>
    apiClient.post(PAYMENT_ENDPOINTS.CREATE_ORDER, body, options),

  createCryptoOrder: (body, options = {}) =>
    apiClient.post(PAYMENT_ENDPOINTS.CREATE_CRYPTO_ORDER, body, options),

  payinOrderStatus: (body, options = {}) =>
    apiClient.post(PAYMENT_ENDPOINTS.ORDER_STATUS, body, options),

  checkOrderStatus: (body, options = {}) =>
    apiClient.post(PAYMENT_ENDPOINTS.CHECK_ORDER_STATUS, body, options),

  testPayin: (options = {}) =>
    apiClient.get(PAYMENT_ENDPOINTS.TEST_PAYIN, undefined, options),

  getAllTransactions: (body, options = {}) =>
    apiClient.post(PAYMENT_ENDPOINTS.TRANSACTIONS, body, options),

  getPayinTxnDetails: (body, options = {}) =>
    apiClient.post(PAYMENT_ENDPOINTS.PAYIN_TXN_DETAILS, body, options),

  getCryptoPayinTxnDetails: (body, options = {}) =>
    apiClient.post(PAYMENT_ENDPOINTS.CRYPTO_PAYIN_TXN_DETAILS, body, options),

  generateReport: (body, options = {}) =>
    apiClient.post(PAYMENT_ENDPOINTS.GENERATE_REPORT, body, options),

  /**
   * GET /checkout/params/:orderId
   * Same-origin first (Vite/Netlify proxy), then absolute API BASE_URL.
   */
  getCheckoutParams: async (orderId, options = {}) => {
    if (!orderId) {
      return {
        status: "fail",
        message: "Order ID is required",
        source: "Payout-service",
      };
    }

    const path = PAYMENT_ENDPOINTS.CHECKOUT_PARAMS(orderId);
    const headers = {
      ...getApiKeyHeaders(),
      ...(options.headers || {}),
    };

    const candidates = [
      `${BASE_URL || "https://api.courseraeducation.com"}${path}`,
    ];  

    let lastError = null;

    for (const url of candidates) {
      try {
        const { response, data } = await fetchCheckoutJson(url, headers);

        if (data?.error || data?.status === "fail" || data?.status === "success") {
          return data;
        }

        if (!response.ok) {
          lastError = {
            status: "fail",
            error:
              data?.error ||
              data?.message ||
              `Request failed (${response.status})`,
            source: data?.source || "Payout-service",
            message:
              data?.message ||
              data?.error ||
              `Request failed (${response.status})`,
          };
          continue;
        }

        return data;
      } catch (err) {
        lastError = err;
      }
    }

    if (lastError && typeof lastError === "object" && lastError.status) {
      return lastError;
    }

    throw lastError || new Error("Unable to load checkout params");
  },
};

export default paymentApi;
