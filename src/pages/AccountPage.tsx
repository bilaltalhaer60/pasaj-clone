import { Tabs } from "antd";
import { PageShell } from "../app/page-shell";

export const AccountPage = () => {
  return (
    <PageShell
      title="Hesabım"
      description="Alt hesap akışları için üst seviye route kabuğu hazırlandı."
    >
      <Tabs
        items={[
          { key: "orders", label: "Siparişler", children: "Siparişler alanı sonraki haftalarda gelecek." },
          { key: "favorites", label: "Favoriler", children: "Favoriler alanı sonraki haftalarda gelecek." },
          { key: "profile", label: "Profil", children: "Profil alanı sonraki haftalarda gelecek." }
        ]}
      />
    </PageShell>
  );
};
