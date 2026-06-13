import { CheckCircle2, Sparkles, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen bg-white flex flex-col lg:flex-row font-sans">
			{/* Left Column - Auth Form */}
			<div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-16 min-h-screen bg-white">
				{/* Top Logo */}
				<div className="flex justify-start">
					<Logo href="/" />
				</div>

				{/* Form Content Wrapper */}
				<div className="w-full max-w-[420px] mx-auto my-auto py-10">
					{children}
				</div>

				{/* Footer */}
				<div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-3 border-t border-gray-100 pt-6">
					<p>© {new Date().getFullYear()} GPAFlow Enterprises LTD.</p>
					<div className="flex gap-4">
						<Link
							href="/privacy"
							className="hover:text-gray-600 transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="hover:text-gray-600 transition-colors"
						>
							Terms of Service
						</Link>
					</div>
				</div>
			</div>

			{/* Right Column - Premium Academic Dashboard Mockup */}
			<div className="hidden lg:flex w-1/2 p-6 bg-slate-50 justify-center items-center min-h-screen relative overflow-hidden">
				{/* Vibrant Royal Blue/Indigo Main Panel */}
				<div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 relative overflow-hidden flex flex-col justify-between p-12 text-white shadow-2xl border border-blue-500/20">
					{/* Glowing blobs and grid background overlay */}
					<div className="absolute inset-0 opacity-15 pointer-events-none">
						<div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-white blur-[120px]" />
						<div className="absolute bottom-[-15%] right-[-15%] w-[75%] h-[75%] rounded-full bg-blue-300 blur-[130px]" />

						{/* Grid pattern overlay */}
						<svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
							<title>Grid pattern</title>
							<defs>
								<pattern
									id="grid"
									width="48"
									height="48"
									patternUnits="userSpaceOnUse"
								>
									<path
										d="M 48 0 L 0 0 0 48"
										fill="none"
										stroke="white"
										strokeWidth="1"
									/>
								</pattern>
							</defs>
							<rect width="100%" height="100%" fill="url(#grid)" />
						</svg>
					</div>

					{/* Top Section - Headers */}
					<div className="relative z-10 space-y-4 max-w-lg">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-blue-100 tracking-wide uppercase">
							<Sparkles className="h-3 w-3 text-yellow-300 animate-pulse" />
							Smart Academic Companion
						</div>
						<h2 className="text-4xl font-semibold tracking-tight leading-[1.15] text-white">
							Effortlessly track your academic progress.
						</h2>
						<p className="text-blue-100/90 text-base leading-relaxed font-light">
							Log in to access your dashboard, map out future semesters, and
							automate your GPA forecasting.
						</p>
					</div>

					{/* Dashboard Mockup Center */}
					<div className="relative z-10 my-auto pt-8 flex items-center justify-center w-full">
						<div className="relative w-full max-w-[450px]">
							{/* Main Dashboard Card */}
							<div className="w-full bg-white rounded-[2rem] p-6 shadow-2xl border border-slate-100 text-slate-800 transition-all duration-500 hover:scale-[1.01] hover:shadow-indigo-500/10">
								{/* Mockup Header */}
								<div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
									<div>
										<div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
											Academic Tracker
										</div>
										<h4 className="text-sm font-bold text-slate-800">
											GPA Overview
										</h4>
									</div>
									<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-[10px]">
										<TrendingUp className="h-3 w-3" />
										Spring 2026
									</div>
								</div>

								{/* Row of stats */}
								<div className="grid grid-cols-3 gap-3 mb-6">
									<div className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100/40">
										<div className="text-[9px] font-medium text-indigo-500/80 mb-0.5">
											Current GPA
										</div>
										<div className="text-lg font-bold text-indigo-900 leading-none">
											3.92
										</div>
										<div className="text-[8px] text-emerald-600 font-medium mt-1">
											+0.04 vs last sem
										</div>
									</div>
									<div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
										<div className="text-[9px] font-medium text-slate-500 mb-0.5">
											Study Hours
										</div>
										<div className="text-lg font-bold text-slate-800 leading-none">
											02:45
										</div>
										<div className="text-[8px] text-indigo-500 font-medium mt-1">
											Daily avg
										</div>
									</div>
									<div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
										<div className="text-[9px] font-medium text-slate-500 mb-0.5">
											Total Credits
										</div>
										<div className="text-lg font-bold text-slate-800 leading-none">
											84
										</div>
										<div className="text-[8px] text-slate-400 font-medium mt-1">
											/ 120 Required
										</div>
									</div>
								</div>

								{/* Course Results List */}
								<div className="space-y-3">
									<div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-2 flex justify-between items-center">
										<span>Course Results</span>
										<span className="text-indigo-500 hover:underline cursor-pointer">
											View All
										</span>
									</div>

									{/* Item 1 */}
									<div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition">
										<div className="flex items-center gap-3">
											<div className="h-7 w-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs">
												CS
											</div>
											<div>
												<div className="text-xs font-semibold text-slate-800">
													Advanced Web Dev
												</div>
												<div className="text-[9px] text-slate-400">
													4.0 Credits • Theory & Lab
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<div className="text-xs font-bold text-indigo-600">A</div>
											<div className="px-2 py-0.5 rounded-md bg-emerald-50 text-[8px] font-medium text-emerald-600 flex items-center gap-0.5">
												<CheckCircle2 className="h-2 w-2" /> Passed
											</div>
										</div>
									</div>

									{/* Item 2 */}
									<div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition">
										<div className="flex items-center gap-3">
											<div className="h-7 w-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-xs">
												DS
											</div>
											<div>
												<div className="text-xs font-semibold text-slate-800">
													Machine Learning
												</div>
												<div className="text-[9px] text-slate-400">
													4.0 Credits • Calculus Prep
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<div className="text-xs font-bold text-purple-600">
												A-
											</div>
											<div className="px-2 py-0.5 rounded-md bg-emerald-50 text-[8px] font-medium text-emerald-600 flex items-center gap-0.5">
												<CheckCircle2 className="h-2 w-2" /> Passed
											</div>
										</div>
									</div>

									{/* Item 3 */}
									<div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 bg-slate-50/50 hover:bg-slate-50 transition">
										<div className="flex items-center gap-3">
											<div className="h-7 w-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
												SE
											</div>
											<div>
												<div className="text-xs font-semibold text-slate-800">
													Database Systems
												</div>
												<div className="text-[9px] text-slate-400">
													3.0 Credits • SQL Specialization
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<div className="text-xs font-bold text-blue-600">A</div>
											<div className="px-2 py-0.5 rounded-md bg-emerald-50 text-[8px] font-medium text-emerald-600 flex items-center gap-0.5">
												<CheckCircle2 className="h-2 w-2" /> Passed
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Overlapping Floating Gauge Card */}
							<div className="absolute bottom-[-24px] right-[-16px] w-[210px] bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 text-slate-800 z-20 transition-all duration-500 hover:translate-y-[-2px] hover:shadow-indigo-500/15">
								<div className="flex justify-between items-center mb-3">
									<div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
										Target GPA
									</div>
									<Target className="h-3.5 w-3.5 text-indigo-500" />
								</div>

								{/* Semi-circular gauge mock */}
								<div className="relative flex flex-col items-center justify-center pt-2">
									<svg className="w-24 h-14" viewBox="0 0 100 50">
										<title>GPA forecast gauge</title>
										{/* Gauge Track */}
										<path
											d="M 10 50 A 40 40 0 0 1 90 50"
											fill="none"
											stroke="#f1f5f9"
											strokeWidth="8"
											strokeLinecap="round"
										/>
										{/* Gauge Value */}
										<path
											d="M 10 50 A 40 40 0 0 1 85 40"
											fill="none"
											stroke="url(#purpleGrad)"
											strokeWidth="8"
											strokeLinecap="round"
											strokeDasharray="125"
											strokeDashoffset="25"
										/>
										<defs>
											<linearGradient
												id="purpleGrad"
												x1="0%"
												y1="0%"
												x2="100%"
												y2="0%"
											>
												<stop offset="0%" stopColor="#4f46e5" />
												<stop offset="100%" stopColor="#a855f7" />
											</linearGradient>
										</defs>
									</svg>

									<div className="absolute bottom-0 text-center">
										<div className="text-base font-bold text-slate-800 leading-none">
											3.92
										</div>
										<div className="text-[8px] font-semibold text-slate-400">
											Target: 4.00
										</div>
									</div>
								</div>

								{/* Legend Details */}
								<div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
									<div className="flex items-center gap-1">
										<span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
										<span className="text-[8px] font-semibold text-slate-500">
											Current
										</span>
									</div>
									<div className="flex items-center gap-1 justify-end">
										<span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
										<span className="text-[8px] font-semibold text-slate-500">
											Forecast
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom Text / Info */}
					<div className="relative z-10 flex items-center justify-between text-xs text-blue-200/80 border-t border-white/10 pt-6">
						<span>Powered by Supabase Integration</span>
						<span>v1.2.0 Stable</span>
					</div>
				</div>
			</div>
		</main>
	);
}
