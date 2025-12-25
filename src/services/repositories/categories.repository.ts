/**
 * Categories Repository
 * Pure database operations for category management.
 * Zero business logic - only CRUD operations.
 */
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/types'

/**
 * Category creation data
 */
export interface CreateCategoryEntity {
    name_en: string
    name_ar: string
    image_url?: string | null
    is_active?: boolean
}

/**
 * Category update data
 */
export interface UpdateCategoryEntity extends Partial<CreateCategoryEntity> {}

/**
 * Finds all categories
 */
export async function findAllCategories(activeOnly: boolean = false): Promise<Category[]> {
    const supabase = await createClient()

    let query = supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

    if (activeOnly) {
        query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch categories: ${error.message}`)

    return data as Category[]
}

/**
 * Finds a single category by ID
 */
export async function findCategoryById(id: number): Promise<Category | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) throw new Error(`Failed to fetch category: ${error.message}`)

    return data as Category | null
}

/**
 * Creates a new category
 */
export async function createCategory(entity: CreateCategoryEntity): Promise<Category> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .insert({
            name_en: entity.name_en,
            name_ar: entity.name_ar,
            image_url: entity.image_url || null,
            is_active: entity.is_active ?? true
        })
        .select()
        .single()

    if (error) throw new Error(`Failed to create category: ${error.message}`)

    return data as Category
}

/**
 * Updates an existing category
 */
export async function updateCategory(id: number, entity: UpdateCategoryEntity): Promise<Category> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .update(entity)
        .eq('id', id)
        .select()
        .single()

    if (error) throw new Error(`Failed to update category: ${error.message}`)

    return data as Category
}

/**
 * Deletes a category by ID
 */
export async function deleteCategory(id: number): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

    if (error) throw new Error(`Failed to delete category: ${error.message}`)
}

/**
 * Counts products in a category
 */
export async function countProductsInCategory(categoryId: number): Promise<number> {
    const supabase = await createClient()

    const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)

    if (error) throw new Error(`Failed to count products in category: ${error.message}`)

    return count || 0
}

/**
 * Checks if a category has any products
 */
export async function categoryHasProducts(categoryId: number): Promise<boolean> {
    const count = await countProductsInCategory(categoryId)
    return count > 0
}

/**
 * Counts total categories
 */
export async function countCategories(activeOnly: boolean = false): Promise<number> {
    const supabase = await createClient()

    let query = supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })

    if (activeOnly) {
        query = query.eq('is_active', true)
    }

    const { count, error } = await query

    if (error) throw new Error(`Failed to count categories: ${error.message}`)

    return count || 0
}

/**
 * Toggles category active status
 */
export async function toggleCategoryStatus(id: number, isActive: boolean): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('categories')
        .update({ is_active: isActive })
        .eq('id', id)

    if (error) throw new Error(`Failed to toggle category status: ${error.message}`)
}
