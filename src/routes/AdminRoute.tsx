import type { ReactElement } from "react";
import { Spin } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

type AdminRouteProps = {
  children?: ReactElement;
};

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const user = useAuthStore((state) => state.user);

  if (!isAuthReady) {
    return <Spin fullscreen tip="Oturum kontrol ediliyor" />;
  }

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.login} replace state={{ from: ROUTES.admin }} />;
  }

  if (user?.role !== "admin") {
    return <Navigate to={ROUTES.home} replace />;
  }

  return children ?? <Outlet />;
};

