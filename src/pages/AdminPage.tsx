import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
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
import {
  AppstoreOutlined,
  BarChartOutlined,
  HomeOutlined,
  PlusOutlined,
  ShoppingOutlined,
  UserOutlined
} from "@ant-design/icons";
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
  "Hazırlanıyor",
  "Kargoda",
  "Teslim Edildi",
  "İptal Edildi"
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
          label="Ürün adı"
          name="name"
          rules={[{ required: true, message: "Ürün adı zorunlu." }]}
        >
          <Input placeholder="Samsung Galaxy S25" />
        </Form.Item>
      </Col>
      <Col xs={24} md={12}>
        <Form.Item label="Slug" name="slug">
          <Input placeholder="Boş bırakılırsa otomatik üretilir" />
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
        <Form.Item label="Satış fiyatı" name="price" rules={[{ required: true, message: "Fiyat zorunlu." }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item label="Eski fiyat" name="previousPrice">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col xs={24}>
        <Form.Item label="Görsel URL" name="image">
          <Input placeholder="https://..." />
        </Form.Item>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
        />
        <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
          Firebase Storage aktifse seçilen dosya yüklenir. Dosya seçmezseniz mevcut URL kullanılır.
        </Typography.Paragraph>
        {selectedFile ? (
          <Typography.Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
            Seçilen dosya: {selectedFile.name}
          </Typography.Paragraph>
        ) : null}
      </Col>
      <Col xs={24}>
        <Form.Item label="Kısa açıklama" name="summary">
          <Input.TextArea rows={3} placeholder="Ürün yönetim panelinden eklendi." />
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
        editingProduct ? "Ürün kaydı güncellendi." : "Yeni ürün başarıyla eklendi."
      );
      resetProductModal();
    },
    onError: (error) => {
      messageApi.error(error instanceof Error ? error.message : "Ürün kaydı tamamlanamadı.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductById,
    onSuccess: async () => {
      await invalidateAdminData();
      messageApi.success("Ürün silindi.");
    },
    onError: (error) => {
      messageApi.error(error instanceof Error ? error.message : "Ürün silinemedi.");
    }
  });

  const orderStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderRecord["status"] }) =>
      updateOrderStatus(orderId, status),
    onSuccess: async () => {
      await invalidateAdminData();
      messageApi.success("Sipariş durumu güncellendi.");
    },
    onError: (error) => {
      messageApi.error(error instanceof Error ? error.message : "Sipariş durumu güncellenemedi.");
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
      title: "Ürün",
      dataIndex: "name",
      render: (_, record) => (
        <div className="pasaj-admin-product-cell">
          <img src={record.image} alt={record.name} />
          <span>
            <Typography.Text strong>{record.name}</Typography.Text>
            <Typography.Text type="secondary">{record.brand}</Typography.Text>
          </span>
        </div>
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
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <Space wrap>
          <Button onClick={() => openEditModal(record)}>Düzenle</Button>
          <Popconfirm
            title="Ürün silinsin mi?"
            description="Bu işlem Firestore kaydını kaldırır."
            okText="Sil"
            cancelText="İptal"
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
      title: "Sipariş",
      dataIndex: "orderNumber",
      render: (value: string, record) => (
        <Space direction="vertical" size={2}>
          <Typography.Text strong>{value}</Typography.Text>
          <Typography.Text type="secondary">{formatOrderDate(record.createdAt)}</Typography.Text>
        </Space>
      )
    },
    {
      title: "Müşteri",
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
    <main className="pasaj-admin-page">
      <section className="pasaj-admin-shell">
        <div className="pasaj-admin-header">
          <div>
            <span className="pasaj-admin-eyebrow">Pasaj Yönetim Merkezi</span>
            <h1>Admin Panel</h1>
            <p>Ürünleri, siparişleri ve operasyon özetini tek ekrandan yönetin.</p>
          </div>
          <div className="pasaj-admin-actions">
            <Link to={ROUTES.account} className="pasaj-admin-outline-button">
              <UserOutlined />
              Hesabım
            </Link>
            <Link to={ROUTES.home} className="pasaj-admin-outline-button">
              <HomeOutlined />
              Mağazaya Dön
            </Link>
          </div>
        </div>
      {messageContext}
      {!isFirebaseReady ? (
        <Alert
          type="warning"
          showIcon
          message="Firebase ayarları eksik olduğu için admin panelindeki veri işlemeleri çalışmayabilir."
          style={{ marginBottom: 16 }}
        />
      ) : null}
      {!storage ? (
        <Alert
          type="info"
          showIcon
          message="Firebase Storage bağlantısı yok. Görsel için doğrudan URL girebilirsiniz."
          style={{ marginBottom: 16 }}
        />
      ) : null}
      <Tabs
        className="pasaj-admin-tabs"
        items={[
          {
            key: "dashboard",
            label: (
              <span className="pasaj-admin-tab-label">
                <BarChartOutlined />
                Dashboard
              </span>
            ),
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
                        <Statistic title="Toplam Ürün" value={products.length} />
                      </Card>
                    </Col>
                    <Col xs={24} md={12} xl={6}>
                      <Card className="admin-stat-card">
                        <Statistic title="Bugünkü Sipariş" value={todaysOrderCount} />
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
                        <Statistic title="Düşük Stok" value={lowStockCount} suffix="/ kritik" />
                      </Card>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col xs={24} xl={14}>
                      <Card className="admin-panel-card" title="Son 7 gün sipariş grafiği">
                        {orders.length === 0 ? (
                          <Empty description="Henüz sipariş kaydı yok." image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
                      <Card className="admin-panel-card" title="Operasyon özeti">
                        <Space direction="vertical" size={14} style={{ width: "100%" }}>
                          <div className="admin-summary-row">
                            <span>Toplam sipariş</span>
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
                            <span>İptal edilen</span>
                            <strong>{orders.filter((order) => order.status === "İptal Edildi").length}</strong>
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
            label: (
              <span className="pasaj-admin-tab-label">
                <AppstoreOutlined />
                Ürün Yönetimi
              </span>
            ),
            children: (
              <Card
                className="admin-panel-card"
                title="Firestore ürün kayıtları"
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                    Yeni ürün
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
                        : "Ürünler yüklenemedi."
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
            label: (
              <span className="pasaj-admin-tab-label">
                <ShoppingOutlined />
                Sipariş Yönetimi
              </span>
            ),
            children: (
              <Card className="admin-panel-card" title="Tüm siparişler">
                {ordersQuery.error ? (
                  <Alert
                    type="error"
                    showIcon
                    message={
                      ordersQuery.error instanceof Error
                        ? ordersQuery.error.message
                        : "Siparişler yüklenemedi."
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
        title={editingProduct ? "Ürünü düzenle" : "Yeni ürün ekle"}
        open={modalOpen}
        onCancel={resetProductModal}
        onOk={handleProductSubmit}
        confirmLoading={productMutation.isPending}
        okText={editingProduct ? "Kaydet" : "Oluştur"}
        cancelText="İptal"
        width={760}
      >
        <ProductForm form={form} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
      </Modal>
      </section>
    </main>
  );
};

