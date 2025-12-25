import { Navbar } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image Section Skeleton - Square */}
            <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden transition-colors">
              <Skeleton className="w-full h-full" />
            </div>

            {/* Details Section Skeleton */}
            <div className="flex flex-col space-y-6">
              {/* Category Badge */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                {/* Product Name */}
                <Skeleton className="h-10 w-full" />
                {/* Arabic Name */}
                <Skeleton className="h-6 w-3/4" />
              </div>

              {/* Price */}
              <Skeleton className="h-8 w-40" />

              {/* Description */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Button */}
              <div className="mt-auto pt-6">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
