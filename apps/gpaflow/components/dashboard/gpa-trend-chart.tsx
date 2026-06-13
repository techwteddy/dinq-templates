"use client";

import { useMemo } from "react";
import {
	Area,
	Bar,
	ComposedChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { Semester } from "@/types/grading";

interface GPATrendChartProps {
	semesters: Semester[];
	targetGpa?: number;
}

interface ChartDataPoint {
	name: string;
	semester: string;
	sgpa: number;
	cgpa: number;
	credits: number;
}

export function GPATrendChart({
	semesters,
	targetGpa = 3.5,
}: GPATrendChartProps) {
	const chartData = useMemo<ChartDataPoint[]>(() => {
		if (semesters.length === 0) return [];

		let cumulativePoints = 0;
		let cumulativeCredits = 0;

		return semesters.map((semester, index) => {
			const semesterPoints = semester.sgpa * semester.total_credit_hours;
			cumulativePoints += semesterPoints;
			cumulativeCredits += semester.total_credit_hours;
			const cgpa =
				cumulativeCredits > 0 ? cumulativePoints / cumulativeCredits : 0;

			return {
				name: `S${index + 1}`,
				semester: semester.name,
				sgpa: Number(semester.sgpa.toFixed(2)),
				cgpa: Number(cgpa.toFixed(2)),
				credits: semester.total_credit_hours,
			};
		});
	}, [semesters]);

	const hasData = chartData.length > 0;

	return (
		<div className="bg-white rounded-3xl p-6 card-shadow h-full">
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">
						GPA Progression
					</h3>
					<p className="text-sm text-gray-500">
						Semester-wise performance tracking
					</p>
				</div>
			</div>

			{hasData ? (
				<>
					{/* Stats Row */}
					<div className="flex flex-wrap gap-6 mb-4 pb-4 border-b border-gray-100">
						{chartData.map((item, index) => (
							<div key={item.name}>
								<p className="text-xs text-gray-500 mb-0.5">{item.semester}</p>
								<p
									className={`text-xl font-light ${index === chartData.length - 1 ? "text-primary" : "text-muted-foreground"}`}
								>
									{item.sgpa.toFixed(2)}
								</p>
							</div>
						))}
					</div>

					{/* Chart */}
					<div className="h-[200px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<ComposedChart
								data={chartData}
								margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
							>
								<defs>
									<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
										<stop
											offset="0%"
											stopColor="var(--primary)"
											stopOpacity={0.8}
										/>
										<stop
											offset="100%"
											stopColor="var(--primary)"
											stopOpacity={0.3}
										/>
									</linearGradient>
									<linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
										<stop
											offset="0%"
											stopColor="var(--primary)"
											stopOpacity={0.15}
										/>
										<stop
											offset="100%"
											stopColor="var(--primary)"
											stopOpacity={0}
										/>
									</linearGradient>
								</defs>
								<XAxis
									dataKey="name"
									stroke="transparent"
									fontSize={11}
									tickLine={false}
									axisLine={false}
									tick={{ fill: "var(--muted-foreground)" }}
									dy={5}
								/>
								<YAxis
									stroke="transparent"
									fontSize={11}
									tickLine={false}
									axisLine={false}
									tick={{ fill: "var(--muted-foreground)" }}
									domain={[0, 4]}
									ticks={[0, 1, 2, 3, 4]}
								/>
								<Tooltip
									cursor={{ fill: "transparent" }}
									content={({ active, payload }) => {
										if (active && payload && payload.length) {
											const data = payload[0].payload as ChartDataPoint;
											return (
												<div className="bg-popover border border-border rounded-xl px-3 py-2 shadow-lg">
													<p className="text-xs font-medium text-foreground mb-1.5">
														{data.semester}
													</p>
													<div className="space-y-1">
														<div className="flex items-center justify-between gap-4">
															<span className="text-xs text-muted-foreground">
																SGPA
															</span>
															<span className="text-xs font-semibold text-primary">
																{data.sgpa}
															</span>
														</div>
														<div className="flex items-center justify-between gap-4">
															<span className="text-xs text-muted-foreground">
																CGPA
															</span>
															<span className="text-xs font-medium text-foreground">
																{data.cgpa}
															</span>
														</div>
													</div>
												</div>
											);
										}
										return null;
									}}
								/>
								<Bar
									dataKey="sgpa"
									fill="url(#barGradient)"
									radius={[4, 4, 0, 0]}
									maxBarSize={40}
								/>
								<Area
									type="monotone"
									dataKey="cgpa"
									fill="url(#areaGradient)"
									stroke="var(--primary)"
									strokeWidth={2}
									dot={{ fill: "var(--primary)", strokeWidth: 0, r: 3 }}
									activeDot={{ fill: "var(--primary)", strokeWidth: 0, r: 5 }}
								/>
							</ComposedChart>
						</ResponsiveContainer>
					</div>

					{/* Legend */}
					<div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 rounded bg-primary/60" />
							<span className="text-xs text-muted-foreground">SGPA</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-0.5 bg-primary rounded" />
							<span className="text-xs text-muted-foreground">CGPA Trend</span>
						</div>
						{targetGpa && (
							<div className="flex items-center gap-2 ml-auto">
								<span className="text-xs text-gray-400">
									Target: {targetGpa}
								</span>
							</div>
						)}
					</div>
				</>
			) : (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<p className="text-gray-400 text-sm">No semesters added yet</p>
					<p className="text-gray-300 text-xs mt-1">
						Add your first semester to see the chart
					</p>
				</div>
			)}
		</div>
	);
}
