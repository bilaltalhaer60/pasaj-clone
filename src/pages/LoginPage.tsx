import { Alert, Button, Card, Form, Input } from "antd";
import { PageShell } from "../app/page-shell";
import { isFirebaseReady } from "../config/firebase";

export const LoginPage = () => {
  return (
    <PageShell
      title="Giriş"
      description="Auth entegrasyonu sonraki hafta kapsamı. Bu ekranda şimdilik rota, form kabuğu ve Firebase hazırlık durumu gösteriliyor."
    >
      {!isFirebaseReady ? (
        <Alert
          type="warning"
          showIcon
          message="Firebase environment değişkenleri henüz tanımlı değil. .env dosyasını doldurduğunda auth entegrasyonuna geçebilirsin."
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <Card>
        <Form layout="vertical">
          <Form.Item label="E-posta">
            <Input type="email" placeholder="ornek@mail.com" />
          </Form.Item>
          <Form.Item label="Şifre">
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Button type="primary">Giriş Yap</Button>
        </Form>
      </Card>
    </PageShell>
  );
};
