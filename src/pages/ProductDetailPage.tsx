import { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  HeartFilled,
  HeartOutlined,
  InfoCircleOutlined,
  RightOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TruckOutlined
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Descriptions, Rate, Skeleton, Tag, Typography } from "antd";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../services/productService";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";

const memoryOptions = ["128 GB", "256 GB", "512 GB"];
const emptyFavoriteSlugs: string[] = [];

const galleryBySlug: Record<string, string[]> = {
  "iphone-17-256-gb": [
    "/pasaj/products/iphone-17-main.webp",
    "/pasaj/products/iphone-17-box.webp"
  ],
  "macbook-air-m4-13": ["/pasaj/products/macbook-air-main.webp"],
  "macbook-air-m4": ["/pasaj/products/macbook-air-main.webp"]
};

const getMemoryValue = (name: string) =>
  memoryOptions.find((option) => name.includes(option)) ?? "256 GB";

const getColorMeta = (category: string) =>
  category === "telefon"
    ? { name: "Siyah", style: { background: "#1d2229" } }
    : { name: "Gümüş", style: { background: "#d8dde2" } };

const ProductVisual = ({ image, name }: { image: string; name: string }) => (
  <img src={image} alt={name} className="pasaj-product-real-image" />
);

export const ProductDetailPage = () => {
  const { productSlug } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const favoriteSlugs = useAuthStore((state) => state.user?.favorites ?? emptyFavoriteSlugs);
  const toggleFavorite = useAuthStore((state) => state.toggleFavorite);
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productSlug],
    queryFn: () => getProductBySlug(productSlug),
    enabled: Boolean(productSlug)
  });

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [productSlug]);

  if (isLoading) {
    return (
      <main className="pasaj-product-detail-page">
        <Skeleton active paragraph={{ rows: 14 }} />
      </main>
    );
  }

  if (error) {
    return (
      <main className="pasaj-product-detail-page">
        <Alert
          type="error"
          showIcon
          message={error instanceof Error ? error.message : "Ürün yüklenirken beklenmeyen bir hata oluştu."}
        />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pasaj-product-detail-page">
        <Alert type="warning" showIcon message="İstenen ürün bulunamadı." />
      </main>
    );
  }

  const galleryImages = galleryBySlug[product.slug] ?? [product.image];
  const selectedImage = galleryImages[selectedImageIndex] ?? galleryImages[0] ?? product.image;
  const isPhone = product.category === "telefon";
  const categoryTitle = isPhone ? "Cep Telefonu-Aksesuar" : "Bilgisayar-Tablet";
  const brandCategoryTitle = isPhone ? `${product.brand} Telefonlar` : `${product.brand} MacBook`;
  const variantLabel = isPhone ? "DAHİLİ HAFIZA" : "DEPOLAMA";
  const variantValue = isPhone ? getMemoryValue(product.name) : "512 GB SSD";
  const colorMeta = getColorMeta(product.category);
  const discountRate =
    product.previousPrice > product.price
      ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
      : product.discount;
  const isFavorite = favoriteSlugs.includes(product.slug);
  const monthlyPrice = Math.ceil(product.price / 3);
  const sellerName = "Turkcell Satış A.Ş.";

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.slug);
  };

  return (
    <main className="pasaj-product-detail-page">
      <nav className="pasaj-breadcrumb" aria-label="Ürün yolu">
        <Link to="/">Pasaj</Link>
        <RightOutlined />
        <Link to={`/category/${product.category}`}>{categoryTitle}</Link>
        <RightOutlined />
        <Link to={`/category/${product.category}`}>{brandCategoryTitle}</Link>
        <RightOutlined />
        <span>{product.name}</span>
      </nav>

      <section className="pasaj-product-hero">
        <div className="pasaj-product-gallery">
          {discountRate > 0 ? <span className="pasaj-gallery-campaign">%{discountRate} indirim</span> : null}
          <div className="pasaj-gallery-thumb-list">
            {galleryImages.map((image, index) => (
              <button
                type="button"
                key={image}
                className={`pasaj-gallery-thumb ${selectedImageIndex === index ? "active" : ""}`}
                aria-label={`${product.name} görsel ${index + 1}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <ProductVisual image={image} name={product.name} />
              </button>
            ))}
          </div>
          <div className="pasaj-product-stage">
            <ProductVisual image={selectedImage} name={product.name} />
          </div>
        </div>

        <div className="pasaj-product-summary">
          <div className="pasaj-title-row">
            <div>
              <Typography.Title level={1}>{product.name}</Typography.Title>
            </div>
            <button
              type="button"
              className={`pasaj-favorite-detail ${isFavorite ? "active" : ""}`}
              aria-label={isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
              aria-pressed={isFavorite}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? <HeartFilled /> : <HeartOutlined />}
            </button>
          </div>

          <div className="pasaj-rating-row">
            <Rate allowHalf disabled value={product.rating} />
            <span className="pasaj-rating-score">{product.rating.toLocaleString("tr-TR")}</span>
            <Link to="#reviews">{product.reviewCount} Değerlendirme</Link>
          </div>

          <div className="pasaj-variant-grid">
            <button type="button" className="pasaj-variant-card active">
              <span>RENK</span>
              <strong>
                <i className="pasaj-color-dot" style={colorMeta.style} /> {colorMeta.name}
              </strong>
            </button>
            <button type="button" className="pasaj-variant-card active">
              <span>{variantLabel}</span>
              <strong>{variantValue}</strong>
            </button>
          </div>

          <aside className="pasaj-buy-box">
            <div className="pasaj-seller-row">
              <span>Satıcı:</span>
              <strong>{sellerName}</strong>
            </div>

            <div className="pasaj-price-panel">
              <div>
                {product.previousPrice > product.price ? (
                  <span className="pasaj-old-price">{formatCurrency(product.previousPrice)}</span>
                ) : null}
                {discountRate > 0 ? <span className="pasaj-discount">%{discountRate} İndirim</span> : null}
              </div>
              <strong>{formatCurrency(product.price)}</strong>
            </div>

            <div className="pasaj-stock-note">
              <span>Ürün tükenmek üzere</span>
              <small>Sepette ve ödeme adımında teslimat seçeneği güncellenebilir.</small>
            </div>

            <div className="pasaj-buy-actions">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
              >
                Sepete Ekle
              </Button>
              <Button size="large">
                <Link to="/checkout">Hemen Al</Link>
              </Button>
            </div>

            <div className="pasaj-service-row">
              <span><CheckCircleOutlined /> 1 İş Gününde Kargoda</span>
              <span><TruckOutlined /> Ücretsiz Kargo</span>
            </div>

            <div className="pasaj-buy-footer">
              <Link to="#questions">{product.reviewCount} Soru & Cevap</Link>
              <Link to={`/category/${product.category}`}>Diğer Satıcılar (10)</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="pasaj-payment-methods">
        <Typography.Title level={2}>Alternatif Ödeme Yöntemleri</Typography.Title>
        <div className="pasaj-payment-grid">
          <article className="pasaj-payment-feature">
            <div className="pasaj-payment-check">
              <CheckCircleOutlined />
            </div>
            <div>
              <strong>Turkcell Faturanıza Ek</strong>
              <span>Kredi sorgulama sonucunuza göre tutarlar değişiklik gösterebilir.</span>
            </div>
            <b>{formatCurrency(monthlyPrice)} x 3 AY</b>
          </article>
          <article>
            <CreditCardOutlined />
            <strong>Kredi Kartı</strong>
            <span>Seçili bankalarda peşin fiyatına taksit fırsatları.</span>
          </article>
          <article>
            <ShopOutlined />
            <strong>Hızlı Teslimat</strong>
            <span>{product.shippingNote}</span>
          </article>
        </div>
      </section>

      <section className="pasaj-detail-tabs">
        <div className="pasaj-detail-tab-list">
          <button type="button">Ürün Açıklamaları</button>
          <button type="button" className="active">Ürün Özellikleri</button>
          <button type="button" id="reviews">Değerlendirmeler</button>
          <button type="button" id="questions">Soru & Cevap</button>
          <button type="button">Kredi Kartı Taksit Seçenekleri</button>
        </div>
        <div className="pasaj-detail-content">
          <div>
            <Typography.Title level={3}>Öne Çıkan Özellikler</Typography.Title>
            <div className="pasaj-highlight-list">
              {product.highlights.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </div>
            <div className="pasaj-discount-info">
              <InfoCircleOutlined />
              <span>İndirim ve stok bilgileri ürün bazında değişiklik gösterebilir.</span>
            </div>
          </div>
          <Descriptions column={1} bordered>
            {product.specs.map((spec) => (
              <Descriptions.Item key={spec.label} label={spec.label}>
                {spec.value}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      </section>
    </main>
  );
};

