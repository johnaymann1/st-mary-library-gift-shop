import { notFound } from 'next/navigation'
import * as categoryService from '@/services/categories'
import * as productService from '@/services/products'
import CategoryPageClient from './category-client'

// Enable ISR with 1 hour revalidation
export const revalidate = 3600

interface CategoryPageProps {
    params: Promise<{ id: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { id } = await params
    const categoryId = parseInt(id)

    if (isNaN(categoryId)) {
        notFound()
    }

    // Fetch category and products on server using services
    const [category, products] = await Promise.all([
        categoryService.getCategoryById(categoryId),
        productService.getProducts({ categoryId, isActive: true })
    ])

    if (!category) {
        notFound()
    }

    return <CategoryPageClient category={category} initialProducts={products} />
}
