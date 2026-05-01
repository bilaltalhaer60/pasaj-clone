import {
  DownOutlined,
  LogoutOutlined,
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Badge, Button, Input } from "antd";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  categoryMenus,
  categoryNav,
  topLinks,
  type CategoryMenuItem
} from "../../data/home";
import { ROUTES } from "../../constants/routes";
import { useAuthStore } from "../../store/authStore";
import { getCartItemCount, useCartStore } from "../../store/cartStore";
import { useUiStore } from "../../store/uiStore";

const renderMegaMenuItems = (items: CategoryMenuItem[], onNavigate: () => void) => (
  <div className="pasaj-mega-menu-list">
    {items.map((item) => (
      <div key={item.label} className="pasaj-mega-menu-row">
        <Link to={item.to} className="pasaj-mega-menu-link" onClick={onNavigate}>
          <span>{item.label}</span>
          {item.children ? <span className="pasaj-mega-arrow">›</span> : null}
        </Link>
        {item.children ? (
          <div className="pasaj-mega-submenu">
            {item.children.map((child) => (
              <Link key={child.label} to={child.to} className="pasaj-mega-submenu-link" onClick={onNavigate}>
                {child.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    ))}
  </div>
);

export const Header = () => {
  const itemCount = useCartStore((state) => getCartItemCount(state.items));
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const openCartDrawer = useUiStore((state) => state.openCartDrawer);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [menuTop, setMenuTop] = useState(226);
  const navShellRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateMenuTop = useCallback(() => {
    const navBottom = navShellRef.current?.getBoundingClientRect().bottom;

    if (typeof navBottom === "number") {
      setMenuTop(Math.max(0, Math.round(navBottom)));
    }
  }, []);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openCategoryMenu = (item: string) => {
    clearCloseTimer();
    updateMenuTop();
    setActiveCategory(item);
  };

  const scheduleCategoryMenuClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setActiveCategory(null);
      closeTimerRef.current = null;
    }, 160);
  };

  const closeCategoryMenu = () => {
    clearCloseTimer();
    setActiveCategory(null);
  };

  useEffect(() => {
    updateMenuTop();
    window.addEventListener("resize", updateMenuTop);
    window.addEventListener("scroll", updateMenuTop, true);

    return () => {
      clearCloseTimer();
      window.removeEventListener("resize", updateMenuTop);
      window.removeEventListener("scroll", updateMenuTop, true);
    };
  }, [updateMenuTop]);

  return (
    <header
      className="site-header pasaj-header"
      style={{ "--pasaj-mega-menu-top": `${menuTop}px` } as CSSProperties}
    >
      <div className="pasaj-top-links">
        <div className="pasaj-top-links-inner">
          <Link to={ROUTES.home} className="pasaj-domain-link">
            turkcell.com.tr
          </Link>
          <div className="pasaj-top-link-list">
            {topLinks.map((item) => (
              <Link key={item.label} to={item.to} className="pasaj-top-link-item">
                {item.label}
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
              placeholder="Ürün, marka veya kategori ara"
            />
          </div>

          <div className="pasaj-header-actions">
            <NavLink to={isLoggedIn ? ROUTES.account : ROUTES.login} className="pasaj-login-chip">
              <UserOutlined />
              <span>{isLoggedIn ? "Hesabım" : "Giriş Yap"}</span>
              <DownOutlined />
            </NavLink>

            {isLoggedIn ? (
              <button type="button" className="pasaj-logout-chip" onClick={logout}>
                <LogoutOutlined />
                <span>Çıkış Yap</span>
              </button>
            ) : null}

            <button type="button" className="pasaj-cart-chip pasaj-cart-button" onClick={openCartDrawer}>
              <ShoppingOutlined />
              <span>Sepetim</span>
              <Badge count={itemCount} showZero className="pasaj-cart-badge" />
            </button>
          </div>
        </div>
      </div>

      <div className="pasaj-category-nav-shell" ref={navShellRef}>
        <nav className="pasaj-category-nav">
          {categoryNav.map((item, index) => {
            const menuItems = categoryMenus[item] ?? [];
            const target = menuItems[0]?.to ?? ROUTES.home;
            const isOpen = activeCategory === item;

            return (
              <div
                key={item}
                className={`pasaj-category-nav-item${isOpen ? " is-open" : ""}`}
                onMouseEnter={() => openCategoryMenu(item)}
                onPointerEnter={() => openCategoryMenu(item)}
                onPointerMove={() => openCategoryMenu(item)}
                onMouseLeave={scheduleCategoryMenuClose}
                onFocus={() => openCategoryMenu(item)}
                onBlur={scheduleCategoryMenuClose}
              >
                <Link to={target} onClick={closeCategoryMenu}>
                  {item}
                </Link>
                {menuItems.length > 0 ? (
                  <div
                    className="pasaj-mega-menu"
                    aria-label={`${item} menüsü`}
                    onMouseEnter={clearCloseTimer}
                    onMouseLeave={scheduleCategoryMenuClose}
                  >
                    <div className="pasaj-mega-title">{item}</div>
                    {renderMegaMenuItems(menuItems, closeCategoryMenu)}
                  </div>
                ) : null}
                {index < categoryNav.length - 1 ? <span className="pasaj-nav-separator">•</span> : null}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="pasaj-announcement-bar">
        <div className="pasaj-announcement-inner">
          <span>5G Uyumlu Telefonlarda Platinum'a Özel 1000 TL İndirim!</span>
          <Button className="pasaj-announcement-button">İncele</Button>
        </div>
      </div>
    </header>
  );
};

