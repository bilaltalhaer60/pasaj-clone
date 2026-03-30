import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Alert, Button, Card, Col, Descriptions, Rate, Row, Skeleton, Space, Tag, Typography } from "antd";
import { PageShell } from "../app/page-shell";
import { isFirebaseReady } from "../config/firebase";
import { getProductBySlug } from "../services/productService";
import { useCartStore } from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";

export const ProductDetailPage = () => {
  const { productSlug } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productSlug],
    queryFn: () => getProductBySlug(productSlug),
    enabled: Boolean(productSlug)
  });

  if (isLoading) {
    return (
      <PageShell
        badge="3. Hafta Teslimi"
        title="Urun yukleniyor"
        description="Urun bilgileri Firestore uzerinden getiriliyor."
      >
        <Card className="detail-summary-card">
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell
        badge="3. Hafta Teslimi"
        title="Urun yuklenemedi"
        description="Detay verisi Firestore'dan okunurken bir sorun olustu."
        nextTargets={[{ label: "Anasayfaya Don", to: "/" }]}
      >
        <Alert
          type="error"
          showIcon
          message={error instanceof Error ? error.message : "Beklenmeyen bir hata olustu."}
        />
      </PageShell>
    );
  }

  if (!product) {
    return (
      <PageShell
        badge="3. Hafta Teslimi"
        title="Urun bulunamadi"
        description="Istenen urun Firestore icindeki products koleksiyonunda bulunamadi."
        nextTargets={[{ label: "Anasayfaya Don", to: "/" }]}
      >
        {!isFirebaseReady ? (
          <Alert
            type="warning"
            showIcon
            message="Firebase baglantisi hazir degil. Once .env bilgilerini doldurman gerekiyor."
          />
        ) : null}
      </PageShell>
    );
  }

  return (
    <PageShell
      badge="3. Hafta Teslimi"
      title={product.name}
      description="Bu hafta urun detay akisi; fiyat, taksit, teknik ozellikler ve sepete ekleme aksiyonu ile birlikte tamamlandi."
      nextTargets={[
        { label: "Sepete Git", to: "/cart" },
        { label: "Kategoriye Don", to: `/category/${product.category}` }
      ]}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={11}>
          <Card className="detail-media-card">
            <img src={product.image} alt={product.name} className="detail-image" />
          </Card>
        </Col>
        <Col xs={24} lg={13}>
          <Card className="detail-summary-card">
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Space wrap>
                <Tag color="blue">{product.badge}</Tag>
                <Tag>{product.brand}</Tag>
                <Tag>{product.installment}</Tag>
              </Space>
              <Typography.Paragraph>{product.summary}</Typography.Paragraph>
              <Space align="center" size="middle" wrap>
                <Rate allowHalf disabled value={product.rating} />
                <Typography.Text type="secondary">
                  {product.rating} puan · {product.reviewCount} yorum
                </Typography.Text>
              </Space>
              <Typography.Title level={2} className="detail-price">
                {formatCurrency(product.price)}
              </Typography.Title>
              <Typography.Text delete type="secondary">
                {formatCurrency(product.previousPrice)}
              </Typography.Text>
              <Typography.Paragraph className="shipping-note">
                {product.shippingNote}
              </Typography.Paragraph>
              <Space wrap>
                <Button type="primary" size="large" onClick={() => addItem(product)}>
                  Sepete ekle
                </Button>
                <Button size="large">
                  <Link to="/checkout">Hemen al</Link>
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card title="One cikan ozellikler" className="detail-info-card">
            <Space direction="vertical" size={10}>
              {product.highlights.map((item) => (
                <Tag key={item} className="detail-tag">
                  {item}
                </Tag>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="Teknik bilgiler" className="detail-info-card">
            <Descriptions column={1} bordered>
              {product.specs.map((spec) => (
                <Descriptions.Item key={spec.label} label={spec.label}>
                  {spec.value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </PageShell>
  );
};
