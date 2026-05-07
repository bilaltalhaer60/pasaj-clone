import { useState } from "react";
import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { isFirebaseReady } from "../config/firebase";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

export const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { isAuthLoading, register } = useAuthStore();

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setFormError("Hesap oluşturmak için ad soyad, e-posta ve şifre alanlarını doldurun.");
      return;
    }

    if (password.length < 6) {
      setFormError("Şifre en az 6 karakter olmalı.");
      return;
    }

    setFormError("");

    try {
      await register(fullName.trim(), email.trim(), password);
      navigate(ROUTES.account);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Kayıt oluşturulamadı.");
    }
  };

  return (
    <main className="pasaj-auth-page">
      <section className="pasaj-auth-panel pasaj-auth-panel-wide" aria-labelledby="pasaj-register-title">
        <img src="/pasaj/logos/PasajHeaderLogo.svg" alt="Turkcell Pasaj" className="pasaj-auth-logo" />
        <h1 id="pasaj-register-title">Üye Ol</h1>
        <p>Pasaj fırsatlarından ve size özel kampanyalardan yararlanmak için üyeliğinizi oluşturun.</p>

        {!isFirebaseReady ? (
          <Alert
            type="error"
            showIcon
            message="Firebase ortam değişkenleri tanımlı olmadığı için gerçek kayıt yapılamıyor."
            className="pasaj-auth-alert"
          />
        ) : null}
        {formError ? (
          <Alert type="error" showIcon message={formError} className="pasaj-auth-alert" />
        ) : null}

        <Form layout="vertical" className="pasaj-auth-form">
          <Form.Item label="Ad Soyad">
            <Input
              placeholder="Adınızı ve soyadınızı girin"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              onPressEnter={handleRegister}
              disabled={isAuthLoading}
              size="large"
            />
          </Form.Item>
          <Form.Item label="E-posta">
            <Input
              type="email"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onPressEnter={handleRegister}
              disabled={isAuthLoading}
              size="large"
            />
          </Form.Item>
          <Form.Item label="Şifre">
            <Input.Password
              placeholder="En az 6 karakter"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onPressEnter={handleRegister}
              disabled={isAuthLoading}
              size="large"
            />
          </Form.Item>
          <Button
            className="pasaj-auth-primary"
            htmlType="button"
            size="large"
            icon={<UserAddOutlined />}
            onClick={handleRegister}
            loading={isAuthLoading}
            disabled={!isFirebaseReady}
            block
          >
            Üye Ol
          </Button>
        </Form>

        <div className="pasaj-auth-divider">
          <span>veya</span>
        </div>

        <Link to={ROUTES.login} className="pasaj-auth-secondary">
          <LoginOutlined />
          Giriş Yap
        </Link>
      </section>
    </main>
  );
};
