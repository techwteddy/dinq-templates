"use client";

import { SessionProvider } from "next-auth/react";

export const SessionProviderC = ({ children }: { children: React.ReactNode }) => {
	return <SessionProvider>{children}</SessionProvider>;
};
