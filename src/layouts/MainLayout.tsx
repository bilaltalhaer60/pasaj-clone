import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { ScrollToTop } from "../routes/ScrollToTop";
import { useAuthStore } from "../store/authStore";
import { Footer } from "../components/Layout/Footer";
import { Header } from "../components/Layout/Header";
import { CartDrawer } from "../components/Layout/CartDrawer";
import { AppToast } from "../components/Layout/AppToast";

export const MainLayout = () => {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  useEffect(() => {
    const unsubscribe = initAuthListener();

    return unsubscribe;
  }, [initAuthListener]);

  return (
    <Layout className="app-layout">
      <ScrollToTop />
      <Header />
      <CartDrawer />
      <AppToast />
      <Layout.Content className="app-content">
        <Outlet />
      </Layout.Content>
      <Footer />
    </Layout>
  );
};
