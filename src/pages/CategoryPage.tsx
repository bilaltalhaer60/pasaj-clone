import { useEffect, useMemo, useState } from "react";
import { HeartFilled, HeartOutlined, RightOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Empty, Select, Skeleton, Slider, Tag, Typography } from "antd";
import { Link, useParams } from "react-router-dom";
import { getProductsByCategory } from "../services/productService";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../types/product";
import { toCategoryTitle } from "../utils/catalog";
import { formatCurrency } from "../utils/formatCurrency";

const sortOptions = [
  { value: "popular", label: "En çok satanlar" },
  { value: "price-asc", label: "Fiyat artan" },
  { value: "price-desc", label: "Fiyat azalan" }
];

const titleBySlug: Record<string, string> = {
  telefon: "Cep Telefonu-Aksesuar",
  bilgisayar: "Bilgisayar-Tablet",
  aksesuar: "Aksesuar"
};

const ProductListCard = ({
  product,
  isFavorite,
  onAddToCart,
  onToggleFavorite
}: {
  product: Product;
  isFavorite: boolean;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (product: Product) => void;
}) => (
  <article className="pasaj-list-product-card">
    <button
      type="button"
      className={`pasaj-list-favorite ${isFavorite ? "active" : ""}`}
      aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={isFavorite}
      onClick={() => onToggleFavorite(product)}
    >
      {isFavorite ? <HeartFilled /> : <HeartOutlined />}
    </button>
    <Link to={`/product/${product.slug}`} className="pasaj-list-image-wrap">
      <img src={product.image} alt={product.name} className="pasaj-list-image" />
    </Link>
    <div className="pasaj-list-card-body">
      <div className="pasaj-list-badges">
        {product.badge ? <Tag color="blue">{product.badge}</Tag> : null}
        <Tag>{product.brand}</Tag>
      </div>
      <Link to={`/product/${product.slug}`} className="pasaj-list-title">
        {product.name}
      </Link>
      <p className="pasaj-list-summary">{product.summary}</p>
      <div className="pasaj-list-chip-row">
        <span>Sepette avantaj</span>
        <span>Ücretsiz Kargo</span>
      </div>
      <div className="pasaj-list-price-row">
        {product.previousPrice > product.price ? (
          <span className="pasaj-list-old-price">{formatCurrency(product.previousPrice)}</span>
        ) : null}
        {product.discount > 0 ? (
          <span className="pasaj-list-discount">%{product.discount} İndirim</span>
        ) : null}
      </div>
      <strong className="pasaj-list-price">{formatCurrency(product.price)}</strong>
      <div className="pasaj-list-actions">
        <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => onAddToCart(product)}>
          Sepete Ekle
        </Button>
        <Button>
          <Link to={`/product/${product.slug}`}>Detay</Link>
        </Button>
      </div>
    </div>
  </article>
);

export const CategoryPage = () => {
  const { categorySlug } = useParams();
  const [range, setRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState("popular");
  const addItem = useCartStore((state) => state.addItem);
  const favoriteSlugs = useAuthStore((state) => state.user?.favorites ?? []);
  const toggleFavorite = useAuthStore((state) => state.toggleFavorite);
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["products", categorySlug],
    queryFn: () => getProductsByCategory(categorySlug ?? ""),
    enabled: Boolean(categorySlug)
  });
  const categoryTitle = titleBySlug[categorySlug ?? ""] ?? toCategoryTitle(categorySlug ?? "Kategori");
  const minPrice = data.length > 0 ? Math.min(...data.map((product) => product.price)) : 0;
  const maxPrice = data.length > 0 ? Math.max(...data.map((product) => product.price)) : 100000;
  const brands = useMemo(() => [...new Set(data.map((product) => product.brand))], [data]);
  const favoriteSlugSet = useMemo(() => new Set(favoriteSlugs), [favoriteSlugs]);

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const handleToggleFavorite = (product: Product) => {
    toggleFavorite(product.slug);
  };

  useEffect(() => {
    setRange([minPrice, maxPrice]);
  }, [maxPrice, minPrice]);

  const filteredProducts = useMemo(() => {
    const scoped = data.filter(
      (product) => product.price >= range[0] && product.price <= range[1]
    );

    return [...scoped].sort((left, right) => {
      if (sortBy === "price-asc") {
        return left.price - right.price;
      }

      if (sortBy === "price-desc") {
        return right.price - left.price;
      }

      return right.popularity - left.popularity;
    });
  }, [data, range, sortBy]);

  return (
    <main className="pasaj-category-page">
      <nav className="pasaj-breadcrumb" aria-label="Kategori yolu">
        <Link to="/">Pasaj</Link>
        <RightOutlined />
        <span>{categoryTitle}</span>
      </nav>

      <section className="pasaj-category-heading">
        <div>
          <Typography.Title level={1}>{categoryTitle}</Typography.Title>
          <p>{filteredProducts.length} ürün listeleniyor</p>
        </div>
        <Select
          value={sortBy}
          options={sortOptions}
          onChange={setSortBy}
          className="pasaj-category-sort"
        />
      </section>

      <div className="pasaj-category-layout">
        <aside className="pasaj-filter-sidebar">
          <section className="pasaj-filter-block">
            <Typography.Title level={5}>Fiyat araligi</Typography.Title>
            <Slider
              range
              min={minPrice}
              max={maxPrice}
              value={range}
              onChange={(value) => setRange(value as [number, number])}
            />
            <div className="pasaj-filter-price-row">
              <span>{formatCurrency(range[0])}</span>
              <span>{formatCurrency(range[1])}</span>
            </div>
          </section>

          <section className="pasaj-filter-block">
            <Typography.Title level={5}>Marka</Typography.Title>
            <div className="pasaj-filter-tag-list">
              {brands.map((brand) => (
                <Tag key={brand}>{brand}</Tag>
              ))}
            </div>
          </section>

          <section className="pasaj-filter-block">
            <Typography.Title level={5}>Teslimat</Typography.Title>
            <label><input type="checkbox" defaultChecked /> Ücretsiz Kargo</label>
            <label><input type="checkbox" /> Hızlı Teslimat</label>
          </section>
        </aside>

        <section className="pasaj-category-results">
          {error ? (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              message={error instanceof Error ? error.message : "Ürünler yüklenirken bir hata oluştu."}
            />
          ) : null}

          {isLoading ? (
            <div className="pasaj-list-grid">
              {Array.from({ length: 6 }).map((_, index) => (
                <article className="pasaj-list-product-card" key={index}>
                  <Skeleton active paragraph={{ rows: 8 }} />
                </article>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="pasaj-category-empty">
              <Empty description="Bu filtreye uygun ürün bulunamadı." />
            </div>
          ) : (
            <div className="pasaj-list-grid">
              {filteredProducts.map((product) => (
                <ProductListCard
                  key={product.id}
                  product={product}
                  isFavorite={favoriteSlugSet.has(product.slug)}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

