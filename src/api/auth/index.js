import { apiClient } from "../client/apiClient";

/** authenticate-controller + key-controller */
export const AUTH_ENDPOINTS = {
  PUBLIC_KEY: "/apiauth/publicKey",
  GENERATE_TOKEN: "/generate-token",
  LOGOUT: "/logoutuser",
  TEST_TOKEN: "/GetTestToken",
  TEST_URL: "/TestUrl",
};

export const authApi = {
  getPublicKey: (options = {}) =>
    apiClient.get(AUTH_ENDPOINTS.PUBLIC_KEY, undefined, { auth: false, ...options }),

  generateToken: (body, options = {}) =>
    apiClient.post(AUTH_ENDPOINTS.GENERATE_TOKEN, body, { auth: false, ...options }),

  logout: (body, options = {}) =>
    apiClient.post(AUTH_ENDPOINTS.LOGOUT, body, options),

  getTestToken: (body, options = {}) =>
    apiClient.post(AUTH_ENDPOINTS.TEST_TOKEN, body, { auth: false, ...options }),

  testUrl: (options = {}) =>
    apiClient.get(AUTH_ENDPOINTS.TEST_URL, undefined, { auth: false, ...options }),
};

export default authApi;
