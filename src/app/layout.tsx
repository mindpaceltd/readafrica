
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav, MobileNavContent } from "@/components/mobile-nav";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: settings } = await supabase.from('app_settings').select('site_title, site_description, logo_url').eq('id', 1).single();

  const title = settings?.site_title || "Prophetic Reads";
  const description = settings?.site_description || "E-books and daily devotionals by Dr. Climate Wiseman.";
  const iconUrl = settings?.logo_url || '/favicon.ico';

  return {
    title: title,
    description: description,
    icons: {
      icon: iconUrl,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = user 
    ? await supabase.from('profiles').select('is_admin').eq('id', user.id).single() 
    : { data: null };

  const { data: settings } = await supabase.from('app_settings').select('site_title, logo_url, footer_text').eq('id', 1).single();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={settings?.logo_url || '/favicon.ico'} sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Belleza&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground" suppressHydrationWarning>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
