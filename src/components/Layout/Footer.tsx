import { Col, Row, Typography } from "antd";

const footerColumns = [
  {
    title: "Kurumsal",
    items: ["Hakkımızda", "Kariyer", "İletişim"]
  },
  {
    title: "Müşteri Hizmetleri",
    items: ["Sipariş Takibi", "İade", "Yardım Merkezi"]
  },
  {
    title: "Staj Projesi",
    items: ["React + TypeScript", "Vite", "React Router"]
  }
];

export const Footer = () => {
  return (
    <footer className="site-footer">
      <Row gutter={[24, 24]}>
        {footerColumns.map((column) => (
          <Col xs={24} md={8} key={column.title}>
            <Typography.Title level={5}>{column.title}</Typography.Title>
            {column.items.map((item) => (
              <Typography.Paragraph key={item} type="secondary">
                {item}
              </Typography.Paragraph>
            ))}
          </Col>
        ))}
      </Row>
    </footer>
  );
};
