"use client";

import {
	ArrowRight,
	BarChart3,
	BookOpen,
	GraduationCap,
	LineChart,
	Menu,
	Sparkles,
	Target,
	TrendingUp,
	X,
	Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export default function HomePage() {
	const [isOpen, setIsOpen] = useState(false);
	const [hidden, setHidden] = useState(false);
	const lastScrollY = useRef(0);
	const [_activeFeatureTab, _setActiveFeatureTab] = useState("predict");

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const scrollingDown = currentScrollY > lastScrollY.current;

			if (scrollingDown && currentScrollY > 60) {
				setHidden(true);
				setIsOpen(false);
			} else if (!scrollingDown) {
				setHidden(false);
			}

			lastScrollY.current = currentScrollY;
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<main className="relative min-h-screen bg-[#fcfdff] overflow-hidden selection:bg-indigo-100 font-sans">
			{/* High-End Ambient Background Blobs */}
			<div className="pointer-events-none absolute top-[-5%] left-[-10%] w-[60%] h-[50%] rounded-full bg-gradient-to-tr from-blue-300/20 to-indigo-300/10 blur-[130px] animate-pulse" />
			<div className="pointer-events-none absolute top-[20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-gradient-to-br from-violet-300/20 to-purple-300/10 blur-[140px]" />
			<div className="pointer-events-none absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px]" />

			{/* Decorative grid pattern */}
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_10%,#000_80%,transparent_100%)]" />

			{/* Sticky Floating Premium Header */}
			<div
				className={`fixed top-6 left-0 right-0 z-50 px-4 transition-transform duration-300 ${
					hidden ? "-translate-y-[calc(100%+2rem)]" : ""
				}`}
			>
				<header className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] px-6 overflow-hidden border-slate-100">
					<div className="h-[60px] flex items-center justify-between shrink-0">
						<Link href="/" className="flex items-center gap-2.5 group">
							<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
								<GraduationCap className="h-5 w-5 text-white" />
							</div>
							<span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
								GPA<span className="text-indigo-600">Flow</span>
							</span>
						</Link>

						{/* Desktop Navigation Links */}
						<nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
							<a
								href="#features"
								className="hover:text-indigo-600 transition-colors"
							>
								Features
							</a>
							<a
								href="#preview"
								className="hover:text-indigo-600 transition-colors"
							>
								Dashboard
							</a>
							<a
								href="#predict"
								className="hover:text-indigo-600 transition-colors"
							>
								Predictions
							</a>
						</nav>

						{/* Desktop Actions */}
						<div className="hidden sm:flex items-center gap-2">
							<Link
								href="/login"
								className="h-10 px-5 flex items-center justify-center text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors rounded-full"
							>
								Log in
							</Link>
							<Link
								href="/signup"
								className="btn-skeuo-primary h-10 px-6 flex items-center justify-center text-sm font-semibold rounded-full"
							>
								Sign up
							</Link>
						</div>

						{/* Mobile Menu Toggle */}
						<button
							type="button"
							onClick={() => setIsOpen(!isOpen)}
							aria-label="Toggle menu"
							aria-expanded={isOpen}
							className="flex sm:hidden h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-slate-100 transition-colors cursor-pointer"
						>
							{isOpen ? (
								<X className="h-5 w-5" />
							) : (
								<Menu className="h-5 w-5" />
							)}
						</button>
					</div>

					<AnimatePresence>
						{isOpen && (
							<motion.div
								initial={{ opacity: 0, y: -8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
								className="flex sm:hidden flex-col items-center gap-3 pb-6 pt-2 border-t border-slate-100 mt-2"
							>
								<Link
									href="/login"
									onClick={() => setIsOpen(false)}
									className="btn-skeuo-white w-full text-center py-3 text-sm font-semibold rounded-2xl"
								>
									Log in
								</Link>
								<Link
									href="/signup"
									onClick={() => setIsOpen(false)}
									className="btn-skeuo-primary w-full text-center py-3 text-sm font-semibold rounded-2xl"
								>
									Sign up
								</Link>
							</motion.div>
						)}
					</AnimatePresence>
				</header>
			</div>

			{/* Hero Section */}
			<section className="relative pt-44 sm:pt-52 pb-16 px-6">
				<div className="max-w-4xl mx-auto flex flex-col items-center text-center">
					{/* Sparkle Badge */}
					<motion.div
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
						className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 mb-6 shadow-sm shadow-indigo-500/5"
					>
						Visualized Semester & GPA Forecasting
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.3,
							delay: 0.05,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6"
					>
						Master your academic <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
							trajectory.
						</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
						className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
					>
						Say goodbye to simple spreadsheets. GPAFlow provides a beautiful,
						state-of-the-art predictive dashboard to visualize your academic
						trajectory, track semesters, and forecast grades automatically.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.3,
							delay: 0.15,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
					>
						<Link
							href="/signup"
							className="btn-skeuo-primary group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full w-full sm:w-auto cursor-pointer"
						>
							Sign up
							<ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
						</Link>
						<Link
							href="/login"
							className="btn-skeuo-white inline-flex items-center justify-center px-8 py-4 rounded-full w-full sm:w-auto cursor-pointer"
						>
							Sign in
						</Link>
					</motion.div>
				</div>
			</section>

			{/* Interactive Showcase Preview */}
			<section id="preview" className="relative px-6 pb-28">
				<div className="max-w-5xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
						className="relative rounded-[2.5rem] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 shadow-[inset_0_2.5px_0_#ffffff,inset_0_-2.5px_0_rgba(15,23,42,0.02),0_25px_60px_-15px_rgba(15,23,42,0.06),0_10px_20px_-10px_rgba(15,23,42,0.04)] overflow-hidden p-3 sm:p-5"
					>
						{/* Window Header */}
						<div className="h-12 bg-slate-50/50 rounded-t-[1.8rem] border-b border-slate-200/60 flex items-center px-6 gap-2 justify-between shrink-0">
							<div className="flex gap-2">
								<div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-rose-400 to-rose-500 border border-rose-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1.5px_3px_rgba(225,29,72,0.15)]" />
								<div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-amber-400 to-amber-500 border border-amber-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1.5px_3px_rgba(217,119,6,0.15)]" />
								<div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-500 border border-emerald-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1.5px_3px_rgba(5,150,105,0.15)]" />
							</div>
							<div className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 bg-slate-100 border border-slate-200/60 shadow-[inset_0_1.5px_3px_rgba(15,23,42,0.06),0_1px_0_#ffffff] px-6 py-1 rounded-full uppercase">
								gpaflow.app/dashboard
							</div>
							<div className="w-12" />
						</div>

						{/* Mock App Interface Grid */}
						<div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-100/20 rounded-b-[1.8rem]">
							{/* Sidebar Left Column Mock */}
							<div className="hidden lg:flex lg:col-span-3 flex-col justify-between p-4 bg-slate-50/50 border border-slate-200/50 rounded-3xl h-[410px] shadow-[inset_0_1.5px_0_#ffffff,0_4px_12px_rgba(15,23,42,0.02)]">
								<div className="space-y-6">
									<div className="flex items-center gap-2.5 px-2">
										<div className="h-8.5 w-8.5 rounded-xl icon-skeuo-inset bg-indigo-50 shadow-[inset_0_1.5px_3px_rgba(79,70,229,0.08)]">
											<GraduationCap className="h-4.5 w-4.5 text-indigo-650" />
										</div>
										<span className="text-xs font-bold text-slate-800">
											GPAFlow Hub
										</span>
									</div>
									<div className="space-y-2">
										<div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-indigo-50/80 border border-indigo-100/60 shadow-[inset_0_1.5px_3px_rgba(79,70,229,0.08)] text-indigo-600 rounded-xl text-xs font-bold select-none">
											<BarChart3 className="h-4 w-4" />
											Overview
										</div>
										<div className="flex items-center gap-2.5 px-3.5 py-2.5 text-slate-550 bg-white border border-slate-200/80 shadow-[inset_0_1px_0_#ffffff,0_1.5px_3px_rgba(15,23,42,0.03)] hover:bg-slate-50 transition active:scale-[0.97] rounded-xl text-xs font-semibold cursor-pointer">
											<BookOpen className="h-4 w-4" />
											Semesters
										</div>
										<div className="flex items-center gap-2.5 px-3.5 py-2.5 text-slate-550 bg-white border border-slate-200/80 shadow-[inset_0_1px_0_#ffffff,0_1.5px_3px_rgba(15,23,42,0.03)] hover:bg-slate-50 transition active:scale-[0.97] rounded-xl text-xs font-semibold cursor-pointer">
											<Target className="h-4 w-4" />
											Grade Target
										</div>
									</div>
								</div>

								{/* Target GPA Inset LCD Display */}
								<div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-955 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.4),0_1.5px_2px_rgba(255,255,255,0.06)] rounded-2xl p-4.5 space-y-3">
									<div className="text-[9px] font-bold tracking-widest text-indigo-300 uppercase font-mono">
										Target GPA
									</div>
									<div className="text-xl font-extrabold text-white tracking-wide font-mono">
										3.92 GPA
									</div>
									<div className="w-full bg-indigo-950/80 h-2.5 rounded-full p-0.5 border border-indigo-900 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.5)] flex items-center">
										<div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)] w-[85%]" />
									</div>
								</div>
							</div>

							{/* Center Area Graph Mock */}
							<div className="col-span-1 lg:col-span-6 flex flex-col justify-between p-6 bg-white border border-slate-200/80 rounded-3xl h-[410px] shadow-[inset_0_2px_0_#ffffff,0_6px_20px_rgba(15,23,42,0.02)]">
								<div className="flex justify-between items-start mb-4">
									<div>
										<p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
											Academic Growth
										</p>
										<h4 className="text-base font-bold text-slate-800">
											Semester GPA Trend
										</h4>
									</div>
									<span className="text-xs font-extrabold text-emerald-650 bg-emerald-50/85 border border-emerald-100 shadow-[inset_0_1.5px_2px_rgba(16,185,129,0.05)] px-3 py-1 rounded-xl select-none">
										+0.12 Gain
									</span>
								</div>

								{/* Oscilloscope Trend Screen Inset */}
								<div className="relative flex-1 w-full min-h-[190px] flex items-end widget-skeuo-inset border-slate-200/50 shadow-[inset_0_2px_6px_rgba(15,23,42,0.05),0_1px_0_#ffffff] rounded-2xl p-4 overflow-hidden">
									{/* Screen grid lines */}
									<div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f060_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f060_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
									<svg
										className="w-full h-full min-h-[160px] relative z-10"
										viewBox="0 0 300 120"
									>
										<title>GPA Growth Chart</title>
										<defs>
											<linearGradient
												id="chartGrad"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="0%"
													stopColor="#4f46e5"
													stopOpacity="0.22"
												/>
												<stop
													offset="100%"
													stopColor="#4f46e5"
													stopOpacity="0.0"
												/>
											</linearGradient>
										</defs>
										{/* Trend Path */}
										<path
											d="M 0 100 Q 50 85 100 60 T 200 45 T 300 15 L 300 120 L 0 120 Z"
											fill="url(#chartGrad)"
										/>
										<path
											d="M 0 100 Q 50 85 100 60 T 200 45 T 300 15"
											fill="none"
											stroke="#4f46e5"
											strokeWidth="3.5"
											strokeLinecap="round"
										/>
										{/* Glow Dots */}
										<circle
											cx="100"
											cy="60"
											r="4.5"
											fill="#4f46e5"
											stroke="white"
											strokeWidth="2"
										/>
										<circle
											cx="200"
											cy="45"
											r="4.5"
											fill="#4f46e5"
											stroke="white"
											strokeWidth="2"
										/>
										<circle
											cx="300"
											cy="15"
											r="6"
											fill="#6366f1"
											stroke="white"
											strokeWidth="2"
										/>
									</svg>
								</div>

								<div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-100 text-center text-[10px] font-bold text-slate-400">
									<div>Sem 1</div>
									<div>Sem 2</div>
									<div>Sem 3</div>
									<div className="text-indigo-600 font-extrabold">
										Sem 4 (Active)
									</div>
								</div>
							</div>

							{/* Right Overview stats mock */}
							<div className="col-span-1 lg:col-span-3 flex flex-col gap-5 h-[410px]">
								{/* Stats Card 1 */}
								<div className="flex-1 p-5 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/70 rounded-3xl shadow-[inset_0_1.5px_0_#ffffff,0_4px_14px_rgba(15,23,42,0.02)] flex flex-col justify-between">
									<div className="flex justify-between items-center">
										<span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
											Current CGPA
										</span>
										<div className="h-7 w-7 rounded-full icon-skeuo-raised">
											<TrendingUp className="h-4 w-4 text-emerald-550" />
										</div>
									</div>
									<div>
										<div className="text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
											3.84
										</div>
										<p className="text-[9px] font-bold text-emerald-650 mt-2.5">
											Top 8% of department
										</p>
									</div>
								</div>

								{/* Stats Card 2 */}
								<div className="flex-1 p-5 bg-gradient-to-br from-indigo-900 to-indigo-950 border border-indigo-950 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.08),inset_0_-2px_4px_rgba(0,0,0,0.4),0_6px_20px_rgba(15,23,42,0.05)] rounded-3xl flex flex-col justify-between text-white relative overflow-hidden">
									<div className="flex justify-between items-center relative z-10">
										<span className="text-[10px] uppercase font-bold text-indigo-350 tracking-wider font-mono">
											Forecast Target
										</span>
										<div className="h-7 w-7 rounded-full bg-indigo-950/80 border border-indigo-900 flex items-center justify-center shadow-inner">
											<Target className="h-4 w-4 text-indigo-400" />
										</div>
									</div>
									<div className="relative z-10">
										<div className="text-3xl font-extrabold tracking-tight leading-none font-mono">
											A Grade
										</div>
										<p className="text-[9px] font-medium text-indigo-300 mt-2.5 font-mono">
											Requires 3.90 next sem
										</p>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Bento Grid Features Section */}
			<section id="features" className="py-24 px-6 bg-white relative">
				<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-16 space-y-4">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
							Optimized Dashboard
						</div>
						<h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
							Built for academic high-performers.
						</h2>
						<p className="text-gray-500 max-w-xl mx-auto text-base sm:text-lg font-light leading-relaxed">
							Everything you need to plan out, analyze, and forecast your degree
							progression down to the decimal point.
						</p>
					</div>

					{/* Bento Grid */}
					<div className="grid md:grid-cols-3 gap-6">
						{/* Bento Card 1 - Giant card */}
						<div className="card-skeuo md:col-span-2 rounded-[32px] p-8 flex flex-col lg:flex-row justify-between items-center gap-8 overflow-hidden relative group">
							<div className="space-y-4 max-w-md relative z-10">
								<div className="h-11 w-11 rounded-xl icon-skeuo-inset">
									<LineChart className="h-5 w-5 text-indigo-600" />
								</div>
								<h3 className="text-2xl font-bold text-gray-900">
									Visualized Grade Growth
								</h3>
								<p className="text-gray-500 text-sm leading-relaxed">
									A beautiful interactive dashboard that tracks your CGPA over
									consecutive semesters. Easily toggle courses, analyze weight
									distribution, and visualize target ranges.
								</p>
								<div className="pt-4 flex flex-wrap gap-2.5 relative z-10">
									<span className="px-3 py-1 bg-white border border-slate-150 rounded-lg text-xs font-semibold text-gray-600 shadow-2xs">
										8-Semester Track
									</span>
									<span className="px-3 py-1 bg-white border border-slate-150 rounded-lg text-xs font-semibold text-gray-600 shadow-2xs">
										Dynamic Scaling
									</span>
									<span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-semibold text-indigo-600">
										Predictive Curves
									</span>
								</div>
							</div>

							{/* Tactile Oscillosocpe Trend Widget */}
							<div className="w-full lg:w-72 h-44 rounded-[24px] widget-skeuo-inset p-4 flex flex-col justify-between overflow-hidden relative shrink-0">
								<div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
									<span>CGPA OSCILLOSCOPE</span>
									<span className="flex items-center gap-1 text-emerald-500">
										<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
										LIVE FORECAST
									</span>
								</div>
								{/* Subtle grid pattern */}
								<div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f050_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f050_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
								<svg className="w-full h-24 mt-2" viewBox="0 0 100 40">
									<title>Bento Grade Graph</title>
									<path
										d="M0,35 Q15,30 30,20 T60,18 T90,5 L100,5 L100,40 L0,40 Z"
										fill="rgba(99, 102, 241, 0.06)"
									/>
									<path
										d="M0,35 Q15,30 30,20 T60,18 T90,5"
										fill="none"
										stroke="var(--color-primary-500)"
										strokeWidth="2"
										strokeLinecap="round"
									/>
									<circle
										cx="30"
										cy="20"
										r="1.5"
										fill="var(--color-primary-600)"
										stroke="white"
										strokeWidth="0.5"
									/>
									<circle
										cx="60"
										cy="18"
										r="1.5"
										fill="var(--color-primary-600)"
										stroke="white"
										strokeWidth="0.5"
									/>
									<circle
										cx="90"
										cy="5"
										r="2.2"
										fill="var(--color-primary-500)"
										stroke="white"
										strokeWidth="0.75"
									/>
								</svg>
								<div className="flex justify-between text-[9px] font-bold text-slate-400 pt-2 border-t border-slate-100 z-10">
									<span>SEM 1: 3.20</span>
									<span className="text-indigo-600">TARGET: 3.85</span>
								</div>
							</div>
						</div>

						{/* Bento Card 2 */}
						<div className="card-skeuo rounded-[32px] p-8 flex flex-col justify-between overflow-hidden relative group">
							<div className="space-y-4">
								<div className="h-11 w-11 rounded-xl icon-skeuo-inset">
									<Zap className="h-5 w-5 text-amber-500" />
								</div>
								<h3 className="text-xl font-bold text-gray-900">
									Lightning Fast Sync
								</h3>
								<p className="text-gray-500 text-sm leading-relaxed">
									Built on Next.js App Router and Supabase, your courses and
									predictions are instantly saved in secure cloud storage.
									Access anywhere, anytime.
								</p>
							</div>

							{/* SUPABASE CLOUD SYNC WIDGET */}
							<div className="w-full h-24 rounded-[20px] widget-skeuo-inset p-3.5 flex flex-col justify-between relative mt-6 font-mono text-[9px] text-slate-500 overflow-hidden">
								<div className="flex justify-between items-center text-slate-400">
									<span>SUPABASE CLOUD SYNC</span>
									<span className="flex items-center gap-1 text-emerald-500 font-bold">
										<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
										SECURE
									</span>
								</div>
								<div className="space-y-1">
									<div className="flex justify-between">
										<span>DATABASE PING</span>
										<span className="text-slate-800 font-semibold">14ms</span>
									</div>
									<div className="flex justify-between">
										<span>LAST SYNCED</span>
										<span className="text-indigo-600 font-semibold">
											JUST NOW
										</span>
									</div>
								</div>
								<div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1">
									<div className="w-[100%] h-full bg-emerald-500 rounded-full" />
								</div>
							</div>
						</div>

						{/* Bento Card 3 */}
						<div className="card-skeuo rounded-[32px] p-8 flex flex-col justify-between overflow-hidden relative group">
							<div className="space-y-4">
								<div className="h-11 w-11 rounded-xl icon-skeuo-inset">
									<BarChart3 className="h-5 w-5 text-emerald-500" />
								</div>
								<h3 className="text-xl font-bold text-gray-900">
									Multi-Grading Support
								</h3>
								<p className="text-gray-500 text-sm leading-relaxed">
									Whether your institution runs on 4.0 systems, letter grades,
									percentage scales, or specific Pakistani scales like NUML or
									GCWUF, GPAFlow handles it natively.
								</p>
							</div>

							{/* BADGE DIAL GRID */}
							<div className="grid grid-cols-2 gap-2 mt-6">
								<div className="icon-skeuo-raised py-2 px-3 rounded-xl text-center text-[10px] font-bold text-slate-700 select-none">
									GPA 4.0
								</div>
								<div className="icon-skeuo-raised py-2 px-3 rounded-xl text-center text-[10px] font-bold text-slate-700 select-none">
									NUML Scale
								</div>
								<div className="icon-skeuo-raised py-2 px-3 rounded-xl text-center text-[10px] font-bold text-slate-700 select-none">
									GCWUF Scale
								</div>
								<div className="icon-skeuo-raised py-2 px-3 rounded-xl text-center text-[10px] font-bold text-slate-700 select-none">
									WAM 100
								</div>
							</div>
						</div>

						{/* Bento Card 4 - Giant card */}
						<div className="card-skeuo md:col-span-2 rounded-[32px] p-8 flex flex-col lg:flex-row justify-between items-center gap-8 overflow-hidden relative group">
							<div className="space-y-4 max-w-sm relative z-10">
								<div className="h-11 w-11 rounded-xl icon-skeuo-inset">
									<Target className="h-5 w-5 text-purple-600" />
								</div>
								<h3 className="text-2xl font-bold text-gray-900">
									Intelligent Grade Forecasting
								</h3>
								<p className="text-gray-500 text-sm leading-relaxed">
									Define your goal GPA, and our algorithm will retroactively
									calculate exactly what grades you need to maintain in future
									courses to make your target a reality.
								</p>
							</div>

							{/* Interactive Slider Card Mockup */}
							<div className="w-full sm:w-64 bg-slate-50 border border-slate-150 rounded-[24px] p-5.5 shadow-[inset_0_2px_0_#fff,0_4px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between shrink-0">
								<div className="flex justify-between items-center text-xs font-bold mb-2">
									<span className="text-slate-400 uppercase tracking-wider text-[9px]">
										Target GPA Goal
									</span>
									<span className="text-indigo-600 font-extrabold text-xs bg-white border border-slate-100 px-2 py-0.5 rounded-lg shadow-2xs">
										3.75 GPA
									</span>
								</div>

								{/* Track Inset */}
								<div className="w-full h-4 bg-slate-200/70 rounded-full p-0.5 border border-slate-300/40 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.08)] flex items-center relative my-3">
									<div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 rounded-full w-[85%]" />
									{/* Raised Thumb Button */}
									<div className="absolute left-[81%] w-6 h-6 rounded-full bg-linear-gradient(180deg,#fff_0%,#f1f5f9_100%) border border-slate-300/80 shadow-[inset_0_1px_0_#fff,0_2.5px_5px_rgba(0,0,0,0.12)] flex items-center justify-center cursor-pointer select-none">
										<div className="w-2 h-2 rounded-full bg-indigo-600 shadow-inner" />
									</div>
								</div>

								<div className="flex justify-between text-[9px] font-bold text-slate-400 mt-2">
									<span>Current: 3.20</span>
									<span className="text-emerald-600 flex items-center gap-1 font-bold">
										<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
										Auto-Calculated
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Brand-Styled Premium Call-to-Action Section */}
			<section className="mt-8 px-6 pb-20 pt-8 relative overflow-hidden">
				<div className="max-w-5xl mx-auto rounded-[3.5rem] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 p-10 sm:p-20 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/10">
					{/* Glowing decorative nodes */}
					<div className="absolute inset-0 opacity-20 pointer-events-none">
						<div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-white blur-[120px]" />
						<div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-blue-300 blur-[120px]" />

						{/* SVG Grid */}
						<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
							<title>Grid decoration</title>
							<defs>
								<pattern
									id="gridCta"
									width="56"
									height="56"
									patternUnits="userSpaceOnUse"
								>
									<path
										d="M 56 0 L 0 0 0 56"
										fill="none"
										stroke="white"
										strokeWidth="0.5"
									/>
								</pattern>
							</defs>
							<rect width="100%" height="100%" fill="url(#gridCta)" />
						</svg>
					</div>

					<div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
						<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-indigo-200 uppercase tracking-widest">
							<Sparkles className="h-3 w-3" /> Step Into The Flow
						</div>
						<h2 className="text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight text-white">
							Ready to take absolute control of your academic journey?
						</h2>
						<p className="text-indigo-200 font-light text-base sm:text-lg leading-relaxed">
							Be part of the next generation of students using data-driven
							forecasting to predict and guarantee GPA outcomes. Setup in less
							than 60 seconds.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center items-center w-full sm:w-auto">
							<Link
								href="/signup"
								className="btn-skeuo-white text-indigo-700 font-bold px-8 py-4 rounded-full w-full sm:w-auto text-center cursor-pointer"
							>
								Sign up
							</Link>
							<Link
								href="/login"
								className="btn-skeuo-glass px-8 py-4 rounded-full border-white/20 text-white font-semibold hover:text-white w-full sm:w-auto text-center cursor-pointer"
							>
								Sign in
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Sleek Dark Brand Footer */}
			<footer className="relative z-10 bg-[#0f172a] pt-20 pb-10 px-6 border-t border-slate-800">
				<div className="max-w-5xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
						{/* Left Column - Brand Info */}
						<div className="md:col-span-6 lg:col-span-5 space-y-6">
							<div className="flex items-center gap-2.5">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
									<GraduationCap className="h-5 w-5 text-white" />
								</div>
								<span className="text-xl font-bold text-white tracking-tight">
									GPA<span className="text-indigo-500">Flow</span>
								</span>
							</div>
							<p className="text-slate-400 text-sm leading-relaxed font-light max-w-sm">
								GPAFlow is a secure, state-of-the-art grade and GPA tracker
								providing students with visual trajectories, semester
								projections, and smart course forecasters.
							</p>
						</div>

						{/* Links Columns */}
						<div className="md:col-span-6 lg:col-span-7 grid grid-cols-2 gap-8 sm:grid-cols-2 lg:flex lg:justify-end lg:gap-20">
							<div className="space-y-4">
								<h4 className="text-slate-200 font-bold text-sm tracking-wide">
									Application
								</h4>
								<ul className="space-y-2.5">
									<li>
										<Link
											href="/login"
											className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
										>
											Sign In
										</Link>
									</li>
									<li>
										<Link
											href="/signup"
											className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
										>
											Register Account
										</Link>
									</li>
								</ul>
							</div>

							<div className="space-y-4">
								<h4 className="text-slate-200 font-bold text-sm tracking-wide">
									Developer
								</h4>
								<ul className="space-y-2.5">
									<li>
										<a
											href="https://github.com/fahadshahbaz/gpaflow"
											target="_blank"
											rel="noopener noreferrer"
											className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
										>
											GitHub Repository
										</a>
									</li>
									<li>
										<a
											href="https://fahadshahbaz.dev"
											target="_blank"
											rel="noopener noreferrer"
											className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
										>
											Portfolio Site
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Bottom copyright bar */}
					<div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
						<p className="text-slate-500 text-xs font-semibold">
							© {new Date().getFullYear()} GPAFlow. Built with pride for higher
							education.
						</p>
						<div className="flex gap-4">
							<a
								href="https://github.com/fahadshahbaz"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub Profile"
								className="w-9 h-9 rounded-full bg-slate-850 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98] border border-slate-800"
							>
								<GithubIcon className="w-[18px] h-[18px]" />
							</a>
							<a
								href="https://linkedin.com/in/fahadshahbaz"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn Profile"
								className="w-9 h-9 rounded-full bg-slate-850 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98] border border-slate-800"
							>
								<LinkedinIcon className="w-[18px] h-[18px]" />
							</a>
						</div>
					</div>
				</div>
			</footer>
		</main>
	);
}
