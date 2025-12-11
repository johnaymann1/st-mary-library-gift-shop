'use client'

import { useState, useEffect, useRef } from 'react'
import { Search as SearchIcon, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/config/site'

interface Product {
    id: number
    name_en: string
    name_ar: string
    price: number
    image_url: string | null
}

export function NavbarLiveSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Live search as user types
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            setShowResults(false)
            return
        }

        setLoading(true)
        setShowResults(true)

        const timeoutId = setTimeout(async () => {
            const supabase = createClient()
            const { data } = await supabase
                .from('products')
                .select('id, name_en, name_ar, price, image_url')
                .eq('is_active', true)
                .or(`name_en.ilike.%${query}%,name_ar.ilike.%${query}%`)
                .limit(5)

            setResults(data || [])
            setLoading(false)
        }, 300) // 300ms debounce

        return () => clearTimeout(timeoutId)
    }, [query])

    return (
        <div ref={containerRef} className="relative flex-1 max-w-md mx-8">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                    type="search"
                    placeholder="Search for gifts..."
                    className="pl-10 bg-neutral-50 border-neutral-200 focus:bg-white transition-all rounded-full focus:ring-2 focus:ring-rose-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && setShowResults(true)}
                />
                {loading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 animate-spin" />
                )}
            </div>

            {/* Live Results Dropdown */}
            {showResults && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                    {results.length > 0 ? (
                        <>
                            <div className="p-2 space-y-1">
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.id}`}
                                        onClick={() => {
                                            setShowResults(false)
                                            setQuery('')
                                        }}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 transition-colors"
                                    >
                                        {product.image_url ? (
                                            <Image
                                                src={product.image_url}
                                                alt={product.name_en}
                                                width={48}
                                                height={48}
                                                className="rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center">
                                                <SearchIcon className="h-5 w-5 text-neutral-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-neutral-900 truncate">{product.name_en}</p>
                                            <p className="text-sm text-neutral-500 truncate">{product.name_ar}</p>
                                        </div>
                                        <p className="font-semibold text-rose-600 text-sm">
                                            {product.price} {siteConfig.currency.code}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href={`/search?q=${encodeURIComponent(query)}`}
                                onClick={() => {
                                    setShowResults(false)
                                    setQuery('')
                                }}
                                className="block p-3 text-center text-sm font-medium text-rose-600 hover:bg-rose-50 border-t border-neutral-100 transition-colors"
                            >
                                View all results for &quot;{query}&quot;
                            </Link>
                        </>
                    ) : (
                        <div className="p-8 text-center">
                            <SearchIcon className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                            <p className="text-sm text-neutral-500">No products found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
