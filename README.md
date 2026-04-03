# Pasaj Clone

Bu proje, e-ticaret deneyimini temel alan bir Pasaj klonudur.
Vite + React + TypeScript altyapısı ile geliştirilmiş, ürün listeleme, detay, sepet ve checkout akışlarını içermektedir.

## Kurulum

```bash
npm install
npm run dev
```

## 4. Hafta Özeti

4. hafta boyunca projenin veri katmanı ve kullanıcı akışı daha kararlı hale getirildi.
Özellikle Firestore tabanlı ürün yönetimi, veri çekme süreçleri ve sayfa bazlı veri kullanımında düzenlemeler yapıldı.

Bu hafta odaklanılan başlıklar:

- Ürün verilerini Firestore üzerinden daha tutarlı şekilde yönetmek
- Anasayfa, kategori ve ürün detay sayfalarında veri akışını sadeleştirmek
- Bileşenler arası veri paylaşımını ve sorgu yapısını iyileştirmek
- Hata durumlarında arayüz davranışlarını daha öngörülebilir hale getirmek
- Kod düzenini koruyarak sonraki geliştirmeler için daha temiz bir temel hazırlamak

## Firebase Entegrasyonu

Projede ürün verileri mock yapıdan çıkarılıp Firebase Firestore'a taşınmıştır.
Anasayfa, kategori ve ürün detay sayfaları ürün verilerini Firestore üzerinden okumaktadır.

Gerekli ortam değişkenleri:

- VITE_FIREBASE_PRODUCTS_COLLECTION
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

## VS Code Önerilen Eklentiler

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Code Spell Checker
- Auto Rename Tag
- Error Lens
