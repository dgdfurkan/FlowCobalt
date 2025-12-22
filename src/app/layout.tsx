import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollTracker from "@/components/tracking/ScrollTracker";
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
        <ScrollTracker />
        <Header />
        <main className="pt-20 md:pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

