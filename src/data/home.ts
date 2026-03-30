export type HeroSlide = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaTo: string;
  accent: string;
  stats: Array<{ label: string; value: string }>;
};

export type CategoryCard = {
  title: string;
  description: string;
  to: string;
  accent: string;
};

export type CampaignCard = {
  title: string;
  description: string;
  to: string;
  accent: string;
  tag: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    eyebrow: "Yeni sezon",
    title: "Telefon, bilgisayar ve aksesuar vitrinini tek landing page'te topladik.",
    description:
      "2. hafta kapsaminda anasayfa hero, kampanya bloklari, kategori kartlari ve vitrin urunleri hazirlandi.",
    ctaLabel: "Telefonlara git",
    ctaTo: "/category/telefon",
    accent: "linear-gradient(135deg, #003b73 0%, #0a66c2 55%, #8bd3ff 100%)",
    stats: [
      { label: "Vitrin urunu", value: "12+" },
      { label: "Kategori", value: "6" },
      { label: "Kampanya", value: "4" }
    ]
  },
  {
    id: 2,
    eyebrow: "Hizli teslim",
    title: "Pasaj hissini veren daha guclu bir home page kabugu olusturuldu.",
    description:
      "Swiper destekli hero alaninda kampanya mesajlari, kategori gecisleri ve dikkat ceken CTA'lar yer aliyor.",
    ctaLabel: "Bilgisayarlara git",
    ctaTo: "/category/bilgisayar",
    accent: "linear-gradient(135deg, #4b2e83 0%, #8b5cf6 50%, #f8b4ff 100%)",
    stats: [
      { label: "Hero slide", value: "3" },
      { label: "CTA", value: "6" },
      { label: "Responsive section", value: "5" }
    ]
  },
  {
    id: 3,
    eyebrow: "Ogrenci kampanyasi",
    title: "Anasayfa simdi kampanya, guven ve urun kesitleriyle aciliyor.",
    description:
      "Firestore destekli urun vitriniyle birlikte kampanya, kategori ve guven bloklari ayni landing page'te toplandi.",
    ctaLabel: "Aksesuarlara git",
    ctaTo: "/category/aksesuar",
    accent: "linear-gradient(135deg, #073b3a 0%, #0f766e 52%, #7ae582 100%)",
    stats: [
      { label: "Firestore", value: "Aktif" },
      { label: "Feature card", value: "4" },
      { label: "Free shipping row", value: "CSS" }
    ]
  }
];

export const categoryCards: CategoryCard[] = [
  {
    title: "Akilli Telefonlar",
    description: "Amiral gemisi modeller ve fiyat performans cihazlar.",
    to: "/category/telefon",
    accent: "#dbeafe"
  },
  {
    title: "Bilgisayarlar",
    description: "Notebook, oyun ve yaratici profesyonel cihazlar.",
    to: "/category/bilgisayar",
    accent: "#fee2e2"
  },
  {
    title: "Aksesuarlar",
    description: "Kulaklik, saat, sarj ve gunluk teknoloji urunleri.",
    to: "/category/aksesuar",
    accent: "#dcfce7"
  },
  {
    title: "Tabletler",
    description: "Egitim, cizim ve medya tuketimi icin hafif cihazlar.",
    to: "/category/tablet",
    accent: "#fef3c7"
  }
];

export const campaignCards: CampaignCard[] = [
  {
    title: "Geceye ozel sepette indirim",
    description: "Secili telefonlarda ek indirim ve pesin fiyatina taksit avantaji.",
    to: "/category/telefon",
    accent: "#0f172a",
    tag: "Bu gece"
  },
  {
    title: "Laptop alana aksesuar paketi",
    description: "Notebook siparislerinde secili ekipmanlarda paket teklifleri.",
    to: "/category/bilgisayar",
    accent: "#1d4ed8",
    tag: "Sinirli stok"
  },
  {
    title: "Ogrenciye ozel teknoloji secimi",
    description: "Ders ve kampus kullanimina uygun hafif cihaz listesi.",
    to: "/category/tablet",
    accent: "#7c3aed",
    tag: "Ogrenci"
  }
];

export const trustHighlights = [
  "Ucretsiz kargo limiti bilgisi ust bantta gorunur.",
  "Kategori gecisleri tek tikla ilgili liste rotasina gider.",
  "Hero alaninda dikkat cekici CTA ve kampanya dili korunur.",
  "Vitrin urunleri React Query ile Firestore'dan yuklenir."
];
