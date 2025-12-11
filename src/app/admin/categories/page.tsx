import * as categoryService from '@/services/categories'
import CategoriesClientPage from './categories-client'

export default async function CategoriesPage() {
    // Fetch categories on server using service
    const categories = await categoryService.getCategories()

    return <CategoriesClientPage initialCategories={categories} />
}
