import { apiClient } from "../client/apiClient";

/** api-master-controller */
export const API_MASTER_ENDPOINTS = {
  SAVE_API: "/apimasters/saveapi",
  UPDATE_API: "/apimasters/updateapi",
  GET_ALL: "/apimasters/GetAllApi",
  GET_BY_ID: (id) => `/apimasters/GetApiByid/${id}`,
  GET_ACQUIRER_CODES: "/apimasters/GetAcquirerCodes",
  SAVE_MERCHANT_MAPPING: "/apimasters/savemerchantAggregatormapping",
  UPDATE_MERCHANT_MAPPING: "/apimasters/updatemerchantAggregatormapping",
  GET_MERCHANT_MAPPING: (merchantId) =>
    `/apimasters/GetMerchantAggregatorMapping/${merchantId}`,
};

export const apiMasterApi = {
  saveApiMaster: (body, options = {}) =>
    apiClient.post(API_MASTER_ENDPOINTS.SAVE_API, body, options),

  updateApiMaster: (body, options = {}) =>
    apiClient.post(API_MASTER_ENDPOINTS.UPDATE_API, body, options),

  getAllApi: (options = {}) =>
    apiClient.get(API_MASTER_ENDPOINTS.GET_ALL, undefined, options),

  getApiById: (id, options = {}) =>
    apiClient.get(API_MASTER_ENDPOINTS.GET_BY_ID(id), undefined, options),

  getAcquirerCodes: (options = {}) =>
    apiClient.get(API_MASTER_ENDPOINTS.GET_ACQUIRER_CODES, undefined, options),

  saveMerchantAggregatorMapping: (body, options = {}) =>
    apiClient.post(API_MASTER_ENDPOINTS.SAVE_MERCHANT_MAPPING, body, options),

  updateMerchantAggregatorMapping: (body, options = {}) =>
    apiClient.post(API_MASTER_ENDPOINTS.UPDATE_MERCHANT_MAPPING, body, options),

  getMerchantAggregatorMapping: (merchantId, options = {}) =>
    apiClient.get(API_MASTER_ENDPOINTS.GET_MERCHANT_MAPPING(merchantId), undefined, options),
};

export default apiMasterApi;
