
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav, MobileNavContent } from "@/components/mobile-nav";
import { Header } from "@/components/header";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: settings } = await supabase.from('app_settings').select('site_title, site_description').eq('id', 1).single();

  return {
    title: settings?.site_title || "Prophetic Reads",
    description: settings?.site_description || "E-books and daily devotionals by Dr. Climate Wiseman.",
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: settings } = await supabase.from('app_settings').select('site_title, logo_url, footer_text').eq('id', 1).single();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground" suppressHydrationWarning>
        <MobileNav>
            <Header siteTitle={settings?.site_title || 'Prophetic Reads'} logoUrl={settings?.logo_url} />
            <div className="flex flex-col min-h-screen">
              <main className="flex-1">{children}</main>
               <footer
                className="text-center p-6 text-muted-foreground text-sm"
                suppressHydrationWarning
              >
                <p>{settings?.footer_text || `© ${new Date().getFullYear()} Dr. Climate Wiseman. All rights reserved.`}</p>
              </footer>
            </div>
            <MobileNavContent siteTitle={settings?.site_title || 'Prophetic Reads'} logoUrl={settings?.logo_url} />
            <Toaster />
            <WhatsAppWidget />
        </MobileNav>
      </body>
    </html>
  );
}
