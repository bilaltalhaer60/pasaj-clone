import type { ReactElement } from "react";
import { Spin } from "antd";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

type ProtectedRouteProps = {
  children?: ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const location = useLocation();

  if (!isAuthReady) {
    return <Spin fullscreen tip="Oturum kontrol ediliyor" />;
  }

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  return children ?? <Outlet />;
};

