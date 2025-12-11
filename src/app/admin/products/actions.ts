'use server'

import * as productService from '@/services/products'

/**
 * Server action to get all products with categories (for client-side refresh)
 */
export async function getProductsAction() {
    return productService.getProducts()
}
