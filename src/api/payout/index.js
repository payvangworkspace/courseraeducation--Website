import { apiClient } from "../client/apiClient";

/** user-payout-details-controller */
export const PAYOUT_ENDPOINTS = {
  SETTINGS: "/payout/settings",
  SETTINGS_BY_USER: (userId) => `/payout/settings/${userId}`,
  IP_WHITELIST: "/payout/ipWhiteList",
  IP_WHITELIST_BY_USER: (userId) => `/payout/ipWhiteList/${userId}`,
};

export const payoutApi = {
  addPayoutSettings: (body, options = {}) =>
    apiClient.post(PAYOUT_ENDPOINTS.SETTINGS, body, options),

  getPayoutSettings: (userId, options = {}) =>
    apiClient.get(PAYOUT_ENDPOINTS.SETTINGS_BY_USER(userId), undefined, options),

  addPayoutIPWhiteList: (body, options = {}) =>
    apiClient.post(PAYOUT_ENDPOINTS.IP_WHITELIST, body, options),

  getPayoutIPWhiteList: (userId, options = {}) =>
    apiClient.get(PAYOUT_ENDPOINTS.IP_WHITELIST_BY_USER(userId), undefined, options),

  removePayoutIP: (body, options = {}) =>
    apiClient.delete(PAYOUT_ENDPOINTS.IP_WHITELIST, { body, ...options }),
};

export default payoutApi;
