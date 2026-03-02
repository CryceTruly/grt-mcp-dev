import type { Coupon, Store } from "./promocodes-data";

/**
 * API response shapes (no auth required):
 *
 * GET /api/v1/stores/{slug}?only_is_active=1&only_is_approved=0&client=8
 *   → 200: { id, name, slug, number_of_coupons, coupons: [{ id, title, description, discount_code, expiration_date, custom_url, ... }] }
 *   → 404: slug not found
 *
 * GET /api/v1/stores/search-stores/?search_text=...&isCRM=0&client=8
 *   → 200: top-level array of store objects: [{ id, name, slug, number_of_coupons, ... }, ...]
 */

const API_BASE = process.env.DISCOUNTCODES_API_BASE ?? "https://backend.discountcodes.com";
const CLIENT = process.env.DISCOUNTCODES_CLIENT ?? "8";

type ApiCoupon = {
  id: number;
  title: string;
  description?: string | null;
  discount_code?: string | null;
  expiration_date?: string | null;
  custom_url?: string | null;
  clicks_count_today?: number;
  latest_savings?: number | null;
  [key: string]: unknown;
};

type ApiStore = {
  id: number;
  name: string;
  slug: string;
  logo_url?: string | null;
  affiliate_website_url?: string | null;
  coupons?: ApiCoupon[];
  number_of_coupons?: number;
  [key: string]: unknown;
};

function toSlug(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function mapCoupon(c: ApiCoupon): Coupon {
  return {
    id: String(c.id),
    title: c.title ?? "Offer",
    offerUrl: c.custom_url ?? "https://www.promocodes.com",
    code: c.discount_code && c.discount_code.trim() !== "" ? c.discount_code : undefined,
    description: c.description && c.description.trim() !== "" ? c.description : undefined,
    clicks_count_today: typeof c.clicks_count_today === "number" ? c.clicks_count_today : undefined,
    latest_savings: typeof c.latest_savings === "number" && c.latest_savings > 0 ? c.latest_savings : undefined,
  };
}

export type StoreWithCouponsResult = { store: Store; coupons: Coupon[] } | null;

const HEADERS: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

/**
 * Fetch store details and coupons from discountcodes.com backend.
 * No authentication headers are sent.
 */
export async function fetchStoreAndCoupons(searchText: string): Promise<StoreWithCouponsResult> {
  let slug = toSlug(searchText);
  if (!slug) return null;

  // 1) Try store details by slug first
  let storeUrl = `${API_BASE}/api/v1/stores/${encodeURIComponent(slug)}?only_is_active=1&only_is_approved=0&client=${CLIENT}`;
  let res = await fetch(storeUrl, { headers: HEADERS });

  // 2) If 404, try search-stores (returns a top-level array of store objects)
  if (res.status === 404) {
    const searchUrl = `${API_BASE}/api/v1/stores/search-stores/?search_text=${encodeURIComponent(searchText.trim())}&isCRM=0&client=${CLIENT}`;
    const searchRes = await fetch(searchUrl, { headers: HEADERS });
    if (!searchRes.ok) return null;
    const searchData = (await searchRes.json()) as { slug?: string }[] | { results?: { slug?: string }[] };
    const firstItem = Array.isArray(searchData) ? searchData[0] : searchData?.results?.[0];
    const first = firstItem?.slug;
    if (first) {
      slug = first;
      storeUrl = `${API_BASE}/api/v1/stores/${encodeURIComponent(slug)}?only_is_active=1&only_is_approved=0&client=${CLIENT}`;
      res = await fetch(storeUrl, { headers: HEADERS });
    }
  }

  if (!res.ok) return null;

  const data = (await res.json()) as ApiStore;
  const coupons = Array.isArray(data.coupons) ? data.coupons.map(mapCoupon) : [];

  const store: Store = {
    id: String(data.id),
    name: data.name ?? searchText,
    slug: data.slug ?? slug,
    coupons,
    logo_url: data.logo_url && data.logo_url.trim() !== "" ? data.logo_url : undefined,
    affiliate_website_url: data.affiliate_website_url && data.affiliate_website_url.trim() !== "" ? data.affiliate_website_url : undefined,
  };

  return { store, coupons };
}
