import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center gap-6">
      <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center text-3xl">
        🔍
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="text-gray-500 max-w-sm">
          We couldn&apos;t find what you were looking for. It may have moved or
          never existed.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium transition"
        >
          Go home
        </Link>
        <Link
          href="/menu"
          className="border border-gray-200 hover:border-gray-300 text-gray-700 px-6 py-2.5 rounded-full font-medium transition"
        >
          Browse menu
        </Link>
      </div>
    </section>
  );
}
