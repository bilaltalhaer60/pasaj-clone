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

export interface HomeBanner {
  id: string;
  badge: string;
  title: string;
  description: string;
  cta: string;
  background: string;
}

export const allProducts: Product[] = [
  {
    id: "1",
    slug: "iphone-16-pro",
    name: "iPhone 16 Pro 256 GB",
    brand: "Apple",
    category: "telefon",
    price: 79999,
    previousPrice: 84999,
    discount: 6,
    popularity: 99,
    rating: 4.8,
    reviewCount: 128,
    installment: "12 aya varan taksit",
    badge: "Hizli teslim",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80",
    summary: "Titanium kasa, A18 Pro cipi ve gelismis kamera sistemiyle premium telefon deneyimi.",
    shippingNote: "Bugun siparis verirsen yarin kargoda.",
    highlights: ["ProMotion ekran", "48 MP kamera", "USB-C", "Apple Intelligence hazir"],
    specs: [
      { label: "Ekran", value: "6.3 in Super Retina XDR" },
      { label: "Depolama", value: "256 GB" },
      { label: "Baglanti", value: "5G, Wi-Fi 7, Bluetooth 5.4" },
      { label: "Pil", value: "Video oynatmada 27 saate kadar" }
    ]
  },
  {
    id: "2",
    slug: "galaxy-s25-ultra",
    name: "Galaxy S25 Ultra 512 GB",
    brand: "Samsung",
    category: "telefon",
    price: 72999,
    previousPrice: 78999,
    discount: 8,
    popularity: 95,
    rating: 4.7,
    reviewCount: 94,
    installment: "3 ay ertelemeli kredi secenegi",
    badge: "Kampanya",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
    summary: "Yapay zeka destekli kamera ve buyuk ekran isteyenler icin amiral gemisi deneyimi.",
    shippingNote: "Sinirli stokla hizli teslimata uygun.",
    highlights: ["200 MP kamera", "S Pen", "Dayanikli govde", "Canli AMOLED ekran"],
    specs: [
      { label: "Ekran", value: "6.8 in Dynamic AMOLED" },
      { label: "Depolama", value: "512 GB" },
      { label: "Baglanti", value: "5G, Wi-Fi 7, Bluetooth 5.4" },
      { label: "Pil", value: "5000 mAh" }
    ]
  },
  {
    id: "3",
    slug: "macbook-air-m4",
    name: "MacBook Air M4 13 in",
    brand: "Apple",
    category: "bilgisayar",
    price: 56999,
    previousPrice: 59999,
    discount: 5,
    popularity: 91,
    rating: 4.9,
    reviewCount: 61,
    installment: "Egitim indirimi ve 12 taksit",
    badge: "Editor secimi",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    summary: "Ince tasarim, sessiz calisma ve uzun pil omru ile gunluk is akisi icin ideal.",
    shippingNote: "Depodan ayni gun cikisli urun.",
    highlights: ["M4 cip", "18 saate kadar pil", "Liquid Retina ekran", "MagSafe 3"],
    specs: [
      { label: "Ekran", value: "13.6 in Liquid Retina" },
      { label: "Bellek", value: "16 GB unified memory" },
      { label: "Depolama", value: "512 GB SSD" },
      { label: "Agirlik", value: "1.24 kg" }
    ]
  },
  {
    id: "4",
    slug: "lenovo-legion-16",
    name: "Lenovo Legion 16",
    brand: "Lenovo",
    category: "bilgisayar",
    price: 61999,
    previousPrice: 68999,
    discount: 10,
    popularity: 90,
    rating: 4.6,
    reviewCount: 47,
    installment: "Oyuncu laptoplarinda ozel taksit",
    badge: "Sinirli stok",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    summary: "Oyun ve performans odakli kullanim icin guclu ekran karti ve sogutma sistemi sunar.",
    shippingNote: "Stokta, 24 saat icinde kargoda.",
    highlights: ["RTX ekran karti", "165 Hz panel", "RGB klavye", "Gelistirilmis sogutma"],
    specs: [
      { label: "Islemci", value: "Intel Core i7" },
      { label: "Ekran", value: "16 in 165 Hz" },
      { label: "Bellek", value: "32 GB RAM" },
      { label: "Depolama", value: "1 TB SSD" }
    ]
  },
  {
    id: "5",
    slug: "airpods-pro-2",
    name: "AirPods Pro 2",
    brand: "Apple",
    category: "aksesuar",
    price: 9999,
    previousPrice: 11499,
    discount: 13,
    popularity: 88,
    rating: 4.6,
    reviewCount: 205,
    installment: "Sepette avantajli fiyat",
    badge: "Sepette avantaj",
    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?auto=format&fit=crop&w=900&q=80",
    summary: "Aktif gurultu engelleme ve gunluk kullanimda rahat tasarim arayanlar icin ideal.",
    shippingNote: "Aksam 18.00'e kadar ayni gun teslim secenegi.",
    highlights: ["ANC", "Seffaf mod", "Kablosuz sarj", "USB-C sarj kutusu"],
    specs: [
      { label: "Baglanti", value: "Bluetooth 5.3" },
      { label: "Pil", value: "6 saate kadar tek sarj" },
      { label: "Ozellik", value: "Uyarlanabilir ses" },
      { label: "Dayaniklilik", value: "IP54" }
    ]
  },
  {
    id: "6",
    slug: "watch-fit-4",
    name: "Watch Fit 4",
    brand: "Huawei",
    category: "aksesuar",
    price: 6999,
    previousPrice: 7999,
    discount: 12,
    popularity: 82,
    rating: 4.5,
    reviewCount: 72,
    installment: "3 taksit firsati",
    badge: "Yeni",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80",
    summary: "Spor ve saglik takibi odakli hafif akilli saat deneyimi.",
    shippingNote: "Hafta ici sipariste ucretsiz kargo.",
    highlights: ["AMOLED ekran", "Nabiz takibi", "GPS", "Hafif govde"],
    specs: [
      { label: "Ekran", value: "1.82 in AMOLED" },
      { label: "Pil", value: "10 gune kadar" },
      { label: "Sensör", value: "Nabiz ve SpO2" },
      { label: "Uyumluluk", value: "iOS ve Android" }
    ]
  }
];

export const featuredProducts = allProducts.slice(0, 4);

export const homeBanners: HomeBanner[] = [
  {
    id: "banner-1",
    badge: "Yeni sezon",
    title: "Telefon ve bilgisayar vitrinini tek ekranda topla.",
    description: "Eski feature sayfalari icin korunan banner verisi.",
    cta: "Alisverise basla",
    background: "linear-gradient(135deg, #003b73 0%, #0a66c2 55%, #8bd3ff 100%)"
  },
  {
    id: "banner-2",
    badge: "Hizli teslim",
    title: "Kampanyalari ve one cikan urunleri tek akista goster.",
    description: "Bu veri yalnizca legacy feature rotalarinin derlenmesi icin tutuluyor.",
    cta: "Kategorilere git",
    background: "linear-gradient(135deg, #073b3a 0%, #0f766e 52%, #7ae582 100%)"
  }
];

export const categoryMeta: Record<string, { title: string; description: string }> = {
  telefon: {
    title: "Telefon",
    description: "Amiral gemisi ve fiyat performans telefonlari bu vitrinde listelenir."
  },
  bilgisayar: {
    title: "Bilgisayar",
    description: "Notebook ve performans odakli bilgisayar urunleri icin secili liste."
  },
  aksesuar: {
    title: "Aksesuar",
    description: "Kulaklik, saat ve gunluk teknoloji aksesuarlari bir arada."
  }
};

export const findProductBySlug = (slug?: string) =>
  allProducts.find((product) => product.slug === slug);
