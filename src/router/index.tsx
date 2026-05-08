import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { ROUTES } from "../constants/routes";
import { AdminRoute } from "../routes/AdminRoute";
import { ProtectedRoute } from "../routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <MainLayout />,
    children: [
      {
        index: true,
        lazy: async () => {
          const module = await import("../pages/HomePage");
          return { Component: module.HomePage };
        }
      },
      {
        path: ROUTES.search,
        lazy: async () => {
          const module = await import("../pages/SearchPage");
          return { Component: module.SearchPage };
        }
      },
      {
        path: ROUTES.category,
        lazy: async () => {
          const module = await import("../pages/CategoryPage");
          return { Component: module.CategoryPage };
        }
      },
      {
        path: ROUTES.product,
        lazy: async () => {
          const module = await import("../pages/ProductDetailPage");
          return { Component: module.ProductDetailPage };
        }
      },
      {
        path: ROUTES.cart,
        lazy: async () => {
          const module = await import("../pages/CartPage");
          return { Component: module.CartPage };
        }
      },
      {
        path: ROUTES.login,
        lazy: async () => {
          const module = await import("../pages/LoginPage");
          return { Component: module.LoginPage };
        }
      },
      {
        path: ROUTES.adminLogin,
        lazy: async () => {
          const module = await import("../pages/AdminLoginPage");
          return { Component: module.AdminLoginPage };
        }
      },
      {
        path: ROUTES.register,
        lazy: async () => {
          const module = await import("../pages/RegisterPage");
          return { Component: module.RegisterPage };
        }
      },
      {
        path: ROUTES.forgotPassword,
        lazy: async () => {
          const module = await import("../pages/ForgotPasswordPage");
          return { Component: module.ForgotPasswordPage };
        }
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.checkout,
            lazy: async () => {
              const module = await import("../pages/CheckoutPage");
              return { Component: module.CheckoutPage };
            }
          },
          {
            path: ROUTES.account,
            lazy: async () => {
              const module = await import("../pages/AccountPage");
              return { Component: module.AccountPage };
            }
          }
        ]
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: ROUTES.admin,
            lazy: async () => {
              const module = await import("../pages/AdminPage");
              return { Component: module.AdminPage };
            }
          }
        ]
      },
      {
        path: "*",
        lazy: async () => {
          const module = await import("../pages/NotFoundPage");
          return { Component: module.NotFoundPage };
        }
      }
    ]
  }
]);

