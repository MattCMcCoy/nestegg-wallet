import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { cn, SidebarProvider } from "@nestegg/ui";
import { ThemeProvider, ThemeToggle } from "@nestegg/ui/theme";
import { Toaster } from "@nestegg/ui/toast";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/styles.css";

import { AppSidebar } from "./_components/appsidebar";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"
      : "http://localhost:3000",
  ),
  title: "Nestegg Wallet",
  description: "Track your finances with a comprehensive view of your accounts, balances, and spending",
  openGraph: {
    title: "Nestegg Wallet",
    description: "Track your finances with a comprehensive view of your accounts, balances, and spending",
    url: env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
    siteName: "Nestegg Wallet",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          inter.variable,
          jetbrainsMono.variable,
        )}
      >
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar />
            <TRPCReactProvider>{props.children}</TRPCReactProvider>
          </SidebarProvider>
          <div className="absolute right-4 bottom-4">
            <ThemeToggle />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
