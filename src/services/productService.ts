import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { env } from "../config/env";
import { firestore, storage } from "../config/firebase";
import type { Product, ProductSpec } from "../types/product";

const productsCollectionName = env.productsCollection;

const fallbackProductValues: Omit<Product, "id"> = {
  slug: "",
  name: "",
  brand: "",
  category: "",
  stock: 0,
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
    throw new Error("Urun verisi su anda yuklenemiyor.");
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
    stock: typeof data.stock === "number" ? data.stock : fallbackProductValues.stock,
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

export const getAllProducts = async () => {
  const productsRef = ensureFirestore();
  const snapshot = await getDocs(productsRef);

  return snapshot.docs.map(mapProduct).sort((left, right) => right.popularity - left.popularity);
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

export interface ProductMutationInput {
  name: string;
  slug?: string;
  brand: string;
  category: string;
  stock: number;
  price: number;
  previousPrice?: number;
  image: string;
  summary?: string;
}

const slugify = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildProductPayload = (input: ProductMutationInput) => {
  const safePreviousPrice = input.previousPrice && input.previousPrice > input.price
    ? input.previousPrice
    : input.price;
  const discount = safePreviousPrice > input.price
    ? Math.round(((safePreviousPrice - input.price) / safePreviousPrice) * 100)
    : 0;

  return {
    name: input.name.trim(),
    slug: slugify(input.slug?.trim() || input.name),
    brand: input.brand.trim(),
    category: input.category.trim(),
    stock: input.stock,
    price: input.price,
    previousPrice: safePreviousPrice,
    discount,
    image: input.image.trim(),
    popularity: 0,
    rating: 0,
    reviewCount: 0,
    installment: "Pesin fiyatina 3 taksit",
    badge: discount > 0 ? `%${discount} indirim` : "Yeni Urun",
    summary: input.summary?.trim() || `${input.name.trim()} icin yonetim panelinden eklenen urun kaydi.`,
    shippingNote: "Hizli teslimat icin uygun",
    highlights: ["Hizli teslimat", "Resmi distributor urunu", "Pasaj guvencesi"],
    specs: [
      { label: "Marka", value: input.brand.trim() },
      { label: "Kategori", value: input.category.trim() },
      { label: "Stok", value: `${input.stock}` }
    ],
    updatedAt: serverTimestamp()
  };
};

export const createProduct = async (input: ProductMutationInput) => {
  const productsRef = ensureFirestore();
  const payload = {
    ...buildProductPayload(input),
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(productsRef, payload);
  return { id: docRef.id, ...payload };
};

export const updateProduct = async (productId: string, input: ProductMutationInput) => {
  const payload = buildProductPayload(input);
  await setDoc(doc(ensureFirestore(), productId), payload, { merge: true });

  return { id: productId, ...payload };
};

export const deleteProductById = async (productId: string) => {
  await deleteDoc(doc(ensureFirestore(), productId));
};

export const uploadProductImage = async (file: File) => {
  if (!storage) {
    throw new Error("Firebase Storage ayarlari eksik.");
  }

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const storageRef = ref(storage, `products/${fileName}`);
  const snapshot = await uploadBytes(storageRef, file);

  return getDownloadURL(snapshot.ref);
};
