// src/app/layout.tsx

import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Raven Rush",
  description: "Race. Stake. Conquer.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body className={`${inter.className} bg-black text-white min-h-screen antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
