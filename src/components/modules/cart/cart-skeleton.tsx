import { Skeleton } from '@/components/ui/skeleton'

export function CartSkeleton() {
    return (
        <div className="min-h-screen bg-neutral-50 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Skeleton className="h-10 w-48 mb-8" />

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4 pb-6 border-b border-neutral-100 last:border-0">
                                    <Skeleton className="h-24 w-24 rounded-xl flex-shrink-0" />
                                    <div className="flex-1 space-y-3">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-10 w-32" />
                                            <Skeleton className="h-8 w-24" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4 mt-6 lg:mt-0">
                        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                            <Skeleton className="h-6 w-32 mb-6" />
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-5 w-32" />
                                </div>
                                <div className="border-t pt-4 flex justify-between">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-28" />
                                </div>
                            </div>
                            <Skeleton className="h-12 w-full rounded-xl mt-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
