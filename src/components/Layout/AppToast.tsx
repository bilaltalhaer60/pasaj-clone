import { CheckCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useUiStore } from "../../store/uiStore";

export const AppToast = () => {
  const toast = useUiStore((state) => state.toast);
  const clearToast = useUiStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => clearToast(toast.id), 2600);

    return () => window.clearTimeout(timer);
  }, [clearToast, toast]);

  if (!toast) {
    return null;
  }

  const Icon = toast.type === "success" ? CheckCircleOutlined : InfoCircleOutlined;

  return (
    <div className={`pasaj-toast pasaj-toast-${toast.type}`} role="status" aria-live="polite">
      <Icon />
      <span>{toast.message}</span>
    </div>
  );
};

