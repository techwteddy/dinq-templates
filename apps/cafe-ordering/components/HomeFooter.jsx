import { Center, Left, Right } from "./FooterContent";

export default function HomeFooter() {
  return (
    <footer className="mt-11 pb-16">
      <div className="max-w-full mx-auto ">
        <div className="bg-white rounded-3xl shadow-sm px-10 py-12">
          <div className="grid gap-16 md:grid-cols-3">
            <Left />
            <Center />
            <Right />
          </div>
        </div>
      </div>
    </footer>
  );
}
