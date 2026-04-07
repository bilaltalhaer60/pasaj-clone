import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Space, Spin, Typography } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./styles/global.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ffc72c",
          colorLink: "#004b93",
          borderRadius: 14,
          fontFamily: "'Segoe UI', sans-serif"
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={router}
          fallbackElement={
            <div className="page-loader">
              <Space direction="vertical" size="middle" align="center">
                <Spin size="large" />
                <Typography.Text>Sayfa yukleniyor...</Typography.Text>
              </Space>
            </div>
          }
        />
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>
);
