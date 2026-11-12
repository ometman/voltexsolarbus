import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Voltex Solar Ghana | Energy Commission Compliant Solar & Storage",
  description:
    "Tier-1 solar panels (L.I. 2449), LiFePO4 batteries (L.I. 2452), and hybrid inverters (L.I. 2461) for homes and SMEs in Greater Accra & Ashanti Region.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased bg-slate-50 text-slate-900">
        <CartProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
