import { Alert, Card, Col, Row, Statistic, Table, type TableColumnsType } from "antd";
import { PageShell } from "../app/page-shell";
import { allProducts } from "../mocks/products";
import { useAuthStore } from "../store/authStore";
import { formatCurrency } from "../utils/formatCurrency";

type ProductRow = {
  key: string;
  name: string;
  category: string;
  stock: number;
  price: string;
};

const columns: TableColumnsType<ProductRow> = [
  { title: "Urun", dataIndex: "name" },
  { title: "Kategori", dataIndex: "category" },
  { title: "Stok", dataIndex: "stock" },
  { title: "Fiyat", dataIndex: "price" }
];

export const AdminPage = () => {
  const user = useAuthStore((state) => state.user);
  const totalRevenue = allProducts.slice(0, 4).reduce((sum, product) => sum + product.price, 0);
  const data: ProductRow[] = allProducts.map((product, index) => ({
    key: product.id,
    name: product.name,
    category: product.category,
    stock: 12 - index,
    price: formatCurrency(product.price)
  }));

  return (
    <PageShell
      badge="4. Hafta Teslimi"
      title="Admin Panel"
      description="Yonetim paneli 4. haftada ozet metrikler, stok tablosu ve operasyon kartlariyla genisletildi."
    >
      <Alert
        type="warning"
        showIcon
        message={`Bu alan demo amaclidir. Aktif oturum: ${user?.fullName ?? "Yonetici"}. Yetkilendirme sonraki iterasyonda eklenecek.`}
        style={{ marginBottom: 16 }}
      />
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={8}>
          <Card className="admin-stat-card">
            <Statistic title="Toplam Urun" value={allProducts.length} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="admin-stat-card">
            <Statistic title="Bekleyen Siparis" value={3} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="admin-stat-card">
            <Statistic
              title="Vitrin Cirosu"
              value={totalRevenue}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
      </Row>
      <Table columns={columns} dataSource={data} pagination={false} />
    </PageShell>
  );
};
