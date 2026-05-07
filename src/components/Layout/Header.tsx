import {
  DownOutlined,
  LogoutOutlined,
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Input } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  categoryMenus,
  categoryNav,
  topLinks,
  type CategoryMenuItem
} from "../../data/home";
import { getAllProducts } from "../../services/productService";
import { ROUTES } from "../../constants/routes";
import { useAuthStore } from "../../store/authStore";
import { getCartItemCount, useCartStore } from "../../store/cartStore";
import { useUiStore } from "../../store/uiStore";
import { formatCurrency } from "../../utils/formatCurrency";

const normalizeSearchText = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemCount = useCartStore((state) => getCartItemCount(state.items));
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const openCartDrawer = useUiStore((state) => state.openCartDrawer);
  const { data: products = [] } = useQuery({
    queryKey: ["products", "header-search"],
    queryFn: getAllProducts
  });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuTop, setMenuTop] = useState(226);
  const navShellRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trimmedSearchTerm = searchTerm.trim();
  const normalizedSearchTerm = normalizeSearchText(trimmedSearchTerm);
  const searchSuggestions = useMemo(() => {
    if (normalizedSearchTerm.length < 2) {
      return [];
    }

    return products
      .filter((product) =>
        normalizeSearchText([product.name, product.brand, product.category, product.summary].join(" ")).includes(
          normalizedSearchTerm
        )
      )
      .slice(0, 6);
  }, [normalizedSearchTerm, products]);
  const shouldShowSearchMenu = isSearchOpen && trimmedSearchTerm.length >= 2;

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

  const submitSearch = () => {
    const query = searchTerm.trim();

    if (!query) {
      return;
    }

    navigate(`${ROUTES.search}?q=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
    closeCategoryMenu();
  };

  const closeSearchMenu = () => {
    window.setTimeout(() => {
      setIsSearchOpen(false);
    }, 120);
  };

  useEffect(() => {
    setSearchTerm(searchParams.get("q") ?? "");
  }, [searchParams]);

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
            <div className="pasaj-search-box" onBlur={closeSearchMenu}>
              <Input
                className="pasaj-search"
                size="large"
                prefix={<SearchOutlined />}
                placeholder="Ürün, marka veya kategori ara"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onPressEnter={submitSearch}
                allowClear
                suffix={
                  <button
                    type="button"
                    className="pasaj-search-submit"
                    aria-label="Ara"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={submitSearch}
                  >
                    Ara
                  </button>
                }
              />
              {shouldShowSearchMenu ? (
                <div className="pasaj-search-suggestions" role="listbox" aria-label="Arama önerileri">
                  {searchSuggestions.length > 0 ? (
                    searchSuggestions.map((product) => (
                      <Link
                        key={product.slug}
                        to={`/product/${product.slug}`}
                        className="pasaj-search-suggestion"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <span className="pasaj-search-suggestion-image">
                          <img src={product.image} alt={product.name} />
                        </span>
                        <span className="pasaj-search-suggestion-copy">
                          <strong>{product.name}</strong>
                          <small>{product.brand}</small>
                        </span>
                        <b>{formatCurrency(product.price)}</b>
                      </Link>
                    ))
                  ) : (
                    <div className="pasaj-search-no-result">Eşleşen ürün bulunamadı.</div>
                  )}
                  <button
                    type="button"
                    className="pasaj-search-all-results"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={submitSearch}
                  >
                    "{trimmedSearchTerm}" için tüm sonuçları gör
                  </button>
                </div>
              ) : null}
            </div>
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

