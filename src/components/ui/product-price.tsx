import { cn } from "@/lib/utils"
import { siteConfig } from "@/config/site"
import { SaleBadge } from "./sale-badge"

interface ProductPriceProps {
    price: number
    salePrice?: number | null
    saleEndDate?: string | null
    className?: string
    showSavings?: boolean
    size?: 'sm' | 'md' | 'lg'
}

// Helper function to check if sale is active (exported for use in cart/checkout logic)
export function isSaleActive(salePrice?: number | null, saleEndDate?: string | null): boolean {
    if (!salePrice || salePrice <= 0) return false
    if (!saleEndDate) return true // No end date = ongoing sale
    
    // Compare dates only (not time) to match SQL CURRENT_DATE behavior
    // Sale should be active for the entire end date
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Start of today
    
    const endDate = new Date(saleEndDate)
    endDate.setHours(0, 0, 0, 0) // Start of end date
    
    return endDate >= today // Sale active ON the end date
}

// Helper function to calculate savings
function calculateSavings(price: number, salePrice: number) {
    const amount = price - salePrice
    const percentage = Math.round((amount / price) * 100)
    return { amount, percentage }
}

export function ProductPrice({ 
    price, 
    salePrice, 
    saleEndDate, 
    className,
    showSavings = false,
    size = 'md'
}: ProductPriceProps) {
    const hasActiveSale = isSaleActive(salePrice, saleEndDate)
    const savings = hasActiveSale && salePrice ? calculateSavings(price, salePrice) : null

    const textSizes = {
        sm: { current: 'text-lg', original: 'text-sm', savings: 'text-xs' },
        md: { current: 'text-xl', original: 'text-base', savings: 'text-sm' },
        lg: { current: 'text-3xl', original: 'text-xl', savings: 'text-base' }
    }

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            <div className="flex items-center gap-2 flex-wrap">
                {hasActiveSale && salePrice ? (
                    <>
                        <span className={cn("font-bold text-rose-600 dark:text-rose-400 transition-colors", textSizes[size].current)}>
                            {siteConfig.currency.symbol}{salePrice.toFixed(2)}
                        </span>
                        <span className={cn("font-medium text-neutral-400 dark:text-neutral-500 line-through transition-colors", textSizes[size].original)}>
                            {siteConfig.currency.symbol}{price.toFixed(2)}
                        </span>
                        {savings && (
                            <SaleBadge 
                                percentage={savings.percentage} 
                                size={size === 'lg' ? 'md' : 'sm'}
                            />
                        )}
                    </>
                ) : (
                    <span className={cn("font-bold text-neutral-900 dark:text-white transition-colors", textSizes[size].current)}>
                        {siteConfig.currency.symbol}{price.toFixed(2)}
                    </span>
                )}
            </div>
            
            {showSavings && hasActiveSale && savings && (
                <div className={cn(
                    "inline-flex items-center gap-1 text-green-700 dark:text-green-400 font-medium transition-colors",
                    textSizes[size].savings
                )}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>You save {siteConfig.currency.symbol}{savings.amount.toFixed(2)}</span>
                </div>
            )}
        </div>
    )
}

// Export helper function for calculating savings
export { calculateSavings }
