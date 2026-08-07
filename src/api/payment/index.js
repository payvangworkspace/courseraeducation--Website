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
  CHECKOUT_PARAMS: (orderId) => `/checkout/params/${orderId}`,
};

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

  getCheckoutParams: async (orderId, options = {}) => {
    const path = PAYMENT_ENDPOINTS.CHECKOUT_PARAMS(orderId);
    const headers = {
      ...getApiKeyHeaders(),
      ...(options.headers || {}),
    };

    // Prefer same-origin /checkout/params in DEV (Vite proxy → live API, avoids CORS).
    // Always return JSON body so UI can handle success / fail / missing key.
    const url =
      typeof window !== "undefined" && import.meta.env.DEV
        ? path
        : `${BASE_URL}${path}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      });
      const data = await response.json().catch(() => ({}));

      // Surface API key / auth errors clearly
      if (data?.error || data?.status === "fail") {
        return data;
      }

      if (!response.ok) {
        return {
          status: "fail",
          error: data?.error || data?.message || `Request failed (${response.status})`,
          source: data?.source || "Payout-service",
          message: data?.message || data?.error || `Request failed (${response.status})`,
        };
      }

      return data;
    } catch (err) {
      // Fallback through apiClient
      try {
        return await apiClient.get(path, undefined, {
          auth: false,
          ...options,
          headers,
        });
      } catch (inner) {
        if (inner?.data && typeof inner.data === "object") {
          return inner.data;
        }
        throw inner;
      }
    }
  },
};

export default paymentApi;
