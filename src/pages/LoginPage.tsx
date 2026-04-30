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
      title="Giriş"
      description="Auth akışının demo sürümü 4. haftada tamamlandı. Giriş sonrası kullanıcı hesap paneline yönleniyor."
      nextTargets={[
        { label: "Kayıt Ol", to: ROUTES.register },
        { label: "Hesabım", to: ROUTES.account }
      ]}
    >
      {!isFirebaseReady ? (
        <Alert
          type="warning"
          showIcon
          message="Firebase ortam değişkenleri henüz tanımlı değil. Demo auth akışı ile test etmeye devam edebilirsiniz."
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
              <div style={{ marginBottom: 16 }}>
                <Link to={ROUTES.forgotPassword}>Şifremi unuttum</Link>
              </div>
              <Button type="primary" htmlType="submit" size="large">
                Giriş Yap
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="auth-side-card">
            <Typography.Title level={4}>Demo kullanıcı akışı</Typography.Title>
            <Typography.Paragraph>
              Giriş yaptığınızda siparişlerinizi, favorilerinizi ve adreslerinizi hesap ekranında görebilirsiniz.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Admin paneli de 4. hafta kapsamında tablo ve metrik kartlarıyla genişletildi.
            </Typography.Paragraph>
            <Button>
              <Link to={ROUTES.register}>Yeni hesap oluştur</Link>
            </Button>
          </Card>
        </Col>
      </Row>
    </PageShell>
  );
};

