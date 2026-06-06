import type { Metadata } from "next";
import "./globals.css";
import { MartinConnectProvider } from "@/context/MartinConnectContext";
import RoleSwitcher from "@/components/RoleSwitcher";

export const metadata: Metadata = {
  title: "Martin Connect | Premium Hiring & Recruitment Platform",
  description: "The most decisive recruitment platform for high-growth enterprises and top professionals. Connect with millions of verified candidates using enterprise AI matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="min-h-full bg-background text-on-background flex flex-col antialiased" suppressHydrationWarning>
        <MartinConnectProvider>
          {children}
          <RoleSwitcher />
        </MartinConnectProvider>
      </body>
    </html>
  );
}
