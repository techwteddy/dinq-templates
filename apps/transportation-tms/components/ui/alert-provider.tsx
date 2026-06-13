"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Alert, AlertType } from "./alert";
import { AlertContainer } from "./alert-container";

interface AlertContextType {
  showAlert: (
    type: AlertType,
    message: string,
    options?: {
      title?: string;
      duration?: number;
      dismissible?: boolean;
    }
  ) => void;
  showSuccess: (message: string, title?: string, duration?: number) => void;
  showError: (message: string, title?: string, duration?: number) => void;
  showWarning: (message: string, title?: string, duration?: number) => void;
  showInfo: (message: string, title?: string, duration?: number) => void;
  dismissAlert: (id: string) => void;
  clearAll: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = useCallback(
    (
      type: AlertType,
      message: string,
      options?: {
        title?: string;
        duration?: number;
        dismissible?: boolean;
      }
    ) => {
      const id = `alert-${Date.now()}-${Math.random()}`;
      const newAlert: Alert = {
        id,
        type,
        message,
        title: options?.title,
        duration: options?.duration ?? 5000,
        dismissible: options?.dismissible ?? true,
      };

      setAlerts((prev) => [...prev, newAlert]);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, title?: string, duration?: number) => {
      showAlert("success", message, { title, duration });
    },
    [showAlert]
  );

  const showError = useCallback(
    (message: string, title?: string, duration?: number) => {
      showAlert("error", message, { title, duration: duration ?? 7000 }); // Errors stay longer by default
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (message: string, title?: string, duration?: number) => {
      showAlert("warning", message, { title, duration });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (message: string, title?: string, duration?: number) => {
      showAlert("info", message, { title, duration });
    },
    [showAlert]
  );

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        dismissAlert,
        clearAll,
      }}
    >
      {children}
      <AlertContainer alerts={alerts} onDismiss={dismissAlert} />
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}




