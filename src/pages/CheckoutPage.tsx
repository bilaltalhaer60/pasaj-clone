import { Alert } from "antd";
import { PageShell } from "../app/page-shell";

export const CheckoutPage = () => {
  return (
    <PageShell
      title="Ödeme"
      description="Checkout route kabuğu hazır. Form validasyonu ve ödeme simülasyonu daha sonraki hafta işidir."
    >
      <Alert
        type="info"
        showIcon
        message="Bu ekran şu an rota doğrulaması için mevcut."
      />
    </PageShell>
  );
};
