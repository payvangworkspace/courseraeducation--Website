/**
 * API key header(s) required by Payout-service (e.g. checkout params).
 * Set VITE_API_KEY in .env — sent as ZIPAPIKEY and X-API-Key.
 * Placeholder / empty values are never sent (avoids "Bad API key format").
 */

const PLACEHOLDER_KEYS = new Set([
  "",
  "your_api_key_here",
  "changeme",
  "replace_me",
  "xxx",
  "test",
]);

function readConfiguredApiKey() {
  const key = String(
    import.meta.env.VITE_API_KEY ||
      import.meta.env.VITE_ZIPAPIKEY ||
      ""
  ).trim();

  if (!key) return "";
  if (PLACEHOLDER_KEYS.has(key.toLowerCase())) return "";
  return key;
}

export function getApiKeyHeaders() {
  const key = readConfiguredApiKey();
  if (!key) return {};

  return {
    ZIPAPIKEY: key,
    "X-API-Key": key,
  };
}

export function hasApiKey() {
  return Boolean(readConfiguredApiKey());
}
