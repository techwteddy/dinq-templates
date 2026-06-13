'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your FarmBridge account</p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email or Phone Number</label>
            <input type="text" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition" placeholder="you@example.com or 0800 000 0000" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition" placeholder="••••••••" required />
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-green-700 hover:underline">Forgot Password?</Link>
          </div>
          <button type="submit" className="w-full bg-green-900 text-white rounded-xl py-3.5 font-semibold hover:bg-green-800 transition">Sign In</button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account? <Link href="/signup" className="text-green-700 font-medium hover:underline">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
