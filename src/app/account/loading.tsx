import { Skeleton } from '@/components/ui/skeleton'

export default function AccountLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-rose-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-6 w-32 mb-6" />
        
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
              <div className="flex flex-col items-center text-center mb-6">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>

              <Skeleton className="h-12 w-full rounded-lg mb-4" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                  <Skeleton className="h-14 w-14 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
