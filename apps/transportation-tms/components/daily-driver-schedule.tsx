"use client";

import { X, Copy, Check } from "lucide-react";
import { Reservation } from "@/lib/types";
import { useState, useMemo } from "react";
import { formatGMT8 } from "@/lib/date-utils";

interface DailyDriverScheduleProps {
  date: Date;
  reservations: Reservation[];
  onClose: () => void;
}

export default function DailyDriverSchedule({ date, reservations, onClose }: DailyDriverScheduleProps) {
  const [copied, setCopied] = useState(false);

  // Group reservations by driver and sort by departure time
  const groupedReservations = useMemo(() => {
    const grouped: Record<string, Reservation[]> = {};
    
    reservations.forEach((reservation) => {
      const driverName = reservation.driver?.name || "Unassigned";
      if (!grouped[driverName]) {
        grouped[driverName] = [];
      }
      grouped[driverName].push(reservation);
    });

    // Sort each driver's reservations by departure time
    Object.keys(grouped).forEach((driverName) => {
      grouped[driverName].sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
    });

    return grouped;
  }, [reservations]);

  // Generate schedule text
  const scheduleText = useMemo(() => {
    const dateStr = formatGMT8(date.toISOString(), "MMMM dd, yyyy");
    let text = `📅 DAILY DRIVER SCHEDULE\nDate: ${dateStr}\n\n`;

    const driverNames = Object.keys(groupedReservations).sort();
    
    if (driverNames.length === 0) {
      text += "No reservations scheduled for this date.\n";
    } else {
      driverNames.forEach((driverName) => {
        text += `👤 Driver: ${driverName}\n`;
        
        groupedReservations[driverName].forEach((reservation) => {
          const departureTime = formatGMT8(reservation.start_time, "h:mm a");
          const returnTime = formatGMT8(reservation.end_time, "h:mm a");
          
          text += `${departureTime} | ${reservation.purpose} | ${reservation.departure_area} → ${reservation.destination}\n`;
          text += `Departure: ${departureTime} | Return: ${returnTime}\n\n`;
        });
      });
    }

    text += "---\nUC Transportation - Daily Schedule";
    return text;
  }, [date, groupedReservations]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scheduleText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      alert("Failed to copy text. Please select and copy manually.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Daily Driver Schedule
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Schedule Text Content */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
            <pre className="font-mono text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
{scheduleText}
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


