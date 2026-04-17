import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Form, Input, Row, Typography } from "antd";
import { PageShell } from "../app/page-shell";
import { isFirebaseReady } from "../config/firebase";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const redirectTarget = (location.state as { from?: string } | null)?.from ?? ROUTES.account;

  const onFinish = (values: { email: string }) => {
    login(values.email);
    navigate(redirectTarget);
  };

  return (
    <PageShell
      badge="4. Hafta Teslimi"
      title="Giris"
      description="Auth akisinin demo surumu 4. haftada tamamlandi. Giris sonrasi kullanici hesap paneline yonleniyor."
      nextTargets={[
        { label: "Kayit Ol", to: ROUTES.register },
        { label: "Hesabim", to: ROUTES.account }
      ]}
    >
      {!isFirebaseReady ? (
        <Alert
          type="warning"
          showIcon
          message="Firebase environment degiskenleri henuz tanimli degil. Demo auth akisi ile test etmeye devam edebilirsin."
          style={{ marginBottom: 16 }}
        />
      ) : null}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card className="auth-card">
            <Form layout="vertical" onFinish={onFinish}>
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
              <div style={{ marginBottom: 16 }}>
                <Link to={ROUTES.forgotPassword}>Sifremi unuttum</Link>
              </div>
              <Button type="primary" htmlType="submit" size="large">
                Giris Yap
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="auth-side-card">
            <Typography.Title level={4}>Demo kullanici akisi</Typography.Title>
            <Typography.Paragraph>
              Giris yaptiginda siparislerini, favorilerini ve adreslerini hesap ekraninda gorebilirsin.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Admin paneli de 4. hafta kapsaminda tablo ve metrik kartlariyla genisletildi.
            </Typography.Paragraph>
            <Button>
              <Link to={ROUTES.register}>Yeni hesap olustur</Link>
            </Button>
          </Card>
        </Col>
      </Row>
    </PageShell>
  );
};
