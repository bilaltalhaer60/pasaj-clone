import { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  TruckOutlined
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, Descriptions, Rate, Skeleton, Tag, Typography } from "antd";
import { Link, useParams } from "react-router-dom";
import { getProductBySlug } from "../services/productService";
import { useCartStore } from "../store/cartStore";
import { formatCurrency } from "../utils/formatCurrency";

const memoryOptions = ["128 GB", "256 GB", "512 GB"];

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

const ProductVisual = ({ image, name }: { image: string; name: string }) => (
  <img src={image} alt={name} className="pasaj-product-real-image" />
);

export const ProductDetailPage = () => {
  const { productSlug } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
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
          message={error instanceof Error ? error.message : "Urun yuklenirken beklenmeyen bir hata olustu."}
        />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pasaj-product-detail-page">
        <Alert type="warning" showIcon message="Istenen urun bulunamadi." />
      </main>
    );
  }

  const galleryImages = galleryBySlug[product.slug] ?? [product.image];
  const selectedImage = galleryImages[selectedImageIndex] ?? galleryImages[0] ?? product.image;
  const isPhone = product.category === "telefon";
  const categoryTitle = isPhone ? "Cep Telefonu-Aksesuar" : "Bilgisayar-Tablet";
  const brandCategoryTitle = isPhone ? `${product.brand} Telefonlar` : `${product.brand} MacBook`;
  const variantLabel = isPhone ? "DAHILI HAFIZA" : "DEPOLAMA";
  const variantValue = isPhone ? getMemoryValue(product.name) : "512 GB SSD";
  const colorName = isPhone ? "Yesil" : "Gumus";
  const colorStyle = { background: isPhone ? "#c6d2aa" : "#d8dde2" };
  const discountRate =
    product.previousPrice > product.price
      ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
      : product.discount;

  return (
    <main className="pasaj-product-detail-page">
      <nav className="pasaj-breadcrumb" aria-label="Urun yolu">
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
          <div className="pasaj-gallery-thumb-list">
            {galleryImages.map((image, index) => (
              <button
                type="button"
                key={image}
                className={`pasaj-gallery-thumb ${selectedImageIndex === index ? "active" : ""}`}
                aria-label={`${product.name} gorsel ${index + 1}`}
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
              <Typography.Text className="pasaj-product-brand">{product.brand}</Typography.Text>
              <Typography.Title level={1}>{product.name}</Typography.Title>
            </div>
            <button type="button" className="pasaj-favorite-detail" aria-label="Favorilere ekle">
              <HeartOutlined />
            </button>
          </div>

          <div className="pasaj-rating-row">
            <Rate allowHalf disabled value={product.rating} />
            <span className="pasaj-rating-score">{product.rating.toLocaleString("tr-TR")}</span>
          </div>

          <div className="pasaj-variant-grid">
            <button type="button" className="pasaj-variant-card active">
              <span>RENK</span>
              <strong>
                <i className="pasaj-color-dot" style={colorStyle} /> {colorName}
              </strong>
            </button>
            <button type="button" className="pasaj-variant-card active">
              <span>{variantLabel}</span>
              <strong>{variantValue}</strong>
            </button>
          </div>

          <aside className="pasaj-buy-box">
            <div className="pasaj-price-panel">
              <div>
                {product.previousPrice > product.price ? (
                  <span className="pasaj-old-price">{formatCurrency(product.previousPrice)}</span>
                ) : null}
                {discountRate > 0 ? <span className="pasaj-discount">%{discountRate} Indirim</span> : null}
              </div>
              <strong>{formatCurrency(product.price)}</strong>
            </div>

            <div className="pasaj-buy-actions">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={() => addItem(product)}
              >
                Sepete Ekle
              </Button>
              <Button size="large">
                <Link to="/checkout">Hemen Al</Link>
              </Button>
            </div>

            <div className="pasaj-service-row">
              <span><CheckCircleOutlined /> 1 Is Gununde Kargoda</span>
              <span><TruckOutlined /> Ucretsiz Kargo</span>
              <Link to={`/category/${product.category}`}>Indirim Bilgileri <InfoCircleOutlined /></Link>
            </div>

            <div className="pasaj-buy-footer">
              <Link to="#questions">{product.reviewCount} Soru & Cevap</Link>
              <Link to={`/category/${product.category}`}>Diger Saticilar (10)</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="pasaj-payment-methods">
        <Typography.Title level={2}>Alternatif Odeme Yontemleri</Typography.Title>
        <div className="pasaj-payment-grid">
          <article>
            <strong>Pasaj Limitiyle Al</strong>
            <span>Turkcell Pasaj limitini kullanarak kolayca alisveris yap.</span>
          </article>
          <article>
            <strong>Kredi Karti</strong>
            <span>Secili bankalarda pesin fiyatina taksit firsatlari.</span>
          </article>
          <article>
            <strong>Hizli Teslimat</strong>
            <span>Uygun urunlerde ayni gun veya ertesi gun teslimat.</span>
          </article>
        </div>
      </section>

      <section className="pasaj-detail-tabs">
        <div className="pasaj-detail-tab-list">
          <button type="button" className="active">Urun Ozellikleri</button>
          <button type="button">Degerlendirmeler</button>
          <button type="button" id="questions">Soru & Cevap</button>
        </div>
        <div className="pasaj-detail-content">
          <div>
            <Typography.Title level={3}>One Cikan Ozellikler</Typography.Title>
            <div className="pasaj-highlight-list">
              {product.highlights.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
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
