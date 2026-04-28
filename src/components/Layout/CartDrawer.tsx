import { Button, Drawer, Empty, InputNumber, Space, Typography, message } from "antd";
import { Link } from "react-router-dom";
import { env } from "../../config/env";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  getCartItemCount,
  getCartRemainingForFreeShipping,
  getCartSubtotal,
  useCartStore
} from "../../store/cartStore";
import { useUiStore } from "../../store/uiStore";

export const CartDrawer = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const isOpen = useUiStore((state) => state.isCartDrawerOpen);
  const closeDrawer = useUiStore((state) => state.closeCartDrawer);

  const subtotal = getCartSubtotal(items);
  const shippingCost = subtotal >= env.shippingThreshold ? 0 : env.shippingCost;
  const total = subtotal + shippingCost;
  const freeShippingRemaining = getCartRemainingForFreeShipping(items, env.shippingThreshold);

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    message.success("Urun sepetten silindi.");
  };

  return (
    <Drawer
      title={`Sepetim (${getCartItemCount(items)})`}
      placement="right"
      width={420}
      open={isOpen}
      onClose={closeDrawer}
    >
      {items.length === 0 ? (
        <Empty description="Sepetin bos." image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="drawer-cart-item">
              <img src={product.image} alt={product.name} className="drawer-cart-thumb" />
              <div className="drawer-cart-copy">
                <Typography.Text strong>{product.name}</Typography.Text>
                <Typography.Text type="secondary">{formatCurrency(product.price)}</Typography.Text>
                <div className="drawer-qty-row">
                  <InputNumber
                    min={1}
                    max={5}
                    value={quantity}
                    onChange={(value) => updateQuantity(product.id, Number(value ?? 1))}
                  />
                  <Button type="link" danger onClick={() => handleRemoveItem(product.id)}>
                    Sil
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <div className="drawer-summary-box">
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
            <Typography.Text type="secondary">
              {freeShippingRemaining === 0
                ? "Ucretsiz kargo aktif."
                : `Ucretsiz kargo icin ${formatCurrency(freeShippingRemaining)} daha ekleyin.`}
            </Typography.Text>
          </div>
          <Button block size="large" onClick={closeDrawer}>
            <Link to="/cart">Sepet sayfasina git</Link>
          </Button>
          <Button type="primary" block size="large" onClick={closeDrawer}>
            <Link to="/checkout">Siparisi tamamla</Link>
          </Button>
        </Space>
      )}
    </Drawer>
  );
};
