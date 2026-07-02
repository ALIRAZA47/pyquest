"use client";

import { ThemeProvider } from "next-themes";
import { ProgressProvider } from "@/components/ProgressContext";
import { ConfettiHost } from "@/components/ConfettiHost";
import { Toaster } from "@/components/Toaster";
import { CommandPalette } from "@/components/CommandPalette";
import { KeyboardNav } from "@/components/KeyboardNav";

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
        <CommandPalette />
        <KeyboardNav />
      </ProgressProvider>
    </ThemeProvider>
  );
}
