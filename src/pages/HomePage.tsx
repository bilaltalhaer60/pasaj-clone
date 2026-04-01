import { ClockCircleOutlined, FireOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Card, Col, Rate, Row, Skeleton, Space, Statistic, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { PageShell } from "../app/page-shell";
import { isFirebaseReady } from "../config/firebase";
import { campaignCards, categoryCards, heroSlides, trustHighlights } from "../data/home";
import { getFeaturedProducts } from "../services/productService";

export const HomePage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featured-products"],
    queryFn: getFeaturedProducts
  });

  const campaignDeadline = dayjs().add(3, "day").format("DD MMMM");

  return (
    <PageShell
      badge="2. Hafta Teslimi"
      title="Anasayfa hero ve vitrin yapisi"
      description="Dokumandaki 2. hafta kapsamini baz alarak hero carousel, kategori gecisleri, kampanya kartlari, one cikan urunler ve guven bolumleri eklendi."
      nextTargets={[
        { label: "Kategoriye Git", to: "/category/telefon" },
        { label: "Urun Detaya Git", to: "/product/iphone-16-pro" }
      ]}
    >
      <section className="home-hero-section">
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop
          className="hero-swiper"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="hero-slide" style={{ background: slide.accent }}>
                <div className="hero-copy">
                  <Tag color="gold">{slide.eyebrow}</Tag>
                  <Typography.Title level={2} className="hero-title">
                    {slide.title}
                  </Typography.Title>
                  <Typography.Paragraph className="hero-description">
                    {slide.description}
                  </Typography.Paragraph>
                  <Space wrap>
                    <Button type="primary" size="large">
                      <Link to={slide.ctaTo}>{slide.ctaLabel}</Link>
                    </Button>
                    <Button size="large" ghost>
                      <Link to="/cart">Sepete git</Link>
                    </Button>
                  </Space>
                </div>
                <div className="hero-stats">
                  {slide.stats.map((stat) => (
                    <Card key={stat.label} className="hero-stat-card">
                      <Statistic title={stat.label} value={stat.value} />
                    </Card>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="shipping-strip">
        <div className="shipping-chip">
          <ThunderboltOutlined />
          <span>Ayni gun kargo secenekleri</span>
        </div>
        <div className="shipping-chip">
          <FireOutlined />
          <span>Geceye ozel kampanyalar</span>
        </div>
        <div className="shipping-chip">
          <ClockCircleOutlined />
          <span>Kampanya bitisi: {campaignDeadline}</span>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <Typography.Title level={3}>Hizli kategori gecisleri</Typography.Title>
          <Typography.Paragraph>
            Kategori kartlari ilgili dynamic route yapisina bagli.
          </Typography.Paragraph>
        </div>
        <Row gutter={[16, 16]}>
          {categoryCards.map((category) => (
            <Col xs={24} sm={12} xl={6} key={category.title}>
              <Link to={category.to}>
                <Card className="category-card" style={{ background: category.accent }}>
                  <Typography.Title level={4}>{category.title}</Typography.Title>
                  <Typography.Paragraph>{category.description}</Typography.Paragraph>
                  <span className="inline-link">Listeyi ac</span>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </section>

      <section>
        <div className="section-heading">
          <Typography.Title level={3}>Kampanya vitrinleri</Typography.Title>
          <Typography.Paragraph>
            Hero altinda promosyon kutulari ve listeye yonlendiren aksiyonlar bulunuyor.
          </Typography.Paragraph>
        </div>
        <Row gutter={[16, 16]}>
          {campaignCards.map((campaign) => (
            <Col xs={24} md={8} key={campaign.title}>
              <Link to={campaign.to}>
                <Card className="campaign-card" style={{ backgroundColor: campaign.accent }}>
                  <Tag>{campaign.tag}</Tag>
                  <Typography.Title level={4} className="campaign-title">
                    {campaign.title}
                  </Typography.Title>
                  <Typography.Paragraph className="campaign-description">
                    {campaign.description}
                  </Typography.Paragraph>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </section>

      <section>
        <div className="section-heading">
          <Typography.Title level={3}>One cikan urunler</Typography.Title>
          <Typography.Paragraph>
            Bu alan React Query ile Firestore uzerinden gelen urunleri listeliyor.
          </Typography.Paragraph>
        </div>
        {!isFirebaseReady ? (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message="Firebase baglantisi hazir degil. .env dosyasini doldurup Firestore icindeki products koleksiyonunu tanimlaman gerekiyor."
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
        <Row gutter={[16, 16]}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Col xs={24} md={12} xl={6} key={index}>
                  <Card className="product-card">
                    <Skeleton active paragraph={{ rows: 4 }} />
                  </Card>
                </Col>
              ))
            : data?.map((product) => (
                <Col xs={24} md={12} xl={6} key={product.id}>
                  <Link to={`/product/${product.slug}`}>
                    <Card className="product-card">
                      <Tag color="blue">{product.badge}</Tag>
                      <Typography.Paragraph className="product-brand">
                        {product.brand}
                      </Typography.Paragraph>
                      <Typography.Title level={5}>{product.name}</Typography.Title>
                      <Space direction="vertical" size={6}>
                        <Rate allowHalf disabled defaultValue={product.rating} />
                        <Typography.Text type="secondary">
                          {product.rating} puan - {product.reviewCount} yorum
                        </Typography.Text>
                        <Typography.Title level={4} className="product-price">
                          {product.price.toLocaleString("tr-TR")} TL
                        </Typography.Title>
                        <Typography.Text delete type="secondary">
                          {product.previousPrice.toLocaleString("tr-TR")} TL
                        </Typography.Text>
                      </Space>
                    </Card>
                  </Link>
                </Col>
              ))}
        </Row>
      </section>

      <section className="trust-section">
        <div className="section-heading">
          <Typography.Title level={3}>Anasayfa kontrol listesi</Typography.Title>
          <Typography.Paragraph>
            Dokumandaki zorunlu maddelerin bu hafta icin karsilanan kismi.
          </Typography.Paragraph>
        </div>
        <Row gutter={[16, 16]}>
          {trustHighlights.map((item) => (
            <Col xs={24} md={12} key={item}>
              <Card className="trust-card">
                <Typography.Paragraph>{item}</Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </PageShell>
  );
};
