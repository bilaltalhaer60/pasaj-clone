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
import { fallbackProducts } from "../data/fallbackProducts";
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

const localProductImages: Record<string, string> = {
  "iphone-17-256-gb": "/pasaj/products/iphone-17-main.webp",
  "iphone-15-128-gb": "/pasaj/products/iphone-15.avif",
  "iphone-17-pro-max-256-gb": "/pasaj/products/iphone-pro-lineup.jpg",
  "iphone-16-128-gb": "/pasaj/products/iphone-15.avif",
  "macbook-air-m4-13": "/pasaj/products/macbook-air-main.webp",
  "macbook-air-m4": "/pasaj/products/macbook-air-main.webp",
  "xiaomi-redmi-note-15-pro-256gb": "/pasaj/products/bestsellers/redmi-note-15.jpg",
  "samsung-galaxy-s25-fe-8gb-256gb": "/pasaj/products/bestsellers/s25-fe.jpg",
  "lenovo-legion-16": "/pasaj/products/bestsellers/lenovo-legion.avif",
  "ipad-air-11": "/pasaj/products/bestsellers/ipad-air-11.jpg",
  "philips-kahve-makinesi": "/pasaj/products/bestsellers/philips-kahve.jpg",
  "dyson-v15-supurge": "/pasaj/products/bestsellers/dyson-v15.webp",
  "arzum-tost-makinesi": "/pasaj/products/bestsellers/arzum-tost.jpg",
  "braun-series-7": "/pasaj/products/bestsellers/braun-series-7.jpg",
  "philips-sac-kurutma": "/pasaj/products/bestsellers/philips-sac-kurutma.avif",
  "xiaomi-akilli-tarti": "/pasaj/products/bestsellers/xiaomi-akilli-tarti.webp",
  "playstation-5-slim": "/pasaj/products/bestsellers/ps5-slim.jpg",
  "logitech-g435": "/pasaj/products/bestsellers/logitech-g435.webp",
  "xbox-wireless-controller": "/pasaj/products/bestsellers/xbox-controller.jpg",
  "jbl-flip-6": "/pasaj/products/bestsellers/jbl-flip-6.jpg",
  "sony-wh-1000xm5": "/pasaj/products/bestsellers/sony-wh-1000xm5.jpg",
  "samsung-soundbar": "/pasaj/products/bestsellers/samsung-soundbar.jpg",
  "anker-powerbank-20000": "/pasaj/products/bestsellers/anker-powerbank.jpg",
  "sbs-hizli-sarj": "/pasaj/products/bestsellers/sbs-charger.webp",
  "akilli-ev-kamera": "/pasaj/products/bestsellers/akilli-ev-kamerasi.jpg"
};

const withLocalProductImage = (product: Product): Product => ({
  ...product,
  image: localProductImages[product.slug] ?? product.image
});

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
  const slug = typeof data.slug === "string" ? data.slug : fallbackProductValues.slug;

  return {
    id: doc.id,
    slug,
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
    image: localProductImages[slug] ?? (typeof data.image === "string" ? data.image : fallbackProductValues.image),
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
  try {
    const productsRef = ensureFirestore();
    const snapshot = await getDocs(query(productsRef, orderBy("popularity", "desc"), limit(4)));

    return snapshot.docs.map(mapProduct).map(withLocalProductImage);
  } catch {
    return fallbackProducts.slice(0, 4);
  }
};

export const getAllProducts = async () => {
  try {
    const productsRef = ensureFirestore();
    const snapshot = await getDocs(productsRef);
    const products = snapshot.docs.map(mapProduct);
    const productsBySlug = new Map(products.map((product) => [product.slug, product]));

    fallbackProducts.forEach((product) => {
      if (!productsBySlug.has(product.slug)) {
        productsBySlug.set(product.slug, product);
      }
    });

    return [...productsBySlug.values()]
      .map(withLocalProductImage)
      .sort((left, right) => right.popularity - left.popularity);
  } catch {
    return [...fallbackProducts]
      .map(withLocalProductImage)
      .sort((left, right) => right.popularity - left.popularity);
  }
};

export const getProductsByCategory = async (category: string) => {
  try {
    const productsRef = ensureFirestore();
    const snapshot = await getDocs(query(productsRef, where("category", "==", category)));
    const products = snapshot.docs.map(mapProduct);
    const productsBySlug = new Map(products.map((product) => [product.slug, product]));

    fallbackProducts
      .filter((product) => product.category === category)
      .forEach((product) => {
        if (!productsBySlug.has(product.slug)) {
          productsBySlug.set(product.slug, product);
        }
      });

    return [...productsBySlug.values()].map(withLocalProductImage);
  } catch {
    return fallbackProducts
      .filter((product) => product.category === category)
      .map(withLocalProductImage);
  }
};

export const getProductBySlug = async (slug?: string) => {
  if (!slug) {
    return null;
  }

  try {
    const productsRef = ensureFirestore();
    const snapshot = await getDocs(query(productsRef, where("slug", "==", slug), limit(1)));

    if (snapshot.docs[0]) {
      return withLocalProductImage(mapProduct(snapshot.docs[0]));
    }

    const fallbackProduct = fallbackProducts.find((product) => product.slug === slug);
    return fallbackProduct ? withLocalProductImage(fallbackProduct) : null;
  } catch {
    const fallbackProduct = fallbackProducts.find((product) => product.slug === slug);
    return fallbackProduct ? withLocalProductImage(fallbackProduct) : null;
  }
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
