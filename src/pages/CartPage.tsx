import { Link } from "react-router-dom";
import { Alert, Button, Card, Empty, InputNumber, List, Space, Tag, Typography } from "antd";
import { PageShell } from "../app/page-shell";
import { env } from "../config/env";
import { getCartItemCount, getCartSubtotal, useCartStore } from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";

export const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const subtotal = getCartSubtotal(items);
  const shippingCost = subtotal >= env.shippingThreshold ? 0 : env.shippingCost;
  const total = subtotal + shippingCost;

  return (
    <PageShell
      badge="3. Hafta Teslimi"
      title="Sepet"
      description="Zustand tabanli sepet state'i, adet guncelleme ve siparis ozeti bu hafta aktif hale getirildi."
      nextTargets={[
        { label: "Odeme Sayfasi", to: "/checkout" },
        { label: "Alisverise Don", to: "/" }
      ]}
    >
      <Alert
        type="info"
        showIcon
        message={`Sepette ${getCartItemCount(items)} urun var. Ucretsiz kargo esigi ${env.shippingThreshold} TL.`}
      />

      <div className="cart-layout">
        <Card className="cart-items-card">
          {items.length === 0 ? (
            <Empty
              description="Sepetin su anda bos. Kategori ekranindan urun ekleyebilirsin."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <List
              dataSource={items}
              renderItem={({ product, quantity }) => (
                <List.Item
                  actions={[
                    <Button key="detail" type="link">
                      <Link to={`/product/${product.slug}`}>Detay</Link>
                    </Button>,
                    <Button key="remove" danger type="link" onClick={() => removeItem(product.id)}>
                      Sil
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<img src={product.image} alt={product.name} className="cart-thumb" />}
                    title={product.name}
                    description={
                      <Space direction="vertical" size={6}>
                        <Tag>{product.installment}</Tag>
                        <Typography.Text type="secondary">{product.shippingNote}</Typography.Text>
                      </Space>
                    }
                  />
                  <Space direction="vertical" align="end" size={10}>
                    <InputNumber
                      min={1}
                      max={5}
                      value={quantity}
                      onChange={(value) => updateQuantity(product.id, Number(value ?? 1))}
                    />
                    <Typography.Title level={5}>
                      {formatCurrency(product.price * quantity)}
                    </Typography.Title>
                  </Space>
                </List.Item>
              )}
            />
          )}
        </Card>

        <Card className="cart-summary-card" title="Siparis ozeti">
          <Space direction="vertical" size={14} style={{ width: "100%" }}>
            <div className="summary-row">
              <span>Ara toplam</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Kargo</span>
              <strong>{shippingCost === 0 ? "Ucretsiz" : formatCurrency(shippingCost)}</strong>
            </div>
            <div className="summary-row total-row">
              <span>Toplam</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <Button type="primary" size="large" block disabled={items.length === 0}>
              <Link to="/checkout">Odeme adimina gec</Link>
            </Button>
          </Space>
        </Card>
      </div>
    </PageShell>
  );
};
