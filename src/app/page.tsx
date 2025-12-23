
import * as categoryService from '@/services/categories'
import { getStoreSettings } from '@/utils/settings'
import { getActiveTheme } from '@/config/themes'
import Link from 'next/link'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

// Enable ISR with 1 hour revalidation for better performance
export const revalidate = 3600

export default async function Home() {
  // Fetch store settings for hero image
  const settings = await getStoreSettings()
  
  // Get active theme for hero text using the selected theme from settings
  const theme = await getActiveTheme(settings.active_theme)

  // Fetch Categories using service
  const categories = await categoryService.getCategories(true)

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        <div className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div className="text-center sm:text-left space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  {theme.hero.badge}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
                  {theme.hero.title}
                  <span className="block text-neutral-900 mt-2">{theme.hero.subtitle}</span>
                </h1>
                <p className="text-lg sm:text-xl text-neutral-600 max-w-xl leading-relaxed">
                  Browse our curated collection of premium gifts. From thoughtful presents to everyday treasures, find something special for every occasion.
                </p>
                <div>
                  <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl" asChild>
                    <Link href="#categories">
                      Shop Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right: Image */}
              <div className="relative lg:h-[500px] h-[400px]">
                <div className="absolute inset-0 bg-neutral-200/30 rounded-3xl transform rotate-3"></div>
                <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={settings.hero_image_url || '/hero-image.jpg'}
                    alt="Premium Gifts"
                    fill
                    className="object-cover"
                    priority
                    quality={75}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Explore our carefully organized collections to find the perfect gift
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 max-w-5xl mx-auto">
            {categories?.map((category, index) => (
              <Link key={category.id} href={`/category/${category.id}`} className="group">
                <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-1000 ease-in-out aspect-[4/5] transform hover:-translate-y-2">
                  {category.image_url ? (
                    <Image
                      src={category.image_url}
                      alt={category.name_en}
                      fill
                      className="object-cover group-hover:scale-105"
                      loading={index < 3 ? "eager" : "lazy"}
                      quality={70}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                      style={{
                        transition: 'transform 2000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
                      <span className="text-sm font-medium">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <h3 className="text-white font-bold text-2xl drop-shadow-lg mb-2">{category.name_en}</h3>
                    <p className="text-white/90 text-lg drop-shadow-md font-medium" dir="rtl">{category.name_ar}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {(!categories || categories.length === 0) && (
            <div className="text-center py-12">
              <p className="text-neutral-500 text-lg">No categories available yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

