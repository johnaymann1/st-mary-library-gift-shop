/**
 * Categories Service
 * Centralized data access for all category-related operations.
 */
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/types'

export interface CreateCategoryData {
    name_en: string
    name_ar: string
    image_url?: string | null
    is_active?: boolean
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> { }

/**
 * Retrieves all categories
 */
export async function getCategories(activeOnly: boolean = false): Promise<Category[]> {
    const supabase = await createClient()

    let query = supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

    if (activeOnly) {
        query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
        return []
    }

    return data as Category[]
}

/**
 * Retrieves a single category by ID
 */
export async function getCategoryById(id: number): Promise<Category | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return null
    }

    return data as Category
}

/**
 * Creates a new category
 */
export async function createCategory(data: CreateCategoryData): Promise<{ category?: Category; error?: string }> {
    const supabase = await createClient()

    const { data: category, error } = await supabase
        .from('categories')
        .insert({
            name_en: data.name_en,
            name_ar: data.name_ar,
            image_url: data.image_url,
            is_active: data.is_active ?? true
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    return { category: category as Category }
}

/**
 * Updates an existing category
 */
export async function updateCategory(id: number, data: UpdateCategoryData): Promise<{ category?: Category; error?: string }> {
    const supabase = await createClient()

    const { data: category, error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    return { category: category as Category }
}

/**
 * Deletes a category (only if no products are associated)
 */
export async function deleteCategory(id: number): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    // Check if products exist
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id)

    if (count && count > 0) {
        return { error: 'Cannot delete category with existing products.' }
    }

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Checks if a category has associated products
 */
export async function hasProducts(categoryId: number): Promise<boolean> {
    const supabase = await createClient()

    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)

    return (count ?? 0) > 0
}

/**
 * Gets total count of categories
 */
export async function getCategoryCount(): Promise<number> {
    const supabase = await createClient()

    const { count, error } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })

    if (error) {
        return 0
    }

    return count || 0
}

