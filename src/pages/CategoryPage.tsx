import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Alert, Button, Card, Col, Empty, Row, Select, Skeleton, Slider, Space, Tag, Typography } from "antd";
import { PageShell } from "../app/page-shell";
import { isFirebaseReady } from "../config/firebase";
import { categoryMeta } from "../data/categories";
import { getProductsByCategory } from "../services/productService";
import { useCartStore } from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";

const sortOptions = [
  { value: "popular", label: "En cok satanlar" },
  { value: "price-asc", label: "Fiyat artan" },
  { value: "price-desc", label: "Fiyat azalan" }
];

export const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [range, setRange] = useState<[number, number]>([5000, 90000]);
  const [sortBy, setSortBy] = useState("popular");
  const addItem = useCartStore((state) => state.addItem);
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["products", categorySlug],
    queryFn: () => getProductsByCategory(categorySlug ?? ""),
    enabled: Boolean(categorySlug)
  });

  const category = categoryMeta[categorySlug ?? ""] ?? {
    title: categorySlug ?? "Kategori",
    description: "Bu kategori icin filtrelenmis urun listesi ve kampanya kartlari hazirlandi."
  };

  const filteredProducts = useMemo(() => {
    const scoped = data.filter(
      (product) =>
        product.category === categorySlug &&
        product.price >= range[0] &&
        product.price <= range[1]
    );

    return [...scoped].sort((left, right) => {
      if (sortBy === "price-asc") {
        return left.price - right.price;
      }

      if (sortBy === "price-desc") {
        return right.price - left.price;
      }

      return right.popularity - left.popularity;
    });
  }, [categorySlug, data, range, sortBy]);

  return (
    <PageShell
      badge="3. Hafta Teslimi"
      title={`${category.title} listesi`}
      description={`${category.description} Filtre, siralama ve urun detaya gecisleri bu hafta ayni akista toplandi.`}
      nextTargets={[
        { label: "Sepete Git", to: "/cart" },
        { label: "Anasayfaya Don", to: "/" }
      ]}
    >
      <div className="section-heading section-heading-inline">
        <div>
          <Typography.Title level={3}>Filtre ve siralama</Typography.Title>
          <Typography.Paragraph>
            Fiyat araligi ve populerlik bazli listeleme aktif durumda.
          </Typography.Paragraph>
        </div>
        <Select value={sortBy} options={sortOptions} onChange={setSortBy} style={{ width: 220 }} />
      </div>

      <div className="category-layout-block">
        <aside className="filter-panel">
          <Typography.Title level={5}>Fiyat araligi</Typography.Title>
          <Slider
            range
            min={1000}
            max={100000}
            value={range}
            onChange={(value) => setRange(value as [number, number])}
          />
          <div className="filter-tags">
            <Tag>{formatCurrency(range[0])}</Tag>
            <Tag>{formatCurrency(range[1])}</Tag>
          </div>
        </aside>

        <section>
          {!isFirebaseReady ? (
            <Alert
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
              message="Firebase baglantisi hazir degil. Urunleri gorebilmek icin .env bilgilerini ve Firestore products koleksiyonunu tanimlaman gerekiyor."
            />
          ) : null}
          {error ? (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              message={error instanceof Error ? error.message : "Urunler yuklenirken bir hata olustu."}
            />
          ) : null}
          {isLoading ? (
            <Row gutter={[16, 16]}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Col xs={24} md={12} xl={8} key={index}>
                  <Card className="product-card">
                    <Skeleton active paragraph={{ rows: 6 }} />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : filteredProducts.length === 0 ? (
            <Card className="empty-card">
              <Empty description="Bu filtreye uygun urun bulunamadi." />
            </Card>
          ) : (
            <Row gutter={[16, 16]}>
              {filteredProducts.map((product) => (
                <Col xs={24} md={12} xl={8} key={product.id}>
                  <Card
                    className="product-card"
                    cover={<img src={product.image} alt={product.name} className="product-image" />}
                  >
                    <Space direction="vertical" size={10} style={{ width: "100%" }}>
                      <Space wrap>
                        <Tag color="blue">{product.badge}</Tag>
                        <Tag>{product.brand}</Tag>
                      </Space>
                      <Typography.Title level={5}>{product.name}</Typography.Title>
                      <Typography.Paragraph type="secondary">
                        {product.summary}
                      </Typography.Paragraph>
                      <Typography.Title level={4} className="product-price">
                        {formatCurrency(product.price)}
                      </Typography.Title>
                      <Typography.Text delete type="secondary">
                        {formatCurrency(product.previousPrice)}
                      </Typography.Text>
                      <Space wrap>
                        <Button type="primary" onClick={() => addItem(product)}>
                          Sepete ekle
                        </Button>
                        <Button>
                          <Link to={`/product/${product.slug}`}>Detayi ac</Link>
                        </Button>
                      </Space>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </section>
      </div>
    </PageShell>
  );
};
