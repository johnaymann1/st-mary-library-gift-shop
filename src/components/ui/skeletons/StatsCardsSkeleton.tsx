export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24" />
              <div className="h-8 bg-neutral-300 dark:bg-neutral-600 rounded w-16" />
            </div>
            <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}
