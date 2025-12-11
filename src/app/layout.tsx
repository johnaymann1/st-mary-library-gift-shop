import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
import { Navbar, Footer } from "@/components/layout";
import SnowOverlay from "@/components/ui/snow-overlay";
import { siteConfig } from "@/config/site";
import { getStoreSettings } from "@/utils/settings";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { themes, generateThemeCSS } from "@/config/themes";

// Force dynamic rendering to ensure theme changes are reflected
export const dynamic = 'force-dynamic'
export const revalidate = 0

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings()

  return {
    title: {
      template: `%s | ${settings.store_name}`,
      default: `${settings.store_name} - Books, Stationery & Premium Gifts`
    },
    description: settings.description,
    keywords: siteConfig.seo.keywords,
    authors: [{ name: settings.store_name }],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      title: `${settings.store_name} - Books, Stationery & Premium Gifts`,
      description: settings.description,
      siteName: settings.store_name,
      images: [
        {
          url: siteConfig.seo.ogImage,
          width: 1200,
          height: 630,
          alt: settings.store_name
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${settings.store_name} - Books, Stationery & Premium Gifts`,
      description: settings.description,
      images: [siteConfig.seo.ogImage]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();
  
  // Log settings to verify database fetch
  console.log('=== THEME DEBUG ===');
  console.log('Settings from DB:', { 
    store_name: settings.store_name, 
    active_theme: settings.active_theme 
  });
  
  // Get the active theme based on admin selection
  const themeKey = settings.active_theme || 'default';
  const activeTheme = themes[themeKey] || themes.default;
  const themeCSS = generateThemeCSS(activeTheme);
  
  console.log('Theme Key:', themeKey);
  console.log('Active Theme Name:', activeTheme.name);
  console.log('Theme Primary Color:', activeTheme.colors.primary);
  console.log('Generated CSS length:', themeCSS.length);
  console.log('=================');

  return (
    <html lang="en" data-theme={themeKey}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
        {/* Inject theme CSS variables */}
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeCSS }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `console.log('🎨 Theme loaded: ${themeKey}', '${activeTheme.name}', 'Primary: ${activeTheme.colors.primary}');`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {themeKey === 'christmas' && <SnowOverlay />}
        <CartProvider>
          <Navbar storeName={settings.store_name} />
          <div className="pt-20">
            {children}
          </div>
          <Footer settings={settings} />
          <Toaster />
          <SpeedInsights />
        </CartProvider>
      </body>
    </html>
  );
}
