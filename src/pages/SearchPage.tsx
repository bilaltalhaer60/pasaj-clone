import { HeartFilled, HeartOutlined, RightOutlined, SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Empty, Skeleton, Tag, Typography } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import type { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";

const emptyFavoriteSlugs: string[] = [];

const normalizeSearchText = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const SearchProductCard = ({
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
  <article className="pasaj-search-product-card">
    <button
      type="button"
      className={`pasaj-list-favorite ${isFavorite ? "active" : ""}`}
      aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={isFavorite}
      onClick={() => onToggleFavorite(product)}
    >
      {isFavorite ? <HeartFilled /> : <HeartOutlined />}
    </button>
    <Link to={`/product/${product.slug}`} className="pasaj-search-product-image">
      <img src={product.image} alt={product.name} />
    </Link>
    <div className="pasaj-search-product-copy">
      <div className="pasaj-search-badges">
        <Tag>{product.brand}</Tag>
        {product.badge ? <Tag color="blue">{product.badge}</Tag> : null}
      </div>
      <Link to={`/product/${product.slug}`} className="pasaj-search-product-title">
        {product.name}
      </Link>
      <p>{product.summary}</p>
      <div className="pasaj-search-price-row">
        {product.previousPrice > product.price ? <span>{formatCurrency(product.previousPrice)}</span> : null}
        {product.discount > 0 ? <em>%{product.discount} İndirim</em> : null}
      </div>
      <strong>{formatCurrency(product.price)}</strong>
      <div className="pasaj-search-actions">
        <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => onAddToCart(product)}>
          Sepete Ekle
        </Button>
        <Button>
          <Link to={`/product/${product.slug}`}>İncele</Link>
        </Button>
      </div>
    </div>
  </article>
);

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const addItem = useCartStore((state) => state.addItem);
  const favoriteSlugs = useAuthStore((state) => state.user?.favorites ?? emptyFavoriteSlugs);
  const toggleFavorite = useAuthStore((state) => state.toggleFavorite);
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["products", "search"],
    queryFn: getAllProducts
  });
  const normalizedQuery = normalizeSearchText(query);
  const favoriteSlugSet = new Set(favoriteSlugs);
  const filteredProducts = normalizedQuery
    ? data.filter((product) => {
        const searchable = normalizeSearchText(
          [product.name, product.brand, product.category, product.summary, product.badge].join(" ")
        );

        return searchable.includes(normalizedQuery);
      })
    : [];

  return (
    <main className="pasaj-search-page">
      <nav className="pasaj-breadcrumb" aria-label="Arama yolu">
        <Link to="/">Pasaj</Link>
        <RightOutlined />
        <span>Arama Sonuçları</span>
      </nav>

      <section className="pasaj-search-heading">
        <div className="pasaj-search-heading-icon">
          <SearchOutlined />
        </div>
        <div>
          <Typography.Title level={1}>Arama Sonuçları</Typography.Title>
          <p>
            {query
              ? `"${query}" araması için ${filteredProducts.length} ürün listeleniyor.`
              : "Ürün, marka veya kategori aramak için üstteki arama alanını kullanın."}
          </p>
        </div>
      </section>

      {error ? (
        <Alert
          type="warning"
          showIcon
          className="pasaj-search-alert"
          message="Arama sonuçları yüklenirken bir sorun oluştu."
        />
      ) : null}

      {isLoading ? (
        <div className="pasaj-search-results">
          {Array.from({ length: 4 }).map((_, index) => (
            <article className="pasaj-search-product-card" key={index}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </article>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="pasaj-search-empty">
          <Empty
            description={
              query
                ? "Bu aramaya uygun ürün bulunamadı. Farklı bir marka veya kategori deneyebilirsiniz."
                : "Arama yapmak için ürün, marka veya kategori adı yazın."
            }
          />
        </div>
      ) : (
        <div className="pasaj-search-results">
          {filteredProducts.map((product) => (
            <SearchProductCard
              key={product.id}
              product={product}
              isFavorite={favoriteSlugSet.has(product.slug)}
              onAddToCart={addItem}
              onToggleFavorite={(item) => toggleFavorite(item.slug)}
            />
          ))}
        </div>
      )}
    </main>
  );
};
