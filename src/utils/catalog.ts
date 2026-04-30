import type { Product } from "../types/product";

export type CategorySummary = {
  slug: string;
  title: string;
  description: string;
  productCount: number;
  startıngPrice: number;
  topBrands: string[];
  accent: string;
};

export type CampaignSummary = {
  id: string;
  title: string;
  description: string;
  to: string;
  accent: string;
  tag: string;
};

const categoryAccentPalette = ["#dbeafe", "#fee2e2", "#dcfce7", "#fef3c7", "#ede9fe"];
const campaignAccentPalette = ["#0f172a", "#1d4ed8", "#0f766e", "#7c3aed"];

export const toCategoryTitle = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const buildCategorySummaries = (products: Product[]): CategorySummary[] => {
  const categoryMap = new Map<string, Product[]>();

  products.forEach((product) => {
    const current = categoryMap.get(product.category) ?? [];
    current.push(product);
    categoryMap.set(product.category, current);
  });

  return [...categoryMap.entries()]
    .map(([slug, scopedProducts], index) => {
      const sortedByPrice = [...scopedProducts].sort((left, right) => left.price - right.price);
      const brandFrequency = scopedProducts.reduce<Record<string, number>>((acc, product) => {
        acc[product.brand] = (acc[product.brand] ?? 0) + 1;
        return acc;
      }, {});
      const topBrands = Object.entries(brandFrequency)
        .sort((left, right) => right[1] - left[1])
        .slice(0, 3)
        .map(([brand]) => brand);

      return {
        slug,
        title: toCategoryTitle(slug),
        description: `${scopedProducts.length} ürün, ${topBrands.join(", ")} ve daha fazlası Firestore üzerinden listeleniyor.`,
        productCount: scopedProducts.length,
        startıngPrice: sortedByPrice[0]?.price ?? 0,
        topBrands,
        accent: categoryAccentPalette[index % categoryAccentPalette.length]
      };
    })
    .sort((left, right) => right.productCount - left.productCount);
};

export const buildCampaignSummaries = (products: Product[]): CampaignSummary[] =>
  [...products]
    .sort((left, right) => right.discount - left.discount)
    .slice(0, 3)
    .map((product, index) => ({
      id: product.id,
      title: `${product.name} için özel fırsat`,
      description: `${product.brand} ${product.category} kategorisinde %${product.discount} indirim ve ${product.installment.toLowerCase()} secenegiyle one cikiyor.`,
      to: `/product/${product.slug}`,
      accent: campaignAccentPalette[index % campaignAccentPalette.length],
      tag: product.badge || "Firestore"
    }));

export const getAverageRating = (products: Product[]) => {
  if (products.length === 0) {
    return 0;
  }

  return products.reduce((sum, product) => sum + product.rating, 0) / products.length;
};

export const getTotalReviewCount = (products: Product[]) =>
  products.reduce((sum, product) => sum + product.reviewCount, 0);

