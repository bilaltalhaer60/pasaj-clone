import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AccountPage } from "../pages/AccountPage";
import { AdminPage } from "../pages/AdminPage";
import { CartPage } from "../pages/CartPage";
import { CategoryPage } from "../pages/CategoryPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { ROUTES } from "../constants/routes";

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTES.category, element: <CategoryPage /> },
      { path: ROUTES.product, element: <ProductDetailPage /> },
      { path: ROUTES.cart, element: <CartPage /> },
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.checkout, element: <CheckoutPage /> },
      { path: ROUTES.account, element: <AccountPage /> },
      { path: ROUTES.admin, element: <AdminPage /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);
