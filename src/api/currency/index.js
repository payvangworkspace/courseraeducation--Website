import { apiClient } from "../client/apiClient";

/** currency-controller */
export const CURRENCY_ENDPOINTS = {
  ADD: "/currency",
  UPDATE: "/currency",
  ALL: "/currency/all",
  BY_ID: (currencyId) => `/currency/${currencyId}`,
  MAPPING: "/currency/mapping",
  MAPPING_BY_MERCHANT: (merchantId) => `/currency/mapping/${merchantId}`,
  REMOVE_MAPPING: (merchantId, currencyId) =>
    `/currency/mapping/${merchantId}/${currencyId}`,
};

export const currencyApi = {
  addCurrency: (body, options = {}) =>
    apiClient.post(CURRENCY_ENDPOINTS.ADD, body, options),

  updateCurrency: (body, options = {}) =>
    apiClient.put(CURRENCY_ENDPOINTS.UPDATE, body, options),

  getAllCurrencies: (body, options = {}) =>
    apiClient.post(CURRENCY_ENDPOINTS.ALL, body, options),

  deleteCurrency: (currencyId, options = {}) =>
    apiClient.delete(CURRENCY_ENDPOINTS.BY_ID(currencyId), options),

  addCurrencyMapping: (body, options = {}) =>
    apiClient.post(CURRENCY_ENDPOINTS.MAPPING, body, options),

  getCurrencyMapping: (merchantId, options = {}) =>
    apiClient.get(CURRENCY_ENDPOINTS.MAPPING_BY_MERCHANT(merchantId), undefined, options),

  removeCurrencyMapping: (merchantId, currencyId, options = {}) =>
    apiClient.delete(CURRENCY_ENDPOINTS.REMOVE_MAPPING(merchantId, currencyId), options),
};

export default currencyApi;
