export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8 max-w-5xl mx-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="relative rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 shadow-lg aspect-[4/5] animate-pulse">
          <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />
          <div className="absolute inset-x-0 bottom-0 p-8 space-y-3">
            <div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded-md w-3/4" />
            <div className="h-5 bg-neutral-300 dark:bg-neutral-700 rounded-md w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
