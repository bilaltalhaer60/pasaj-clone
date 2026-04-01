import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  type DocumentData,
  type QueryDocumentSnapshot
} from "firebase/firestore";
import { env } from "../config/env";
import { firestore } from "../config/firebase";
import type { Product, ProductSpec } from "../types/product";

const productsCollectionName = env.productsCollection;

const fallbackProductValues: Omit<Product, "id"> = {
  slug: "",
  name: "",
  brand: "",
  category: "",
  price: 0,
  previousPrice: 0,
  discount: 0,
  popularity: 0,
  rating: 0,
  reviewCount: 0,
  installment: "",
  badge: "",
  image: "",
  summary: "",
  shippingNote: "",
  highlights: [],
  specs: []
};

const ensureFirestore = () => {
  if (!firestore || !productsCollectionName) {
    throw new Error(
      "Firebase ayarlari eksik. .env dosyasini ve Firestore products koleksiyonunu kontrol etmen gerekiyor."
    );
  }

  return collection(firestore, productsCollectionName);
};

const toSpecs = (value: unknown): ProductSpec[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is ProductSpec =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as ProductSpec).label === "string" &&
        typeof (item as ProductSpec).value === "string"
    )
    .map((item) => ({
      label: item.label,
      value: item.value
    }));
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
};

const mapProduct = (doc: QueryDocumentSnapshot<DocumentData>): Product => {
  const data = doc.data();

  return {
    id: doc.id,
    slug: typeof data.slug === "string" ? data.slug : fallbackProductValues.slug,
    name: typeof data.name === "string" ? data.name : fallbackProductValues.name,
    brand: typeof data.brand === "string" ? data.brand : fallbackProductValues.brand,
    category:
      typeof data.category === "string" ? data.category : fallbackProductValues.category,
    price: typeof data.price === "number" ? data.price : fallbackProductValues.price,
    previousPrice:
      typeof data.previousPrice === "number"
        ? data.previousPrice
        : fallbackProductValues.previousPrice,
    discount: typeof data.discount === "number" ? data.discount : fallbackProductValues.discount,
    popularity:
      typeof data.popularity === "number" ? data.popularity : fallbackProductValues.popularity,
    rating: typeof data.rating === "number" ? data.rating : fallbackProductValues.rating,
    reviewCount:
      typeof data.reviewCount === "number"
        ? data.reviewCount
        : fallbackProductValues.reviewCount,
    installment:
      typeof data.installment === "string"
        ? data.installment
        : fallbackProductValues.installment,
    badge: typeof data.badge === "string" ? data.badge : fallbackProductValues.badge,
    image: typeof data.image === "string" ? data.image : fallbackProductValues.image,
    summary: typeof data.summary === "string" ? data.summary : fallbackProductValues.summary,
    shippingNote:
      typeof data.shippingNote === "string"
        ? data.shippingNote
        : fallbackProductValues.shippingNote,
    highlights: toStringArray(data.highlights),
    specs: toSpecs(data.specs)
  };
};

export const getFeaturedProducts = async () => {
  const productsRef = ensureFirestore();
  const snapshot = await getDocs(query(productsRef, orderBy("popularity", "desc"), limit(4)));

  return snapshot.docs.map(mapProduct);
};

export const getProductsByCategory = async (category: string) => {
  const productsRef = ensureFirestore();
  const snapshot = await getDocs(query(productsRef, where("category", "==", category)));

  return snapshot.docs.map(mapProduct);
};

export const getProductBySlug = async (slug?: string) => {
  if (!slug) {
    return null;
  }

  const productsRef = ensureFirestore();
  const snapshot = await getDocs(query(productsRef, where("slug", "==", slug), limit(1)));

  return snapshot.docs[0] ? mapProduct(snapshot.docs[0]) : null;
};
