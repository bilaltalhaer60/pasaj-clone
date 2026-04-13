import { Col, Row, Typography } from "antd";

const footerColumns = [
  {
    title: "Pasaj",
    items: ["Hakkimizda", "Kampanyalar", "Pasaj Blog", "Iletisim"]
  },
  {
    title: "Yardim",
    items: ["Siparis Sorgulama", "Iade ve Degisim", "Sikca Sorulan Sorular", "Kargo ve Teslimat"]
  },
  {
    title: "Guven",
    items: ["Guvenli Odeme", "Yetkili Saticilar", "Kurumsal Fatura", "Musteri Destegi"]
  },
  {
    title: "Uygulamalar",
    items: ["Pasaj Limit", "Sari Kutu", "Telefon Kiralama", "Cihaz Karsilastirma"]
  }
];

export const Footer = () => {
  return (
    <footer className="site-footer-shell">
      <div className="site-footer">
        <div className="footer-topline">
          <div>
            <Typography.Title level={4}>Turkcell Pasaj deneyimine yakin yeni vitrin</Typography.Title>
            <Typography.Paragraph>
              Sari vurgu, mavi marka dili ve kampanya odakli bloklarla ana sayfa kabugu yenilendi.
            </Typography.Paragraph>
          </div>
          <div className="footer-security-box">
            <strong>256 bit guvenli odeme</strong>
            <span>Yetkili satici urunleri, hizli teslimat ve destek akisi.</span>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {footerColumns.map((column) => (
            <Col xs={12} md={6} key={column.title}>
              <Typography.Title level={5}>{column.title}</Typography.Title>
              {column.items.map((item) => (
                <Typography.Paragraph key={item} type="secondary">
                  {item}
                </Typography.Paragraph>
              ))}
            </Col>
          ))}
        </Row>

        <div className="footer-bottomline">
          <span>© 2026 Turkcell Pasaj arayuz referansina gore hazirlanan staj projesi vitrini</span>
          <span>KVKK • Cerez Tercihleri • On Bilgilendirme Formu</span>
        </div>
      </div>
    </footer>
  );
};
