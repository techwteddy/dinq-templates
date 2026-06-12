'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-accent">404</h1>
          <p className="text-2xl font-semibold text-slate-200 mt-4">Page Not Found</p>
          <p className="text-slate-400 mt-2">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="space-y-4">
          <a
            href="/"
            className="inline-block px-8 py-3 bg-accent text-white font-bold rounded-lg hover:bg-accent/90 transition transform hover:scale-105"
          >
            Go Back Home
          </a>
          <p className="text-slate-400 text-sm">
            Need help? <a href="/contact" className="text-accent hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
