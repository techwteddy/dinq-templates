import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

export const Dropdown = ({
  icon,
  label,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  options: string[];
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(`Choose ${label}`);

  return (
    <div className="relative">
      <div className="flex gap-1.5 items-center mb-1">
        <span>{icon}</span>
        <p className="font-medium">{label}</p>
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-500 text-sm font-medium cursor-pointer"
      >
        <span>{selected}</span>
        <MdKeyboardArrowDown size={18} />
      </button>
      {open && (
        <ul className="absolute left-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-10">
          {options.map((option) => (
            <li
              key={option}
              className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
              onClick={() => {
                setSelected(option);
                setOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

