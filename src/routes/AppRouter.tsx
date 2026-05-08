import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '../components/Layout/MainLayout';
import { HomePage } from '../features/home/HomePage';
import { NotFoundPage } from '../features/misc/NotFoundPage';
import { ProductListPage } from '../features/product/ProductListPage';
import { AccountPage } from '../pages/AccountPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminPage } from '../pages/AdminPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { RegisterPage } from '../pages/RegisterPage';
import { SearchPage } from '../pages/SearchPage';
import { ROUTES } from '../constants/routes';
import { AdminRoute } from './AdminRoute';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path={ROUTES.search} element={<SearchPage />} />
        <Route path="/category/:categorySlug" element={<ProductListPage />} />
        <Route path={ROUTES.product} element={<ProductDetailPage />} />
        <Route path={ROUTES.cart} element={<CartPage />} />
        <Route
          path={ROUTES.checkout}
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.account}
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.admin}
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route path={ROUTES.adminLogin} element={<AdminLoginPage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path="/giriş" element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
        <Route path="/kayıt" element={<RegisterPage />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}

