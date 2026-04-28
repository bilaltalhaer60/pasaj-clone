import { HeartFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, Col, Empty, List, Row, Space, Statistic, Tabs, Tag, Typography, message } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { PageShell } from "../app/page-shell";
import { ROUTES } from "../constants/routes";
import { getAllProducts } from "../services/productService";
import { useAuthStore } from "../store/authStore";
import type { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";

export const AccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoggedIn, logout, toggleFavorite, user } = useAuthStore();
  const { data: products = [], error: favoritesError } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    enabled: isLoggedIn && Boolean(user)
  });
  const nextTargets =
    user?.role === "admin"
      ? [
          { label: "Admin Panel", to: ROUTES.admin },
          { label: "Alisverise Don", to: ROUTES.home }
        ]
      : [{ label: "Alisverise Don", to: ROUTES.home }];
  const favoriteProducts = user
    ? user.favorites
        .map((favoriteSlug) => products.find((product) => product.slug === favoriteSlug))
        .filter((product): product is Product => Boolean(product))
    : [];
  const requestedTab = searchParams.get("tab");
  const activeTabKey =
    requestedTab === "favorites" || requestedTab === "orders" || requestedTab === "profile"
      ? requestedTab
      : "orders";

  const handleRemoveFavorite = (product: Product) => {
    toggleFavorite(product.slug);
    message.success("Urun favorilerden kaldirildi.");
  };

  if (!isLoggedIn || !user) {
    return (
      <PageShell
        badge="4. Hafta Teslimi"
        title="Hesabim"
        description="Bu alan 4. hafta ile birlikte kullanici paneline donustu. Devam etmek icin once giris yap."
        nextTargets={[
          { label: "Giris", to: ROUTES.login },
          { label: "Kayit Ol", to: ROUTES.register }
        ]}
      />
    );
  }

  return (
    <PageShell
      badge="4. Hafta Teslimi"
      title="Hesabim"
      description="Kullanici paneli; siparisler, favoriler, adresler ve profil ozetiyle birlikte 4. haftada tamamlandi."
      nextTargets={nextTargets}
    >
      <Row gutter={[16, 16]} className="account-stats-grid">
        <Col xs={24} md={8}>
          <Card className="account-stat-card">
            <Statistic title="Uyelik" value={user.membership} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="account-stat-card">
            <Statistic title="Toplam Siparis" value={user.orders.length} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="account-stat-card">
            <Statistic title="Favori Urun" value={user.favorites.length} />
          </Card>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTabKey}
        onChange={(key) => setSearchParams({ tab: key })}
        items={[
          {
            key: "orders",
            label: "Siparisler",
            children:
              user.orders.length === 0 ? (
                <Empty
                  description="Hesabinda henuz siparis yok. Checkout tamamlandiginda yeni siparisler burada listelenir."
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <List
                  dataSource={user.orders}
                  renderItem={(order) => (
                    <List.Item>
                      <List.Item.Meta
                        title={`${order.id} - ${order.date}`}
                        description={`Durum: ${order.status}`}
                      />
                      <Space direction="vertical" align="end">
                        <Tag
                          color={
                            order.status === "Teslim Edildi"
                              ? "green"
                              : order.status === "Kargoda"
                                ? "blue"
                                : "gold"
                          }
                        >
                          {order.status}
                        </Tag>
                        <Typography.Text strong>{formatCurrency(order.total)}</Typography.Text>
                      </Space>
                    </List.Item>
                  )}
                />
              )
          },
          {
            key: "favorites",
            label: "Favoriler",
            children: (
              <>
                {favoritesError ? (
                  <Alert
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                    message="Favori urunler yuklenirken bir sorun olustu."
                  />
                ) : null}
                {favoriteProducts.length === 0 ? (
                  <Empty
                    description="Henuz favori urun eklemedin. Urun kartlarindaki kalp ikonuyla favori listeni doldurabilirsin."
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ) : (
                  <List
                    dataSource={favoriteProducts}
                    renderItem={(product) => (
                      <List.Item
                        actions={[
                          <Button
                            key={`${product.slug}-remove`}
                            type="text"
                            danger
                            onClick={() => handleRemoveFavorite(product)}
                          >
                            Kaldir
                          </Button>,
                          <Link key={product.slug} to={`/product/${product.slug}`}>
                            Incele
                          </Link>
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <div className="account-favorite-avatar">
                              <img src={product.image} alt={product.name} className="account-favorite-image" />
                            </div>
                          }
                          title={
                            <Space size={8}>
                              <HeartFilled className="account-favorite-icon" />
                              <Link to={`/product/${product.slug}`}>{product.name}</Link>
                            </Space>
                          }
                          description={`${product.brand} - ${formatCurrency(product.price)}`}
                        />
                      </List.Item>
                    )}
                  />
                )}
              </>
            )
          },
          {
            key: "profile",
            label: "Profil",
            children: (
              <Space direction="vertical" size={14}>
                <Card className="profile-card">
                  <Typography.Title level={5}>{user.fullName}</Typography.Title>
                  <Typography.Paragraph>{user.email}</Typography.Paragraph>
                  <Typography.Paragraph>{user.phone}</Typography.Paragraph>
                </Card>
                <Card className="profile-card">
                  <Typography.Title level={5}>Kayitli adresler</Typography.Title>
                  {user.addresses.map((address) => (
                    <Typography.Paragraph key={address.id}>
                      <strong>{address.title}:</strong> {address.detail}
                    </Typography.Paragraph>
                  ))}
                </Card>
                <Button danger onClick={logout}>
                  Cikis Yap
                </Button>
              </Space>
            )
          }
        ]}
      />
    </PageShell>
  );
};
