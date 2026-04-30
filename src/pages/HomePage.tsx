import { useState } from "react";
import {
  HeartFilled,
  CustomerServiceOutlined,
  GiftOutlined,
  HeartOutlined,
  LeftOutlined,
  LaptopOutlined,
  MobileOutlined,
  RightOutlined,
  StarOutlined,
  ThunderboltOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, Col, Row, Skeleton, Typography } from "antd";
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  campaignTiles,
  heroBanners,
  infoFeatures,
  popularBrands,
  shortcutCategories
} from "../data/home";
import { getAllProducts } from "../services/productService";
import { useAuthStore } from "../store/authStore";
import type { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";

const featureIcons = [GiftOutlined, StarOutlined, StarOutlined, UserOutlined];
const loadingCards = Array.from({ length: 5 });
const bestsellerTabs = [
  {
    key: "telefon",
    label: "Cep Telefonu-Aksesuar",
    icon: MobileOutlined,
    to: "/category/telefon",
    slugs: [
      "iphone-17-256-gb",
      "xiaomi-redmi-note-15-pro-256gb",
      "samsung-galaxy-s25-fe-8gb-256gb",
      "iphone-17-pro-max-256-gb",
      "iphone-16-128-gb"
    ]
  },
  {
    key: "bilgisayar",
    label: "Bilgisayar-Tablet",
    icon: LaptopOutlined,
    to: "/category/bilgisayar",
    slugs: ["macbook-air-m4-13", "lenovo-legion-16", "ipad-air-11"]
  },
  {
    key: "ev-aletleri",
    label: "Elektrikli Ev Aletleri",
    icon: ThunderboltOutlined,
    to: "/category/aksesuar",
    slugs: ["philips-kahve-makinesi", "dyson-v15-supurge", "arzum-tost-makinesi"]
  },
  {
    key: "sağlık",
    label: "Sağlık-Kişisel Bakım",
    icon: HeartOutlined,
    to: "/category/aksesuar",
    slugs: ["braun-series-7", "philips-sac-kurutma", "xiaomi-akilli-tarti"]
  },
  {
    key: "hobi",
    label: "Hobi-Oyun",
    icon: CustomerServiceOutlined,
    to: "/category/bilgisayar",
    slugs: ["playstation-5-slim", "logitech-g435", "xbox-wireless-controller"]
  },
  {
    key: "tv-ses",
    label: "TV-Ses Sistemleri",
    icon: StarOutlined,
    to: "/category/aksesuar",
    slugs: ["jbl-flip-6", "sony-wh-1000xm5", "samsung-soundbar"]
  },
  {
    key: "ev-yaşam",
    label: "Ev-Yaşam",
    icon: GiftOutlined,
    to: "/category/aksesuar",
    slugs: ["anker-powerbank-20000", "sbs-hizli-sarj", "akilli-ev-kamera"]
  }
];
const brandCounts: Record<string, number> = {
  Apple: 528,
  Samsung: 367,
  Mi: 209,
  Huawei: 82,
  Philips: 366,
  Sony: 164,
  Lenovo: 814,
  JBL: 97,
  Anker: 20,
  Arzum: 51,
  Braun: 153,
  Casper: 124,
  Dyson: 82,
  Omix: 16,
  Realme: 22,
  TCL: 33
};

const ProductCard = ({
  product,
  isFavorite,
  onToggleFavorite
}: {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}) => (
  <Card className="pasaj-shelf-card">
    <button
      type="button"
      className={`favorite-button ${isFavorite ? "active" : ""}`}
      aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={isFavorite}
      onClick={() => onToggleFavorite(product)}
    >
      {isFavorite ? <HeartFilled /> : <HeartOutlined />}
    </button>
    <Link to={`/product/${product.slug}`} className="shelf-product-detail-link">
      <div className="shelf-product-image-wrap">
        <img src={product.image} alt={product.name} className="shelf-product-image" />
      </div>
    </Link>
    <div className="variant-dots">* * *</div>
    <Link to={`/product/${product.slug}`} className="shelf-product-name-link">
      <Typography.Paragraph className="shelf-product-title">{product.name}</Typography.Paragraph>
    </Link>
    <div className="product-chip-row">
      <span className="product-chip">Pasaj Limitinle Ode</span>
      <span className="product-chip">Ücretsiz Kargo</span>
    </div>
    <div className="shelf-price-row">
      {product.previousPrice > 0 ? <span className="old-price">{formatCurrency(product.previousPrice)}</span> : null}
      {product.discount > 0 ? <span className="discount-text">{product.discount}.000 TL İndirim</span> : null}
    </div>
    <div className="current-price">{formatCurrency(product.price)}</div>
  </Card>
);

const formatPasajPrice = (amount: number) =>
  `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(amount)} TL`;

const BestsellerPhoneCard = ({
  product,
  isFavorite,
  onToggleFavorite
}: {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}) => (
  <article className="pasaj-bestseller-card">
    <span className="pasaj-bestseller-badge">Çok Satan</span>
    <button
      type="button"
      className={`pasaj-bestseller-fav ${isFavorite ? "active" : ""}`}
      aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={isFavorite}
      onClick={() => onToggleFavorite(product)}
    >
      {isFavorite ? <HeartFilled /> : <HeartOutlined />}
    </button>
    <Link to={`/product/${product.slug}`} className="pasaj-bestseller-image-wrap">
      <img src={product.image} alt={product.name} className="pasaj-bestseller-image" />
      {product.category === "telefon" && product.slug !== "xiaomi-redmi-note-15-pro-256gb" ? (
        <img src="/pasaj/products/5g-badge.jpg" alt="5G uyumlu" className="pasaj-5g-badge" />
      ) : null}
    </Link>
    <div className="pasaj-bestseller-color-row">
      <span className="color-dot black" />
      <span className="color-extra">+{product.brand === "Apple" ? 3 : 1}</span>
      <span className="mini-dots" />
    </div>
    <Link to={`/product/${product.slug}`} className="pasaj-bestseller-title">
      {product.name}
    </Link>
    <div className="pasaj-bestseller-chip-row">
      <span>Pasaj Limitinle Ode</span>
      <span>Ücretsiz Kargo</span>
    </div>
    <div className="pasaj-bestseller-price-row">
      {product.previousPrice > product.price ? (
        <span className="pasaj-bestseller-old">{formatPasajPrice(product.previousPrice)}</span>
      ) : null}
      {product.discount > 0 ? (
        <span className="pasaj-bestseller-discount">
          {formatPasajPrice(product.previousPrice - product.price)} İndirim
        </span>
      ) : null}
    </div>
    <strong className="pasaj-bestseller-price">{formatPasajPrice(product.price)}</strong>
    {product.slug === "iphone-16-128-gb" ? (
      <span className="pasaj-bestseller-note">Son 30 günün en düşük fiyatı</span>
    ) : null}
  </article>
);

export const HomePage = () => {
  const [activeBestsellerKey, setActiveBestsellerKey] = useState("telefon");
  const favoriteSlugs = useAuthStore((state) => state.user?.favorites ?? []);
  const toggleFavorite = useAuthStore((state) => state.toggleFavorite);
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts
  });

  const featuredProducts = data.slice(0, 5);
  const activeBestsellerTab = bestsellerTabs.find((tab) => tab.key === activeBestsellerKey) ?? bestsellerTabs[0];
  const bestsellerProducts = activeBestsellerTab.slugs
    .map((slug) => data.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));
  const favoriteSlugSet = new Set(favoriteSlugs);

  const handleToggleFavorite = (product: Product) => {
    toggleFavorite(product.slug);
  };

  return (
    <div className="pasaj-homepage">
      <section className="pasaj-hero-section">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          loop
          className="pasaj-hero-swiper"
        >
          {heroBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Link to="/" className="pasaj-hero-banner-link">
                <img src={banner.image} alt={banner.alt} className="pasaj-hero-banner-image" />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="shortcut-icons-section">
        <div className="shortcut-icons-row">
          {shortcutCategories.map((item) => (
            <Link key={item.title} to={item.to} className="shortcut-icon-link">
              <div className="shortcut-icon-circle">
                <img src={item.image} alt={item.title} className="shortcut-icon-image" />
              </div>
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="feature-strip-section">
        <div className="feature-strip-grid">
          {infoFeatures.map((item, index) => {
            const Icon = featureIcons[index];
            return (
              <article key={item.title} className="feature-strip-card">
                <div className="feature-strip-icon">
                  <Icon />
                </div>
                <span>{item.title}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="product-rack-section">
        <div className="pasaj-section-header">
          <Typography.Title level={2}>Sana Özel Ürünler</Typography.Title>
        </div>
        {error ? (
          <Alert
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
            message={error instanceof Error ? error.message : "Ürünler yüklenirken hata oluştu."}
          />
        ) : null}
        <Row gutter={[24, 24]}>
          {isLoading
            ? loadingCards.map((_, index) => (
                <Col xs={24} sm={12} lg={8} xl={4} key={index}>
                  <Card className="pasaj-shelf-card">
                    <Skeleton active paragraph={{ rows: 5 }} />
                  </Card>
                </Col>
              ))
            : featuredProducts.map((product) => (
                <Col xs={24} sm={12} lg={8} xl={4} key={product.id}>
                  <ProductCard
                    product={product}
                    isFavorite={favoriteSlugSet.has(product.slug)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </Col>
              ))}
        </Row>
      </section>

      <section className="campaign-grid-section">
        <div className="pasaj-section-header with-action">
          <Typography.Title level={2}>Kampanyalar</Typography.Title>
          <Button className="soft-pill-button">Tümü</Button>
        </div>
        <div className="campaign-image-grid">
          {campaignTiles.map((tile) => (
            <Link key={tile.id} to={tile.to} className="campaign-image-link">
              <img src={tile.image} alt={tile.alt} className="campaign-image" />
            </Link>
          ))}
        </div>
      </section>

      <section className="product-rack-section bestseller-section">
        <div className="pasaj-section-header">
          <Typography.Title level={2}>Çok Satanlar</Typography.Title>
        </div>
        <div className="pasaj-bestseller-tabs">
          {bestsellerTabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                type="button"
                key={tab.label}
                className={activeBestsellerKey === tab.key ? "active" : ""}
                onClick={() => setActiveBestsellerKey(tab.key)}
                aria-pressed={activeBestsellerKey === tab.key}
              >
                <Icon />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="pasaj-bestseller-toolbar">
          <span>{activeBestsellerTab.label} kategorisinde çok satan ürünler</span>
          <Link to={activeBestsellerTab.to}>Tümünü Gör</Link>
        </div>
        <div className="pasaj-bestseller-grid">
          {isLoading
            ? loadingCards.map((_, index) => (
                <article className="pasaj-bestseller-card" key={`best-${index}`}>
                  <Skeleton active paragraph={{ rows: 7 }} />
                </article>
              ))
            : bestsellerProducts.map((product) => (
                <BestsellerPhoneCard
                  product={product}
                  key={`best-${product.id}`}
                  isFavorite={favoriteSlugSet.has(product.slug)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
        </div>
      </section>

      <section className="brands-section">
        <div className="pasaj-section-header with-action">
          <Typography.Title level={2}>Popüler Markalar</Typography.Title>
          <Button className="soft-pill-button">Tümü</Button>
        </div>
        <div className="brand-card-grid">
          {popularBrands.map((brand) => (
            <article key={brand.name} className="brand-card">
              <img src={brand.image} alt={brand.name} className="brand-card-image" />
            </article>
          ))}
        </div>
      </section>

      <section className="brand-directory-section">
        <div className="pasaj-section-header centered-title">
          <Typography.Title level={2}>Markalar</Typography.Title>
        </div>
        <div className="directory-filters">
          <button type="button" className="circle-nav-button">
            <LeftOutlined />
          </button>
          <div className="filter-pills">
            <span className="filter-pill active">Popüler Markalar</span>
            <span className="filter-pill">Tümü</span>
            <span className="filter-pill">Diğer</span>
            <span className="filter-pill">A</span>
            <span className="filter-pill">B</span>
            <span className="filter-pill">C</span>
            <span className="filter-pill">D</span>
            <span className="filter-pill">E</span>
            <span className="filter-pill">F</span>
            <span className="filter-pill">G</span>
          </div>
          <button type="button" className="circle-nav-button">
            <RightOutlined />
          </button>
        </div>
        <div className="directory-filters second-row">
          <button type="button" className="circle-nav-button">
            <LeftOutlined />
          </button>
          <div className="filter-pills category-pills">
            <span className="filter-pill active">Tümü</span>
            <span className="filter-pill">Cep Telefonu-Aksesuar</span>
            <span className="filter-pill">Bilgisayar-Tablet</span>
            <span className="filter-pill">Elektrikli Ev Aletleri</span>
            <span className="filter-pill">Sağlık-Kişisel Bakım</span>
            <span className="filter-pill">Hobi-Oyun</span>
            <span className="filter-pill">TV-Ses Sistemleri</span>
          </div>
          <button type="button" className="circle-nav-button">
            <RightOutlined />
          </button>
        </div>
        <div className="brand-directory-grid">
          {popularBrands.map((brand) => (
            <article key={`directory-${brand.name}`} className="brand-directory-card">
              <img src={brand.image} alt={brand.name} className="brand-directory-image" />
              <span>{brandCounts[brand.name] ?? 50} Ürün</span>
            </article>
          ))}
        </div>
      </section>

      <section className="bottom-spacer" />
    </div>
  );
};

