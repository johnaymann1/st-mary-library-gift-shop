import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Package, Search as SearchIcon, Home } from 'lucide-react'

interface EmptyStateProps {
    icon?: 'cart' | 'orders' | 'search' | 'generic'
    title: string
    description: string
    actionLabel?: string
    actionHref?: string
    secondaryActionLabel?: string
    secondaryActionHref?: string
}

export function EmptyState({
    icon = 'generic',
    title,
    description,
    actionLabel,
    actionHref,
    secondaryActionLabel,
    secondaryActionHref
}: EmptyStateProps) {
    const icons = {
        cart: ShoppingBag,
        orders: Package,
        search: SearchIcon,
        generic: Home
    }

    const Icon = icons[icon]

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-6 w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center transition-colors">
                <Icon className="h-10 w-10 text-neutral-400 dark:text-neutral-500 transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 transition-colors">{title}</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md transition-colors">{description}</p>
            <div className="flex flex-col sm:flex-row gap-3">
                {actionLabel && actionHref && (
                    <Button asChild size="lg">
                        <Link href={actionHref}>{actionLabel}</Link>
                    </Button>
                )}
                {secondaryActionLabel && secondaryActionHref && (
                    <Button asChild variant="outline" size="lg">
                        <Link href={secondaryActionHref}>{secondaryActionLabel}</Link>
                    </Button>
                )}
            </div>
        </div>
    )
}
