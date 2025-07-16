
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav, MobileNavContent } from "@/components/mobile-nav";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { CartProvider } from "@/context/cart-context";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  const { data: settings } = await supabase.from('app_settings').select('site_title, site_description, logo_url').eq('id', 1).single();

  const title = settings?.site_title || "africanreads";
  const description = settings?.site_description || "E-books and daily devotionals by Dr. Climate Wiseman.";
  const iconUrl = settings?.logo_url || undefined;

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
    ? await supabase.from('profiles').select('is_admin, role').eq('id', user.id).single() 
    : { data: null };

  const { data: settings } = await supabase.from('app_settings').select('site_title, logo_url, footer_text').eq('id', 1).single();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground" suppressHydrationWarning>
        <CartProvider>
            <MobileNav>
            <Header
                siteTitle={settings?.site_title}
                logoUrl={settings?.logo_url}
                user={user}
                isAdmin={profile?.is_admin || false}
                userRole={profile?.role || 'reader'}
            />
            <MobileNavContent
                siteTitle={settings?.site_title}
                logoUrl={settings?.logo_url}
                user={user}
                isAdmin={profile?.is_admin || false}
                userRole={profile?.role || 'reader'}
            />
            <main>{children}</main>
            </MobileNav>
            <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
