import { Center, Left, Right } from "./FooterContent";

export default function MenuFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6 grid grid-cols-1 gap-10 md:grid-cols-3">
        <Left />
        <Center />
        <Right />
      </div>
    </footer>
  );
}
