"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft, Sparkles, Brain, FileQuestion, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);

		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const floatingElements = [
		{ icon: Brain, delay: 0, duration: 6 },
		{ icon: Sparkles, delay: 1, duration: 8 },
		{ icon: FileQuestion, delay: 2, duration: 7 },
		{ icon: Zap, delay: 0.5, duration: 9 },
	];

	return (
		<div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
			{/* Animated background */}
			<div className="fixed inset-0 -z-10">
				{/* Mouse follower gradient */}
				<div
					className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
					style={{
						left: mousePosition.x - 192,
						top: mousePosition.y - 192,
					}}
				/>

				{/* Static floating orbs */}
				<div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl animate-float-slow" />
				<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-full blur-3xl animate-float-slower" />
				<div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl animate-float" />

				{/* Grid pattern */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[length:50px_50px]" />
			</div>

			{/* Floating icons */}
			{floatingElements.map((element, index) => {
				const Icon = element.icon;
				return (
					<div
						key={index}
						className="absolute opacity-20 text-purple-400"
						style={{
							left: `${20 + index * 20}%`,
							top: `${30 + index * 15}%`,
							animation: `float ${element.duration}s ease-in-out infinite`,
							animationDelay: `${element.delay}s`,
						}}
					>
						<Icon className="w-8 h-8" />
					</div>
				);
			})}

			{/* Main content */}
			<div className="relative z-10 min-h-screen flex items-center justify-center px-6">
				<div className="text-center max-w-2xl mx-auto">
					{/* 404 Number with glitch effect */}
					<div
						className={`relative mb-8 transition-all duration-1000 ${
							isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
						}`}
					>
						<div className="text-[12rem] md:text-[16rem] font-black leading-none relative">
							<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
								404
							</span>

							{/* Glitch overlay */}
							<span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent opacity-0 animate-pulse">
								404
							</span>
						</div>

						{/* Decorative elements around 404 */}
						<div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-purple-500 animate-pulse" />
						<div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2 border-pink-500 animate-pulse animation-delay-200" />
						<div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2 border-blue-500 animate-pulse animation-delay-400" />
						<div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-500 animate-pulse animation-delay-600" />
					</div>

					{/* Error message */}
					<div
						className={`mb-12 transition-all duration-1000 delay-300 ${
							isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
						}`}
					>
						<h1 className="text-3xl md:text-4xl font-bold mb-4">Oops! Page Not Found</h1>
						<p className="text-lg text-zinc-400 mb-8 leading-relaxed">
							Looks like this page got lost in the digital void. Don&apos;t worry, even our AI couldn&apos;t find it!
							You can contribute to the project on GitHub to help improve the experience.
						</p>

						{/* Animated search suggestion */}
						<Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm max-w-md mx-auto mb-4">
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-3">
									<Search className="w-5 h-5 text-purple-400 animate-pulse" />
									<span className="text-sm text-zinc-300">Maybe you were looking for:</span>
								</div>
								<div className="space-y-2 text-left">
									<Link href="/" className="block text-sm text-zinc-400 hover:text-purple-400 transition-colors">
										→ Home page
									</Link>
									<Link href="/pricing" className="block text-sm text-zinc-400 hover:text-purple-400 transition-colors">
										→ Pricing plans
									</Link>
									<Link href="/about" className="block text-sm text-zinc-400 hover:text-purple-400 transition-colors">
										→ About us
									</Link>
									<Link
										href="https://github.com/Er-luffy-d/Simplifai"
										className="block text-sm text-zinc-400 hover:text-purple-400 transition-colors"
									>
										→ Github
									</Link>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Action buttons */}
					<div
						className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${
							isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
						}`}
					>
						<Button
							asChild
							className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-8 group"
						>
							<Link href="/">
								<Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
								Go Home
							</Link>
						</Button>

						<Button
							variant="outline"
							onClick={() => window.history.back()}
							className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 px-8 group"
						>
							<ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
							Go Back
						</Button>
					</div>

					{/* Fun fact */}
					<div
						className={`my-10 transition-all duration-1000 delay-700 ${
							isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
						}`}
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-400 ">
							<Sparkles className="w-4 h-4 text-purple-400 animate-spin-slow" />
							<span>Fun fact: 404 errors were named after room 404 at CERN</span>
						</div>
					</div>
				</div>
			</div>

			{/* Animated particles */}
			<div className="fixed inset-0 pointer-events-none">
				{Array.from({ length: 20 }).map((_, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-float"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`,
							animationDuration: `${3 + Math.random() * 4}s`,
						}}
					/>
				))}
			</div>

			{/* Bottom decoration */}
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
		</div>
	);
}
