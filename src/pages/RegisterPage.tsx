import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Form, Input, Row, Typography } from "antd";
import { PageShell } from "../app/page-shell";
import { isFirebaseReady } from "../config/firebase";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const onFinish = (values: { fullName: string; email: string }) => {
    register(values.fullName, values.email);
    navigate(ROUTES.account);
  };

  return (
    <PageShell
      badge="4. Hafta Teslimi"
      title="Kayit Ol"
      description="4. haftada auth akisinin demo versiyonu tamamlandi. Kayit formu hesap ekranina yonleniyor."
      nextTargets={[
        { label: "Giris Yap", to: ROUTES.login },
        { label: "Anasayfa", to: ROUTES.home }
      ]}
    >
      {!isFirebaseReady ? (
        <Alert
          type="info"
          showIcon
          message="Firebase ayarlari zorunlu degil; bu hafta icin demo auth akisiyla ilerliyoruz."
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card className="auth-card">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Ad Soyad"
                name="fullName"
                rules={[{ required: true, message: "Ad soyad girmen gerekiyor." }]}
              >
                <Input placeholder="Bilal Talha" />
              </Form.Item>
              <Form.Item
                label="E-posta"
                name="email"
                rules={[{ required: true, message: "E-posta girmen gerekiyor." }]}
              >
                <Input type="email" placeholder="ornek@mail.com" />
              </Form.Item>
              <Form.Item
                label="Sifre"
                name="password"
                rules={[{ required: true, message: "Sifre girmen gerekiyor." }]}
              >
                <Input.Password placeholder="********" />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Hesap olustur
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="auth-side-card">
            <Typography.Title level={4}>4. hafta eklemeleri</Typography.Title>
            <Typography.Paragraph>
              Kayit ve giris ekranlari artik hesap sayfasina bagli calisiyor.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Hazirlanan demo akista siparisler, favoriler ve adresler tek panelde gorulebiliyor.
            </Typography.Paragraph>
            <Button>
              <Link to={ROUTES.login}>Zaten uyeyim</Link>
            </Button>
          </Card>
        </Col>
      </Row>
    </PageShell>
  );
};
