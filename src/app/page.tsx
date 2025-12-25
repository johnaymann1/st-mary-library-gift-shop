import * as categoryService from '@/services/categories'
import { getStoreSettings } from '@/utils/settings'
import { getActiveTheme } from '@/config/themes'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Suspense } from 'react'
import { ProductGridSkeleton } from '@/components/ui/skeletons/ProductGridSkeleton'

/**
 * Home Page - Landing page for the gift shop
 * Features:
 * - Hero section with dynamic theme-based content
 * - Category grid for easy browsing
 * - Optimized images and ISR for performance
 */

// Enable ISR (Incremental Static Regeneration) with 1 hour revalidation for better performance
export const revalidate = 3600

// Async component to fetch and render categories
async function CategoriesGrid() {
  const categories = await categoryService.getCategories(true)

  return (
    <>
      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 max-w-5xl mx-auto">
        {categories?.map((category, index) => (
          <Link key={category.id} href={`/category/${category.id}`} className="group">
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-lg hover:shadow-xl transition-shadow duration-300 aspect-[4/5] will-change-auto">
              {/* Category Image */}
              {category.image_url ? (
                <Image
                  src={category.image_url}
                  alt={category.name_en}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
                  loading={index < 3 ? "eager" : "lazy"} // Eager load first 3 for LCP
                  quality={70}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                />
              ) : (
                // Fallback if no image
                <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500">
                  <span className="text-sm font-medium">No Image</span>
                </div>
              )}

              {/* Gradient Overlay for text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              {/* Category Names */}
              <div className="absolute inset-x-0 bottom-0 p-8">
                <h3 className="text-white font-bold text-2xl drop-shadow-lg mb-2">{category.name_en}</h3>
                <p className="text-white/90 text-lg drop-shadow-md font-medium" dir="rtl">{category.name_ar}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State - show when no categories exist */}
      {(!categories || categories.length === 0) && (
        <div className="text-center py-12">
          <p className="text-neutral-500 dark:text-neutral-400 text-lg transition-colors">No categories available yet.</p>
        </div>
      )}
    </>
  )
}

export default async function Home() {
  // Fetch store settings for hero image configuration and active theme in parallel
  const [settings, theme] = await Promise.all([
    getStoreSettings(),
    (async () => {
      const settings = await getStoreSettings()
      return getActiveTheme(settings.active_theme)
    })()
  ])

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      <main>
        {/* Hero Section - Dynamic theme-based welcome banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-rose-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column: Text Content */}
              <div className="text-center sm:text-left space-y-8">
                {/* Theme Badge - changes based on season/theme */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-sm font-medium transition-colors">
                  <Sparkles className="h-4 w-4" />
                  {theme.hero.badge}
                </div>

                {/* Main Heading - dynamic based on active theme */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1] transition-colors">
                  {theme.hero.title}
                  <span className="block text-neutral-900 dark:text-white mt-2">{theme.hero.subtitle}</span>
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-neutral-700 dark:text-neutral-300 max-w-xl leading-relaxed transition-colors">
                  Browse our curated collection of premium gifts. From thoughtful presents to everyday treasures, find something special for every occasion.
                </p>

                {/* Call to Action Button */}
                <div>
                  <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl" asChild>
                    <Link href="#categories">
                      Shop Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column: Hero Image */}
              <div className="relative lg:h-[500px] h-[400px]">
                {/* Decorative Background Layer */}
                <div className="absolute inset-0 bg-neutral-200/30 rounded-3xl transform rotate-3"></div>
                
                {/* Main Image Container */}
                <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={settings.hero_image_url || '/hero-image.jpg'}
                    alt="Premium Gifts"
                    fill
                    className="object-cover"
                    priority // Load immediately for LCP optimization
                    quality={75}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section - Browse products by category */}
        <div id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4 transition-colors">Shop by Category</h2>
            <p className="text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto transition-colors">
              Explore our carefully organized collections to find the perfect gift
            </p>
          </div>

          {/* Category Grid with Suspense for progressive rendering */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <CategoriesGrid />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

