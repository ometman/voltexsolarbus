import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
