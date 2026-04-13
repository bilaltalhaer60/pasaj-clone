import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { Footer } from "../components/Layout/Footer";
import { Header } from "../components/Layout/Header";
import { CartDrawer } from "../components/Layout/CartDrawer";

export const MainLayout = () => {
  return (
    <Layout className="app-layout">
      <Header />
      <CartDrawer />
      <Layout.Content className="app-content">
        <Outlet />
      </Layout.Content>
      <Footer />
    </Layout>
  );
};
