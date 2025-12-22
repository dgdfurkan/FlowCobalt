import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "FlowCobalt - Automated Workflows in Days",
  description: "We build practical AI + n8n automations that reduce errors and free up your team's time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header />
        <main className="pt-16 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

