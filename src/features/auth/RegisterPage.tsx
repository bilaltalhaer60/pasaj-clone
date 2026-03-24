import { Button, Card, Form, Input, Typography } from 'antd';

export function RegisterPage() {
  return (
    <div className="auth-shell">
      <Card className="auth-card">
        <Typography.Title level={2}>Hesap Oluştur</Typography.Title>
        <Form layout="vertical">
          <Form.Item label="Ad Soyad">
            <Input placeholder="Ad Soyad" />
          </Form.Item>
          <Form.Item label="E-posta">
            <Input placeholder="ornek@pasaj.com" />
          </Form.Item>
          <Form.Item label="Şifre">
            <Input.Password placeholder="Şifre belirleyin" />
          </Form.Item>
          <Button type="primary" block>
            Kayıt Ol
          </Button>
        </Form>
      </Card>
    </div>
  );
}
