import { ReactNode } from "react";
import { Button, Card, Col, Row, Space, Tag, Typography } from "antd";
import { Link } from "react-router-dom";

type PageShellProps = {
  title: string;
  description: string;
  nextTargets?: Array<{ label: string; to: string }>;
  children?: ReactNode;
};

export const PageShell = ({
  title,
  description,
  nextTargets,
  children
}: PageShellProps) => {
  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Card className="hero-card">
        <Tag color="gold">1. Hafta Teslimi</Tag>
        <Typography.Title level={1}>{title}</Typography.Title>
        <Typography.Paragraph>{description}</Typography.Paragraph>
        {nextTargets && nextTargets.length > 0 ? (
          <Space wrap>
            {nextTargets.map((target) => (
              <Button key={target.to} type="primary">
                <Link to={target.to}>{target.label}</Link>
              </Button>
            ))}
          </Space>
        ) : null}
      </Card>
      {children}
    </Space>
  );
};

export const RoutePreviewGrid = ({
  items
}: {
  items: Array<{ title: string; description: string; to: string }>;
}) => {
  return (
    <Row gutter={[16, 16]}>
      {items.map((item) => (
        <Col xs={24} md={12} xl={8} key={item.to}>
          <Card className="route-card" title={item.title} extra={<Link to={item.to}>Aç</Link>}>
            <Typography.Paragraph>{item.description}</Typography.Paragraph>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
