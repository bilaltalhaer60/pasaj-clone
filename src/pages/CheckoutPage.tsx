import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Form, Input, message, Result, Row, Space, Steps, Typography } from "antd";
import { useMutation } from "@tanstack/react-query";
import { PageShell } from "../app/page-shell";
import { env } from "../config/env";
import { createOrder } from "../services/orderService";
import { getCartSubtotal, useCartStore } from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";
import type { CreateOrderPayload, OrderRecord } from "../types/order";

const stepItems = [
  { title: "Teslimat" },
  { title: "Odeme" },
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
      clearCart();
      message.success("Siparis basariyla olusturuldu.");
    },
    onError: (error) => {
      message.error(error instanceof Error ? error.message : "Siparis olusturulamadi.");
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
    const payload: CreateOrderPayload = {
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

  if (completedOrder) {
    return (
      <PageShell
        badge="6. Hafta Teslimi"
        title="Siparis tamamlandi"
        description="Siparis Firestore'a kaydedildi ve checkout akisinin 3 adimi tamamlandi."
        nextTargets={[
          { label: "Anasayfa", to: "/" },
          { label: "Sepet", to: "/cart" }
        ]}
      >
        <Result
          status="success"
          title="Siparisiniz alindi"
          subTitle={`Siparis numarasi: ${completedOrder.orderNumber}`}
          extra={[
            <Button key="home" type="primary" onClick={() => navigate("/")}>
              Anasayfaya don
            </Button>
          ]}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      badge="6. Hafta Teslimi"
      title="Odeme"
      description="Checkout artik 3 adimli akista calisiyor ve siparisi Firestore'a kaydediyor."
      nextTargets={[
        { label: "Sepete Don", to: "/cart" },
        { label: "Anasayfa", to: "/" }
      ]}
    >
      {items.length === 0 ? (
        <Alert
          type="warning"
          showIcon
          message="Checkout'a devam etmek icin once sepete urun eklemelisin."
        />
      ) : null}

      <Steps current={currentStep} items={stepItems} className="checkout-steps" />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card className="checkout-card">
            <Form layout="vertical" form={form} initialValues={{ installment: "Pesin" }}>
              {currentStep === 0 ? (
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Ad Soyad" name="fullName" rules={[{ required: true, message: "Ad soyad zorunlu." }]}>
                      <Input placeholder="Bilal Talha" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Telefon" name="phone" rules={[{ required: true, message: "Telefon zorunlu." }]}>
                      <Input placeholder="05xx xxx xx xx" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item label="Adres" name="address" rules={[{ required: true, message: "Adres zorunlu." }]}>
                      <Input.TextArea rows={4} placeholder="Teslimat adresini gir" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Sehir" name="city" rules={[{ required: true, message: "Sehir zorunlu." }]}>
                      <Input placeholder="Istanbul" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Ilce" name="district" rules={[{ required: true, message: "Ilce zorunlu." }]}>
                      <Input placeholder="Kadikoy" />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}

              {currentStep === 1 ? (
                <Row gutter={[16, 0]}>
                  <Col xs={24}>
                    <Form.Item label="Kart uzerindeki ad" name="cardName" rules={[{ required: true, message: "Kart sahibi zorunlu." }]}>
                      <Input placeholder="BILAL TALHA" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Kart numarasi"
                      name="cardNumber"
                      rules={[
                        { required: true, message: "Kart numarasi zorunlu." },
                        { min: 16, message: "Kart numarasi eksik gorunuyor." }
                      ]}
                    >
                      <Input placeholder="0000 0000 0000 0000" maxLength={19} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Ay / Yil" name="expireDate" rules={[{ required: true, message: "Tarih zorunlu." }]}>
                      <Input placeholder="12/28" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="CVV" name="cvv" rules={[{ required: true, message: "CVV zorunlu." }]}>
                      <Input placeholder="123" maxLength={3} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item label="Taksit" name="installment" rules={[{ required: true, message: "Taksit secimi zorunlu." }]}>
                      <Input placeholder="Pesin / 3 / 6" />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null}

              {currentStep === 2 ? (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Typography.Title level={4}>Siparis ozeti ve onay</Typography.Title>
                  <Typography.Paragraph>
                    Teslimat, odeme ve sepet bilgilerini kontrol et. "Siparisi olustur" dediginde kayit Firestore'a yazilacak.
                  </Typography.Paragraph>
                  <div className="checkout-review-box">
                    <div className="summary-row"><span>Toplam urun</span><strong>{items.length}</strong></div>
                    <div className="summary-row"><span>Ara toplam</span><strong>{formatCurrency(subtotal)}</strong></div>
                    <div className="summary-row"><span>Kargo</span><strong>{shippingCost === 0 ? "Ucretsiz" : formatCurrency(shippingCost)}</strong></div>
                    <div className="summary-row total-row"><span>Genel toplam</span><strong>{formatCurrency(total)}</strong></div>
                  </div>
                </Space>
              ) : null}
            </Form>

            <div className="checkout-actions">
              <Button onClick={previousStep} disabled={currentStep === 0 || createOrderMutation.isPending}>
                Geri
              </Button>
              {currentStep < 2 ? (
                <Button type="primary" onClick={nextStep} disabled={items.length === 0}>
                  Devam et
                </Button>
              ) : (
                <Button type="primary" onClick={submitOrder} loading={createOrderMutation.isPending} disabled={items.length === 0}>
                  Siparisi olustur
                </Button>
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={9}>
          <Card title="Siparis ozeti" className="checkout-card">
            <Space direction="vertical" size={14} style={{ width: "100%" }}>
              {items.map((item) => (
                <div key={item.product.id} className="summary-row checkout-item-row">
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
                Bu ekran artik demo degil. Form tamamlandiginda siparis kaydi Firestore koleksiyonuna eklenir.
              </Typography.Paragraph>
            </Space>
          </Card>
        </Col>
      </Row>
    </PageShell>
  );
};
