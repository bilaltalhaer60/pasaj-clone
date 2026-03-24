import { Button, Card, Carousel, Col, Row, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { featuredProducts, homeBanners } from '../../mocks/products';
import { formatCurrency } from '../../utils/formatCurrency';
import { categories } from '../../utils/constants';

export function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero-section container">
        <Carousel autoplay dots>
          {homeBanners.map((banner) => (
            <div key={banner.id}>
              <article className="hero-banner" style={{ background: banner.background }}>
                <div>
                  <Typography.Text className="hero-eyebrow">{banner.badge}</Typography.Text>
                  <Typography.Title>{banner.title}</Typography.Title>
                  <Typography.Paragraph>{banner.description}</Typography.Paragraph>
                  <Button type="primary" size="large">
                    {banner.cta}
                  </Button>
                </div>
              </article>
            </div>
          ))}
        </Carousel>
      </section>

      <section className="container">
        <div className="section-header">
          <Typography.Title level={3}>Kategoriler</Typography.Title>
          <Typography.Text>1. hafta teslimi için temel yönlendirme kartları</Typography.Text>
        </div>
        <Row gutter={[16, 16]}>
          {categories.map((category) => (
            <Col xs={12} md={8} lg={4} key={category.slug}>
              <Link to={`/category/${category.slug}`}>
                <Card className="category-card" hoverable>
                  <span className="category-icon">{category.icon}</span>
                  <Typography.Title level={5}>{category.name}</Typography.Title>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </section>

      <section className="container">
        <div className="section-header">
          <Typography.Title level={3}>Öne Çıkan Ürünler</Typography.Title>
          <Typography.Text>Mock veri ile beslenen ürün vitrin alanı</Typography.Text>
        </div>
        <Row gutter={[16, 16]}>
          {featuredProducts.map((product) => (
            <Col xs={24} md={12} lg={8} key={product.id}>
              <Card className="product-card" cover={<img src={product.image} alt={product.name} />}>
                <Tag color="gold">%{product.discount} indirim</Tag>
                <Typography.Title level={5}>{product.name}</Typography.Title>
                <Typography.Paragraph>{product.brand}</Typography.Paragraph>
                <Typography.Title level={4}>{formatCurrency(product.price)}</Typography.Title>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
}
