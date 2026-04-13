# Pasaj Clone

Bu proje, e-ticaret deneyimini temel alan bir Pasaj klonudur.
Vite + React + TypeScript altyapısı ile gelistirilmis, urun listeleme, detay, sepet ve checkout akislarini icermektedir.

## Kurulum

```bash
npm install
npm run dev
```

## 4. Hafta Ozeti

4. hafta boyunca proje veri akisi daha duzenli ve surdurulebilir hale getirildi.
Ozellikle Firestore tabanli urun yonetimi, sayfalar arasi veri kullanimi ve kullanici deneyimini etkileyen temel akislerde iyilestirmeler yapildi.

Hafta boyunca yapilan calismalar:

- Urun verilerini Firestore uzerinden daha tutarli bir yapida yonetmek
- Anasayfa, kategori ve urun detay sayfalarinda veri cekme ve gosterme mantigini sadelestirmek
- Bilesenler arasi veri paylasimini iyilestirerek gereksiz tekrarları azaltmak
- Hata durumlarinda uygulama davranisini daha anlasilir ve yonetilebilir hale getirmek
- Kod yapisini daha okunabilir tutarak sonraki gelistirmeler icin saglam bir temel olusturmak

## 5. Hafta Ozeti

5. hafta ile birlikte urun vitrini tamamen Firebase odakli calisacak sekilde yenilendi.
Mock urun verileri projeden cikarildi; anasayfa, kategori, urun detay, header navigasyonu ve admin paneli artik Firestore koleksiyonundaki urunlerden besleniyor.

Hafta boyunca yapilan calismalar:

- Tum ana urun akislarini tek Firestore koleksiyonundan veri okuyacak sekilde birlestirmek
- Kategori kartlari, kampanya bloklari ve vitrin alanlarini canli urun verilerinden turetmek
- Header menusunu ve admin metriklerini mock veriden cikarip Firestore tabanli hale getirmek
- Eski feature dosyalarini guncel sayfa bilesenlerine baglayarak mock bagimliliklarini kaldirmak
- TypeScript derleme kontrolunden gecen daha temiz bir veri katmani olusturmak

## 6. Hafta Ozeti

6. hafta ile birlikte alisveris akisinin siparis olusturma kismi aktif hale getirildi.
Sepet deneyimi drawer ve sayfa uzerinden desteklenirken checkout 3 adimli bir akisa donusturuldu ve siparis kayitlari Firestore'a yazilmaya baslandi.

Hafta boyunca yapilan calismalar:

- Header uzerinden acilan sepet drawer'ini aktif etmek
- Sepet sayfasini checkout akisina baglamak
- Checkout sayfasini teslimat, odeme ve onay olmak uzere 3 adimli yapiya cevirmek
- Siparis verilerini Firestore'daki orders koleksiyonuna kaydetmek
- Siparis basarili oldugunda sepeti temizleyip siparis numarasi gostermek

## Firebase Entegrasyonu

Projede urun verileri mock yapidan cikarilip Firebase Firestore'a tasinmistir.
Anasayfa, kategori ve urun detay sayfalari urun verilerini Firestore uzerinden okumaktadir.
Checkout akisi da siparisleri Firestore'a kaydeder.

Gerekli ortam degiskenleri:

- VITE_FIREBASE_PRODUCTS_COLLECTION
- VITE_FIREBASE_ORDERS_COLLECTION
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

## VS Code Onerilen Eklentiler

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Code Spell Checker
- Auto Rename Tag
- Error Lens
