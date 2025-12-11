import * as productService from '@/services/products'
import * as categoryService from '@/services/categories'
import ProductsClientPage from './products-client'

export default async function ProductsPage() {
    // Fetch data on server using services
    const [products, categories] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(true)
    ])

    return <ProductsClientPage initialProducts={products} initialCategories={categories} />
}
