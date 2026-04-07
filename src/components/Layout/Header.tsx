import {
  HeartOutlined,
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Drawer, Input, Space } from "antd";
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { env } from "../../config/env";
import { ROUTES } from "../../constants/routes";
import { getAllProducts } from "../../services/productService";
import { useAuthStore } from "../../store/authStore";
import { getCartItemCount, useCartStore } from "../../store/cartStore";
import { buildCategorySummaries } from "../../utils/catalog";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const itemCount = useCartStore((state) => getCartItemCount(state.items));
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts
  });
  const navItems = useMemo(() => {
    const categoryMap = new Map<string, string[]>();

    products.forEach((product) => {
      const current = categoryMap.get(product.category) ?? [];
      if (!current.includes(product.brand)) {
        current.push(product.brand);
      }
      categoryMap.set(product.category, current);
    });

    const categoryItems = buildCategorySummaries(products).map((category) => ({
      label: category.title,
      to: `/category/${category.slug}`,
      children: category.topBrands.length > 0 ? category.topBrands : categoryMap.get(category.slug) ?? []
    }));

    return [
      ...categoryItems,
      {
        label: "Kampanyalar",
        to: ROUTES.home,
        children: ["Canli kampanyalar", "Indirimli urunler", "Vitrin secimleri", "Yeni gelenler"]
      }
    ];
  }, [products]);
  const links = useMemo(
    () => [
      ...navItems,
      { label: isLoggedIn ? "Hesabim" : "Giris", to: isLoggedIn ? ROUTES.account : ROUTES.login },
      { label: "Admin", to: ROUTES.admin },
      { label: "Sepet", to: ROUTES.cart }
    ],
    [isLoggedIn]
  );

  return (
    <header className="site-header">
      <div className="topbar">
        <span>Hizli teslimat ve haftalik vitrin alanlari hazir.</span>
        <span>Kargo esigi: {env.shippingThreshold} TL</span>
      </div>
      <div className="header-main">
        <Space align="center" size="middle">
          <Button
            className="mobile-only"
            aria-label="Menuyu ac"
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          />
          <Link to={ROUTES.home} className="brand">
            {env.appName}
          </Link>
        </Space>

        <Input
          className="header-search"
          size="large"
          prefix={<SearchOutlined />}
          placeholder="Urun, marka veya kategori ara"
        />

        <Space size="middle">
          <NavLink to={isLoggedIn ? ROUTES.account : ROUTES.login} className="icon-link">
            <UserOutlined />
          </NavLink>
          <button className="icon-link" type="button" aria-label="Favoriler">
            <HeartOutlined />
          </button>
          <NavLink to={ROUTES.cart} className="icon-link">
            <Badge count={itemCount} size="small">
              <ShoppingCartOutlined />
            </Badge>
          </NavLink>
        </Space>
      </div>

      <nav className="desktop-nav">
        {navItems.map((item) => (
          <div key={item.to} className="mega-nav-item">
            <NavLink to={item.to} className="nav-link">
              {item.label}
            </NavLink>
            <div className="mega-menu">
              <span className="mega-title">{item.label}</span>
              <div className="mega-links">
                {item.children.map((child) => (
                  <Link key={child} to={item.to} className="mega-link">
                    {child}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </nav>

      <Drawer placement="left" open={open} onClose={() => setOpen(false)} title={env.appName}>
        <Space direction="vertical" size="middle">
          {links.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </Space>
      </Drawer>
    </header>
  );
};
