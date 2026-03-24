import { Breadcrumb, Card, Col, Empty, Row, Select, Slider, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { allProducts } from '../../mocks/products';
import { formatCurrency } from '../../utils/formatCurrency';

const sortOptions = [
  { value: 'popular', label: 'En Çok Satanlar' },
  { value: 'price-asc', label: 'Fiyat Artan' },
  { value: 'price-desc', label: 'Fiyat Azalan' },
];

export function ProductListPage() {
  const { categorySlug } = useParams();
  const [range, setRange] = useState<[number, number]>([5000, 90000]);
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = useMemo(() => {
    const scoped = allProducts.filter(
      (product) =>
        product.category === categorySlug &&
        product.price >= range[0] &&
        product.price <= range[1],
    );

    return [...scoped].sort((left, right) => {
      if (sortBy === 'price-asc') {
        return left.price - right.price;
      }

      if (sortBy === 'price-desc') {
        return right.price - left.price;
      }

      return right.popularity - left.popularity;
    });
  }, [categorySlug, range, sortBy]);

  return (
    <div className="container page-stack category-page">
      <Breadcrumb items={[{ title: 'Ana Sayfa' }, { title: categorySlug ?? 'Kategori' }]} />
      <div className="section-header split-header">
        <div>
          <Typography.Title level={2}>{categorySlug}</Typography.Title>
          <Typography.Text>Filtre ve sıralama iskeleti hazır.</Typography.Text>
        </div>
        <Select value={sortBy} options={sortOptions} onChange={setSortBy} style={{ width: 220 }} />
      </div>
      <div className="category-layout">
        <aside className="filter-panel">
          <Typography.Title level={5}>Fiyat Aralığı</Typography.Title>
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
          {filteredProducts.length === 0 ? (
            <Empty description="Bu filtrelere uygun ürün bulunamadı" />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredProducts.map((product) => (
                <Col xs={24} md={12} xl={8} key={product.id}>
                  <Card className="product-card" cover={<img src={product.image} alt={product.name} />}>
                    <Typography.Title level={5}>{product.name}</Typography.Title>
                    <Typography.Paragraph>{product.brand}</Typography.Paragraph>
                    <Typography.Title level={4}>{formatCurrency(product.price)}</Typography.Title>
                    <Tag color="blue">Stokta</Tag>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </section>
      </div>
    </div>
  );
}
