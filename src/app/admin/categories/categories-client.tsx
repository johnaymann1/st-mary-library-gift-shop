'use client'

import { createClient } from '@/utils/supabase/client'
import CreateCategoryForm from './create-form'
import DeleteCategoryButton from './delete-button'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'

import { Category } from '@/types'

export default function CategoriesClientPage() {
    const [allCategories, setAllCategories] = useState<Category[]>([])
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const supabase = createClient()

            const { data: categoriesData } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: false })

            if (categoriesData) {
                setAllCategories(categoriesData)
            }

            setLoading(false)
        }

        fetchData()
    }, [])

    // Apply search filter
    useEffect(() => {
        let result = [...allCategories]

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(c =>
                c.name_en.toLowerCase().includes(query) ||
                c.name_ar.toLowerCase().includes(query)
            )
        }

        setFilteredCategories(result)
    }, [allCategories, searchQuery])

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="text-neutral-600">Loading...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-2">Categories Management</h1>
                <p className="text-neutral-700 font-medium text-lg">Organize your products into categories</p>
            </div>

            <CreateCategoryForm />

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                        type="search"
                        placeholder="Search categories by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {searchQuery && (
                    <div className="flex items-center gap-2 text-sm text-neutral-700 font-medium">
                        <span>Showing {filteredCategories.length} of {allCategories.length} results</span>
                        <Badge variant="secondary">Search: {searchQuery}</Badge>
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white shadow-sm rounded-xl overflow-hidden border border-neutral-200">
                <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">Name (EN)</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">Name (AR)</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-neutral-900 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-neutral-900 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                        {filteredCategories.map((category) => (
                            <tr key={category.id} className="hover:bg-neutral-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {category.image_url ? (
                                        <img src={category.image_url} alt={category.name_en} className="h-12 w-12 rounded-full object-cover shadow-sm" />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs font-medium">No Img</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900">{category.name_en}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">{category.name_ar}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Badge variant={category.is_active ? 'success' : 'destructive'}>
                                        {category.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <a
                                            href={`/admin/categories/${category.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </a>
                                        <DeleteCategoryButton id={category.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredCategories.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-700 font-medium">
                                    {searchQuery
                                        ? 'No categories match your search.'
                                        : 'No categories found. Create your first category above.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {filteredCategories.map((category) => (
                    <div key={category.id} className="bg-white shadow-sm rounded-xl border border-neutral-200 overflow-hidden">
                        <div className="p-4 space-y-4">
                            {/* Image and Title */}
                            <div className="flex gap-4">
                                {category.image_url ? (
                                    <img src={category.image_url} alt={category.name_en} className="h-20 w-20 rounded-full object-cover shadow-sm flex-shrink-0" />
                                ) : (
                                    <div className="h-20 w-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs font-medium flex-shrink-0">No Image</div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-neutral-900">{category.name_en}</h3>
                                    <p className="text-sm text-neutral-600 truncate">{category.name_ar}</p>
                                    <div className="mt-2">
                                        <Badge variant={category.is_active ? 'success' : 'destructive'}>
                                            {category.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-neutral-100">
                                <a
                                    href={`/admin/categories/${category.id}`}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                </a>
                                <DeleteCategoryButton id={category.id} />
                            </div>
                        </div>
                    </div>
                ))}
                {filteredCategories.length === 0 && (
                    <div className="bg-white shadow-sm rounded-xl border border-neutral-200 p-8 text-center">
                        <p className="text-sm text-neutral-700 font-medium">
                            {searchQuery
                                ? 'No categories match your search.'
                                : 'No categories found. Create your first category above.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
