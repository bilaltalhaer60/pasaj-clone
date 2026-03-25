import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';

export function MainLayout() {
  return (
    <Layout className="app-shell">
      <Header />
      <Layout.Content className="app-content">
        <Outlet />
      </Layout.Content>
      <Footer />
    </Layout>
  );
}
