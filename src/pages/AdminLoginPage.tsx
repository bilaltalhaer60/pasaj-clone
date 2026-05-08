import { useEffect, useState } from "react";
import { LockOutlined, LoginOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { isFirebaseReady } from "../config/firebase";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

export const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { isAuthLoading, isLoggedIn, user, login } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      navigate(ROUTES.admin, { replace: true });
    }
  }, [isLoggedIn, navigate, user?.role]);

  const handleAdminLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setFormError("Admin girişi için e-posta ve şifre alanlarını doldurun.");
      return;
    }

    setFormError("");

    try {
      await login(email.trim(), password);
      const currentUser = useAuthStore.getState().user;

      if (currentUser?.role !== "admin") {
        await useAuthStore.getState().logout();
        setFormError("Bu hesap admin yetkisine sahip değil.");
        return;
      }

      navigate(ROUTES.admin);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Admin girişi yapılamadı.");
    }
  };

  return (
    <main className="pasaj-auth-page pasaj-admin-auth-page">
      <section className="pasaj-auth-panel" aria-labelledby="pasaj-admin-login-title">
        <img src="/pasaj/logos/PasajHeaderLogo.svg" alt="Turkcell Pasaj" className="pasaj-auth-logo" />
        <h1 id="pasaj-admin-login-title">Admin Girişi</h1>
        <p>Yönetim paneline erişmek için admin yetkili hesabınızla devam edin.</p>

        {!isFirebaseReady ? (
          <Alert
            type="error"
            showIcon
            message="Firebase ortam değişkenleri tanımlı olmadığı için admin girişi yapılamıyor."
            className="pasaj-auth-alert"
          />
        ) : null}
        {isLoggedIn && user?.role !== "admin" ? (
          <Alert
            type="warning"
            showIcon
            message="Mevcut oturum admin yetkisine sahip değil. Admin hesabıyla tekrar giriş yapın."
            className="pasaj-auth-alert"
          />
        ) : null}
        {formError ? (
          <Alert type="error" showIcon message={formError} className="pasaj-auth-alert" />
        ) : null}

        <Form layout="vertical" className="pasaj-auth-form">
          <Form.Item label="Admin e-posta">
            <Input
              type="email"
              placeholder="admin@ornek.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onPressEnter={handleAdminLogin}
              disabled={isAuthLoading}
              size="large"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item label="Şifre">
            <Input.Password
              placeholder="Admin şifresi"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onPressEnter={handleAdminLogin}
              disabled={isAuthLoading}
              size="large"
            />
          </Form.Item>
          <Button
            className="pasaj-auth-primary pasaj-admin-auth-primary"
            htmlType="button"
            size="large"
            icon={<LoginOutlined />}
            onClick={handleAdminLogin}
            loading={isAuthLoading}
            disabled={!isFirebaseReady}
            block
          >
            Admin Paneline Giriş Yap
          </Button>
        </Form>

        <div className="pasaj-auth-divider">
          <span>veya</span>
        </div>

        <Link to={ROUTES.login} className="pasaj-auth-secondary">
          Normal Kullanıcı Girişi
        </Link>
      </section>
    </main>
  );
};
