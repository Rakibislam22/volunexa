import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "../components/providers/ClientProviders";

export const metadata: Metadata = {
  title: "Volunexa — Community Event & Volunteer Management Platform",
  description:
    "Discover local community events, register for volunteer opportunities in real-time, and manage participation with AI-assisted tools.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8fafc] dark:bg-[#090e13] text-slate-900 dark:text-slate-100 transition-colors">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
