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

const navItems = [
  { label: "Telefon", to: "/category/telefon" },
  { label: "Bilgisayar", to: "/category/bilgisayar" },
  { label: "Aksesuar", to: "/category/aksesuar" },
  { label: "Kampanyalar", to: ROUTES.home }
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const links = useMemo(
    () => [
      ...navItems,
      { label: "Giriş", to: ROUTES.login },
      { label: "Sepet", to: ROUTES.cart }
    ],
    []
  );

  return (
    <header className="site-header">
      <div className="topbar">
        <span>Hızlı teslimat ve temel routing hazır.</span>
        <span>Kargo eşiği: {env.shippingThreshold} TL</span>
      </div>
      <div className="header-main">
        <Space align="center" size="middle">
          <Button
            className="mobile-only"
            aria-label="Menüyü aç"
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
          placeholder="Ürün, marka veya kategori ara"
        />

        <Space size="middle">
          <NavLink to={ROUTES.login} className="icon-link">
            <UserOutlined />
          </NavLink>
          <button className="icon-link" type="button" aria-label="Favoriler">
            <HeartOutlined />
          </button>
          <NavLink to={ROUTES.cart} className="icon-link">
            <Badge count={0} size="small">
              <ShoppingCartOutlined />
            </Badge>
          </NavLink>
        </Space>
      </div>

      <nav className="desktop-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className="nav-link">
            {item.label}
          </NavLink>
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
