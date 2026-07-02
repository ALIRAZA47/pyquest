"use client";

import { ThemeProvider } from "next-themes";
import { ProgressProvider } from "@/components/ProgressContext";
import { ConfettiHost } from "@/components/ConfettiHost";
import { Toaster } from "@/components/Toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <ProgressProvider>
        {children}
        <Toaster />
        <ConfettiHost />
      </ProgressProvider>
    </ThemeProvider>
  );
}
