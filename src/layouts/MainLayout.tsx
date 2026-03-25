import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import { Footer } from "../components/Layout/Footer";
import { Header } from "../components/Layout/Header";

export const MainLayout = () => {
  return (
    <Layout className="app-layout">
      <Header />
      <Layout.Content className="app-content">
        <Outlet />
      </Layout.Content>
      <Footer />
    </Layout>
  );
};
