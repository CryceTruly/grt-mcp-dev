export type Coupon = {
  id: string;
  title: string;
  offerUrl: string;
  code?: string;
  description?: string;
  clicks_count_today?: number;
  latest_savings?: number;
};

export type Store = {
  id: string;
  name: string;
  slug: string;
  coupons: Coupon[];
  logo_url?: string;
  affiliate_website_url?: string;
};

export const stores: Store[] = [
  {
    id: "dell",
    name: "Dell",
    slug: "dell",
    logo_url: "https://placehold.co/120x120?text=Dell",
    affiliate_website_url: "https://www.dell.com",
    coupons: [
      {
        id: "dell-1",
        title: "10% off select monitors",
        description: "Apply this code at checkout for 10% off select monitors.",
        offerUrl: "https://www.dell.com/en-us/shop/deals",
        code: "MONITOR10",
      },
      {
        id: "dell-2",
        title: "Free shipping on orders over $49",
        description: "Free standard shipping when you spend $49 or more.",
        offerUrl: "https://www.dell.com/en-us/shop",
      },
      {
        id: "dell-3",
        title: "Up to $200 off XPS laptops",
        description: "Save up to $200 on XPS laptops when you use this offer.",
        offerUrl: "https://www.dell.com/en-us/shop/laptops/xps",
        code: "XPS200",
      },
    ],
  },
  {
    id: "amazon",
    name: "Amazon",
    slug: "amazon",
    logo_url: "https://placehold.co/120x120?text=Amazon",
    affiliate_website_url: "https://www.amazon.com",
    coupons: [
      {
        id: "amazon-1",
        title: "$10 off first Subscribe & Save order",
        description: "New subscribers get $10 off their first Subscribe & Save order.",
        offerUrl: "https://www.amazon.com/gp/subscribe-and-save",
      },
      {
        id: "amazon-2",
        title: "Prime members: 5% back on Whole Foods",
        description: "Prime members earn 5% back on Whole Foods Market purchases.",
        offerUrl: "https://www.amazon.com/wholefoods",
      },
    ],
  },
  {
    id: "bestbuy",
    name: "Best Buy",
    slug: "bestbuy",
    logo_url: "https://placehold.co/120x120?text=Best+Buy",
    affiliate_website_url: "https://www.bestbuy.com",
    coupons: [
      {
        id: "bestbuy-1",
        title: "15% off for students",
        description: "Verify your student status to get 15% off at checkout.",
        offerUrl: "https://www.bestbuy.com/student",
      },
      {
        id: "bestbuy-2",
        title: "Free installation on TV purchase over $999",
        description: "Free standard installation when you buy a TV over $999.",
        offerUrl: "https://www.bestbuy.com/site/tvs",
      },
    ],
  },
  {
    id: "nike",
    name: "Nike",
    slug: "nike",
    logo_url: "https://placehold.co/120x120?text=Nike",
    affiliate_website_url: "https://www.nike.com",
    coupons: [
      {
        id: "nike-1",
        title: "Members get 25% off first order",
        description: "Join Nike Membership and get 25% off your first order.",
        offerUrl: "https://www.nike.com/membership",
      },
      {
        id: "nike-2",
        title: "Free shipping on orders $75+",
        description: "Free standard shipping when you spend $75 or more.",
        offerUrl: "https://www.nike.com",
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
