# Pasaj Clone

1. hafta kapsamÄ±nda Pasaj Clone projesinin temel yapÄ±sÄ± tamamlandÄ±. Ana sayfa dÃ¼zeni geliÅŸtirildi, layout bileÅŸenleri gÃ¼ncellendi, header ve footer yapÄ±larÄ± dÃ¼zenlendi, stil dosyalarÄ± iyileÅŸtirildi ve proje iÃ§in gerekli veri yapÄ±sÄ± eklendi.

## Kurulum

```bash
npm install
npm run dev
```

## VS Code Ã¶nerilen eklentiler

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Code Spell Checker
- Auto Rename Tag
- Error Lens

`.vscode/extensions.json` dosyasÄ± aÃ§Ä±ldÄ±ÄŸÄ±nda bu Ã¶nerileri otomatik gÃ¶sterir.


## 3. Hafta Geliştirmeleri

Bu hafta proje içerisinde cart ve checkout akışları geliştirilmiştir.
Sepet yönetimi, ürün adet güncelleme işlemleri ve sipariş özeti bileşenleri düzenlenmiştir.
Checkout sayfası kullanıcı akışına uygun şekilde güncellenmiş, arayüzde gerekli stil iyileştirmeleri yapılmıştır.
Ek olarak bazı proje yapılandırmaları gözden geçirilmiş ve düzenlenmiştir.



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

4. Hafta Özeti
Bu hafta projede veri akışını daha düzenli ve sürdürülebilir hale getirmeye odaklandım.
Özellikle ürün verilerinin yönetimi, sayfalar arası veri kullanımı ve kullanıcı deneyimini etkileyen temel akışlarda iyileştirmeler yaptım.

Hafta boyunca yaptığım çalışmalar:

Ürün verilerini Firestore üzerinden daha tutarlı bir yapıda kullanacak şekilde düzenledim.
Anasayfa, kategori ve ürün detay sayfalarında veri çekme ve gösterme mantığını sadeleştirdim.
Bileşenler arası veri paylaşımını iyileştirerek gereksiz tekrarları azalttım.
Hata durumlarında uygulamanın verdiği tepkiyi daha anlaşılır ve yönetilebilir hale getirdim.
Kod yapısını daha okunabilir tutarak sonraki geliştirmeler için sağlam bir temel oluşturdum.
Bu çalışmalarla birlikte proje hem teknik açıdan daha stabil hale geldi hem de geliştirme sürecinde yönetilebilirlik arttı.



