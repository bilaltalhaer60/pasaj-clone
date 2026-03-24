import { PageShell, RoutePreviewGrid } from "../app/page-shell";

const routes = [
  {
    title: "Kategori Sayfası",
    description: "Dinamik slug ile kategori bazlı ürün listesi rotası hazır.",
    to: "/category/telefon"
  },
  {
    title: "Ürün Detay",
    description: "Slug tabanlı ürün detay rotası hazır.",
    to: "/product/iphone-16-pro"
  },
  {
    title: "Sepet",
    description: "Sepet akışı için bağımsız rota hazır.",
    to: "/cart"
  }
];

export const HomePage = () => {
  return (
    <PageShell
      title="Pasaj Clone başlangıç iskeleti"
      description="1. hafta kapsamına uygun olarak React Router tabanlı temel sayfa yapısı, ana layout ve TypeScript proje iskeleti kuruldu."
      nextTargets={[
        { label: "Kategoriye Git", to: "/category/telefon" },
        { label: "Ürün Detaya Git", to: "/product/iphone-16-pro" }
      ]}
    >
      <RoutePreviewGrid items={routes} />
    </PageShell>
  );
};
