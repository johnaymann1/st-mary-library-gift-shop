import { cn } from "@/lib/utils"

interface SaleBadgeProps {
    percentage: number
    className?: string
    size?: 'sm' | 'md' | 'lg'
}

export function SaleBadge({ percentage, className, size = 'md' }: SaleBadgeProps) {
    const sizes = {
        sm: 'text-[10px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5'
    }

    return (
        <div className={cn(
            "inline-flex items-center gap-1 rounded-full bg-rose-600 font-bold text-white shadow-sm",
            sizes[size],
            className
        )}>
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span>{percentage}% OFF</span>
        </div>
    )
}
