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
  to: string;
};

export type BrandLogo = {
  name: string;
  image: string;
};

export type CategoryMenuItem = {
  label: string;
  to: string;
  children?: CategoryMenuItem[];
};

export type TopLinkItem = {
  label: string;
  to: string;
};

export const topLinks: TopLinkItem[] = [
  { label: "Kampanyalar", to: "/" },
  { label: "Markalar", to: "/" },
  { label: "Favorilerim", to: "/account?tab=favorites" },
  { label: "Sipariş Sorgulama", to: "/account?tab=orders" },
  { label: "Yardım", to: "/" },
  { label: "Pasaj Blog", to: "/" }
];

export const categoryNav = [
  "Cep Telefonu-Aksesuar",
  "Bilgisayar-Tablet",
  "Elektrikli Ev Aletleri",
  "Sağlık-Kişisel Bakım",
  "Hobi-Oyun",
  "TV-Ses Sistemleri",
  "Ev-Yaşam"
];

export const categoryMenus: Record<string, CategoryMenuItem[]> = {
  "Cep Telefonu-Aksesuar": [
    {
      label: "Apple Telefonlar",
      to: "/category/telefon",
      children: [
        { label: "iPhone 17 256 GB", to: "/product/iphone-17-256-gb" },
        { label: "iPhone 15 128 GB", to: "/product/iphone-15-128-gb" },
        { label: "iPhone 16 Pro 256 GB", to: "/product/iphone-16-pro-256-gb" }
      ]
    },
    { label: "Android Telefonlar", to: "/category/telefon" },
    { label: "Yapay Zeka (AI) Telefonlar", to: "/category/telefon" },
    {
      label: "Aksesuarlar",
      to: "/category/aksesuar",
      children: [
        { label: "Kulaklıklar", to: "/category/aksesuar" },
        { label: "Akıllı Saatler", to: "/category/aksesuar" }
      ]
    },
    { label: "Giyilebilir Teknolojiler", to: "/category/aksesuar" },
    { label: "Tuşlu Telefonlar", to: "/category/telefon" },
    { label: "Yenilenmiş Telefonlar", to: "/category/telefon" },
    { label: "5G Uyumlu Telefonlar", to: "/category/telefon" },
    { label: "Tüm Cep Telefonu-Aksesuar", to: "/category/telefon" }
  ],
  "Bilgisayar-Tablet": [
    { label: "Apple MacBook", to: "/product/macbook-air-m4-13" },
    { label: "Laptop", to: "/category/bilgisayar" },
    { label: "Tablet", to: "/category/bilgisayar" },
    { label: "Oyuncu Bilgisayarları", to: "/category/bilgisayar" },
    { label: "Tüm Bilgisayar-Tablet", to: "/category/bilgisayar" }
  ],
  "Elektrikli Ev Aletleri": [
    { label: "Kahve Makineleri", to: "/category/aksesuar" },
    { label: "Süpürgeler", to: "/category/aksesuar" },
    { label: "Küçük Ev Aletleri", to: "/category/aksesuar" }
  ],
  "Sağlık-Kişisel Bakım": [
    { label: "Kişisel Bakım", to: "/category/aksesuar" },
    { label: "Akıllı Tartılar", to: "/category/aksesuar" }
  ],
  "Hobi-Oyun": [
    { label: "Oyun Konsolları", to: "/category/bilgisayar" },
    { label: "Oyuncu Aksesuarları", to: "/category/aksesuar" }
  ],
  "TV-Ses Sistemleri": [
    { label: "Kulaklık", to: "/product/airpods-pro-2" },
    { label: "Hoparlör", to: "/category/aksesuar" }
  ],
  "Ev-Yaşam": [
    { label: "Akıllı Ev", to: "/category/aksesuar" },
    { label: "Yaşam Ürünleri", to: "/category/aksesuar" }
  ]
};

export const heroBanners: HeroBanner[] = [
  {
    id: 1,
    image: "/pasaj/hero/ip0326-new-hero-web.webp",
    alt: "5G uyumlu telefonlara gecin kampanyası"
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
    alt: "SKG masaj ürünleri banner"
  },
  {
    id: 5,
    image: "/pasaj/hero/xxfit3-new-hero-web.webp",
    alt: "Huawei Watch Fit 3 banner"
  }
];

export const shortcutCategories: ShortcutCategory[] = [
  {
    title: "Apple Eğitim",
    image: "/pasaj/categories/_1772535591727_appleegitim.webp",
    to: "/"
  },
  {
    title: "Apple Ürünleri",
    image: "/pasaj/categories/_1775459311458_apple_brand_store.webp",
    to: "/category/telefon"
  },
  {
    title: "Apple Telefonlar",
    image: "/pasaj/categories/cep-telefonu164px.webp",
    to: "/category/telefon"
  },
  {
    title: "Hediye Çeklerim",
    image: "/pasaj/categories/hediye-ceki164px.webp",
    to: "/"
  },
  {
    title: "Pasaj Gamer",
    image: "/pasaj/categories/oyun-konsolu164px.webp",
    to: "/"
  },
  {
    title: "Çok Satanlar",
    image: "/pasaj/categories/cok-satan164px.webp",
    to: "/"
  },
  {
    title: "Kurumsal",
    image: "/pasaj/categories/kurumsal164px.webp",
    to: "/"
  },
  {
    title: "Akıllı Ev",
    image: "/pasaj/categories/akilli-ev164px.webp",
    to: "/"
  },
  {
    title: "Kahve Makineleri",
    image: "/pasaj/categories/kahve-makinasi164px.webp",
    to: "/"
  },
  {
    title: "Kulaklıklar",
    image: "/pasaj/categories/kulaklik164px.webp",
    to: "/"
  }
];

export const infoFeatures: CampaignFeature[] = [
  { title: "Garaj Günleri", icon: "parti" },
  { title: "Limitine Uygun Ürünler Burada!", icon: "limit" },
  { title: "Superbox 5G Yeni Nesil Ev İnterneti", icon: "yildiz" },
  { title: "Hediye Çeklerim", icon: "kullanıcı" }
];

export const campaignTiles: CampaignTile[] = [
  {
    id: 1,
    image: "/pasaj/campaigns/36-taksit-doalt.webp",
    alt: "Turkcellilere özel kampanya",
    to: "/category/aksesuar"
  },
  {
    id: 2,
    image: "/pasaj/campaigns/hg30k-do-alt.webp",
    alt: "Kredi kampanyası",
    to: "/category/telefon"
  },
  {
    id: 3,
    image: "/pasaj/campaigns/logitechbanner-doalt.webp",
    alt: "Logitech Pasaj kampanyası",
    to: "/category/aksesuar"
  },
  {
    id: 4,
    image: "/pasaj/campaigns/sbs-aksesuar-doalt.webp",
    alt: "SBS aksesuar kampanyası",
    to: "/category/aksesuar"
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

