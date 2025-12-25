'use client'

import { useEffect, useState, useCallback } from 'react'
import { Product } from '@/types'
import { getProductsAction } from '@/app/admin/products/actions'

export function useProductsLogic(initialProducts: Product[]) {
    const [allProducts, setAllProducts] = useState<Product[]>(initialProducts)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const fetchData = useCallback(async () => {
        setLoading(true)
        const products = await getProductsAction()
        setAllProducts(products)
        setLoading(false)
    }, [])

    // Apply filters whenever search or status changes
    useEffect(() => {
        let result = [...allProducts]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(p =>
                p.name_en.toLowerCase().includes(query) ||
                p.name_ar.toLowerCase().includes(query)
            )
        }

        // Status filter
        if (statusFilter === 'instock') {
            result = result.filter(p => p.in_stock)
        } else if (statusFilter === 'outofstock') {
            result = result.filter(p => !p.in_stock)
        }

        setFilteredProducts(result)
        setCurrentPage(1) // Reset to first page on filter change
    }, [allProducts, searchQuery, statusFilter])

    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return {
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
    }
}
