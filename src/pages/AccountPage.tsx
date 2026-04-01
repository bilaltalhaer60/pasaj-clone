import { Link } from "react-router-dom";
import { Button, Card, Col, List, Row, Space, Statistic, Tabs, Tag, Typography } from "antd";
import { PageShell } from "../app/page-shell";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";
import { formatCurrency } from "../utils/formatCurrency";

export const AccountPage = () => {
  const { isLoggedIn, logout, user } = useAuthStore();

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
      nextTargets={[
        { label: "Admin Panel", to: ROUTES.admin },
        { label: "Alisverise Don", to: ROUTES.home }
      ]}
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
        items={[
          {
            key: "orders",
            label: "Siparisler",
            children: (
              <List
                dataSource={user.orders}
                renderItem={(order) => (
                    <List.Item>
                      <List.Item.Meta
                      title={`${order.id} - ${order.date}`}
                      description={`Durum: ${order.status}`}
                    />
                    <Space direction="vertical" align="end">
                      <Tag color={order.status === "Teslim Edildi" ? "green" : "blue"}>
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
              <List
                dataSource={user.favorites}
                renderItem={(item) => (
                  <List.Item actions={[<Link key={item} to={ROUTES.home}>Incele</Link>]}>
                    {item}
                  </List.Item>
                )}
              />
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
