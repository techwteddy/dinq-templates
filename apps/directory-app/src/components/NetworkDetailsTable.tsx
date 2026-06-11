import React from "react";

const EXCLUDE_FIELDS = [
  "id", "logo_url", "description", "name", "website", "category", "rating", "countries"
];

function prettifyLabel(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

export default function NetworkDetailsTable({ network }: { network: any }) {
  return (
    <div className="p-0 sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-[#e6c77c] sm:p-8 sm:mb-8 mb-2">
      <h2 className="text-base sm:text-xl font-semibold text-[#bfa14a] mb-3 sm:mb-6 flex items-center tracking-wide" style={{letterSpacing: '0.02em'}}>
        <span className="w-1 h-4 sm:w-2 sm:h-8 bg-gradient-to-r from-[#e6c77c] to-[#bfa14a] rounded-full mr-2 sm:mr-4"></span>
        Affiliate Network Details
      </h2>
      <table className="w-full text-xs sm:text-[15px] font-light text-gray-900 border-separate border-spacing-y-1 sm:border-spacing-y-2" style={{fontFamily: 'Inter, ui-sans-serif, system-ui'}}>
        <tbody>
          {Object.entries(network)
            .filter(([key]) => !EXCLUDE_FIELDS.includes(key))
            .map(([key, value]) => (
              <tr key={key}>
                <td className="py-1 pr-2 sm:py-2 sm:pr-4 text-gray-500 font-medium whitespace-nowrap" style={{fontSize: '13px', letterSpacing: '0.01em'}}>{prettifyLabel(key)}</td>
                <td className="py-1 pl-1 sm:py-2 sm:pl-2 text-gray-900 font-semibold" style={{fontSize: '14px', color: '#bfa14a'}}>
                  {Array.isArray(value)
                    ? value.join(", ")
                    : value !== null && value !== undefined
                    ? String(value)
                    : "-"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
} 