import { useMemo, useState } from "react";
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  HomeOutlined,
  LeftOutlined,
  ShoppingCartOutlined,
  TruckOutlined
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Alert, Button, Col, Form, Input, message, Result, Row, Space, Steps, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { env } from "../config/env";
import { ROUTES } from "../constants/routes";
import { createOrder } from "../services/orderService";
import { useAuthStore } from "../store/authStore";
import { getCartSubtotal, useCartStore } from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";
import type { CreateOrderPayload, OrderRecord } from "../types/order";

const stepItems = [
  { title: "Teslimat" },
  { title: "Ödeme" },
  { title: "Onay" }
];

const deliveryFields = ["fullName", "phone", "city", "district", "address"];
const paymentFields = ["cardName", "cardNumber", "expireDate", "cvv", "installment"];

export const CheckoutPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const addOrder = useAuthStore((state) => state.addOrder);

  const subtotal = getCartSubtotal(items);
  const shippingCost = subtotal >= env.shippingThreshold ? 0 : env.shippingCost;
  const total = subtotal + shippingCost;

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.product.id,
        slug: item.product.slug,
        name: item.product.name,
        image: item.product.image,
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal: item.product.price * item.quantity
      })),
    [items]
  );

  const createOrderMutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: (order) => {
      setCompletedOrder(order);
      addOrder(order);
      clearCart();
      message.success("Sipariş başarıyla oluşturuldu.");
    },
    onError: (error) => {
      message.error(error instanceof Error ? error.message : "Sipariş oluşturulamadı.");
    }
  });

  const nextStep = async () => {
    const fields = currentStep === 0 ? deliveryFields : paymentFields;
    await form.validateFields(fields);
    setCurrentStep((step) => Math.min(step + 1, 2));
  };

  const previousStep = () => setCurrentStep((step) => Math.max(step - 1, 0));

  const submitOrder = async () => {
    const values = await form.validateFields();
    if (!user) {
      message.error("Sipariş oluşturmak için giriş yapmalısınız.");
      return;
    }

    const payload: CreateOrderPayload = {
      userId: user.uid,
      userEmail: user.email,
      customer: {
        fullName: values.fullName,
        phone: values.phone,
        city: values.city,
        district: values.district,
        address: values.address
      },
      payment: {
        cardName: values.cardName,
        cardNumber: String(values.cardNumber).replace(/\s+/g, ""),
        expireDate: values.expireDate,
        installment: values.installment
      },
      items: orderItems,
      subtotal,
      shippingCost,
      total
    };

    await createOrderMutation.mutateAsync(payload);
  };

  const deliverySummary = form.getFieldsValue(deliveryFields);
  const paymentSummary = form.getFieldsValue(paymentFields);

  if (completedOrder) {
    return (
      <main className="pasaj-checkout-page">
        <section className="pasaj-checkout-success">
          <Result
            status="success"
            title="Siparişiniz alındı"
            subTitle={`Sipariş numarası: ${completedOrder.orderNumber}`}
            extra={[
              <Button key="home" type="primary" onClick={() => navigate("/")}>
                Anasayfaya Dön
              </Button>
            ]}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="pasaj-checkout-page">
      <nav className="pasaj-breadcrumb" aria-label="Ödeme yolu">
        <Link to="/">Pasaj</Link>
        <span>/</span>
        <Link to={ROUTES.cart}>Sepetim</Link>
        <span>/</span>
        <span>Ödeme</span>
      </nav>

      <section className="pasaj-checkout-heading">
        <div>
          <h1>Ödeme</h1>
          <p>Teslimat bilgilerinizi tamamlayın, ödeme adımında siparişinizi onaylayın.</p>
        </div>
        <Link to={ROUTES.cart} className="pasaj-checkout-back">
          <LeftOutlined />
          Sepete Dön
        </Link>
      </section>

      {items.length === 0 ? (
        <Alert
          type="warning"
          showIcon
          className="pasaj-checkout-alert"
          message="Checkout'a devam etmek için önce sepete ürün eklemelisiniz."
        />
      ) : null}

      <div className="pasaj-checkout-layout">
        <section className="pasaj-checkout-main-panel">
          <Steps current={currentStep} items={stepItems} className="pasaj-checkout-steps" />

          <Form layout="vertical" form={form} initialValues={{ installment: "Peşin" }} className="pasaj-checkout-form">
            {currentStep === 0 ? (
              <section className="pasaj-checkout-section">
                <div className="pasaj-checkout-section-title">
                  <HomeOutlined />
                  <div>
                    <h2>Teslimat Bilgileri</h2>
                    <p>Siparişinizin gönderileceği adres ve alıcı bilgileri.</p>
                  </div>
                </div>
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Ad Soyad" name="fullName" rules={[{ required: true, message: "Ad soyad zorunlu." }]}>
                      <Input placeholder="Bilal Talha" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Telefon" name="phone" rules={[{ required: true, message: "Telefon zorunlu." }]}>
                      <Input placeholder="05xx xxx xx xx" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item label="Adres" name="address" rules={[{ required: true, message: "Adres zorunlu." }]}>
                      <Input.TextArea rows={4} placeholder="Teslimat adresini girin" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Şehir" name="city" rules={[{ required: true, message: "Şehir zorunlu." }]}>
                      <Input placeholder="İstanbul" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="İlçe" name="district" rules={[{ required: true, message: "İlçe zorunlu." }]}>
                      <Input placeholder="Kadıköy" size="large" />
                    </Form.Item>
                  </Col>
                </Row>
              </section>
            ) : null}

            {currentStep === 1 ? (
              <section className="pasaj-checkout-section">
                <div className="pasaj-checkout-section-title">
                  <CreditCardOutlined />
                  <div>
                    <h2>Ödeme Bilgileri</h2>
                    <p>Kart bilgilerinizi girin, onay adımında siparişi kontrol edin.</p>
                  </div>
                </div>
                <Row gutter={[16, 0]}>
                  <Col xs={24}>
                    <Form.Item label="Kart üzerindeki ad" name="cardName" rules={[{ required: true, message: "Kart sahibi zorunlu." }]}>
                      <Input placeholder="BILAL TALHA" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Kart numarası"
                      name="cardNumber"
                      rules={[
                        { required: true, message: "Kart numarası zorunlu." },
                        { min: 16, message: "Kart numarası eksik görünüyor." }
                      ]}
                    >
                      <Input placeholder="0000 0000 0000 0000" maxLength={19} size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Ay / Yıl" name="expireDate" rules={[{ required: true, message: "Tarih zorunlu." }]}>
                      <Input placeholder="12/28" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="CVV" name="cvv" rules={[{ required: true, message: "CVV zorunlu." }]}>
                      <Input placeholder="123" maxLength={3} size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Taksit" name="installment" rules={[{ required: true, message: "Taksit seçimi zorunlu." }]}>
                      <Input placeholder="Peşin / 3 / 6" size="large" />
                    </Form.Item>
                  </Col>
                </Row>
              </section>
            ) : null}

            {currentStep === 2 ? (
              <section className="pasaj-checkout-section">
                <div className="pasaj-checkout-section-title">
                  <CheckCircleOutlined />
                  <div>
                    <h2>Sipariş Onayı</h2>
                    <p>Teslimat, ödeme ve sepet bilgilerinizi kontrol edin.</p>
                  </div>
                </div>
                <Space direction="vertical" size={14} style={{ width: "100%" }}>
                  <div className="checkout-review-box">
                    <div className="summary-row"><span>Teslimat alıcısı</span><strong>{deliverySummary.fullName || "-"}</strong></div>
                    <div className="summary-row"><span>Telefon</span><strong>{deliverySummary.phone || "-"}</strong></div>
                    <div className="summary-row">
                      <span>Adres</span>
                      <strong>{[deliverySummary.district, deliverySummary.city].filter(Boolean).join(" / ") || "-"}</strong>
                    </div>
                  </div>
                  <div className="checkout-review-box">
                    <div className="summary-row"><span>Ödeme yöntemi</span><strong>{paymentSummary.installment || "Peşin"}</strong></div>
                    <div className="summary-row"><span>Kart sahibi</span><strong>{paymentSummary.cardName || "-"}</strong></div>
                    <div className="summary-row">
                      <span>Kart</span>
                      <strong>
                        {paymentSummary.cardNumber
                          ? `**** ${String(paymentSummary.cardNumber).replace(/\s+/g, "").slice(-4)}`
                          : "-"}
                      </strong>
                    </div>
                  </div>
                </Space>
              </section>
            ) : null}
          </Form>

          <div className="checkout-actions">
            <Button onClick={previousStep} disabled={currentStep === 0 || createOrderMutation.isPending}>
              Geri
            </Button>
            {currentStep < 2 ? (
              <Button type="primary" onClick={nextStep} disabled={items.length === 0}>
                Devam Et
              </Button>
            ) : (
              <Button type="primary" onClick={submitOrder} loading={createOrderMutation.isPending} disabled={items.length === 0}>
                Siparişi Oluştur
              </Button>
            )}
          </div>
        </section>

        <aside className="pasaj-checkout-summary-panel">
          <div className="pasaj-cart-summary-title">
            <ShoppingCartOutlined />
            <strong>Sipariş Özeti</strong>
          </div>

          <div className="pasaj-checkout-items">
            {items.map((item) => (
              <div key={item.product.id} className="pasaj-checkout-item">
                <img src={item.product.image} alt={item.product.name} />
                <span>{item.product.name} x{item.quantity}</span>
                <strong>{formatCurrency(item.product.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="pasaj-cart-summary-rows">
            <div><span>Ürünler</span><strong>{items.length}</strong></div>
            <div><span>Ara Toplam</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div><span>Kargo</span><strong>{shippingCost === 0 ? "Ücretsiz" : formatCurrency(shippingCost)}</strong></div>
          </div>

          <div className="pasaj-cart-total-row">
            <span>Genel Toplam</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <div className="pasaj-cart-summary-note">
            <TruckOutlined />
            <span>Sepetteki fiyatlar ödeme adımına kadar korunur.</span>
          </div>

          <Typography.Paragraph type="secondary" className="checkout-note">
            Sipariş tamamlandığında kayıt Firestore koleksiyonuna eklenir.
          </Typography.Paragraph>
        </aside>
      </div>
    </main>
  );
};
