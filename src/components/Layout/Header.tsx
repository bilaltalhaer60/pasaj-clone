import {
  DownOutlined,
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Badge, Button, Input } from "antd";
import { Link, NavLink } from "react-router-dom";
import { categoryNav, topLinks } from "../../data/home";
import { ROUTES } from "../../constants/routes";
import { useAuthStore } from "../../store/authStore";
import { getCartItemCount, useCartStore } from "../../store/cartStore";
import { useUiStore } from "../../store/uiStore";

export const Header = () => {
  const itemCount = useCartStore((state) => getCartItemCount(state.items));
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openCartDrawer = useUiStore((state) => state.openCartDrawer);

  return (
    <header className="site-header pasaj-header">
      <div className="pasaj-top-links">
        <div className="pasaj-top-links-inner">
          <Link to={ROUTES.home} className="pasaj-domain-link">
            turkcell.com.tr
          </Link>
          <div className="pasaj-top-link-list">
            {topLinks.map((item) => (
              <Link key={item} to={ROUTES.home} className="pasaj-top-link-item">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="pasaj-header-main-shell">
        <div className="pasaj-header-main">
          <Link to={ROUTES.home} className="pasaj-logo-link" aria-label="Pasaj">
            <img src="/pasaj/logos/PasajHeaderLogo.svg" alt="Turkcell Pasaj" className="pasaj-logo" />
          </Link>

          <div className="pasaj-search-wrap">
            <Input
              className="pasaj-search"
              size="large"
              prefix={<SearchOutlined />}
              placeholder="Urun, marka veya kategori ara"
            />
          </div>

          <div className="pasaj-header-actions">
            <NavLink to={isLoggedIn ? ROUTES.account : ROUTES.login} className="pasaj-login-chip">
              <UserOutlined />
              <span>Giris Yap</span>
              <DownOutlined />
            </NavLink>

            <button type="button" className="pasaj-cart-chip pasaj-cart-button" onClick={openCartDrawer}>
              <ShoppingOutlined />
              <span>Sepetim</span>
              <Badge count={itemCount} showZero className="pasaj-cart-badge" />
            </button>
          </div>
        </div>
      </div>

      <div className="pasaj-category-nav-shell">
        <nav className="pasaj-category-nav">
          {categoryNav.map((item, index) => (
            <div key={item} className="pasaj-category-nav-item">
              <Link to={ROUTES.home}>{item}</Link>
              {index < categoryNav.length - 1 ? <span className="pasaj-nav-separator">•</span> : null}
            </div>
          ))}
        </nav>
      </div>

      <div className="pasaj-announcement-bar">
        <div className="pasaj-announcement-inner">
          <span>5G Uyumlu Telefonlarda Platinuma Ozel 1000 TL Indirim!</span>
          <Button className="pasaj-announcement-button">Incele</Button>
        </div>
      </div>
    </header>
  );
};
