export type Coupon = {
  id: string;
  title: string;
  offerUrl: string;
  code?: string;
  expiry?: string;
  description?: string;
  clicks_count_today?: number;
  latest_savings?: number;
};

export type Store = {
  id: string;
  name: string;
  slug: string;
  coupons: Coupon[];
};

export const stores: Store[] = [
  {
    id: "dell",
    name: "Dell",
    slug: "dell",
    coupons: [
      {
        id: "dell-1",
        title: "10% off select monitors",
        offerUrl: "https://www.dell.com/en-us/shop/deals",
        code: "MONITOR10",
        expiry: "2025-12-31",
      },
      {
        id: "dell-2",
        title: "Free shipping on orders over $49",
        offerUrl: "https://www.dell.com/en-us/shop",
        expiry: "Ongoing",
      },
      {
        id: "dell-3",
        title: "Up to $200 off XPS laptops",
        offerUrl: "https://www.dell.com/en-us/shop/laptops/xps",
        code: "XPS200",
        expiry: "2025-06-30",
      },
    ],
  },
  {
    id: "amazon",
    name: "Amazon",
    slug: "amazon",
    coupons: [
      {
        id: "amazon-1",
        title: "$10 off first Subscribe & Save order",
        offerUrl: "https://www.amazon.com/gp/subscribe-and-save",
        expiry: "Ongoing",
      },
      {
        id: "amazon-2",
        title: "Prime members: 5% back on Whole Foods",
        offerUrl: "https://www.amazon.com/wholefoods",
        expiry: "Ongoing",
      },
    ],
  },
  {
    id: "bestbuy",
    name: "Best Buy",
    slug: "bestbuy",
    coupons: [
      {
        id: "bestbuy-1",
        title: "15% off for students",
        offerUrl: "https://www.bestbuy.com/student",
        expiry: "2025-12-31",
      },
      {
        id: "bestbuy-2",
        title: "Free installation on TV purchase over $999",
        offerUrl: "https://www.bestbuy.com/site/tvs",
        expiry: "Ongoing",
      },
    ],
  },
  {
    id: "nike",
    name: "Nike",
    slug: "nike",
    coupons: [
      {
        id: "nike-1",
        title: "Members get 25% off first order",
        offerUrl: "https://www.nike.com/membership",
        expiry: "Ongoing",
      },
      {
        id: "nike-2",
        title: "Free shipping on orders $75+",
        offerUrl: "https://www.nike.com",
        expiry: "Ongoing",
      },
    ],
  },
];

export function findStoresAndCoupons(query: string): { store: Store; coupons: Store["coupons"] } | null {
  const q = query.trim().toLowerCase();
  const store = stores.find(
    (s) => s.slug.includes(q) || s.name.toLowerCase().includes(q)
  );
  if (!store) return null;
  return { store, coupons: store.coupons };
}
