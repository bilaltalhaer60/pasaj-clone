# Pasaj Clone

Turkcell Pasaj referans alinerek gelistirilmis bu proje, Vite + React + TypeScript tabanli bir e-ticaret klonudur. Uygulama; vitrin, kategori, urun detay, sepet, checkout, hesap paneli ve admin paneli akislarini tek projede toplar.

## One Cikan Moduller

- Anasayfa vitrini, kampanya bloklari ve marka alanlari
- Firestore tabanli urun listeleme, kategori filtreleme ve urun detay akisi
- Zustand ile kalici sepet yonetimi
- 3 adimli checkout ve Firestore siparis kaydi
- Hesabim paneli ve admin paneli
- Route korumalari: `ProtectedRoute` ve `AdminRoute`
- `forgot-password` sayfasi ve final responsive duzenlemeler
- Jest + React Testing Library ile coverage kontrollu test altyapisi

## Teknolojiler

- React 19
- TypeScript
- Vite
- React Router DOM
- Ant Design
- TanStack React Query
- Zustand
- Firebase Firestore + Storage
- Jest
- React Testing Library

## Kurulum

```bash
npm install
npm run dev
```

## Test ve Build

```bash
npm run build
npm run test:coverage -- --runInBand
```

Son guncel durumda:

- `npm run build` basariyla geciyor
- `npm run test:coverage -- --runInBand` basariyla geciyor
- Toplam `29` test mevcut
- Coverage threshold global olarak `%80` ve uzeri olacak sekilde aktif

## Ortam Degiskenleri

Projeyi calistirmak icin kok dizinde `.env` dosyasi kullanilir. Ornek anahtarlar:

```env
VITE_APP_NAME=Pasaj Clone
VITE_SHIPPING_THRESHOLD=200
VITE_SHIPPING_COST=29.90

VITE_FIREBASE_PRODUCTS_COLLECTION=products
VITE_FIREBASE_ORDERS_COLLECTION=orders
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Rotalar

- `/`
- `/category/:categorySlug`
- `/product/:productSlug`
- `/cart`
- `/login`
- `/register`
- `/forgot-password`
- `/checkout`
- `/account`
- `/admin`

## Demo Hesaplar

Bu repodaki auth akisi demo store mantigiyla desteklenir.

- Kullanici girisi: herhangi bir normal e-posta
- Admin girisi: icinde `admin` gecen bir e-posta
- Varsayilan demo admin profili: `bilal@pasajclone.dev`

## Hafta Ozeti

### 4. Hafta

- Urun verisi ve sayfalar arasi veri akisi sadeleştirildi
- Firebase odakli veri katmani temizlendi

### 5. Hafta

- Urun vitrini ve detay akislari Firestore ile birlestirildi
- Mock veri bagimliliklari azaltildi

### 6. Hafta

- Sepet drawer ve sepet sayfasi aktif hale getirildi
- Checkout 3 adimli akis olarak tamamlandi
- Siparis olusturma Firestore'a baglandi

### 7. Hafta

- Admin paneli dashboard, urun CRUD ve siparis yonetimi ile genisletildi
- Firebase Storage uzerinden gorsel yukleme akisi eklendi

### 8. Hafta

- Jest + RTL test altyapisi kuruldu
- Minimum gereksinimin ustunde test yazildi
- Coverage threshold eklendi
- Mobil responsive iyilestirmeler yapildi
- Route guard ve sifre sifirlama rotasi tamamlandi
- README final teslim formatina yaklastirildi

## Notlar

- Proje bitti, son kontroller yapiliyor.
- Uretim build'i sirasinda buyuk vendor chunk uyarisi alinabiliyor; bu su an hata degil, sadece optimizasyon firsatidir.
- Canli deploy linki bu repo icinde tanimli degil. Proje kodu deploy'a hazir olacak sekilde duzenlenmistir.
