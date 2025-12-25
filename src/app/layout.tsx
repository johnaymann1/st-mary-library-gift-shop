import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
import { Navbar, Footer } from "@/components/layout";
import SnowOverlay from "@/components/ui/snow-overlay";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/config/site";
import { getStoreSettings } from "@/utils/settings";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { themes, generateThemeCSS } from "@/config/themes";

/**
 * Root Layout - Main application layout wrapper
 * Features:
 * - Dynamic theme system (Christmas, Default, etc.)
 * - Font optimization with variable fonts
 * - SEO metadata configuration
 * - Global providers (Cart, Theme, Toast notifications)
 */

// Enable ISR (Incremental Static Regeneration) - revalidate every hour
export const revalidate = 3600

// Configure optimized fonts with variable font technology
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Use fallback font until custom font loads
  preload: true, // Preload for faster initial render
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only load when needed (code blocks, etc.)
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  preload: true, // Preload for Arabic text
});

/**
 * Generate dynamic metadata for SEO
 * Uses store settings from database for personalization
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings()

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://partheno-gift-shop.vercel.app'),
    title: {
      template: `%s | ${settings.store_name}`, // Page-specific titles
      default: `${settings.store_name} - Books, Stationery & Premium Gifts`
    },
    description: settings.description,
    keywords: siteConfig.seo.keywords,
    authors: [{ name: settings.store_name }],
    
    // Open Graph metadata for social media sharing
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
    
    // Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      title: `${settings.store_name} - Books, Stationery & Premium Gifts`,
      description: settings.description,
      images: [siteConfig.seo.ogImage]
    },
    
    // Search engine crawler instructions
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
  // Fetch store settings for theme and customization
  const settings = await getStoreSettings();
  
  // Get the active theme based on admin selection (e.g., Christmas, Default)
  const themeKey = settings.active_theme || 'default';
  const activeTheme = themes[themeKey] || themes.default;
  const themeCSS = generateThemeCSS(activeTheme);

  return (
    <html lang="en" data-theme={themeKey} suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Load Arabic fonts (Cairo & Tajawal) for bilingual support */}
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* Inject dynamic theme CSS variables */}
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased bg-white dark:bg-neutral-950 transition-colors`}
      >
        {/* Theme Provider for dark/light mode */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="st-mary-theme"
          disableTransitionOnChange={false}
        >
          {/* Show snowfall animation for Christmas theme */}
          {themeKey === 'christmas' && <SnowOverlay />}
          
          {/* Cart Context Provider for global cart state */}
          <CartProvider>
            {/* Navigation Bar */}
            <Navbar storeName={settings.store_name} />
            
            {/* Main Content Area */}
            <div className="pt-20 bg-white dark:bg-neutral-950 min-h-screen transition-colors">
              {children}
            </div>
            
            {/* Footer */}
            <Footer settings={settings} />
            
            {/* Toast Notifications */}
            <Toaster />
            
            {/* Vercel Speed Insights for performance monitoring */}
            <SpeedInsights />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
