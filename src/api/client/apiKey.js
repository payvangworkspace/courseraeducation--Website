/**
 * API key header(s) required by Payout-service (e.g. checkout params).
 * Set VITE_API_KEY in .env — sent as ZIPAPIKEY and X-API-Key.
 */
export function getApiKeyHeaders() {
  const key =
    import.meta.env.VITE_API_KEY ||
    import.meta.env.VITE_ZIPAPIKEY ||
    "";

  if (!key) return {};

  return {
    ZIPAPIKEY: key,
    "X-API-Key": key,
  };
}

export function hasApiKey() {
  return Boolean(
    import.meta.env.VITE_API_KEY || import.meta.env.VITE_ZIPAPIKEY
  );
}
