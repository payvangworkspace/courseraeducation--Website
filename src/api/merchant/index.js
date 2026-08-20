import { apiClient } from "../client/apiClient";

/** user-controller (merchant) + user-account-controller + user-document-controller */
export const MERCHANT_ENDPOINTS = {
  CREATE: "/user/merchant",
  LIST: "/user/merchant/list",
  ALL: "/user/merchant/all",
  BY_ID: (userId) => `/user/merchant/${userId}`,
  CREATE_ADMIN: "/user/admin",
  CREATE_VIA_ADMIN: "/user/UserCreationViaAdmin",
  ALL_USERS: "/user/all",
  RESET_PASSWORD: "/user/resetPassword",
  RANDOM_AES_KEY: "/user/GetRandomAESKey",
  TEST: "/user/test",

  // Account
  PERSONAL_DETAILS: (userId) => `/user/personalDetails/${userId}`,
  ACCOUNT_DETAILS: (userId) => `/user/accountDetails/${userId}`,
  UPDATE_DETAILS: "/user/updateDetails",
  VERIFY_USER: (userId) => `/user/verifyUser/${userId}`,
  STATUS: (userId) => `/user/status/${userId}`,
  PAYIN_STATUS: (userId) => `/user/payinstatus/${userId}`,
  PAYOUT_STATUS: (userId) => `/user/payoutstatus/${userId}`,
  PAYOUT_STATUS_VIA_APP: (userId) => `/user/payoutStatusViaApplication/${userId}`,
  PAYIN_GST_STATUS: (userId) => `/user/payinGststatus/${userId}`,
  PAYOUT_GST_STATUS: (userId) => `/user/payoutGststatus/${userId}`,
  PAYOUT_FEE_RETURN_STATUS: (userId) => `/user/payoutFeeReturnStatus/${userId}`,
  AUTH_STATUS: (userId) => `/user/authStatus/${userId}`,
  SHORT_CODE: (userId, shortCode) =>
    `/user/UpdateMerchantShortCode/${userId}/ShortCode/${shortCode}`,

  // Documents
  DOCUMENTS: "/user/document",
  DOCUMENTS_BY_USER: (userId) => `/user/document/${userId}`,
  DOCUMENT_FILE: (documentId) => `/user/document/file/${documentId}`,
  VERIFY_DOCUMENT: (documentId) => `/user/document/verify/${documentId}`,
  REJECT_DOCUMENT: "/user/document/reject",

  // Activity
  USER_ACTIVITY: "/userActivity",
};

export const merchantApi = {
  createMerchant: (body, options = {}) =>
    apiClient.post(MERCHANT_ENDPOINTS.CREATE, body, options),

  getAllMerchantList: (body = {}, options = {}) =>
    apiClient.post(
      MERCHANT_ENDPOINTS.LIST,
      {
        start: body.start ?? 0,
        size: String(body.size ?? 25),
        keyword: body.keyword ?? "",
      },
      options
    ),

  getAllMerchant: (body, options = {}) =>
    apiClient.post(MERCHANT_ENDPOINTS.ALL, body, options),

  getMerchant: (userId, options = {}) =>
    apiClient.get(MERCHANT_ENDPOINTS.BY_ID(userId), undefined, options),

  createAdmin: (body, options = {}) =>
    apiClient.post(MERCHANT_ENDPOINTS.CREATE_ADMIN, body, options),

  createUserViaAdmin: (body, options = {}) =>
    apiClient.post(MERCHANT_ENDPOINTS.CREATE_VIA_ADMIN, body, options),

  getAllUsers: (body, options = {}) =>
    apiClient.post(MERCHANT_ENDPOINTS.ALL_USERS, body, options),

  resetPassword: (body, options = {}) =>
    apiClient.post(MERCHANT_ENDPOINTS.RESET_PASSWORD, body, options),

  getRandomAESKey: (options = {}) =>
    apiClient.get(MERCHANT_ENDPOINTS.RANDOM_AES_KEY, undefined, options),

  getPersonalDetails: (userId, options = {}) =>
    apiClient.get(MERCHANT_ENDPOINTS.PERSONAL_DETAILS(userId), undefined, options),

  getAccountDetails: (userId, options = {}) =>
    apiClient.get(MERCHANT_ENDPOINTS.ACCOUNT_DETAILS(userId), undefined, options),

  updateDetails: (body, options = {}) => {
    const payload = {};
    Object.entries(body || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      payload[key] = String(value);
    });
    return apiClient.put(MERCHANT_ENDPOINTS.UPDATE_DETAILS, payload, options);
  },

  // Status toggles: Swagger declares path param only, NO request body.
  // The endpoint flips the current server-side value; caller must refetch.
  verifyUser: (userId, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.VERIFY_USER(userId), undefined, options),

  updateLockedStatus: (userId, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.STATUS(userId), undefined, options),

  updatePayinStatus: (userId, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.PAYIN_STATUS(userId), undefined, options),

  updatePayoutStatus: (userId, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.PAYOUT_STATUS(userId), undefined, options),

  updatePayoutStatusViaApplication: (userId, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.PAYOUT_STATUS_VIA_APP(userId), undefined, options),

  updatePayinGstStatus: (userId, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.PAYIN_GST_STATUS(userId), undefined, options),

  updatePayoutGstStatus: (userId, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.PAYOUT_GST_STATUS(userId), undefined, options),

  updatePayoutFeeReturnStatus: (userId, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.PAYOUT_FEE_RETURN_STATUS(userId), undefined, options),

  updateAuthStatus: (userId, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.AUTH_STATUS(userId), undefined, options),

  updateMerchantShortCode: (userId, shortCode, body, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.SHORT_CODE(userId, shortCode), body, options),

  uploadDocuments: (body, options = {}) =>
    apiClient.post(MERCHANT_ENDPOINTS.DOCUMENTS, body, options),

  /**
   * Multipart document upload.
   * POST /user/document?documentType=&userId= with form field `file`.
   */
  uploadDocument: (file, { documentType, userId } = {}, options = {}) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post(MERCHANT_ENDPOINTS.DOCUMENTS, form, {
      ...options,
      params: { documentType, userId, ...(options.params || {}) },
    });
  },

  getUsersDocuments: (userId, options = {}) =>
    apiClient.get(MERCHANT_ENDPOINTS.DOCUMENTS_BY_USER(userId), undefined, options),

  getDocumentsFile: (documentId, options = {}) =>
    apiClient.get(MERCHANT_ENDPOINTS.DOCUMENT_FILE(documentId), undefined, options),

  // PUT /user/document/verify/{documentId}: path param only, no request body.
  verifyDocument: (documentId, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.VERIFY_DOCUMENT(documentId), undefined, options),

  // PUT /user/document/reject: body is a Map<string,string> (e.g. { documentId, reason }).
  rejectDocument: (body, options = {}) =>
    apiClient.put(MERCHANT_ENDPOINTS.REJECT_DOCUMENT, body, options),

  getUserActivity: (body, options = {}) =>
    apiClient.post(MERCHANT_ENDPOINTS.USER_ACTIVITY, body, options),
};

export default merchantApi;
