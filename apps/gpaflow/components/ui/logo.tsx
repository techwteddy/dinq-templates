import { GraduationCap } from "lucide-react";
import Link from "next/link";

interface LogoProps {
	size?: "sm" | "md" | "lg";
	href?: string;
}

const sizes = {
	sm: {
		container: "h-9 w-9",
		icon: "h-5 w-5",
		text: "text-lg",
	},
	md: {
		container: "h-10 w-10",
		icon: "h-6 w-6",
		text: "text-2xl",
	},
	lg: {
		container: "h-16 w-16",
		icon: "h-8 w-8",
		text: "text-3xl",
	},
};

export function Logo({ size = "md", href }: LogoProps) {
	const s = sizes[size];

	const content = (
		<>
			<div
				className={`flex ${s.container} items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600`}
			>
				<GraduationCap className={`${s.icon} text-white`} />
			</div>
			<span className={`${s.text} font-semibold text-gray-900 tracking-tight`}>
				GPA<span className="text-blue-500">Flow</span>
			</span>
		</>
	);

	if (href) {
		return (
			<Link href={href} className="flex items-center gap-2.5">
				{content}
			</Link>
		);
	}

	return <div className="flex items-center gap-2.5">{content}</div>;
}
