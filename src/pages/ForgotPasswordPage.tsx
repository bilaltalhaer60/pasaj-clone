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
      title="Sifre Sifirlama"
      description="Son hafta final duzenlemeleriyle auth akisi icin sifre sifirlama ekrani da projeye dahil edildi."
      nextTargets={[
        { label: "Giris Yap", to: ROUTES.login },
        { label: "Kayit Ol", to: ROUTES.register }
      ]}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card className="auth-card">
            {submittedEmail ? (
              <Alert
                type="success"
                showIcon
                message={`${submittedEmail} adresi icin sifre sifirlama yonlendirmesi hazirlandi.`}
                style={{ marginBottom: 16 }}
              />
            ) : null}
            {!isFirebaseReady ? (
              <Alert
                type="info"
                showIcon
                message="Firebase ayarlari yoksa bu ekran demo dogrulama akisini gosterir."
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
                  { type: "email", message: "Gecerli bir e-posta gir." }
                ]}
              >
                <Input type="email" placeholder="ornek@mail.com" />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Sifirlama baglantisi gonder
              </Button>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card className="auth-side-card">
            <Typography.Title level={4}>Ne olacak?</Typography.Title>
            <Typography.Paragraph>
              E-posta adresini girdiginde sifreni yenilemek icin yeniden giris akisina donebilirsin.
            </Typography.Paragraph>
            <Button>
              <Link to={ROUTES.login}>Giris ekranina don</Link>
            </Button>
          </Card>
        </Col>
      </Row>
    </PageShell>
  );
};
