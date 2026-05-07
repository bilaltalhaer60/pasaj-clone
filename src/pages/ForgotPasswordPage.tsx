import { useState } from "react";
import { LoginOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { isFirebaseReady } from "../config/firebase";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

export const ForgotPasswordPage = () => {
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resetPassword = useAuthStore((state) => state.resetPassword);

  const handleResetPassword = async (values: { email: string }) => {
    setFormError("");
    setIsSubmitting(true);

    try {
      await resetPassword(values.email);
      setSubmittedEmail(values.email);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Şifre sıfırlama bağlantısı gönderilemedi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pasaj-auth-page">
      <section className="pasaj-auth-panel" aria-labelledby="pasaj-forgot-title">
        <img src="/pasaj/logos/PasajHeaderLogo.svg" alt="Turkcell Pasaj" className="pasaj-auth-logo" />
        <h1 id="pasaj-forgot-title">Şifremi Unuttum</h1>
        <p>E-posta adresinizi girin, şifrenizi yenilemeniz için gerekli bağlantıyı gönderelim.</p>

        {submittedEmail ? (
          <Alert
            type="success"
            showIcon
            message={`${submittedEmail} adresine şifre sıfırlama bağlantısı gönderildi.`}
            className="pasaj-auth-alert"
          />
        ) : null}
        {formError ? (
          <Alert type="error" showIcon message={formError} className="pasaj-auth-alert" />
        ) : null}
        {!isFirebaseReady ? (
          <Alert
            type="error"
            showIcon
            message="Firebase ayarları olmadığı için şifre sıfırlama bağlantısı gönderilemiyor."
            className="pasaj-auth-alert"
          />
        ) : null}

        <Form layout="vertical" className="pasaj-auth-form" onFinish={handleResetPassword}>
          <Form.Item
            label="E-posta"
            name="email"
            rules={[
              { required: true, message: "E-posta zorunlu." },
              { type: "email", message: "Geçerli bir e-posta adresi girin." }
            ]}
          >
            <Input type="email" placeholder="ornek@mail.com" size="large" />
          </Form.Item>
          <Button
            className="pasaj-auth-primary"
            htmlType="submit"
            size="large"
            icon={<MailOutlined />}
            loading={isSubmitting}
            disabled={!isFirebaseReady}
            block
          >
            Sıfırlama Bağlantısı Gönder
          </Button>
        </Form>

        <div className="pasaj-auth-divider">
          <span>veya</span>
        </div>

        <Link to={ROUTES.login} className="pasaj-auth-secondary">
          <LoginOutlined />
          Giriş Ekranına Dön
        </Link>
      </section>
    </main>
  );
};
