"use client";

import { X, Copy, Check } from "lucide-react";
import { Reservation } from "@/lib/types";
import { useState } from "react";
import { formatGMT8 } from "@/lib/date-utils";

interface DigitalTicketProps {
  reservation: Reservation;
  onClose: () => void;
}

export default function DigitalTicket({ reservation, onClose }: DigitalTicketProps) {
  const [copied, setCopied] = useState(false);

  const ticketText = `🎫 TRIP TICKET

📅 Date: ${formatGMT8(reservation.start_time, "MMMM dd, yyyy")}

👤 Driver: ${reservation.driver?.name || "N/A"}

📝 Purpose: ${reservation.purpose}

📍 Route: ${reservation.departure_area} → ${reservation.destination}

🕐 Departure: ${formatGMT8(reservation.start_time, "h:mm a")}
🕐 Return: ${formatGMT8(reservation.end_time, "h:mm a")}

---
Official Trip Ticket - UC Transportation`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ticketText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      alert("Failed to copy text. Please select and copy manually.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Digital Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Ticket Text Content */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
            <pre className="font-mono text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
{ticketText}
            </pre>
          </div>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Click the button below to copy and send via messenger or text
          </p>
        </div>

        {/* Copy Button */}
        <div className="p-6 bg-gray-50 border-t">
          <button
            onClick={handleCopy}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors ${
              copied
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-5 w-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                Copy Text
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

