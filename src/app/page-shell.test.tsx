import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PageShell, RoutePreviewGrid } from "./page-shell";

describe("PageShell", () => {
  it("renders its main content and description", () => {
    render(
      <MemoryRouter>
        <PageShell title="Baslik" description="Aciklama">
          <div>Icerik</div>
        </PageShell>
      </MemoryRouter>
    );

    expect(screen.getByText("Baslik")).toBeInTheDocument();
    expect(screen.getByText("Aciklama")).toBeInTheDocument();
    expect(screen.getByText("Icerik")).toBeInTheDocument();
  });

  it("renders navigation targets and route preview cards", () => {
    render(
      <MemoryRouter>
        <>
          <PageShell
            title="Yonlendirme"
            description="Aksiyonlar"
            nextTargets={[{ label: "Hesabım", to: "/account" }]}
          />
          <RoutePreviewGrid
            items={[{ title: "Ürünler", description: "Listeye git", to: "/category/telefon" }]}
          />
        </>
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Hesabım" })).toHaveAttribute("href", "/account");
    expect(screen.getByText("Ürünler")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ac" })).toHaveAttribute(
      "href",
      "/category/telefon"
    );
  });
});

