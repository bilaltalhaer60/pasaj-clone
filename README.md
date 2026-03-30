# Pasaj Clone

1. hafta kapsamında Pasaj Clone projesinin temel yapısı tamamlandı. Ana sayfa düzeni geliştirildi, layout bileşenleri güncellendi, header ve footer yapıları düzenlendi, stil dosyaları iyileştirildi ve proje için gerekli veri yapısı eklendi.

## Kurulum

```bash
npm install
npm run dev
```

## VS Code önerilen eklentiler

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Code Spell Checker
- Auto Rename Tag
- Error Lens

`.vscode/extensions.json` dosyası açıldığında bu önerileri otomatik gösterir.




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


