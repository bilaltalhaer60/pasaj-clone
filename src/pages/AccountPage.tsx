import {
  HeartFilled,
  LogoutOutlined,
  RightOutlined,
  ShoppingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Empty, List, Space, Tabs, Tag, Typography } from "antd";
import { Link, useSearchParams } from "react-router-dom";
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
  };

  if (!isLoggedIn || !user) {
    return (
      <main className="pasaj-auth-page">
        <section className="pasaj-auth-panel" aria-labelledby="pasaj-account-login-title">
          <img src="/pasaj/logos/PasajHeaderLogo.svg" alt="Turkcell Pasaj" className="pasaj-auth-logo" />
          <h1 id="pasaj-account-login-title">Hesabım</h1>
          <p>Siparişlerinizi, favorilerinizi ve hesap bilgilerinizi görüntülemek için giriş yapın.</p>
          <Link to={ROUTES.login} className="pasaj-auth-primary pasaj-auth-link-button">
            <UserOutlined />
            Giriş Yap
          </Link>
          <div className="pasaj-auth-divider">
            <span>veya</span>
          </div>
          <Link to={ROUTES.register} className="pasaj-auth-secondary">
            Üye Ol
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="pasaj-account-page">
      <section className="pasaj-account-shell">
        <div className="pasaj-account-header">
          <div>
            <span className="pasaj-account-eyebrow">Hesabım</span>
            <h1>Merhaba, {user.fullName}</h1>
            <p>Pasaj siparişlerinizi, favorilerinizi ve üyelik bilgilerinizi bu alandan takip edin.</p>
          </div>
          <div className="pasaj-account-actions">
            {user.role === "admin" ? (
              <Link to={ROUTES.admin} className="pasaj-account-outline-button">
                Admin Panel
                <RightOutlined />
              </Link>
            ) : null}
            <Link to={ROUTES.home} className="pasaj-account-outline-button">
              Alışverişe Dön
              <RightOutlined />
            </Link>
            <button type="button" className="pasaj-account-logout" onClick={() => void logout()}>
              <LogoutOutlined />
              Çıkış Yap
            </button>
          </div>
        </div>

        <div className="pasaj-account-summary-grid">
          <article>
            <span>Üyelik</span>
            <strong>{user.membership}</strong>
          </article>
          <article>
            <span>Toplam Sipariş</span>
            <strong>{user.orders.length}</strong>
          </article>
          <article>
            <span>Favori Ürün</span>
            <strong>{user.favorites.length}</strong>
          </article>
        </div>

        <div className="pasaj-account-content">
          <Tabs
            className="pasaj-account-tabs"
            activeKey={activeTabKey}
            onChange={(key) => setSearchParams({ tab: key })}
            items={[
              {
                key: "orders",
                label: "Siparişlerim",
                children:
                  user.orders.length === 0 ? (
                    <Empty
                      description="Henüz siparişiniz yok. Alışverişinizi tamamladığınızda siparişleriniz burada listelenir."
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ) : (
                    <List
                      className="pasaj-account-list"
                      dataSource={user.orders}
                      renderItem={(order) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<ShoppingOutlined className="pasaj-account-list-icon" />}
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
                label: "Favorilerim",
                children: (
                  <>
                    {favoritesError ? (
                      <Alert
                        type="warning"
                        showIcon
                        className="pasaj-account-alert"
                        message="Favori ürünler yüklenirken bir sorun oluştu."
                      />
                    ) : null}
                    {favoriteProducts.length === 0 ? (
                      <Empty
                        description="Henüz favori ürün eklemediniz. Ürün kartlarındaki kalp ikonuyla listenizi oluşturabilirsiniz."
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    ) : (
                      <List
                        className="pasaj-account-list"
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
                                Kaldır
                              </Button>,
                              <Link key={product.slug} to={`/product/${product.slug}`}>
                                İncele
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
                label: "Profil Bilgilerim",
                children: (
                  <div className="pasaj-profile-grid">
                    <section className="pasaj-profile-box">
                      <h2>Kişisel Bilgiler</h2>
                      <dl>
                        <div>
                          <dt>Ad Soyad</dt>
                          <dd>{user.fullName}</dd>
                        </div>
                        <div>
                          <dt>E-posta</dt>
                          <dd>{user.email}</dd>
                        </div>
                        <div>
                          <dt>Telefon</dt>
                          <dd>{user.phone || "-"}</dd>
                        </div>
                      </dl>
                    </section>
                    <section className="pasaj-profile-box">
                      <h2>Kayıtlı Adresler</h2>
                      {user.addresses.length === 0 ? (
                        <p>Kayıtlı adresiniz bulunmuyor.</p>
                      ) : (
                        user.addresses.map((address) => (
                          <p key={address.id}>
                            <strong>{address.title}:</strong> {address.detail}
                          </p>
                        ))
                      )}
                    </section>
                  </div>
                )
              }
            ]}
          />
        </div>
      </section>
    </main>
  );
};
