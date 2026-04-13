export type HeroBanner = {
  id: number;
  image: string;
  alt: string;
};

export type ShortcutCategory = {
  title: string;
  image: string;
  to: string;
};

export type CampaignFeature = {
  title: string;
  icon: string;
};

export type CampaignTile = {
  id: number;
  image: string;
  alt: string;
};

export type BrandLogo = {
  name: string;
  image: string;
};

export const topLinks = [
  "Kampanyalar",
  "Markalar",
  "Favorilerim",
  "Siparis Sorgulama",
  "Yardim",
  "Pasaj Blog"
];

export const categoryNav = [
  "Cep Telefonu-Aksesuar",
  "Bilgisayar-Tablet",
  "Elektrikli Ev Aletleri",
  "Saglik-Kisisel Bakim",
  "Hobi-Oyun",
  "TV-Ses Sistemleri",
  "Ev-Yasam"
];

export const heroBanners: HeroBanner[] = [
  {
    id: 1,
    image: "/pasaj/hero/ip0326-new-hero-web.webp",
    alt: "5G uyumlu telefonlara gecin kampanyasi"
  },
  {
    id: 2,
    image: "/pasaj/hero/airm4_satista-new-hero-web.webp",
    alt: "MacBook Air M5 hero banner"
  },
  {
    id: 3,
    image: "/pasaj/hero/pati-tracker-hero-banner-web.webp",
    alt: "Pati tracker kampanya banner"
  },
  {
    id: 4,
    image: "/pasaj/hero/skg0203-new-hero-web.webp",
    alt: "SKG masaj urunleri banner"
  },
  {
    id: 5,
    image: "/pasaj/hero/xxfit3-new-hero-web.webp",
    alt: "Huawei Watch Fit 3 banner"
  }
];

export const shortcutCategories: ShortcutCategory[] = [
  {
    title: "Apple Egitim",
    image: "/pasaj/categories/_1772535591727_appleegitim.webp",
    to: "/"
  },
  {
    title: "Apple Urunleri",
    image: "/pasaj/categories/_1775459311458_apple_brand_store.webp",
    to: "/"
  },
  {
    title: "Apple Telefonlar",
    image: "/pasaj/categories/cep-telefonu164px.webp",
    to: "/category/telefon"
  },
  {
    title: "Hediye Cekilerim",
    image: "/pasaj/categories/hediye-ceki164px.webp",
    to: "/"
  },
  {
    title: "Pasaj Gamer",
    image: "/pasaj/categories/oyun-konsolu164px.webp",
    to: "/"
  },
  {
    title: "Cok Satanlar",
    image: "/pasaj/categories/cok-satan164px.webp",
    to: "/"
  },
  {
    title: "Kurumsal",
    image: "/pasaj/categories/kurumsal164px.webp",
    to: "/"
  },
  {
    title: "Akilli Ev",
    image: "/pasaj/categories/akilli-ev164px.webp",
    to: "/"
  },
  {
    title: "Kahve Makineleri",
    image: "/pasaj/categories/kahve-makinasi164px.webp",
    to: "/"
  },
  {
    title: "Kulakliklar",
    image: "/pasaj/categories/kulaklik164px.webp",
    to: "/"
  }
];

export const infoFeatures: CampaignFeature[] = [
  { title: "Garaj Gunleri", icon: "parti" },
  { title: "Limitine Uygun Urunler Burada!", icon: "limit" },
  { title: "Superbox 5G Yeni Nesil Ev Interneti", icon: "yildiz" },
  { title: "Hediye Ceklerim", icon: "kullanici" }
];

export const campaignTiles: CampaignTile[] = [
  {
    id: 1,
    image: "/pasaj/campaigns/_1773392029586_kampanya.webp",
    alt: "Turkcellilere ozel kampanya"
  },
  {
    id: 2,
    image: "/pasaj/campaigns/_1764830638038_kredi.webp",
    alt: "Kredi kampanyasi"
  },
  {
    id: 3,
    image: "/pasaj/campaigns/_1774870788465_ayin.webp",
    alt: "Ayin kampanyasi"
  },
  {
    id: 4,
    image: "/pasaj/campaigns/_1769681009697_hesap.webp",
    alt: "Hesap kampanyasi"
  }
];

export const popularBrands: BrandLogo[] = [
  { name: "Apple", image: "/pasaj/brands/apple-logo.webp" },
  { name: "Samsung", image: "/pasaj/brands/samsung-logo.webp" },
  { name: "Mi", image: "/pasaj/brands/mi-logo.webp" },
  { name: "Huawei", image: "/pasaj/brands/huawei-logo-2.webp" },
  { name: "Philips", image: "/pasaj/brands/philips-logo.webp" },
  { name: "Sony", image: "/pasaj/brands/sony-logo.webp" },
  { name: "Lenovo", image: "/pasaj/brands/lenovo-logo.webp" },
  { name: "JBL", image: "/pasaj/brands/jbl-logo.webp" },
  { name: "Anker", image: "/pasaj/brands/anker-logo.webp" },
  { name: "Arzum", image: "/pasaj/brands/arzum-logo.webp" },
  { name: "Braun", image: "/pasaj/brands/braun-logo.webp" },
  { name: "Casper", image: "/pasaj/brands/casper-logo.webp" },
  { name: "Dyson", image: "/pasaj/brands/dyson-logo.webp" },
  { name: "Omix", image: "/pasaj/brands/omix-logo.webp" },
  { name: "Realme", image: "/pasaj/brands/realme-logo.webp" },
  { name: "TCL", image: "/pasaj/brands/tcl-logo.webp" }
];
