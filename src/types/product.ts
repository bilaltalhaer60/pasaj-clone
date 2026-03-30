export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  previousPrice: number;
  discount: number;
  popularity: number;
  rating: number;
  reviewCount: number;
  installment: string;
  badge: string;
  image: string;
  summary: string;
  shippingNote: string;
  highlights: string[];
  specs: ProductSpec[];
}

export type CategoryMeta = Record<string, { title: string; description: string }>;
