import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToastTheme from "@/context/ToastTheme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Messenger clone",
  description: "Messenger clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastTheme/>
        <main>{children}</main>
        </body>
    </html>
  );
}
