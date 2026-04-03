# Pasaj Clone

Bu proje, e-ticaret deneyimini temel alan bir Pasaj klonudur.
Vite + React + TypeScript altyapısı ile geliştirilmiş, ürün listeleme, detay, sepet ve checkout akışlarını içermektedir.

## Kurulum

```bash
npm install
npm run dev
```

## 4. Hafta Özeti

4. hafta boyunca proje veri akışı daha düzenli ve sürdürülebilir hale getirildi.
Özellikle Firestore tabanlı ürün yönetimi, sayfalar arası veri kullanımı ve kullanıcı deneyimini etkileyen temel akışlarda iyileştirmeler yapıldı.

Hafta boyunca yapılan çalışmalar:

- Ürün verilerini Firestore üzerinden daha tutarlı bir yapıda yönetmek
- Anasayfa, kategori ve ürün detay sayfalarında veri çekme ve gösterme mantığını sadeleştirmek
- Bileşenler arası veri paylaşımını iyileştirerek gereksiz tekrarları azaltmak
- Hata durumlarında uygulama davranışını daha anlaşılır ve yönetilebilir hale getirmek
- Kod yapısını daha okunabilir tutarak sonraki geliştirmeler için sağlam bir temel oluşturmak

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
