import { useEffect, useState } from "react";
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isFirebaseReady } from "../config/firebase";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthLoading, isLoggedIn, login } = useAuthStore();
  const redirectTarget = (location.state as { from?: string } | null)?.from ?? ROUTES.account;

  useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isLoggedIn, navigate, redirectTarget]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setFormError("Giriş yapmak için e-posta ve şifre alanlarını doldurun.");
      return;
    }

    setFormError("");

    try {
      await login(email.trim(), password);
      navigate(redirectTarget);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Giriş yapılamadı.");
    }
  };

  return (
    <main className="pasaj-auth-page">
      <section className="pasaj-auth-panel" aria-labelledby="pasaj-login-title">
        <img src="/pasaj/logos/PasajHeaderLogo.svg" alt="Turkcell Pasaj" className="pasaj-auth-logo" />
        <h1 id="pasaj-login-title">Giriş</h1>
        <p>Size özel ödeme avantajları ve tekliflerden faydalanmak için hesabınızla devam edin.</p>

        {!isFirebaseReady ? (
          <Alert
            type="error"
            showIcon
            message="Firebase ortam değişkenleri tanımlı olmadığı için gerçek giriş yapılamıyor."
            className="pasaj-auth-alert"
          />
        ) : null}
        {formError ? (
          <Alert type="error" showIcon message={formError} className="pasaj-auth-alert" />
        ) : null}

        <Form layout="vertical" className="pasaj-auth-form">
          <Form.Item label="E-posta">
            <Input
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onPressEnter={handleLogin}
              disabled={isAuthLoading}
              size="large"
            />
          </Form.Item>
          <Form.Item label="Şifre">
            <Input.Password
              placeholder="En az 6 karakter"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onPressEnter={handleLogin}
              disabled={isAuthLoading}
              size="large"
            />
          </Form.Item>
          <Link to={ROUTES.forgotPassword} className="pasaj-auth-forgot">
            Şifremi unuttum
          </Link>
          <Button
            className="pasaj-auth-primary"
            htmlType="button"
            size="large"
            icon={<LoginOutlined />}
            onClick={handleLogin}
            loading={isAuthLoading}
            disabled={!isFirebaseReady}
            block
          >
            Giriş Yap
          </Button>
        </Form>

        <div className="pasaj-auth-divider">
          <span>veya</span>
        </div>

        <Link to={ROUTES.home} className="pasaj-auth-secondary">
          Giriş Yapmadan Devam Et
        </Link>
        <Link to={ROUTES.register} className="pasaj-auth-register">
          <UserAddOutlined />
          Üye Ol
        </Link>
      </section>
    </main>
  );
};
