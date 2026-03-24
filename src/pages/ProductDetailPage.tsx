import { Button, Card, Descriptions } from "antd";
import { useParams } from "react-router-dom";
import { PageShell } from "../app/page-shell";

export const ProductDetailPage = () => {
  const { productSlug } = useParams();

  return (
    <PageShell
      title={productSlug ?? "Ürün detay"}
      description="Ürün detay sayfası için rota ve temel içerik alanı hazır. Varyant, taksit ve yorum alanları sonraki haftalarda eklenecek."
      nextTargets={[{ label: "Sepete Git", to: "/cart" }]}
    >
      <Card>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Slug">{productSlug}</Descriptions.Item>
          <Descriptions.Item label="Durum">Detay sayfası route kabuğu hazır</Descriptions.Item>
          <Descriptions.Item label="Sonraki adım">Gerçek ürün verisi ve varyant seçimi</Descriptions.Item>
        </Descriptions>
        <Button type="primary" size="large" style={{ marginTop: 24 }}>
          Sepete Ekle
        </Button>
      </Card>
    </PageShell>
  );
};
