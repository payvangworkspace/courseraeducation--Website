import { apiClient } from "../client/apiClient";
import { merchantApi } from "../merchant";
import { isoCountries } from "../../data/isoCountries";

function encodeId(value) {
  return encodeURIComponent(String(value || ""));
}

/** Mirrors currency-controller. Live Swagger currently has no country paths. */
export const COUNTRY_ENDPOINTS = {
  ALL: "/country/all",
  MAPPING: "/country/mapping",
  MAPPING_BY_MERCHANT: (merchantId) => `/country/mapping/${encodeId(merchantId)}`,
  REMOVE_MAPPING: (merchantId, countryId) =>
    `/country/mapping/${encodeId(merchantId)}/${encodeId(countryId)}`,
};

export function isCountryApiUnavailable(err) {
  const status = Number(err?.status);
  if ([404, 405, 501, 502].includes(status)) return true;
  const message = String(err?.message || err?.data?.error || "").toLowerCase();
  return (
    message.includes("not found") ||
    message.includes("no static resource") ||
    message.includes("no handler") ||
    message.includes("whitelabel")
  );
}

export function isMongoObjectId(value) {
  return /^[a-f0-9]{24}$/i.test(String(value || ""));
}

export function isBrokenCountryRef(err) {
  const message = String(err?.message || err?.data?.message || err?.data?.error || "");
  return /LocationCountry|getCountryCode\(\)|because "c" is null/i.test(message);
}

function mappingIds(countries = []) {
  return (Array.isArray(countries) ? countries : [countries])
    .map((item) => {
      if (item && typeof item === "object") return item.countryId || item.countryCode || item.id;
      return item;
    })
    .filter(Boolean);
}

export function normalizeCountry(item) {
  if (!item || typeof item !== "object") {
    const code = String(item || "").toUpperCase();
    const match = isoCountries().find((country) => country.countryCode === code);
    return match || { countryId: code, countryCode: code, countryName: code };
  }
  const countryCode = String(item.countryCode || item.code || item.isoCode || "").toUpperCase();
  const countryId = String(item.countryId || item.id || countryCode);
  const countryName = item.countryName || item.name || item.label || countryCode || countryId;
  return { ...item, countryId, countryCode: countryCode || countryId, countryName };
}

const PUBLIC_COUNTRY_CACHE = "public-country-catalog";
const COUNTRIES_NOW_URL = "https://countriesnow.space/api/v0.1/countries/iso";
const NAGER_COUNTRIES_URL = "https://date.nager.at/api/v3/AvailableCountries";

function sortCountries(list) {
  return list.sort((a, b) => a.countryName.localeCompare(b.countryName, "en"));
}

function fromNager(data) {
  if (!Array.isArray(data)) return [];
  return sortCountries(
    data
      .map((item) => {
        const countryCode = String(item?.countryCode || item?.cca2 || "").toUpperCase();
        const countryName = item?.name || "";
        if (!countryCode || !countryName) return null;
        return { countryId: countryCode, countryCode, countryName };
      })
      .filter(Boolean)
  );
}

function fromCountriesNow(payload) {
  const list = Array.isArray(payload) ? payload : payload?.data;
  if (!Array.isArray(list)) return [];
  return sortCountries(
    list
      .map((item) => {
        const countryCode = String(item?.Iso2 || item?.iso2 || item?.code || "").toUpperCase();
        const countryName = item?.name || item?.country || "";
        if (!countryCode || !countryName) return null;
        return { countryId: countryCode, countryCode, countryName };
      })
      .filter(Boolean)
  );
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const data = await response.json();
    if (data && data.success === false) throw new Error("Public country API returned an error.");
    return data;
  } finally {
    window.clearTimeout(timer);
  }
}

function readPublicCache() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(PUBLIC_COUNTRY_CACHE) || "[]");
    return Array.isArray(parsed) && parsed.length ? parsed : [];
  } catch {
    return [];
  }
}

function writePublicCache(list) {
  try {
    sessionStorage.setItem(PUBLIC_COUNTRY_CACHE, JSON.stringify(list));
  } catch {
    /* ignore quota / private mode */
  }
}

let publicCatalogPromise;

async function fetchPublicCountries() {
  const cached = readPublicCache();
  if (cached.length) return cached.map(normalizeCountry);

  const load = async () => {
    try {
      const now = fromCountriesNow(await fetchJson(COUNTRIES_NOW_URL));
      if (now.length) return now;
    } catch {
      /* try next public source */
    }
    try {
      const nager = fromNager(await fetchJson(NAGER_COUNTRIES_URL));
      if (nager.length) return nager;
    } catch {
      /* fall through to ISO list */
    }
    return isoCountries();
  };

  if (!publicCatalogPromise) publicCatalogPromise = load();
  const list = await publicCatalogPromise;
  if (list.length) writePublicCache(list);
  return list;
}

function isoCatalog() {
  const data = isoCountries();
  return { data, totalElement: data.length, fallback: true };
}

function mappingField(source) {
  if (!source || typeof source !== "object") return undefined;
  return (
    source.countries ??
    source.countryCodes ??
    source.countryMapping ??
    source.mappedCountries ??
    source.mappedCountryCodes
  );
}

export function parseMappedCountries(source) {
  if (!source) return [];
  if (Array.isArray(source)) return source;
  if (Array.isArray(source.data)) return source.data;
  const nested =
    source.data && typeof source.data === "object" && !Array.isArray(source.data)
      ? source.data
      : {};
  const raw = mappingField(source) ?? mappingField(nested);
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(/[,|;]/).map((part) => part.trim()).filter(Boolean);
  }
  return [];
}

const CACHE_PREFIX = "country-mapping:";

export function readCountryMappingCache(userId) {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(CACHE_PREFIX + userId) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCountryMappingCache(userId, countries) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + userId, JSON.stringify(countries || []));
  } catch {
    /* ignore quota / private mode */
  }
}

export const countryApi = {
  getAllCountries: async () => {
    try {
      const data = await fetchPublicCountries();
      if (data.length) return { data, totalElement: data.length };
    } catch {
      /* ISO list is always available offline */
    }
    return isoCatalog();
  },

  addCountryMapping: async (body, options = {}) => {
    const ids = mappingIds(body?.countries);
    const canUseMappingApi = ids.length > 0 && ids.every(isMongoObjectId);
    if (canUseMappingApi) {
      try {
        return await apiClient.post(COUNTRY_ENDPOINTS.MAPPING, { ...body, countries: ids }, options);
      } catch (err) {
        if (!isCountryApiUnavailable(err) && !isBrokenCountryRef(err) && Number(err?.status) !== 500) {
          throw err;
        }
      }
    }
    return countryApi.saveFallbackCountries(body.userId, ids, options);
  },

  getCountryMapping: async (merchantId, options = {}) => {
    try {
      return await apiClient.get(
        COUNTRY_ENDPOINTS.MAPPING_BY_MERCHANT(merchantId),
        undefined,
        options
      );
    } catch (err) {
      if (
        isCountryApiUnavailable(err) ||
        isBrokenCountryRef(err) ||
        Number(err?.status) === 500
      ) {
        return { countries: [], fallback: true };
      }
      throw err;
    }
  },

  removeCountryMapping: async (merchantId, countryId, remaining = [], options = {}) => {
    if (isMongoObjectId(countryId)) {
      try {
        return await apiClient.delete(
          COUNTRY_ENDPOINTS.REMOVE_MAPPING(merchantId, countryId),
          options
        );
      } catch (err) {
        if (!isCountryApiUnavailable(err) && !isBrokenCountryRef(err) && Number(err?.status) !== 500) {
          throw err;
        }
      }
    }
    return countryApi.saveFallbackCountries(merchantId, remaining, options);
  },

  saveFallbackCountries: (userId, countries = [], options = {}) => {
    const codes = (Array.isArray(countries) ? countries : [countries])
      .map((item) => {
        if (item && typeof item === "object") return item.countryCode || item.countryId;
        return item;
      })
      .filter(Boolean);
    return merchantApi.updateDetails(
      { userId, username: userId, userName: userId, countries: codes.join(",") },
      options
    );
  },
};

export default countryApi;
