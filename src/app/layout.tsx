import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["400","500","600"] });

export const metadata: Metadata = {
  title: { default: "Maria Perfumes | Bengaluru", template: "%s | Maria Perfumes" },
  description: "A refined fragrance house in Bengaluru. Perfumes, attars, discovery sets and event fragrance experiences.",
  metadataBase: new URL("https://maria-perfumes.vercel.app"),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${display.variable}`}><Toaster position="top-right" richColors />{children}</body></html>;
}
