import { Skeleton } from '@/components/ui/skeleton'

export default function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md flex flex-col">
            {/* Image Skeleton */}
            <div className="relative aspect-square bg-neutral-100">
                <Skeleton className="w-full h-full" />
            </div>

            {/* Content Skeleton */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
                {/* Title */}
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />

                {/* Description */}
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />

                {/* Price and Button */}
                <div className="mt-auto flex items-center justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
            </div>
        </div>
    )
}
