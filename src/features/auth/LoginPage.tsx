import { Button, Card, Form, Input, Typography } from 'antd';

export function LoginPage() {
  return (
    <div className="auth-shell">
      <Card className="auth-card">
        <Typography.Title level={2}>Giriş Yap</Typography.Title>
        <Form layout="vertical">
          <Form.Item label="E-posta">
            <Input placeholder="ornek@pasaj.com" />
          </Form.Item>
          <Form.Item label="Şifre">
            <Input.Password placeholder="Şifreniz" />
          </Form.Item>
          <Button type="primary" block>
            Giriş Yap
          </Button>
        </Form>
      </Card>
    </div>
  );
}
