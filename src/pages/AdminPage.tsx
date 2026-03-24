import { Alert, Table, type TableColumnsType } from "antd";
import { PageShell } from "../app/page-shell";

type ProductRow = {
  key: string;
  name: string;
  category: string;
  stock: number;
};

const columns: TableColumnsType<ProductRow> = [
  { title: "Ürün", dataIndex: "name" },
  { title: "Kategori", dataIndex: "category" },
  { title: "Stok", dataIndex: "stock" }
];

const data: ProductRow[] = [
  { key: "1", name: "iPhone 16 Pro", category: "Telefon", stock: 12 },
  { key: "2", name: "MacBook Air M4", category: "Bilgisayar", stock: 7 }
];

export const AdminPage = () => {
  return (
    <PageShell
      title="Admin Panel"
      description="İleri haftalarda tablo, CRUD ve Firebase Storage burada genişletilecek. Şimdilik rota ve yönetim kabuğu hazır."
    >
      <Alert
        type="warning"
        showIcon
        message="Bu alan normal kullanıcıya kapatılacak. Yetkilendirme daha sonra eklenecek."
        style={{ marginBottom: 16 }}
      />
      <Table columns={columns} dataSource={data} pagination={false} />
    </PageShell>
  );
};
