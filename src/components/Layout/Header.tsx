import {
  HeartOutlined,
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Badge, Button, Drawer, Input, Space } from "antd";
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { env } from "../../config/env";
import { ROUTES } from "../../constants/routes";
import { useAuthStore } from "../../store/authStore";
import { getCartItemCount, useCartStore } from "../../store/cartStore";

const navItems = [
  {
    label: "Telefon",
    to: "/category/telefon",
    children: ["Apple", "Samsung", "Xiaomi", "Yenilenmis"]
  },
  {
    label: "Bilgisayar",
    to: "/category/bilgisayar",
    children: ["Laptop", "Oyuncu", "Monitor", "Tablet"]
  },
  {
    label: "Aksesuar",
    to: "/category/aksesuar",
    children: ["Kulaklik", "Saat", "Sarj", "Ev teknolojileri"]
  },
  {
    label: "Kampanyalar",
    to: ROUTES.home,
    children: ["Gece firsatlari", "Ogrenciye ozel", "Pesin fiyatina taksit", "Outlet"]
  }
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const itemCount = useCartStore((state) => getCartItemCount(state.items));
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
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
