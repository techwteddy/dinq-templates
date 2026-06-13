"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
	const router = useRouter();

	return (
		<main className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-6">
			<div className="text-center max-w-md">
				{/* Logo */}
				<div className="flex justify-center mb-8">
					<Logo size="lg" />
				</div>

				{/* 404 Text */}
				<h1 className="text-8xl font-bold text-gray-900 mb-4 tracking-tight">
					4<span className="text-blue-500">0</span>4
				</h1>

				<h2 className="text-2xl font-semibold text-gray-900 mb-3">
					Page not found
				</h2>

				<p className="text-gray-500 mb-8">
					Sorry, we couldn't find the page you're looking for. It might have
					been moved or doesn't exist.
				</p>

				{/* Go Back Button */}
				<button
					type="button"
					onClick={() => router.back()}
					className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
				>
					<ArrowLeft className="h-4 w-4" />
					Go back
				</button>
			</div>
		</main>
	);
}
