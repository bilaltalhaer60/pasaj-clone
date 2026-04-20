import { Link } from "react-router-dom";

const footerColumns = [
  {
    title: "Hakkimizda",
    items: [
      "Pasaj Genel Bakis",
      "Haberler & Duyurular",
      "Kurumsal Iletisim ve Surdurulebilirlik",
      "Kariyer",
      "Gizlilik ve Guvenlik",
      "Pasaj Iletisim",
      "Pasaj Blog",
      "Pasaj Gaming",
      "Turkcell Blog",
      "Akilli Ev"
    ]
  },
  {
    title: "Populer Kategoriler",
    items: [
      "Cep Telefonu",
      "Android Telefonlar",
      "iPhone Modelleri",
      "Ikinci El / Yenilenmis Telefonlar",
      "Yenilenmis iPhone",
      "5G Uyumlu Telefonlar",
      "Akilli Saatler",
      "Bluetooth Kulakliklar",
      "Tabletler",
      "Laptop"
    ]
  },
  {
    title: "Yardim",
    items: [
      "Yardim Merkezi",
      "Islem Rehberi",
      "Urun Guvenligi Temas Noktasi",
      "Nasil Iade Edebilirim?",
      "Pasaj Siparis Sorgulama",
      "iPhone Karsilastirma",
      "Televizyon (TV) Karsilastirma",
      "Telefon Sat"
    ]
  },
  {
    title: "Populer Marka Kategoriler",
    items: [
      "Samsung Telefonlar",
      "JBL Kulaklik",
      "Philips Kahve Makinesi",
      "Samsung Tablet",
      "Dyson Sac Duzlestirici",
      "Philips Dikey Supurge",
      "Philips Supurge",
      "Karaca Kahve Makinesi",
      "Philips Airfryer",
      "Apple Kulaklik"
    ]
  },
  {
    title: "Markalar",
    items: ["Apple", "Samsung", "Dyson", "Anker", "Arzum", "Beko", "Bosch", "Braun", "Casper", "Delonghi"]
  },
  {
    title: "Ozel Gunler & Kampanyalar",
    items: [
      "Apple Egitim",
      "Dugun Ceyiz Paketleri",
      "Firsatlar Pasaji",
      "Pasaj Gunleri",
      "Uykusu Kacanlar Kulubu",
      "Sevgililer Gunu Hediyeleri",
      "Vergisiz Telefonlar",
      "Vergisiz Bilgisayarlar",
      "Karne Hediyeleri",
      "Kurban Bayrami Kampanyasi"
    ]
  },
  {
    title: "Populer Urunler",
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
            <p>Sosyal medya hesaplarimizdan bizi takip edin, firsatlari kacirmayin.</p>
            <div className="pasaj-social-links">
              {socialLinks.map((item) => (
                <a href={item.href} key={item.label} aria-label={item.label} target="_blank" rel="noreferrer">
                  <img src={item.icon} alt="" />
                </a>
              ))}
            </div>
          </div>

          <div className="pasaj-footer-app-block">
            <strong>Turkcell Uygulamasini Indir</strong>
            <div className="pasaj-footer-qr-row">
              <img src="/pasaj/footer-icons/pasaj-qr.webp" alt="Turkcell uygulamasi QR kodu" className="pasaj-footer-qr" />
              <p>
                QR kodunu taratarak uygulamayi hemen indirebilirsin. Pasaj ile ilgili tum islemlerinizi Turkcell
                Uygulamasindan hizlica gerceklestirebilirsiniz.
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
              <button type="button">Tumunu Gor <span>⌄</span></button>
            </nav>
          ))}
        </div>
      </section>

      <section className="pasaj-footer-brands-section">
        <div className="pasaj-footer-inner">
          <div className="pasaj-footer-lang-row">
            <button type="button" className="active">Turkce</button>
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
          <Link to="/">Gizlilik ve Guvenlik</Link>
          <div>
            <span className="pasaj-trgo">TR<br />GO</span>
            <span>© 2026 Turkcell</span>
          </div>
        </div>
      </section>
    </footer>
  );
};
