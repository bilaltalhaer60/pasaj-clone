import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Form, Input, Row, Typography } from "antd";
import { PageShell } from "../app/page-shell";
import { isFirebaseReady } from "../config/firebase";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const redirectTarget = (location.state as { from?: string } | null)?.from ?? ROUTES.account;

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setFormError("Giriş yapmak için e-posta ve şifre alanlarını doldurun.");
      return;
    }

    setFormError("");
    login(email.trim());
    navigate(redirectTarget);
  };

  return (
    <PageShell
      badge="4. Hafta Teslimi"
      title="Giriş"
      description="Giriş yaptıktan sonra hesap panelinize, favorilerinize ve siparişlerinize ulaşabilirsiniz."
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
            {formError ? (
              <Alert type="error" showIcon message={formError} style={{ marginBottom: 16 }} />
            ) : null}
            <Form layout="vertical">
              <Form.Item label="E-posta">
                <Input
                  type="email"
                  placeholder="ornek@mail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onPressEnter={handleLogin}
                />
              </Form.Item>
              <Form.Item label="Şifre">
                <Input.Password
                  placeholder="********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onPressEnter={handleLogin}
                />
              </Form.Item>
              <div style={{ marginBottom: 16 }}>
                <Link to={ROUTES.forgotPassword}>Şifremi unuttum</Link>
              </div>
              <Button type="primary" htmlType="button" size="large" onClick={handleLogin}>
                Giriş Yap
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="auth-side-card">
            <Typography.Title level={4}>Kullanıcı İşlemleri</Typography.Title>
            <Typography.Paragraph>
              Demo giriş için herhangi bir e-posta ve şifre kullanabilirsiniz. Admin panelini görmek için e-posta adresinde
              admin kelimesi geçmelidir.
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
