import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AdminRoute } from "./AdminRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthStore } from "../store/authStore";

const renderWithRoutes = (element: ReactElement, initialEntry: string) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/" element={<div>Home page</div>} />
        <Route path="/account" element={element} />
        <Route path="/admin" element={element} />
      </Routes>
    </MemoryRouter>
  );

describe("route guards", () => {
  beforeEach(() => {
    useAuthStore.persist.clearStorage();
    useAuthStore.setState({
      isLoggedIn: false,
      user: null
    });
  });

  it("redirects guests from protected routes to login", () => {
    renderWithRoutes(
      <ProtectedRoute>
        <div>Account page</div>
      </ProtectedRoute>,
      "/account"
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("renders protected content for logged in users", () => {
    useAuthStore.setState({
      isLoggedIn: true,
      user: {
        fullName: "Bilal",
        email: "user@example.com",
        phone: "",
        membership: "Silver",
        role: "user",
        orders: [],
        favorites: [],
        addresses: []
      }
    });

    renderWithRoutes(
      <ProtectedRoute>
        <div>Account page</div>
      </ProtectedRoute>,
      "/account"
    );

    expect(screen.getByText("Account page")).toBeInTheDocument();
  });

  it("renders nested outlet content for protected routes without explicit children", () => {
    useAuthStore.setState({
      isLoggedIn: true,
      user: {
        fullName: "Bilal",
        email: "user@example.com",
        phone: "",
        membership: "Silver",
        role: "user",
        orders: [],
        favorites: [],
        addresses: []
      }
    });

    render(
      <MemoryRouter initialEntries={["/account"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<div>Nested account page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Nested account page")).toBeInTheDocument();
  });

  it("redirects guests from admin routes to login", () => {
    renderWithRoutes(
      <AdminRoute>
        <div>Admin page</div>
      </AdminRoute>,
      "/admin"
    );

    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("redirects non-admin users to home", () => {
    useAuthStore.setState({
      isLoggedIn: true,
      user: {
        fullName: "Bilal",
        email: "user@example.com",
        phone: "",
        membership: "Silver",
        role: "user",
        orders: [],
        favorites: [],
        addresses: []
      }
    });

    renderWithRoutes(
      <AdminRoute>
        <div>Admin page</div>
      </AdminRoute>,
      "/admin"
    );

    expect(screen.getByText("Home page")).toBeInTheDocument();
  });

  it("renders admin content for admin users", () => {
    useAuthStore.setState({
      isLoggedIn: true,
      user: {
        fullName: "Bilal",
        email: "admin@example.com",
        phone: "",
        membership: "Platin",
        role: "admin",
        orders: [],
        favorites: [],
        addresses: []
      }
    });

    renderWithRoutes(
      <AdminRoute>
        <div>Admin page</div>
      </AdminRoute>,
      "/admin"
    );

    expect(screen.getByText("Admin page")).toBeInTheDocument();
  });

  it("renders nested outlet content for admin routes without explicit children", () => {
    useAuthStore.setState({
      isLoggedIn: true,
      user: {
        fullName: "Bilal",
        email: "admin@example.com",
        phone: "",
        membership: "Platin",
        role: "admin",
        orders: [],
        favorites: [],
        addresses: []
      }
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Nested admin page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Nested admin page")).toBeInTheDocument();
  });
});

