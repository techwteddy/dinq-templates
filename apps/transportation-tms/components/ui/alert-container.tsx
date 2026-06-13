"use client";

import { Alert, AlertBox } from "./alert";

interface AlertContainerProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";
}

export function AlertContainer({
  alerts,
  onDismiss,
  position = "top-right",
}: AlertContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2";
      default:
        return "top-4 right-4";
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div
      className={`fixed z-[9999] flex max-h-screen w-full max-w-sm flex-col gap-2 overflow-y-auto p-4 ${getPositionClasses()}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {alerts.map((alert) => (
        <AlertBox key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </div>
  );
}




