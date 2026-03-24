import { useParams } from "react-router-dom";
import { Card, Col, Row, Typography } from "antd";
import { PageShell } from "../app/page-shell";

const mockProducts = [
  "iPhone 16 Pro",
  "Samsung Galaxy S25",
  "MacBook Air M4",
  "AirPods Pro"
];

export const CategoryPage = () => {
  const { categorySlug } = useParams();

  return (
    <PageShell
      title={`Kategori: ${categorySlug ?? "genel"}`}
      description="Listeleme mantığı sonraki haftalarda gerçek veriyle doldurulacak. Bu hafta rota, layout ve sayfa kabuğu hazırlandı."
    >
      <Row gutter={[16, 16]}>
        {mockProducts.map((product) => (
          <Col xs={24} md={12} xl={6} key={product}>
            <Card className="product-card">
              <Typography.Title level={5}>{product}</Typography.Title>
              <Typography.Paragraph type="secondary">
                Dinamik kategori rotası başarıyla çalışıyor.
              </Typography.Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </PageShell>
  );
};
