import { Button, Card, Col, Form, Input, Row, Space, Typography } from "antd";
import { PageShell } from "../app/page-shell";
import { env } from "../config/env";
import { getCartSubtotal, useCartStore } from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";

export const CheckoutPage = () => {
  const items = useCartStore((state) => state.items);
  const subtotal = getCartSubtotal(items);
  const shippingCost = subtotal >= env.shippingThreshold ? 0 : env.shippingCost;
  const total = subtotal + shippingCost;

  return (
    <PageShell
      badge="3. Hafta Teslimi"
      title="Odeme"
      description="Teslimat ve odeme formlari siparis ozetiyle ayni sayfada birlestirildi. Bu asama simdilik demo checkout akisidir."
      nextTargets={[
        { label: "Sepete Don", to: "/cart" },
        { label: "Anasayfa", to: "/" }
      ]}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card title="Teslimat bilgileri" className="checkout-card">
            <Form layout="vertical">
              <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Ad Soyad">
                    <Input placeholder="Bilal Talha" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Telefon">
                    <Input placeholder="05xx xxx xx xx" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Adres">
                    <Input.TextArea rows={4} placeholder="Teslimat adresini gir" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Sehir">
                    <Input placeholder="Istanbul" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Ilce">
                    <Input placeholder="Kadikoy" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          <Card title="Odeme bilgileri" className="checkout-card">
            <Form layout="vertical">
              <Row gutter={[16, 0]}>
                <Col xs={24}>
                  <Form.Item label="Kart uzerindeki ad">
                    <Input placeholder="BILAL TALHA" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item label="Kart numarasi">
                    <Input placeholder="0000 0000 0000 0000" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Ay / Yil">
                    <Input placeholder="12/28" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="CVV">
                    <Input placeholder="123" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Taksit">
                    <Input placeholder="Pesin / 3 / 6" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card title="Siparis ozeti" className="checkout-card">
            <Space direction="vertical" size={14} style={{ width: "100%" }}>
              {items.map((item) => (
                <div key={item.product.id} className="summary-row">
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <strong>{formatCurrency(item.product.price * item.quantity)}</strong>
                </div>
              ))}
              <div className="summary-row">
                <span>Ara toplam</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div className="summary-row">
                <span>Kargo</span>
                <strong>{shippingCost === 0 ? "Ucretsiz" : formatCurrency(shippingCost)}</strong>
              </div>
              <div className="summary-row total-row">
                <span>Genel toplam</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
              <Typography.Paragraph type="secondary" className="checkout-note">
                Bu ekran demo akisidir; kart cekimi yapmaz. 3. hafta icin siparis ozeti ve form kabugu hazirlandi.
              </Typography.Paragraph>
              <Button type="primary" size="large" block>
                Siparisi tamamla
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </PageShell>
  );
};
