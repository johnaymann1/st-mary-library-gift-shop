import { Skeleton } from '@/components/ui/skeleton'
import { Package, ShoppingBag, TrendingUp, AlertCircle } from 'lucide-react'

export default function AdminDashboardLoading() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <Skeleton className="h-12 w-64 mb-2" />
                <Skeleton className="h-6 w-96" />
            </div>

            {/* Quick Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl border-2 border-neutral-200">
                            <Skeleton className="h-9 w-9 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[Package, TrendingUp, AlertCircle, ShoppingBag].map((Icon, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-12 w-12 rounded-xl" />
                        </div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                ))}
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="p-6 border-b border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-5 w-64" />
                        </div>
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <Skeleton className="h-4 w-20" />
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <Skeleton className="h-4 w-24" />
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <Skeleton className="h-4 w-16" />
                                </th>
                                <th className="px-6 py-4 text-left">
                                    <Skeleton className="h-4 w-16" />
                                </th>
                                <th className="px-6 py-4 text-right">
                                    <Skeleton className="h-4 w-16" />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="h-12 w-12 rounded-lg" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Skeleton className="h-4 w-20" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Skeleton className="h-4 w-16" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <Skeleton className="h-4 w-12 ml-auto" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
