"use client";

import { AppProgressProvider } from "@bprogress/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<AppProgressProvider
				height="2.5px"
				color="#131313"
				options={{ showSpinner: false }}
				shallowRouting
			>
				<Analytics />
				{children}
			</AppProgressProvider>
		</ThemeProvider>
	);
}
