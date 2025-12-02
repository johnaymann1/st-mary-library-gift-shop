
import ProductCard from '@/components/ProductCard'
import { createClient } from '@/utils/supabase/server'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
    const supabase = await createClient()
    const { q } = await searchParams
    const query = q || ''

    // Search Products (Simple ILIKE on name)
    // Note: For better search, we'd use Full Text Search, but ILIKE is fine for now.
    let products = []

    if (query) {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .or(`name_en.ilike.%${query}%,name_ar.ilike.%${query}%,desc_en.ilike.%${query}%`)
            .order('created_at', { ascending: false })

        products = data || []
    }

    return (
        <div className="min-h-screen bg-neutral-50">


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-neutral-900">Search Results</h1>
                    <p className="mt-2 text-neutral-500">
                        Showing results for <span className="font-semibold">&quot;{query}&quot;</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-600">No products found for &quot;{query}&quot;.</p>
                    </div>
                )}
            </main>
        </div>
    )
}

