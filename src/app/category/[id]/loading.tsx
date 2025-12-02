import Navbar from '@/components/Navbar'
import { Skeleton } from '@/components/ui/skeleton'

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-2" />
          <Skeleton className="h-6 w-48" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-4 mb-4">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 mb-8 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col">
      {/* Image Skeleton - Square aspect ratio */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Product Info Skeleton */}
      <div className="flex-1 p-5 space-y-3 flex flex-col">
        <div className="flex-1 space-y-2">
          {/* Product Name - 2 lines */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          {/* Arabic Name - 1 line */}
          <Skeleton className="h-3 w-1/2" />
        </div>

        {/* Price Skeleton */}
        <div className="pt-2 border-t border-neutral-100">
          <Skeleton className="h-8 w-24" />
        </div>

        {/* Button Skeleton */}
        <Skeleton className="h-10 w-full rounded-lg mt-2" />
      </div>
    </div>
  )
}
