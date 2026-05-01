import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { AppToast } from "./AppToast";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function MainLayout() {
  return (
    <Layout className="app-shell">
      <Header />
      <CartDrawer />
      <AppToast />
      <Layout.Content className="app-content">
        <Outlet />
      </Layout.Content>
      <Footer />
    </Layout>
  );
}
