import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqm7lXHGD66JpBhSQjV1BOa1C_KS8Kcz4",

  authDomain: "pasaj-clone.firebaseapp.com",

  projectId: "pasaj-clone",

  storageBucket: "pasaj-clone.firebasestorage.app",

  messagingSenderId: "521705049819",

  appId: "1:521705049819:web:8c2fdaee09e94430f986fe",

  measurementId: "G-045H6RN2YF"

};

const products = [
  {
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
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80",
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
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
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
    image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
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
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?auto=format&fit=crop&w=900&q=80",
    summary: "Aktif gurultu engelleme ve gunluk kullanimda rahat tasarim arayanlar icin ideal.",
    shippingNote: "Aksam 18.00'e kadar ayni gun teslim secenegi.",
    highlights: ["ANC", "Seffaf mod", "Kablosuz sarj", "USB-C sarj kutusu"],
    specs: [
      { label: "Baglanti", value: "Bluetooth 5.3" },
      { label: "Pil", value: "6 saate kadar tek sarj" },
      { label: "Ozellik", value: "Uyarlanabilir ses" },
      { label: "Dayaniklilik", value: "IP54" }
    ]
  }
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

for (const product of products) {
  await setDoc(doc(db, "products", product.slug), product);
  console.log(`Yuklendi: ${product.slug}`);
}

console.log("Tum urunler Firestore'a yüklendi.");
