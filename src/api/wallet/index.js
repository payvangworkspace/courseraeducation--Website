import { apiClient } from "../client/apiClient";

/** wallet-controller */
export const WALLET_ENDPOINTS = {
  LIST: "/wallet/walletList",
  CRYPTO_LIST: "/wallet/cryptoWalletList",
  SAVE: "/wallet/savewallet",
  CREDIT: "/wallet/creditwallet",
  BY_MERCHANT: (merchantId) => `/wallet/getWalletByMerchantId/${merchantId}`,
  CRYPTO_BY_MERCHANT: (merchantId) =>
    `/wallet/getCryptoWalletByMerchantId/${merchantId}`,
};

export const walletApi = {
  getWalletList: (options = {}) =>
    apiClient.get(WALLET_ENDPOINTS.LIST, undefined, options),

  getCryptoWalletList: (options = {}) =>
    apiClient.get(WALLET_ENDPOINTS.CRYPTO_LIST, undefined, options),

  saveWallet: (body, options = {}) =>
    apiClient.post(WALLET_ENDPOINTS.SAVE, body, options),

  creditWallet: (body, options = {}) =>
    apiClient.post(WALLET_ENDPOINTS.CREDIT, body, options),

  getWalletByMerchantId: (merchantId, options = {}) =>
    apiClient.get(WALLET_ENDPOINTS.BY_MERCHANT(merchantId), undefined, options),

  getCryptoWalletByMerchantId: (merchantId, options = {}) =>
    apiClient.get(WALLET_ENDPOINTS.CRYPTO_BY_MERCHANT(merchantId), undefined, options),
};

export default walletApi;
