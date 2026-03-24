import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { AppFooter } from './Footer';
import { AppHeader } from './Header';

export function MainLayout() {
  return (
    <Layout className="app-shell">
      <AppHeader />
      <Layout.Content className="app-content">
        <Outlet />
      </Layout.Content>
      <AppFooter />
    </Layout>
  );
}
