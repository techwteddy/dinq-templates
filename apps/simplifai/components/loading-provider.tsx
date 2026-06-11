"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LoaderScreen } from "./loader";

export function LoadingProvider({ children }: { children: React.ReactNode }) {
	const [loading, setLoading] = useState(true);
	const pathname = usePathname();

	useEffect(() => {
		setLoading(true);
		const timeout = setTimeout(() => setLoading(false), 700);
		return () => clearTimeout(timeout);
	}, [pathname]);

	return (
		<>
			{loading && <LoaderScreen />}
			{children}
		</>
	);
}
