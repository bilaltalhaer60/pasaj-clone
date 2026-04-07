import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Card, Col, Row, Skeleton, Statistic, Table, type TableColumnsType } from "antd";
import { PageShell } from "../app/page-shell";
import { getAllProducts } from "../services/productService";
import { useAuthStore } from "../store/authStore";
import { buildCategorySummaries, getAverageRating, getTotalReviewCount } from "../utils/catalog";
import { formatCurrency } from "../utils/formatCurrency";

type ProductRow = {
  key: string;
  name: string;
  category: string;
  popularity: number;
  reviews: number;
  price: string;
};

const columns: TableColumnsType<ProductRow> = [
  { title: "Urun", dataIndex: "name" },
  { title: "Kategori", dataIndex: "category" },
  { title: "Populerlik", dataIndex: "popularity" },
  { title: "Yorum", dataIndex: "reviews" },
  { title: "Fiyat", dataIndex: "price" }
];

export const AdminPage = () => {
  const user = useAuthStore((state) => state.user);
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts
  });
  const categories = useMemo(() => buildCategorySummaries(products), [products]);
  const averageRating = useMemo(() => getAverageRating(products), [products]);
  const totalReviews = useMemo(() => getTotalReviewCount(products), [products]);
  const averagePrice = useMemo(() => {
    if (products.length === 0) {
      return 0;
    }

    return products.reduce((sum, product) => sum + product.price, 0) / products.length;
  }, [products]);
  const data: ProductRow[] = products.map((product) => ({
    key: product.id,
    name: product.name,
    category: product.category,
    popularity: product.popularity,
    reviews: product.reviewCount,
    price: formatCurrency(product.price)
  }));

  return (
    <PageShell
      badge="5. Hafta Teslimi"
      title="Admin Panel"
      description="Yonetim paneli 5. haftada urun, kategori ve yorum metriklerini dogrudan Firestore koleksiyonundan okumaya basladi."
    >
      <Alert
        type="warning"
        showIcon
        message={`Bu alan demo amaclidir. Aktif oturum: ${user?.fullName ?? "Yonetici"}. Yetkilendirme sonraki iterasyonda eklenecek.`}
        style={{ marginBottom: 16 }}
      />
      {error ? (
        <Alert
          type="error"
          showIcon
          message={error instanceof Error ? error.message : "Dashboard verisi yuklenemedi."}
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card className="admin-stat-card">
            <Statistic title="Toplam Urun" value={products.length} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="admin-stat-card">
            <Statistic title="Toplam Kategori" value={categories.length} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="admin-stat-card">
            <Statistic
              title="Ortalama Fiyat"
              value={averagePrice}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Card className="admin-stat-card">
            <Statistic title="Toplam Yorum" value={totalReviews} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="admin-stat-card">
            <Statistic title="Ortalama Puan" value={averageRating.toFixed(1)} />
          </Card>
        </Col>
      </Row>
      {isLoading ? (
        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      ) : (
        <Table columns={columns} dataSource={data} pagination={false} />
      )}
    </PageShell>
  );
};
