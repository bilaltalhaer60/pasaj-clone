import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
  type TableColumnsType
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PageShell } from "../app/page-shell";
import { isFirebaseReady, storage } from "../config/firebase";
import { ROUTES } from "../constants/routes";
import { getAllOrders, updateOrderStatus } from "../services/orderService";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  type ProductMutationInput,
  updateProduct,
  uploadProductImage
} from "../services/productService";
import { useAuthStore } from "../store/authStore";
import type { OrderRecord } from "../types/order";
import type { Product } from "../types/product";
import { formatCurrency } from "../utils/formatCurrency";

type ProductFormValues = {
  name: string;
  slug?: string;
  brand: string;
  category: string;
  stock: number;
  price: number;
  previousPrice?: number;
  image: string;
  summary?: string;
};

const ORDER_STATUS_OPTIONS: Array<OrderRecord["status"]> = [
  "Hazirlaniyor",
  "Kargoda",
  "Teslim Edildi",
  "Iptal Edildi"
];

const formatOrderDate = (value: string) =>
  new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));

const buildLastSevenDaySeries = (orders: OrderRecord[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const label = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(
      date
    );
    const count = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === date.getTime();
    }).length;

    return { label, count };
  });
};

const ProductForm = ({
  form,
  selectedFile,
  setSelectedFile
}: {
  form: ReturnType<typeof Form.useForm<ProductFormValues>>[0];
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}) => (
  <Form form={form} layout="vertical">
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          label="Urun adi"
          name="name"
          rules={[{ required: true, message: "Urun adi zorunlu." }]}
        >
          <Input placeholder="Samsung Galaxy S25" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item label="Slug" name="slug">
          <Input placeholder="Bos birakilirsa otomatik uretilir" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item label="Marka" name="brand" rules={[{ required: true, message: "Marka zorunlu." }]}>
          <Input placeholder="Samsung" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item
          label="Kategori"
          name="category"
          rules={[{ required: true, message: "Kategori zorunlu." }]}
        >
          <Input placeholder="Telefon" />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item label="Stok" name="stock" rules={[{ required: true, message: "Stok zorunlu." }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item label="Satis fiyati" name="price" rules={[{ required: true, message: "Fiyat zorunlu." }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item label="Eski fiyat" name="previousPrice">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item label="Gorsel URL" name="image">
          <Input placeholder="https://..." />
        </Form.Item>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
        />
        <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
          Firebase Storage aktifse secilen dosya yuklenir. Dosya secmezsen mevcut URL kullanilir.
        </Typography.Paragraph>
        {selectedFile ? (
          <Typography.Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
            Secilen dosya: {selectedFile.name}
          </Typography.Paragraph>
        ) : null}
      </Col>
      <Col xs={24}>
        <Form.Item label="Kisa aciklama" name="summary">
          <Input.TextArea rows={3} placeholder="Urun yonetim panelinden eklendi." />
        </Form.Item>
      </Col>
    </Row>
  </Form>
);

export const AdminPage = () => {
  const queryClient = useQueryClient();
  const [messageApi, messageContext] = message.useMessage();
  const [form] = Form.useForm<ProductFormValues>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isLoggedIn, user } = useAuthStore();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts
  });
  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders
  });

  const products = productsQuery.data ?? [];
  const orders = ordersQuery.data ?? [];

  const dailySeries = useMemo(() => buildLastSevenDaySeries(orders), [orders]);
  const maxChartValue = useMemo(
    () => Math.max(1, ...dailySeries.map((item) => item.count)),
    [dailySeries]
  );
  const todaysOrderCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length;
  }, [orders]);
  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders]
  );
  const lowStockCount = useMemo(
    () => products.filter((product) => product.stock <= 5).length,
    [products]
  );

  const resetProductModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setSelectedFile(null);
    form.resetFields();
  };

  const invalidateAdminData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["products"] }),
      queryClient.invalidateQueries({ queryKey: ["orders"] })
    ]);
  };

  const productMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      let image = values.image?.trim() ?? "";

      if (selectedFile) {
        image = await uploadProductImage(selectedFile);
      }

      const payload: ProductMutationInput = {
        ...values,
        image
      };

      if (editingProduct) {
        return updateProduct(editingProduct.id, payload);
      }

      return createProduct(payload);
    },
    onSuccess: async () => {
      await invalidateAdminData();
      messageApi.success(
        editingProduct ? "Urun kaydi guncellendi." : "Yeni urun basariyla eklendi."
      );
      resetProductModal();
    },
    onError: (error) => {
      messageApi.error(error instanceof Error ? error.message : "Urun kaydi tamamlanamadi.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductById,
    onSuccess: async () => {
      await invalidateAdminData();
      messageApi.success("Urun silindi.");
    },
    onError: (error) => {
      messageApi.error(error instanceof Error ? error.message : "Urun silinemedi.");
    }
  });

  const orderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderRecord["status"] }) =>
      updateOrderStatus(orderId, status),
    onSuccess: async () => {
      await invalidateAdminData();
      messageApi.success("Siparis durumu guncellendi.");
    },
    onError: (error) => {
      messageApi.error(error instanceof Error ? error.message : "Siparis durumu guncellenemedi.");
    }
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setSelectedFile(null);
    form.setFieldsValue({
      name: "",
      slug: "",
      brand: "",
      category: "",
      stock: 0,
      price: 0,
      previousPrice: undefined,
      image: "",
      summary: ""
    });
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setSelectedFile(null);
    form.setFieldsValue({
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      category: product.category,
      stock: product.stock,
      price: product.price,
      previousPrice: product.previousPrice,
      image: product.image,
      summary: product.summary
    });
    setModalOpen(true);
  };

  const handleProductSubmit = async () => {
    const values = await form.validateFields();
    await productMutation.mutateAsync(values);
  };

  const productColumns: TableColumnsType<Product> = [
    {
      title: "Urun",
      dataIndex: "name",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Typography.Text strong>{record.name}</Typography.Text>
          <Typography.Text type="secondary">{record.brand}</Typography.Text>
        </Space>
      )
    },
    { title: "Kategori", dataIndex: "category" },
    {
      title: "Fiyat",
      dataIndex: "price",
      render: (value: number) => formatCurrency(value)
    },
    {
      title: "Stok",
      dataIndex: "stock",
      render: (value: number) => (
        <Tag color={value <= 5 ? "red" : value <= 15 ? "gold" : "green"}>{value}</Tag>
      )
    },
    {
      title: "Islemler",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Button onClick={() => openEditModal(record)}>Duzenle</Button>
          <Popconfirm
            title="Urun silinsin mi?"
            description="Bu islem Firestore kaydini kaldirir."
            okText="Sil"
            cancelText="Iptal"
            onConfirm={() => deleteMutation.mutate(record.id)}
          >
            <Button danger loading={deleteMutation.isPending}>
              Sil
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const orderColumns: TableColumnsType<OrderRecord> = [
    {
      title: "Siparis",
      dataIndex: "orderNumber",
      render: (value: string, record) => (
        <Space direction="vertical" size={2}>
          <Typography.Text strong>{value}</Typography.Text>
          <Typography.Text type="secondary">{formatOrderDate(record.createdAt)}</Typography.Text>
        </Space>
      )
    },
    {
      title: "Musteri",
      key: "customer",
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Typography.Text>{record.customer.fullName || "-"}</Typography.Text>
          <Typography.Text type="secondary">{record.customer.phone || "-"}</Typography.Text>
        </Space>
      )
    },
    {
      title: "Toplam",
      dataIndex: "total",
      render: (value: number) => formatCurrency(value)
    },
    {
      title: "Durum",
      key: "status",
      render: (_, record) => (
        <Select
          value={record.status}
          style={{ minWidth: 160 }}
          loading={orderStatusMutation.isPending}
          options={ORDER_STATUS_OPTIONS.map((status) => ({ label: status, value: status }))}
          onChange={(status) => orderStatusMutation.mutate({ orderId: record.id, status })}
        />
      )
    }
  ];

  if (!isLoggedIn || !user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to={ROUTES.home} replace />;
  }

  return (
    <PageShell
      badge="7. Hafta Teslimi"
      title="Admin Panel"
      description="Dashboard, urun CRUD, siparis yonetimi ve Firebase Storage gorsel yukleme akisi tek panelde aktif."
      nextTargets={[
        { label: "Hesabim", to: ROUTES.account },
        { label: "Anasayfa", to: ROUTES.home }
      ]}
    >
      {messageContext}
      {!isFirebaseReady ? (
        <Alert
          type="warning"
          showIcon
          message="Firebase ayarlari eksik oldugu icin admin panelindeki veri islemeleri calismayabilir."
          style={{ marginBottom: 16 }}
        />
      ) : null}
      {!storage ? (
        <Alert
          type="info"
          showIcon
          message="Firebase Storage baglantisi yok. Gorsel icin dogrudan URL girebilirsin."
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <Tabs
        items={[
          {
            key: "dashboard",
            label: "Dashboard",
            children:
              productsQuery.isLoading || ordersQuery.isLoading ? (
                <Card className="admin-panel-card">
                  <Skeleton active paragraph={{ rows: 10 }} />
                </Card>
              ) : (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12} xl={6}>
                      <Card className="admin-stat-card">
                        <Statistic title="Toplam Urun" value={products.length} />
                      </Card>
                    </Col>
                    <Col xs={24} md={12} xl={6}>
                      <Card className="admin-stat-card">
                        <Statistic title="Bugunku Siparis" value={todaysOrderCount} />
                      </Card>
                    </Col>
                    <Col xs={24} md={12} xl={6}>
                      <Card className="admin-stat-card">
                        <Statistic
                          title="Toplam Gelir"
                          value={totalRevenue}
                          formatter={(value) => formatCurrency(Number(value))}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} md={12} xl={6}>
                      <Card className="admin-stat-card">
                        <Statistic title="Dusuk Stok" value={lowStockCount} suffix="/ kritik" />
                      </Card>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} xl={14}>
                      <Card className="admin-panel-card" title="Son 7 gun siparis grafigi">
                        {orders.length === 0 ? (
                          <Empty description="Henuz siparis kaydi yok." image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        ) : (
                          <div className="admin-chart-wrap">
                            <svg viewBox="0 0 420 180" className="admin-chart">
                              <polyline
                                fill="none"
                                stroke="#004b93"
                                strokeWidth="4"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                points={dailySeries
                                  .map((item, index) => {
                                    const x = 30 + index * 60;
                                    const y = 150 - (item.count / maxChartValue) * 110;
                                    return `${x},${y}`;
                                  })
                                  .join(" ")}
                              />
                              {dailySeries.map((item, index) => {
                                const x = 30 + index * 60;
                                const y = 150 - (item.count / maxChartValue) * 110;

                                return (
                                  <g key={item.label}>
                                    <circle cx={x} cy={y} r="5" fill="#ffc72c" stroke="#004b93" strokeWidth="3" />
                                    <text x={x} y="172" textAnchor="middle" className="admin-chart-label">
                                      {item.label}
                                    </text>
                                    <text x={x} y={y - 12} textAnchor="middle" className="admin-chart-value">
                                      {item.count}
                                    </text>
                                  </g>
                                );
                              })}
                            </svg>
                          </div>
                        )}
                      </Card>
                    </Col>
                    <Col xs={24} xl={10}>
                      <Card className="admin-panel-card" title="Operasyon ozeti">
                        <Space direction="vertical" size={14} style={{ width: "100%" }}>
                          <div className="admin-summary-row">
                            <span>Toplam siparis</span>
                            <strong>{orders.length}</strong>
                          </div>
                          <div className="admin-summary-row">
                            <span>Teslim edilen</span>
                            <strong>{orders.filter((order) => order.status === "Teslim Edildi").length}</strong>
                          </div>
                          <div className="admin-summary-row">
                            <span>Kargoda</span>
                            <strong>{orders.filter((order) => order.status === "Kargoda").length}</strong>
                          </div>
                          <div className="admin-summary-row">
                            <span>Iptal edilen</span>
                            <strong>{orders.filter((order) => order.status === "Iptal Edildi").length}</strong>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                </Space>
              )
          },
          {
            key: "products",
            label: "Urun Yonetimi",
            children: (
              <Card
                className="admin-panel-card"
                title="Firestore urun kayitlari"
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    Yeni urun
                  </Button>
                }
              >
                {productsQuery.error ? (
                  <Alert
                    type="error"
                    showIcon
                    message={
                      productsQuery.error instanceof Error
                        ? productsQuery.error.message
                        : "Urunler yuklenemedi."
                    }
                  />
                ) : (
                  <Table
                    rowKey="id"
                    columns={productColumns}
                    dataSource={products}
                    loading={productsQuery.isLoading}
                    pagination={{ pageSize: 6 }}
                  />
                )}
              </Card>
            )
          },
          {
            key: "orders",
            label: "Siparis Yonetimi",
            children: (
              <Card className="admin-panel-card" title="Tum siparisler">
                {ordersQuery.error ? (
                  <Alert
                    type="error"
                    showIcon
                    message={
                      ordersQuery.error instanceof Error
                        ? ordersQuery.error.message
                        : "Siparisler yuklenemedi."
                    }
                  />
                ) : (
                  <Table
                    rowKey="id"
                    columns={orderColumns}
                    dataSource={orders}
                    loading={ordersQuery.isLoading}
                    pagination={{ pageSize: 6 }}
                  />
                )}
              </Card>
            )
          }
        ]}
      />

      <Modal
        title={editingProduct ? "Urunu duzenle" : "Yeni urun ekle"}
        open={modalOpen}
        onCancel={resetProductModal}
        onOk={handleProductSubmit}
        confirmLoading={productMutation.isPending}
        okText={editingProduct ? "Kaydet" : "Olustur"}
        cancelText="Iptal"
        width={760}
      >
        <ProductForm form={form} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
      </Modal>
    </PageShell>
  );
};
