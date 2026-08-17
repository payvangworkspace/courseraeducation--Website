import { apiClient } from "../client/apiClient";

/** acquirer-controller */
export const ACQUIRER_ENDPOINTS = {
  CREATE: "/acquirer",
  UPDATE_PAYOUT: "/acquirer/updatePayout",
  UPDATE_PAYIN: "/acquirer/updatePayin",
  STATUS: (type) => `/acquirer/status/${type}`,
  ALL: "/acquirer/all",
  BY_ID: (acquirerId) => `/acquirer/${acquirerId}`,
};

export const acquirerApi = {
  createAcquirer: (body, options = {}) =>
    apiClient.post(ACQUIRER_ENDPOINTS.CREATE, body, options),

  updateAcquirerPayoutDetails: (body, options = {}) =>
    apiClient.post(ACQUIRER_ENDPOINTS.UPDATE_PAYOUT, body, options),

  updateAcquirerPayinDetails: (body, options = {}) =>
    apiClient.post(ACQUIRER_ENDPOINTS.UPDATE_PAYIN, body, options),

  getAllAcquirerByStatus: (type, body, options = {}) =>
    apiClient.post(ACQUIRER_ENDPOINTS.STATUS(type), body, options),

  getAllAcquirer: (body = {}, options = {}) =>
    apiClient.post(
      ACQUIRER_ENDPOINTS.ALL,
      {
        start: body.start ?? 0,
        size: String(body.size ?? 25),
        keyword: body.keyword ?? "",
      },
      options
    ),

  getAcquirerById: (acquirerId, options = {}) =>
    apiClient.get(ACQUIRER_ENDPOINTS.BY_ID(acquirerId), undefined, options),

  deleteAcquirer: (acquirerId, options = {}) =>
    apiClient.delete(ACQUIRER_ENDPOINTS.BY_ID(acquirerId), options),
};

export default acquirerApi;
