import { apiClient } from "../client/apiClient";

/** metrics-controller */
export const METRICS_ENDPOINTS = {
  TOTAL: "/api/v1/metrics/hits/total",
  BY_URL: "/api/v1/metrics/hits/url",
  BY_STATUS: "/api/v1/metrics/hits/status",
};

export const metricsApi = {
  getTotalHits: (options = {}) =>
    apiClient.get(METRICS_ENDPOINTS.TOTAL, undefined, options),

  getHitsPerUrl: (options = {}) =>
    apiClient.get(METRICS_ENDPOINTS.BY_URL, undefined, options),

  getHitsPerStatus: (options = {}) =>
    apiClient.get(METRICS_ENDPOINTS.BY_STATUS, undefined, options),
};

export default metricsApi;
