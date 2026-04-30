import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, Col, Form, Input, Row, Typography } from "antd";
import { PageShell } from "../app/page-shell";
import { isFirebaseReady } from "../config/firebase";
import { ROUTES } from "../constants/routes";

export const ForgotPasswordPage = () => {
  const [submittedEmail, setSubmittedEmail] = useState("");

  return (
    <PageShell
      badge="8. Hafta Finali"
      title="Şifre Sıfırlama"
      description="Son hafta final düzenlemeleriyle auth akışı için şifre sıfırlama ekranı da projeye dahil edildi."
      nextTargets={[
        { label: "Giriş Yap", to: ROUTES.login },
        { label: "Kayıt Ol", to: ROUTES.register }
      ]}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card className="auth-card">
            {submittedEmail ? (
              <Alert
                type="success"
                showIcon
                message={`${submittedEmail} adresi için şifre sıfırlama yönlendirmesi hazırlandı.`}
                style={{ marginBottom: 16 }}
              />
            ) : null}
            {!isFirebaseReady ? (
              <Alert
                type="info"
                showIcon
                message="Firebase ayarları yoksa bu ekran demo doğrulama akışını gösterir."
                style={{ marginBottom: 16 }}
              />
            ) : null}
            <Form
              layout="vertical"
              onFinish={(values: { email: string }) => setSubmittedEmail(values.email)}
            >
              <Form.Item
                label="E-posta"
                name="email"
                rules={[
                  { required: true, message: "E-posta zorunlu." },
                  { type: "email", message: "Geçerli bir e-posta adresi girin." }
                ]}
              >
                <Input type="email" placeholder="ornek@mail.com" />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Sıfırlama bağlantısı gönder
              </Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card className="auth-side-card">
            <Typography.Title level={4}>Ne olacak?</Typography.Title>
            <Typography.Paragraph>
              E-posta adresinizi girdiğinizde şifrenizi yenilemek için giriş akışına dönebilirsiniz.
            </Typography.Paragraph>
            <Button>
              <Link to={ROUTES.login}>Giriş ekranına dön</Link>
            </Button>
          </Card>
        </Col>
      </Row>
    </PageShell>
  );
};

