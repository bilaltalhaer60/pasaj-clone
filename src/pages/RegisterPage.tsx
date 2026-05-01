import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Form, Input, Row, Typography } from "antd";
import { PageShell } from "../app/page-shell";
import { isFirebaseReady } from "../config/firebase";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

export const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const handleRegister = () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setFormError("Hesap oluşturmak için ad soyad, e-posta ve şifre alanlarını doldurun.");
      return;
    }

    setFormError("");
    register(fullName.trim(), email.trim());
    navigate(ROUTES.account);
  };

  return (
    <PageShell
      badge="4. Hafta Teslimi"
      title="Kayıt Ol"
      description="Yeni kullanıcı kaydı oluşturduğunuzda hesap paneline yönlendirilirsiniz."
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
            {formError ? (
              <Alert type="error" showIcon message={formError} style={{ marginBottom: 16 }} />
            ) : null}
            <Form layout="vertical">
              <Form.Item label="Ad Soyad">
                <Input
                  placeholder="Bilal Talha"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  onPressEnter={handleRegister}
                />
              </Form.Item>
              <Form.Item label="E-posta">
                <Input
                  type="email"
                  placeholder="ornek@mail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onPressEnter={handleRegister}
                />
              </Form.Item>
              <Form.Item label="Şifre">
                <Input.Password
                  placeholder="********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onPressEnter={handleRegister}
                />
              </Form.Item>
              <Button type="primary" htmlType="button" size="large" onClick={handleRegister}>
                Hesap oluştur
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card className="auth-side-card">
            <Typography.Title level={4}>Kayıt ve giriş akışı</Typography.Title>
            <Typography.Paragraph>
              Kayıt işlemi tamamlandığında kullanıcı oturumu açılır, hesap sayfası aktif hale gelir ve çıkış işlemi
              header ile profil alanından yapılabilir.
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
