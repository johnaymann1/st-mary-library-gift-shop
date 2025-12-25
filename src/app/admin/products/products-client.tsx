'use client'

import CreateProductForm from './create-form'
import { useProductsLogic } from '@/hooks/useProductsLogic'
import { ProductsSearchBar } from '@/components/modules/admin/products/ProductsSearchBar'
import { ProductsTable } from '@/components/modules/admin/products/ProductsTable'
import { ProductsMobileList } from '@/components/modules/admin/products/ProductsMobileList'
import { ProductsPagination } from '@/components/modules/admin/products/ProductsPagination'
import { Product, Category } from '@/types'

interface ProductsClientPageProps {
    initialProducts: Product[]
    initialCategories: Category[]
}

export default function ProductsClientPage({ initialProducts, initialCategories }: ProductsClientPageProps) {
    const categories = initialCategories.map(c => ({ id: c.id, name_en: c.name_en }))
    
    const {
        allProducts,
        filteredProducts,
        paginatedProducts,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        loading,
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        goToPage,
        fetchData
    } = useProductsLogic(initialProducts)

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
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight mb-2">
                    Products Management
                </h1>
                <p className="text-neutral-700 dark:text-neutral-300 font-medium text-lg">
                    Manage your gift shop inventory
                </p>
            </div>

            <CreateProductForm categories={categories} onSuccess={fetchData} />

            <ProductsSearchBar
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                filteredCount={filteredProducts.length}
                totalCount={allProducts.length}
                onSearchChange={setSearchQuery}
                onStatusFilterChange={setStatusFilter}
            />

            <ProductsTable products={paginatedProducts} onRefresh={fetchData} />

            <ProductsMobileList
                products={paginatedProducts}
                onRefresh={fetchData}
                isEmpty={filteredProducts.length === 0}
            />

            <ProductsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                filteredCount={filteredProducts.length}
                onPageChange={goToPage}
            />
        </div>
    )
}
