import { Alert, Card, List } from "antd";
import { PageShell } from "../app/page-shell";
import { env } from "../config/env";

export const CartPage = () => {
  return (
    <PageShell
      title="Sepet"
      description="Sepet rotası hazır. Zustand tabanlı gerçek state ve ödeme akışı sonraki haftalarda eklenecek."
      nextTargets={[{ label: "Ödeme Sayfası", to: "/checkout" }]}
    >
      <Alert
        type="info"
        showIcon
        message={`Ücretsiz kargo eşiği ${env.shippingThreshold} TL, sabit kargo ücreti ${env.shippingCost} TL.`}
      />
      <Card style={{ marginTop: 16 }}>
        <List
          dataSource={["Sepet state", "Kupon alanı", "Ödeme yönlendirmesi"]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>
    </PageShell>
  );
};
