/**
 * Categories Service
 * Business logic layer for category management.
 * Uses categories repository for data access.
 */
import * as categoriesRepo from './repositories/categories.repository'
import type { Category } from '@/types'

/**
 * Service result type
 */
export interface ServiceResult<T = void> {
    success: boolean
    data?: T
    error?: string
}

/**
 * Category creation data
 */
export interface CreateCategoryData {
    name_en: string
    name_ar: string
    image_url?: string | null
    is_active?: boolean
}

/**
 * Category update data
 */
export interface UpdateCategoryData extends Partial<CreateCategoryData> {}

/**
 * Gets all categories (public) - only active
 */
export async function getCategories(): Promise<Category[]> {
    try {
        return await categoriesRepo.findAllCategories(true)
    } catch (error) {
        console.error('Get categories error:', error)
        return []
    }
}

/**
 * Gets all categories (admin) - includes inactive
 */
export async function getAdminCategories(): Promise<Category[]> {
    try {
        return await categoriesRepo.findAllCategories(false)
    } catch (error) {
        console.error('Get admin categories error:', error)
        return []
    }
}

/**
 * Gets a single category by ID
 */
export async function getCategoryById(id: number): Promise<Category | null> {
    try {
        return await categoriesRepo.findCategoryById(id)
    } catch (error) {
        console.error('Get category error:', error)
        return null
    }
}

/**
 * Creates a new category
 */
export async function createCategory(data: CreateCategoryData): Promise<ServiceResult<Category>> {
    try {
        // Validate names
        if (!data.name_en || data.name_en.trim().length === 0) {
            return { success: false, error: 'English name is required' }
        }

        if (!data.name_ar || data.name_ar.trim().length === 0) {
            return { success: false, error: 'Arabic name is required' }
        }

        const category = await categoriesRepo.createCategory(data)
        return { success: true, data: category }
    } catch (error) {
        console.error('Create category error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create category'
        }
    }
}

/**
 * Updates an existing category
 */
export async function updateCategory(
    id: number,
    data: UpdateCategoryData
): Promise<ServiceResult<Category>> {
    try {
        // Validate names if provided
        if (data.name_en !== undefined && data.name_en.trim().length === 0) {
            return { success: false, error: 'English name cannot be empty' }
        }

        if (data.name_ar !== undefined && data.name_ar.trim().length === 0) {
            return { success: false, error: 'Arabic name cannot be empty' }
        }

        const category = await categoriesRepo.updateCategory(id, data)
        return { success: true, data: category }
    } catch (error) {
        console.error('Update category error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update category'
        }
    }
}

/**
 * Deletes a category (only if no products exist)
 */
export async function deleteCategory(id: number): Promise<ServiceResult> {
    try {
        // Check if category has products
        const hasProducts = await categoriesRepo.categoryHasProducts(id)
        if (hasProducts) {
            return {
                success: false,
                error: 'Cannot delete category with existing products'
            }
        }

        await categoriesRepo.deleteCategory(id)
        return { success: true }
    } catch (error) {
        console.error('Delete category error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete category'
        }
    }
}

/**
 * Toggles category active status
 */
export async function toggleCategoryStatus(
    id: number,
    isActive: boolean
): Promise<ServiceResult> {
    try {
        await categoriesRepo.toggleCategoryStatus(id, isActive)
        return { success: true }
    } catch (error) {
        console.error('Toggle category status error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to toggle category status'
        }
    }
}

/**
 * Checks if category has products
 */
export async function hasProducts(categoryId: number): Promise<boolean> {
    try {
        return await categoriesRepo.categoryHasProducts(categoryId)
    } catch (error) {
        console.error('Check products error:', error)
        return false
    }
}

/**
 * Gets category count
 */
export async function getCategoryCount(): Promise<number> {
    try {
        return await categoriesRepo.countCategories(false)
    } catch (error) {
        console.error('Get category count error:', error)
        return 0
    }
}
