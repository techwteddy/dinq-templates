'use client';

interface DrinkCounterProps {
  drinks: number;
  onDecrement: () => void;
  disabled?: boolean;
}

export function DrinkCounter({ drinks, onDecrement, disabled = false }: DrinkCounterProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-8xl font-bold mb-4 text-white">{drinks}</div>
      <button
        onClick={onDecrement}
        disabled={disabled || drinks <= 0}
        className="w-40 h-40 rounded-full bg-orange-600 text-white text-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-700"
      >
        {drinks > 0 ? 'Tap to drink' : 'No drinks left!'}
      </button>
    </div>
  );
}
