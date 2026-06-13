'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join Nigeria&apos;s agricultural marketplace</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input type="text" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition" placeholder="Ibrahim Musa" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email or Phone Number</label>
            <input type="text" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition" placeholder="you@example.com or 0800 000 0000" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-600/20 focus:border-green-700 outline-none transition" placeholder="Min. 8 characters" required />
          </div>
          <button type="submit" className="w-full bg-amber-600 text-white rounded-xl py-3.5 font-semibold hover:bg-amber-700 transition shadow-md">
            Create Account
          </button>
        </form>

        <p className="mt-4 text-xs text-gray-400 text-center">
          By signing up, you are created as a <strong>Buyer</strong>. You can become a Seller anytime from your dashboard.
        </p>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-green-700 font-medium hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
