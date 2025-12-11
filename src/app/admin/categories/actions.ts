'use server'

import * as categoryService from '@/services/categories'

/**
 * Server action to get all categories (for client-side refresh)
 */
export async function getCategoriesAction() {
    return categoryService.getCategories()
}
