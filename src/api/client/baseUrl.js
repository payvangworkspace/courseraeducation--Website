/**
 * Reads API base URL from .env (VITE_BASE_URL).
 * If VITE_BASE_URL is empty or relative, requests route through Vite proxy
 * to prevent CORS preflight blocking in local development.
 */
export const BASE_URL = (
  import.meta.env.VITE_BASE_URL !== undefined
    ? import.meta.env.VITE_BASE_URL
    : ""
).replace(/\/$/, "");

export default BASE_URL;
