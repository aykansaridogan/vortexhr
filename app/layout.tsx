import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import LayoutClient from "../components/LayoutClient";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-title" });

export const metadata = {
  title: "Vortex HR - AI Powered Recruitment",
  description: "Next generation HR management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="dark">
      <body className={`${inter.variable} ${outfit.variable}`} style={{ margin: 0, padding: 0 }}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
