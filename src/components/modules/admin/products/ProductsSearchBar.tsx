import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface ProductsSearchBarProps {
    searchQuery: string
    statusFilter: string
    filteredCount: number
    totalCount: number
    onSearchChange: (query: string) => void
    onStatusFilterChange: (filter: string) => void
}

export function ProductsSearchBar({
    searchQuery,
    statusFilter,
    filteredCount,
    totalCount,
    onSearchChange,
    onStatusFilterChange
}: ProductsSearchBarProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                    <Input
                        type="search"
                        placeholder="Search products by name..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onStatusFilterChange('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'all'
                            ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-md'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => onStatusFilterChange('instock')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'instock'
                            ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-md'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                    >
                        In Stock
                    </button>
                    <button
                        onClick={() => onStatusFilterChange('outofstock')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === 'outofstock'
                            ? 'bg-rose-600 dark:bg-rose-500 text-white shadow-md'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                    >
                        Out of Stock
                    </button>
                </div>
            </div>
            {(searchQuery || statusFilter !== 'all') && (
                <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                    <span>Showing {filteredCount} of {totalCount} results</span>
                    {searchQuery && <Badge variant="secondary">Search: {searchQuery}</Badge>}
                    {statusFilter !== 'all' && (
                        <Badge variant="secondary">
                            Status: {statusFilter === 'instock' ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                    )}
                </div>
            )}
        </div>
    )
}
