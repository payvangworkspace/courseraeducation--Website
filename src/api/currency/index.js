import { apiClient, unwrapList } from "../client/apiClient";
import { merchantApi } from "../merchant";

function encodeId(value) {
  return encodeURIComponent(String(value || ""));
}

/** currency-controller */
export const CURRENCY_ENDPOINTS = {
  ADD: "/currency",
  UPDATE: "/currency",
  ALL: "/currency/all",
  BY_ID: (currencyId) => `/currency/${encodeId(currencyId)}`,
  MAPPING: "/currency/mapping",
  MAPPING_BY_MERCHANT: (merchantId) => `/currency/mapping/${encodeId(merchantId)}`,
  REMOVE_MAPPING: (merchantId, currencyId) =>
    `/currency/mapping/${encodeId(merchantId)}/${encodeId(currencyId)}`,
};

/** Live API caps each page around this size even when a larger `size` is sent. */
export const CURRENCY_PAGE_SIZE = 25;

function currencyKey(item) {
  return String(item?.currencyId || item?.currencyCode || "").toUpperCase();
}

function reportedTotal(res) {
  if (!res || typeof res !== "object" || Array.isArray(res)) return NaN;
  const nested =
    res.data && typeof res.data === "object" && !Array.isArray(res.data) ? res.data : {};
  for (const value of [
    res.totalElement,
    res.totalElements,
    res.total,
    res.totalCount,
    nested.totalElement,
    nested.totalElements,
  ]) {
    const n = Number(value);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return NaN;
}

function pageItems(res) {
  return unwrapList(res).filter(Boolean);
}

function appendUnique(list, seen, items) {
  for (const item of list) {
    const key = currencyKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    items.push(item);
  }
}

function fetchCurrencyPage(body = {}, options = {}) {
  return apiClient.post(
    CURRENCY_ENDPOINTS.ALL,
    {
      start: body.start ?? 0,
      size: Number(body.size ?? CURRENCY_PAGE_SIZE),
      keyword: body.keyword ?? "",
      ...(body.currencyCode ? { currencyCode: body.currencyCode } : {}),
      ...(body.status !== undefined ? { status: body.status } : {}),
    },
    options
  );
}

export function isBrokenMappingRef(err) {
  const status = Number(err?.status);
  const message = String(err?.message || err?.data?.message || err?.data?.errors || err?.data?.error || "");
  return (
    status === 500 ||
    /getCurrencyCode\(\)|LocationCountry|getCountryCode\(\)|because "c" is null|username should not be empty|unrecognized field|json parse error/i.test(message)
  );
}

function mappingField(source) {
  if (!source || typeof source !== "object") return undefined;
  return source.currencies ?? source.currencyCodes ?? source.currencyMapping ?? source.mappedCurrencies;
}

export function parseMappedCurrencies(source) {
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

const CACHE_PREFIX = "currency-mapping:";

export function readCurrencyMappingCache(userId) {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(CACHE_PREFIX + userId) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCurrencyMappingCache(userId, currencies) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + userId, JSON.stringify(currencies || []));
  } catch {
    /* ignore quota / private mode */
  }
}

export const currencyApi = {
  addCurrency: (body, options = {}) =>
    apiClient.post(CURRENCY_ENDPOINTS.ADD, body, options),

  updateCurrency: (body, options = {}) =>
    apiClient.put(CURRENCY_ENDPOINTS.UPDATE, body, options),

  /**
   * POST /currency/all is paged. `start` is a page index (0, 1, 2…), not a row
   * offset — sending start=25 returns an empty page. Size above ~25 is ignored.
   */
  getAllCurrencies: async (body = {}, options = {}) => {
    const requestedSize = Number(body.size);
    const singlePage =
      Number.isFinite(requestedSize) &&
      requestedSize > 0 &&
      requestedSize <= CURRENCY_PAGE_SIZE;

    if (singlePage) return fetchCurrencyPage(body, options);

    const size = CURRENCY_PAGE_SIZE;
    const seen = new Set();
    const items = [];

    const first = await fetchCurrencyPage({ ...body, start: 0, size }, options);
    const firstList = pageItems(first);
    let total = reportedTotal(first);
    appendUnique(firstList, seen, items);

    const pageLen = firstList.length || size;
    if (!pageLen || (Number.isFinite(total) && items.length >= total)) {
      return {
        ...(typeof first === "object" && first && !Array.isArray(first) ? first : {}),
        data: items,
        totalElement: Number.isFinite(total) ? total : items.length,
      };
    }

    const probe = await fetchCurrencyPage({ ...body, start: 1, size: pageLen }, options);
    const probeList = pageItems(probe);
    const known = reportedTotal(probe);
    if (Number.isFinite(known)) total = known;

    const page0Keys = new Set(firstList.map(currencyKey).filter(Boolean));
    const overlap = probeList.filter((item) => page0Keys.has(currencyKey(item))).length;
    const isPageIndex = probeList.length > 0 && overlap < probeList.length / 2;

    const pageCount = Number.isFinite(total)
      ? Math.max(1, Math.ceil(total / pageLen))
      : 20;

    const loadStarts = async (nextStarts) => {
      if (!nextStarts.length) return;
      const pages = await Promise.all(
        nextStarts.map((start) => fetchCurrencyPage({ ...body, start, size: pageLen }, options))
      );
      for (const res of pages) {
        const extra = reportedTotal(res);
        if (Number.isFinite(extra)) total = extra;
        appendUnique(pageItems(res), seen, items);
      }
    };

    const starts = [];
    if (isPageIndex) {
      appendUnique(probeList, seen, items);
      for (let page = 2; page < pageCount; page += 1) starts.push(page);
    } else {
      for (let page = 1; page < pageCount; page += 1) starts.push(page * pageLen);
    }
    await loadStarts(starts);

    // If offset paging added nothing, retry as 1-based page numbers (2, 3, 4…).
    if (Number.isFinite(total) && items.length < total) {
      const used = new Set(starts);
      const oneBased = [];
      for (let page = 2; page <= pageCount; page += 1) {
        if (!used.has(page)) oneBased.push(page);
      }
      await loadStarts(oneBased);
    }

    return {
      ...(typeof first === "object" && first && !Array.isArray(first) ? first : {}),
      data: items,
      totalElement: Number.isFinite(total) ? total : items.length,
    };
  },

  deleteCurrency: (currencyId, options = {}) =>
    apiClient.delete(CURRENCY_ENDPOINTS.BY_ID(currencyId), options),

  addCurrencyMapping: async (body, options = {}) => {
    const userId = body?.userId;
    const currencies = Array.isArray(body?.currencies) ? body.currencies : [];
    try {
      return await apiClient.post(
        CURRENCY_ENDPOINTS.MAPPING,
        { userId, currencies },
        options
      );
    } catch (err) {
      if (!isBrokenMappingRef(err) && ![400, 404].includes(Number(err?.status))) throw err;
      return currencyApi.saveFallbackCurrencies(userId, currencies, options);
    }
  },

  getCurrencyMapping: async (merchantId, options = {}) => {
    try {
      return await apiClient.get(
        CURRENCY_ENDPOINTS.MAPPING_BY_MERCHANT(merchantId),
        undefined,
        options
      );
    } catch (err) {
      if (isBrokenMappingRef(err) || [400, 404].includes(Number(err?.status))) {
        return { currencies: [], fallback: true };
      }
      throw err;
    }
  },

  removeCurrencyMapping: async (merchantId, currencyId, remaining = [], options = {}) => {
    try {
      return await apiClient.delete(
        CURRENCY_ENDPOINTS.REMOVE_MAPPING(merchantId, currencyId),
        options
      );
    } catch (err) {
      if (!isBrokenMappingRef(err) && Number(err?.status) !== 404) throw err;
      return currencyApi.saveFallbackCurrencies(merchantId, remaining, options);
    }
  },

  saveFallbackCurrencies: (userId, currencies = [], options = {}) => {
    const codes = (Array.isArray(currencies) ? currencies : [currencies])
      .map((item) => {
        if (item && typeof item === "object") return item.currencyCode || item.currencyId;
        return item;
      })
      .filter(Boolean);
    return merchantApi.updateDetails(
      { userId, username: userId, userName: userId, currencies: codes.join(",") },
      options
    );
  },
};

export default currencyApi;
