'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function NavbarSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="relative hidden md:block w-full max-w-md mx-8" role="search" aria-label="Search products">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500 transition-colors" aria-hidden="true" />
            <Input
                type="search"
                placeholder="Search for gifts..."
                className="pl-10 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 transition-all rounded-full focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search for products"
            />
        </form>
    )
}
