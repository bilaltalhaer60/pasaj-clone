export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  discount: number;
  popularity: number;
  image: string;
}

export const homeBanners = [
  {
    id: 'banner-1',
    badge: 'Yeni sezon teknoloji',
    title: 'Pasaj deneyimini TypeScript ile kur',
    description: 'İlk hafta teslimi için routing, layout ve vitrin alanları hazır.',
    cta: 'Alışverişe Başla',
    background: 'linear-gradient(135deg, #112950 0%, #1f7ae0 100%)',
  },
  {
    id: 'banner-2',
    badge: 'Kampanya',
    title: 'Seçili telefonlarda peşin fiyatına taksit',
    description: 'Mock veri ile çalışan görsel vitrin alanı.',
    cta: 'Kampanyayı İncele',
    background: 'linear-gradient(135deg, #4d2c19 0%, #f28f3b 100%)',
  },
  {
    id: 'banner-3',
    badge: 'Ev elektroniği',
    title: 'Akıllı yaşam ürünlerinde yeni fırsatlar',
    description: 'İkinci haftada pixel-perfect detaylarla genişletilmeye hazır.',
    cta: 'Detayları Gör',
    background: 'linear-gradient(135deg, #2f3e1c 0%, #9bc53d 100%)',
  },
];

export const allProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 128 GB',
    brand: 'Apple',
    category: 'telefonlar',
    price: 56999,
    discount: 8,
    popularity: 99,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    name: 'Galaxy S24 256 GB',
    brand: 'Samsung',
    category: 'telefonlar',
    price: 48999,
    discount: 12,
    popularity: 95,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    brand: 'Apple',
    category: 'bilgisayarlar',
    price: 44999,
    discount: 5,
    popularity: 91,
    image: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '4',
    name: 'Gaming Laptop 16',
    brand: 'Lenovo',
    category: 'bilgisayarlar',
    price: 61999,
    discount: 15,
    popularity: 90,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '5',
    name: 'QLED 55 inç TV',
    brand: 'Samsung',
    category: 'televizyonlar',
    price: 32999,
    discount: 10,
    popularity: 88,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '6',
    name: 'Robot Süpürge X10',
    brand: 'Xiaomi',
    category: 'ev-elektronigi',
    price: 15999,
    discount: 18,
    popularity: 84,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80',
  },
];

export const featuredProducts = allProducts.slice(0, 3);
