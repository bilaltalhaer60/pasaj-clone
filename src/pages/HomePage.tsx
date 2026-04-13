import {
  GiftOutlined,
  HeartOutlined,
  LeftOutlined,
  RightOutlined,
  StarOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, Col, Row, Skeleton, Typography } from "antd";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
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
import type { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";

const featureIcons = [GiftOutlined, StarOutlined, StarOutlined, UserOutlined];
const loadingCards = Array.from({ length: 5 });
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

const ProductCard = ({ product, bestseller = false }: { product: Product; bestseller?: boolean }) => (
  <Card className="pasaj-shelf-card">
    {bestseller ? <span className="best-badge">Cok Satan</span> : null}
    <button type="button" className="favorite-button" aria-label="Favorilere ekle">
      <HeartOutlined />
    </button>
    <div className="shelf-product-image-wrap">
      <img src={product.image} alt={product.name} className="shelf-product-image" />
    </div>
    <div className="variant-dots">• • •</div>
    <Typography.Paragraph className="shelf-product-title">{product.name}</Typography.Paragraph>
    <div className="product-chip-row">
      <span className="product-chip">Pasaj Limitinle Ode</span>
      <span className="product-chip">Ucretsiz Kargo</span>
    </div>
    <div className="shelf-price-row">
      {product.previousPrice > 0 ? <span className="old-price">{formatCurrency(product.previousPrice)}</span> : null}
      {product.discount > 0 ? <span className="discount-text">{product.discount}.000 TL Indirim</span> : null}
    </div>
    <div className="current-price">{formatCurrency(product.price)}</div>
  </Card>
);

export const HomePage = () => {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts
  });

  const featuredProducts = data.slice(0, 5);
  const bestsellerProducts = data.slice(0, 5);

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
          <Typography.Title level={2}>Sana Ozel Urunler</Typography.Title>
        </div>
        {error ? (
          <Alert
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
            message={error instanceof Error ? error.message : "Urunler yuklenirken hata olustu."}
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
                  <ProductCard product={product} />
                </Col>
              ))}
        </Row>
      </section>

      <section className="campaign-grid-section">
        <div className="pasaj-section-header with-action">
          <Typography.Title level={2}>Kampanyalar</Typography.Title>
          <Button className="soft-pill-button">Tumu</Button>
        </div>
        <div className="campaign-image-grid">
          {campaignTiles.map((tile) => (
            <Link key={tile.id} to="/" className="campaign-image-link">
              <img src={tile.image} alt={tile.alt} className="campaign-image" />
            </Link>
          ))}
        </div>
      </section>

      <section className="product-rack-section bestseller-section">
        <div className="pasaj-section-header">
          <Typography.Title level={2}>Cok Satanlar</Typography.Title>
        </div>
        <div className="bestseller-tabs">
          <span className="active">Cep Telefonu-Aksesuar</span>
          <span>Bilgisayar-Tablet</span>
          <span>Elektrikli Ev Aletleri</span>
          <span>Saglik-Kisisel Bakim</span>
          <span>Hobi-Oyun</span>
          <span>TV-Ses Sistemleri</span>
          <span>Ev-Yasam</span>
        </div>
        <Row gutter={[24, 24]}>
          {isLoading
            ? loadingCards.map((_, index) => (
                <Col xs={24} sm={12} lg={8} xl={4} key={`best-${index}`}>
                  <Card className="pasaj-shelf-card">
                    <Skeleton active paragraph={{ rows: 5 }} />
                  </Card>
                </Col>
              ))
            : bestsellerProducts.map((product) => (
                <Col xs={24} sm={12} lg={8} xl={4} key={`best-${product.id}`}>
                  <ProductCard product={product} bestseller />
                </Col>
              ))}
        </Row>
      </section>

      <section className="brands-section">
        <div className="pasaj-section-header with-action">
          <Typography.Title level={2}>Populer Markalar</Typography.Title>
          <Button className="soft-pill-button">Tumu</Button>
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
            <span className="filter-pill active">Populer Markalar</span>
            <span className="filter-pill">Tumu</span>
            <span className="filter-pill">Diger</span>
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
            <span className="filter-pill active">Tumu</span>
            <span className="filter-pill">Cep Telefonu-Aksesuar</span>
            <span className="filter-pill">Bilgisayar-Tablet</span>
            <span className="filter-pill">Elektrikli Ev Aletleri</span>
            <span className="filter-pill">Saglik-Kisisel Bakim</span>
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
              <span>{brandCounts[brand.name] ?? 50} Urun</span>
            </article>
          ))}
        </div>
      </section>

      <section className="bottom-spacer" />
    </div>
  );
};
