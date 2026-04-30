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
      title="Kayıt Ol"
      description="4. haftada auth akışının demo versiyonu tamamlandı. Kayıt formu hesap ekranına yönleniyor."
      nextTargets={[
        { label: "Giriş Yap", to: ROUTES.login },
        { label: "Şifre Sıfırla", to: ROUTES.forgotPassword },
        { label: "Anasayfa", to: ROUTES.home }
      ]}
    >
      {!isFirebaseReady ? (
        <Alert
          type="info"
          showIcon
          message="Firebase ayarları zorunlu değil; bu hafta için demo auth akışıyla ilerliyoruz."
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
                rules={[{ required: true, message: "Ad soyad girmeniz gerekiyor." }]}
              >
                <Input placeholder="Bilal Talha" />
              </Form.Item>
              <Form.Item
                label="E-posta"
                name="email"
                rules={[{ required: true, message: "E-posta adresi girmeniz gerekiyor." }]}
              >
                <Input type="email" placeholder="ornek@mail.com" />
              </Form.Item>
              <Form.Item
                label="Şifre"
                name="password"
                rules={[{ required: true, message: "Şifre girmeniz gerekiyor." }]}
              >
                <Input.Password placeholder="********" />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Hesap oluştur
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="auth-side-card">
            <Typography.Title level={4}>4. hafta eklemeleri</Typography.Title>
            <Typography.Paragraph>
              Kayıt ve giriş ekranları artık hesap sayfasına bağlı çalışıyor.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Hazırlanan demo akışta siparişler, favoriler ve adresler tek panelde görüntülenebiliyor.
            </Typography.Paragraph>
            <Button>
              <Link to={ROUTES.login}>Zaten üyeyim</Link>
            </Button>
          </Card>
        </Col>
      </Row>
    </PageShell>
  );
};

