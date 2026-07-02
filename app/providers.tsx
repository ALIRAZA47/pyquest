"use client";

import { ThemeProvider } from "next-themes";
import { ProgressProvider } from "@/components/ProgressContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <ProgressProvider>{children}</ProgressProvider>
    </ThemeProvider>
  );
}
