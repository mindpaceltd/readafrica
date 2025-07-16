import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav, MobileNavContent } from "@/components/mobile-nav";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Prophetic Reads",
  description: "E-books and daily devotionals by Dr. Climate Wiseman.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <MobileNav>
            <Header />
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">{children}</main>
            </div>
            <MobileNavContent />
            <Toaster />
        </MobileNav>
      </body>
    </html>
  );
}
