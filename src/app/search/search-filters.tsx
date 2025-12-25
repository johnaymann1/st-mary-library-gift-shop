'use client'

import { useRouter } from 'next/navigation'

interface SearchFiltersProps {
    query: string
    categoryId?: number
    sortBy: string
    categories: Array<{ id: number; name_en: string }>
}

export function SearchFilters({ query, categoryId, sortBy, categories }: SearchFiltersProps) {
    const router = useRouter()

    const handleSortChange = (newSort: string) => {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (categoryId) params.set('category', categoryId.toString())
        params.set('sort', newSort)
        params.set('page', '1')
        router.push(`/search?${params.toString()}`)
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">
                    Category
                </label>
                <div className="flex flex-wrap gap-2">
                    <a
                        href={`/search?q=${query}&sort=${sortBy}&page=1`}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!categoryId
                            ? 'bg-rose-600 text-white'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                            }`}
                    >
                        All
                    </a>
                    {categories?.map((cat) => (
                        <a
                            key={cat.id}
                            href={`/search?q=${query}&category=${cat.id}&sort=${sortBy}&page=1`}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${categoryId === cat.id
                                ? 'bg-rose-600 text-white'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                }`}
                        >
                            {cat.name_en}
                        </a>
                    ))}
                </div>
            </div>

            {/* Sort Filter */}
            <div>
                <label htmlFor="sort-select" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">
                    Sort By
                </label>
                <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-base focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 transition-colors"
                >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                </select>
            </div>
        </div>
    )
}
