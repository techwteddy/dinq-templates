"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

export type AlertType = "success" | "error" | "warning" | "info";

export interface Alert {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number; // in milliseconds, 0 = no auto-dismiss
  dismissible?: boolean;
}

interface AlertProps {
  alert: Alert;
  onDismiss: (id: string) => void;
}

export function AlertBox({ alert, onDismiss }: AlertProps) {
  const {
    id,
    type,
    title,
    message,
    duration = 5000,
    dismissible = true,
  } = alert;

  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          container: "bg-green-50 border-green-200 text-green-800",
          icon: "text-green-400",
          title: "text-green-900",
          message: "text-green-700",
          closeButton: "text-green-500 hover:text-green-700 hover:bg-green-100",
        };
      case "error":
        return {
          container: "bg-red-50 border-red-200 text-red-800",
          icon: "text-red-400",
          title: "text-red-900",
          message: "text-red-700",
          closeButton: "text-red-500 hover:text-red-700 hover:bg-red-100",
        };
      case "warning":
        return {
          container: "bg-yellow-50 border-yellow-200 text-yellow-800",
          icon: "text-yellow-400",
          title: "text-yellow-900",
          message: "text-yellow-700",
          closeButton: "text-yellow-500 hover:text-yellow-700 hover:bg-yellow-100",
        };
      case "info":
        return {
          container: "bg-blue-50 border-blue-200 text-blue-800",
          icon: "text-blue-400",
          title: "text-blue-900",
          message: "text-blue-700",
          closeButton: "text-blue-500 hover:text-blue-700 hover:bg-blue-100",
        };
      default:
        return {
          container: "bg-gray-50 border-gray-200 text-gray-800",
          icon: "text-gray-400",
          title: "text-gray-900",
          message: "text-gray-700",
          closeButton: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`rounded-lg border p-4 shadow-lg transition-all duration-300 ${styles.container}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 ${styles.icon}`}>{getIcon()}</div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${styles.title}`}>{title}</h3>
          )}
          <div className={`text-sm ${title ? "mt-1" : ""} ${styles.message}`}>
            {message}
          </div>
        </div>
        {dismissible && (
          <div className="ml-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => onDismiss(id)}
              className={`inline-flex rounded-md p-1.5 transition-colors ${styles.closeButton}`}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}




