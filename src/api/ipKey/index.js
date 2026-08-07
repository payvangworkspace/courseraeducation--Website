import { apiClient } from "../client/apiClient";

/** key-admin-controller */
export const IP_KEY_ENDPOINTS = {
  CREATE: "/admin/keys/createIPKey",
  LIST_ALL: "/admin/keys/ListAllKeys",
  GET_LIST: "/admin/keys/GetIpKeyList",
  GET_LIST_BY_MERCHANT: (merchantId) => `/admin/keys/GetIpKeyList/${merchantId}`,
  TEST: "/admin/keys/TestIPKey",
};

export const ipKeyApi = {
  createIPKey: (body, options = {}) =>
    apiClient.post(IP_KEY_ENDPOINTS.CREATE, body, options),

  listAllKeys: (body, options = {}) =>
    apiClient.post(IP_KEY_ENDPOINTS.LIST_ALL, body, options),

  getIpKeyList: (options = {}) =>
    apiClient.get(IP_KEY_ENDPOINTS.GET_LIST, undefined, options),

  getMerchantIpKeyList: (merchantId, options = {}) =>
    apiClient.get(IP_KEY_ENDPOINTS.GET_LIST_BY_MERCHANT(merchantId), undefined, options),

  testIPKey: (params, options = {}) =>
    apiClient.get(IP_KEY_ENDPOINTS.TEST, params, options),
};

export default ipKeyApi;
