import { Navbar } from '@/components/layout'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      <Navbar />

      <main>
        {/* Hero Section Skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content Skeleton */}
              <div className="text-left space-y-8">
                <Skeleton className="h-12 w-48 rounded-full" />
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-3/4" />
                </div>
                <Skeleton className="h-6 w-full max-w-xl" />
                <Skeleton className="h-12 w-40 rounded-lg" />
              </div>

              {/* Right: Image Skeleton */}
              <div className="relative lg:h-[500px] h-[400px]">
                <Skeleton className="h-full w-full rounded-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-lg aspect-[4/5] transition-colors">
                <Skeleton className="w-full h-full" />
                <div className="absolute inset-x-0 bottom-0 p-8 space-y-2">
                  <Skeleton className="h-8 w-3/4 bg-white/50 dark:bg-neutral-800/50" />
                  <Skeleton className="h-4 w-1/2 bg-white/40 dark:bg-neutral-800/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
