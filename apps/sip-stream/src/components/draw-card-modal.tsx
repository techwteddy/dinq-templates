import { Dialog } from "primereact/dialog";

interface DrawCardModalProps {
  visible: boolean;
  onHide: () => void;
  cardText: string;
}

export function DrawCardModal({
  visible,
  onHide,
  cardText,
}: DrawCardModalProps) {
  return (
    <Dialog header="Draw Card" visible={visible} onHide={onHide}>
      <div className="text-lg">{cardText}</div>
    </Dialog>
  );
}
