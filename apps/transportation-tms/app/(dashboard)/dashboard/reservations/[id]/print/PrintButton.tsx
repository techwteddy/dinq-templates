"use client";

import { Printer, Download, Smartphone } from "lucide-react";
import { Reservation } from "@/lib/types";
import { useState } from "react";
import DigitalTicket from "@/components/digital-ticket";

interface PrintButtonProps {
  reservation: Reservation;
}

export default function PrintButton({ reservation }: PrintButtonProps) {
  const [showDigitalTicket, setShowDigitalTicket] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.querySelector(".ticket-container") as HTMLElement;
    
    if (!element) {
      alert("Could not find ticket content to save.");
      return;
    }

    const opt = {
      margin: 0.5,
      filename: `trip-ticket-${new Date().getTime()}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "cm", format: "a4", orientation: "portrait" as const },
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to save PDF. Please try printing instead.");
    }
  };

  return (
    <>
      <div className="mt-10 flex gap-4 justify-center print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <Printer className="h-4 w-4" />
          Print
        </button>
        <button
          onClick={handleSaveAsPDF}
          className="bg-green-500 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          Save as PDF
        </button>
        <button
          onClick={() => setShowDigitalTicket(true)}
          className="bg-purple-500 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-purple-600 transition-colors"
        >
          <Smartphone className="h-4 w-4" />
          Digital Ticket
        </button>
      </div>

      {showDigitalTicket && (
        <DigitalTicket 
          reservation={reservation} 
          onClose={() => setShowDigitalTicket(false)} 
        />
      )}
    </>
  );
}

