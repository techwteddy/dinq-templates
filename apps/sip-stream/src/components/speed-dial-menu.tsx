'use client';

import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

interface SpeedDialMenuProps {
  onNextTurn: () => void;
  onDrawCard: () => void;
  onAddDrinks: (count: number) => void;
}

export function SpeedDialMenu({ onNextTurn, onDrawCard, onAddDrinks }: SpeedDialMenuProps) {
  const toast = useRef<Toast>(null);

  const items = [
    {
      label: 'Next Turn',
      icon: 'pi pi-forward',
      command: () => {
        onNextTurn();
        toast.current?.show({
          severity: 'info',
          summary: 'Turn Changed',
          detail: "Next player's turn!",
          life: 2000,
        });
      },
    },
    {
      label: 'Draw Card',
      icon: 'pi pi-star',
      command: () => {
        onDrawCard();
        toast.current?.show({
          severity: 'warn',
          summary: 'Card Drawn',
          detail: 'Check the card details!',
          life: 3000,
        });
      },
    },
    {
      label: '+1 Drink',
      icon: 'pi pi-plus',
      command: () => {
        onAddDrinks(1);
        toast.current?.show({
          severity: 'error',
          summary: 'Drink Added',
          detail: '1 drink added to the count!',
          life: 2000,
        });
      },
    },
    {
      label: '+2 Drinks',
      icon: 'pi pi-plus-circle',
      command: () => {
        onAddDrinks(2);
        toast.current?.show({
          severity: 'error',
          summary: 'Drinks Added',
          detail: '2 drinks added to the count!',
          life: 2000,
        });
      },
    },
  ];

  return (
    <>
      <Toast ref={toast} />
      <SpeedDial
        model={items}
        direction="up"
        style={{ right: '2rem', bottom: '2rem' }}
        buttonClassName="p-button-rounded p-button-warning"
        showIcon="pi pi-bars"
        hideIcon="pi pi-times"
      />
    </>
  );
}
