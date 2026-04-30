import { Link } from "react-router-dom";

const footerColumns = [
  {
    title: "Hakkımızda",
    items: [
      "Pasaj Genel Bakış",
      "Haberler & Duyurular",
      "Kurumsal İletişim ve Sürdürülebilirlik",
      "Kariyer",
      "Gizlilik ve Güvenlik",
      "Pasaj İletişim",
      "Pasaj Blog",
      "Pasaj Gaming",
      "Turkcell Blog",
      "Akıllı Ev"
    ]
  },
  {
    title: "Popüler Kategoriler",
    items: [
      "Cep Telefonu",
      "Android Telefonlar",
      "iPhone Modelleri",
      "İkinci El / Yenilenmiş Telefonlar",
      "Yenilenmiş iPhone",
      "5G Uyumlu Telefonlar",
      "Akıllı Saatler",
      "Bluetooth Kulaklıklar",
      "Tabletler",
      "Laptop"
    ]
  },
  {
    title: "Yardım",
    items: [
      "Yardım Merkezi",
      "İşlem Rehberi",
      "Ürün Güvenliği Temas Noktası",
      "Nasıl İade Edebilirim?",
      "Pasaj Sipariş Sorgulama",
      "iPhone Karşılaştırma",
      "Televizyon (TV) Karşılaştırma",
      "Telefon Sat"
    ]
  },
  {
    title: "Popüler Marka Kategoriler",
    items: [
      "Samsung Telefonlar",
      "JBL Kulaklık",
      "Philips Kahve Makinesi",
      "Samsung Tablet",
      "Dyson Saç Düzleştirici",
      "Philips Dikey Süpürge",
      "Philips Süpürge",
      "Karaca Kahve Makinesi",
      "Philips Airfryer",
      "Apple Kulaklık"
    ]
  },
  {
    title: "Markalar",
    items: ["Apple", "Samsung", "Dyson", "Anker", "Arzum", "Beko", "Bosch", "Braun", "Casper", "Delonghi"]
  },
  {
    title: "Özel Günler & Kampanyalar",
    items: [
      "Apple Eğitim",
      "Düğün Çeyiz Paketleri",
      "Fırsatlar Pasajı",
      "Pasaj Günleri",
      "Uykusu Kaçanlar Kulübü",
      "Sevgililer Günü Hediyeleri",
      "Vergisiz Telefonlar",
      "Vergisiz Bilgisayarlar",
      "Karne Hediyeleri",
      "Kurban Bayramı Kampanyası"
    ]
  },
  {
    title: "Popüler Ürünler",
    items: [
      "iPhone 17",
      "iPhone 16",
      "iPhone Air",
      "iPhone 16 Pro Max",
      "iPhone 17 Pro Max",
      "iPhone 16E",
      "iPhone 15",
      "iPhone 15 Plus",
      "iPhone 15 Pro",
      "iPhone 15 Pro Max"
    ]
  }
];

const socialLinks = [
  { label: "X", icon: "/pasaj/footer-icons/x.png", href: "https://x.com/turkcellpasaj" },
  { label: "Facebook", icon: "/pasaj/footer-icons/facebook.png", href: "https://www.facebook.com/turkcellpasajim" },
  { label: "Instagram", icon: "/pasaj/footer-icons/instagram.png", href: "https://www.instagram.com/turkcellpasaj/" },
  { label: "YouTube", icon: "/pasaj/footer-icons/youtube.png", href: "https://www.youtube.com/@turkcellpasaj" },
  { label: "LinkedIn", icon: "/pasaj/footer-icons/linkedin.png", href: "https://www.linkedin.com/company/turkcellpasaj/" },
  { label: "TikTok", icon: "/pasaj/footer-icons/tiktok.png", href: "https://www.tiktok.com/@turkcellpasaj" }
];

const brandLogos = [
  "fizy",
  "TURKCELL SUPERONLINE",
  "PLATINUM",
  "bip",
  "TV+",
  "lifebox",
  "paycell",
  "GNC",
  "GEFORCE NOW",
  "Powered by GAME+",
  "global bilgi",
  "wiyo"
];

export const Footer = () => {
  return (
    <footer className="pasaj-footer">
      <section className="pasaj-footer-social">
        <div className="pasaj-footer-inner pasaj-footer-social-grid">
          <div className="pasaj-footer-brand-block">
            <Link to="/" className="pasaj-footer-logo" aria-label="Pasaj">
              <img src="/pasaj/footer-icons/PasajHeaderLogo.svg" alt="Pasaj" />
            </Link>
            <strong>Bizi Takip Edin</strong>
            <p>Sosyal medya hesaplarımızdan bizi takip edin, fırsatları kaçırmayın.</p>
            <div className="pasaj-social-links">
              {socialLinks.map((item) => (
                <a href={item.href} key={item.label} aria-label={item.label} target="_blank" rel="noreferrer">
                  <img src={item.icon} alt="" />
                </a>
              ))}
            </div>
          </div>

          <div className="pasaj-footer-app-block">
            <strong>Turkcell Uygulamasını İndir</strong>
            <div className="pasaj-footer-qr-row">
              <img src="/pasaj/footer-icons/pasaj-qr.webp" alt="Turkcell uygulaması QR kodu" className="pasaj-footer-qr" />
              <p>
                QR kodunu taratarak uygulamayı hemen indirebilirsiniz. Pasaj ile ilgili tüm işlemlerinizi Turkcell
                Uygulaması'ndan hızlıca gerçekleştirebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pasaj-footer-links-section">
        <div className="pasaj-footer-inner pasaj-footer-columns">
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="pasaj-footer-column">
              <h3>{column.title}</h3>
              {column.items.map((item) => (
                <Link to="/" key={item}>{item}</Link>
              ))}
              <button type="button">Tümünü Gör <span>⌄</span></button>
            </nav>
          ))}
        </div>
      </section>

      <section className="pasaj-footer-brands-section">
        <div className="pasaj-footer-inner">
          <div className="pasaj-footer-lang-row">
            <button type="button" className="active">Türkçe</button>
            <button type="button">English</button>
            <button type="button">عربي</button>
            <button type="button">русский</button>
          </div>
          <div className="pasaj-footer-brand-row">
            {brandLogos.map((brand) => (
              <span key={brand} className="pasaj-footer-brand-logo">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="pasaj-footer-legal-section">
        <div className="pasaj-footer-inner pasaj-footer-legal-row">
          <Link to="/">Gizlilik ve Güvenlik</Link>
          <div>
            <span className="pasaj-trgo">TR<br />GO</span>
            <span>© 2026 Turkcell</span>
          </div>
        </div>
      </section>
    </footer>
  );
};

