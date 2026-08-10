/**
 * Reads API base URL from .env (VITE_BASE_URL).
 * Vite exposes only VITE_* variables via import.meta.env.
 */
export const BASE_URL = (
  import.meta.env.VITE_BASE_URL || "https://api.courseraeducation.com"
).replace(/\/$/, "");

export default BASE_URL;



