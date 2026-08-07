import { apiClient } from "../client/apiClient";

/** crypto-config-controller */
export const CRYPTO_CONFIG_ENDPOINTS = {
  LIST: "/CryptoConfig/ListCryptoConfig",
  SAVE: "/CryptoConfig/SaveCryptoConfig",
  UPDATE: "/CryptoConfig/updateCryptoConfig",
  SAVE_KEYS: "/CryptoConfig/SaveCryptoKeys",
  GET_KEYS: (merchantId) => `/CryptoConfig/GetCryptoKeys/${merchantId}`,
  MERCHANT_CONFIG: (merchantId) => `/CryptoConfig/MerchantCryptoConfig/${merchantId}`,
  ACTIVE_MERCHANT_CONFIG: (merchantId) =>
    `/CryptoConfig/ActiveMerchantCryptoConfig/${merchantId}`,
};

export const cryptoConfigApi = {
  listCryptoConfig: (options = {}) =>
    apiClient.get(CRYPTO_CONFIG_ENDPOINTS.LIST, undefined, options),

  saveCryptoConfig: (body, options = {}) =>
    apiClient.post(CRYPTO_CONFIG_ENDPOINTS.SAVE, body, options),

  updateCryptoConfig: (body, options = {}) =>
    apiClient.post(CRYPTO_CONFIG_ENDPOINTS.UPDATE, body, options),

  saveCryptoKeys: (body, options = {}) =>
    apiClient.post(CRYPTO_CONFIG_ENDPOINTS.SAVE_KEYS, body, options),

  getCryptoKeys: (merchantId, options = {}) =>
    apiClient.get(CRYPTO_CONFIG_ENDPOINTS.GET_KEYS(merchantId), undefined, options),

  getMerchantCryptoConfig: (merchantId, options = {}) =>
    apiClient.get(CRYPTO_CONFIG_ENDPOINTS.MERCHANT_CONFIG(merchantId), undefined, options),

  getActiveMerchantCryptoConfig: (merchantId, options = {}) =>
    apiClient.get(
      CRYPTO_CONFIG_ENDPOINTS.ACTIVE_MERCHANT_CONFIG(merchantId),
      undefined,
      options
    ),
};

export default cryptoConfigApi;
