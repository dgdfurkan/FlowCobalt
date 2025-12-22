import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "FlowCobalt - Automated Workflows in Days",
  description: "We build practical AI + n8n automations that reduce errors and free up your team's time.",
  icons: {
    icon: [
      { url: '/FlowCobalt/images/logo/logo2.png', sizes: '32x32', type: 'image/png' },
      { url: '/FlowCobalt/images/logo/logo2.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/FlowCobalt/images/logo/logo2.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/FlowCobalt/images/logo/logo2.png',
  },
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
        <main className="pt-20 md:pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

