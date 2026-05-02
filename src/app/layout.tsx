import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/organisms/Footer";
import PreRecChat from "@/components/organisms/PreRecChat";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InsureMatch | Union Assurance",
  description:
    "Get personalized insurance recommendations powered by AI. Built for Union Assurance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <PreRecChat />
        </QueryProvider>
      </body>
    </html>
  );
}
