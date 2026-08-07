import { apiClient } from "../client/apiClient";

/** fee-rule-controller */
export const FEE_RULE_ENDPOINTS = {
  ADD_FEE_RULE: "/FeeLimitRule/AddMerchantFeeRule",
  UPDATE_FEE_RULE: "/FeeLimitRule/UpdateMerchantFeeRule",
  GET_FEE_RULES: "/FeeLimitRule/GetFeeRules",
  GET_MERCHANT_FEE_RULE: (merchantId) =>
    `/FeeLimitRule/GetMerchantFeeRule/${merchantId}`,
  FEE_RULE_BY_TXN_TYPE: "/FeeLimitRule/FeeRuleByMerchantAndTxnType",
  CHECK_TXN_FEE: "/FeeLimitRule/checkTxnFee",

  ADD_LIMIT_RULE: "/FeeLimitRule/AddMerchantLimitRule",
  UPDATE_LIMIT_RULE: "/FeeLimitRule/UpdateMerchantLimitRule",
  GET_LIMIT_RULES: "/FeeLimitRule/GetLimitRules",
  GET_MERCHANT_LIMIT_RULE: (merchantId) =>
    `/FeeLimitRule/GetMerchantlimitRule/${merchantId}`,
  LIMIT_RULE_BY_TXN_TYPE: "/FeeLimitRule/LimitRuleByMerchantAndTxnType",
};

export const feeRuleApi = {
  addMerchantFeeRule: (body, options = {}) =>
    apiClient.post(FEE_RULE_ENDPOINTS.ADD_FEE_RULE, body, options),

  updateMerchantFeeRule: (body, options = {}) =>
    apiClient.post(FEE_RULE_ENDPOINTS.UPDATE_FEE_RULE, body, options),

  getAllFeeRules: (body, options = {}) =>
    apiClient.post(FEE_RULE_ENDPOINTS.GET_FEE_RULES, body, options),

  getMerchantFeeRule: (merchantId, options = {}) =>
    apiClient.get(FEE_RULE_ENDPOINTS.GET_MERCHANT_FEE_RULE(merchantId), undefined, options),

  getFeeRuleByMerchantAndTxnType: (params, options = {}) =>
    apiClient.get(FEE_RULE_ENDPOINTS.FEE_RULE_BY_TXN_TYPE, params, options),

  checkTxnFee: (body, options = {}) =>
    apiClient.post(FEE_RULE_ENDPOINTS.CHECK_TXN_FEE, body, options),

  addMerchantLimitRule: (body, options = {}) =>
    apiClient.post(FEE_RULE_ENDPOINTS.ADD_LIMIT_RULE, body, options),

  updateMerchantLimitRule: (body, options = {}) =>
    apiClient.post(FEE_RULE_ENDPOINTS.UPDATE_LIMIT_RULE, body, options),

  getAllLimitRules: (body, options = {}) =>
    apiClient.post(FEE_RULE_ENDPOINTS.GET_LIMIT_RULES, body, options),

  getMerchantLimitRule: (merchantId, options = {}) =>
    apiClient.get(FEE_RULE_ENDPOINTS.GET_MERCHANT_LIMIT_RULE(merchantId), undefined, options),

  getLimitRuleByMerchantAndTxnType: (params, options = {}) =>
    apiClient.get(FEE_RULE_ENDPOINTS.LIMIT_RULE_BY_TXN_TYPE, params, options),
};

export default feeRuleApi;
