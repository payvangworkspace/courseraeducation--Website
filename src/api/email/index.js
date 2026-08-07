import { apiClient } from "../client/apiClient";

/** email-controller */
export const EMAIL_ENDPOINTS = {
  SEND: "/send-email",
  SAVE_MASTER: "/SaveEmailMaster",
  UPDATE_MASTER: "/UpdateEmailMaster",
  LIST_MASTER: "/GetEmailMasterList",
};

export const emailApi = {
  sendEmail: (body, options = {}) =>
    apiClient.post(EMAIL_ENDPOINTS.SEND, body, options),

  saveEmailMaster: (body, options = {}) =>
    apiClient.post(EMAIL_ENDPOINTS.SAVE_MASTER, body, options),

  updateEmailMaster: (body, options = {}) =>
    apiClient.post(EMAIL_ENDPOINTS.UPDATE_MASTER, body, options),

  getEmailMasterList: (body, options = {}) =>
    apiClient.post(EMAIL_ENDPOINTS.LIST_MASTER, body, options),
};

export default emailApi;
