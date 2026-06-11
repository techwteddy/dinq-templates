"use client";

import { Toaster } from "react-hot-toast";

export default function StoreToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ margin: "12px" }}
      toastOptions={{
        style: {
          fontSize: "14px",
          maxWidth: "420px",
          padding: "14px 18px",
          borderRadius: "14px",
          background: "#ffffff",
          color: "#1f2937", // gray-800
          border: "1px solid #e5e7eb", // gray-200
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.12)",
          fontWeight: 500,
        },

        success: {
          duration: 3000,
          iconTheme: {
            primary: "#22c55e", // green-500
            secondary: "#ffffff",
          },
          style: {
            borderLeft: "4px solid #22c55e",
          },
        },

        error: {
          duration: 5000,
          iconTheme: {
            primary: "#ef4444", // red-500
            secondary: "#ffffff",
          },
          style: {
            borderLeft: "4px solid #ef4444",
          },
        },

        loading: {
          iconTheme: {
            primary: "#f97316", // orange-500
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
