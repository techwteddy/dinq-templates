interface StatusBadgeProps {
  status: string;
  type?: "vehicle" | "driver" | "reservation" | "role";
}

export function StatusBadge({ status, type = "vehicle" }: StatusBadgeProps) {
  const getStyles = () => {
    if (type === "vehicle") {
      switch (status.toLowerCase()) {
        case "available":
          return "bg-green-100 text-green-800 border-green-200";
        case "maintenance":
          return "bg-red-100 text-red-800 border-red-200";
        case "unavailable":
          return "bg-gray-100 text-gray-800 border-gray-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }

    if (type === "driver") {
      switch (status.toLowerCase()) {
        case "available":
          return "bg-green-100 text-green-800 border-green-200";
        case "on_trip":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "unavailable":
          return "bg-gray-100 text-gray-800 border-gray-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }

    if (type === "reservation") {
      switch (status.toLowerCase()) {
        case "pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "approved":
          return "bg-green-100 text-green-800 border-green-200";
        case "completed":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "cancelled":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }

    if (type === "role") {
      switch (status.toLowerCase()) {
        case "supervisor":
          return "bg-purple-100 text-purple-800 border-purple-200";
        case "admin":
          return "bg-gray-100 text-gray-800 border-gray-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }

    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatStatus = () => {
    if (status === "on_trip") return "On Trip";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStyles()}`}
    >
      {formatStatus()}
    </span>
  );
}




