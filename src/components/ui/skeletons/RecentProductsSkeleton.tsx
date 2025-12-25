export function RecentProductsSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-7 bg-neutral-200 dark:bg-neutral-700 rounded w-48 animate-pulse" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-64 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32 animate-pulse" />
                      <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-24 animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-20 animate-pulse" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16 animate-pulse" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full w-20 animate-pulse" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12 ml-auto animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
