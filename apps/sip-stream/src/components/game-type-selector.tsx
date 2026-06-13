import { Dropdown } from "primereact/dropdown";

interface GameTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const gameTypes = [
  { label: "Kings Cup", value: "kings-cup" },
  { label: "Never Have I Ever", value: "never-have-i-ever" },
  { label: "Custom Deck", value: "custom-deck" },
];

export function GameTypeSelector({ value, onChange }: GameTypeSelectorProps) {
  return (
    <Dropdown
      value={value}
      options={gameTypes}
      onChange={(e) => onChange(e.value)}
      placeholder="Select a game type"
      className="w-full mb-4"
    />
  );
}
