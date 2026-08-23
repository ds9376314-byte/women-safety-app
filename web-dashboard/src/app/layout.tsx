import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHEVORA | Admin Operations Center",
  description: "Enterprise Admin Dashboard for SHEVORA operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
