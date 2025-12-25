/**
 * Users Service
 * Business logic layer for user management.
 * Uses users repository for data access.
 */
import * as usersRepo from './repositories/users.repository'

/**
 * Service result type
 */
export interface ServiceResult<T = void> {
    success: boolean
    data?: T
    error?: string
}

/**
 * User profile
 */
export interface UserProfile {
    id: string
    email: string
    full_name: string | null
    phone: string | null
    role: 'user' | 'admin'
    created_at: string
}

/**
 * User profile update data
 */
export interface UpdateUserData {
    full_name?: string
    phone?: string
}

/**
 * User creation data
 */
export interface CreateUserProfileData {
    userId: string
    email: string
    fullName: string
    phone?: string
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser(): Promise<{ id: string; email: string } | null> {
    try {
        return await usersRepo.getCurrentAuthUser()
    } catch (error) {
        console.error('Get current user error:', error)
        return null
    }
}

/**
 * Gets user profile by ID
 */
export async function getUserById(userId: string): Promise<UserProfile | null> {
    try {
        return await usersRepo.findUserById(userId)
    } catch (error) {
        console.error('Get user error:', error)
        return null
    }
}

/**
 * Gets user role
 */
export async function getUserRole(userId: string): Promise<'user' | 'admin' | null> {
    try {
        return await usersRepo.findUserRole(userId)
    } catch (error) {
        console.error('Get user role error:', error)
        return null
    }
}

/**
 * Checks if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
    try {
        const user = await usersRepo.getCurrentAuthUser()
        if (!user) return false

        const role = await usersRepo.findUserRole(user.id)
        return role === 'admin'
    } catch (error) {
        console.error('Check admin error:', error)
        return false
    }
}

/**
 * Creates or updates a user profile
 */
export async function upsertUserProfile(data: CreateUserProfileData): Promise<ServiceResult> {
    try {
        // Validate email
        if (!data.email || !data.email.includes('@')) {
            return { success: false, error: 'Valid email is required' }
        }

        // Validate full name
        if (!data.fullName || data.fullName.trim().length === 0) {
            return { success: false, error: 'Full name is required' }
        }

        await usersRepo.upsertUser({
            id: data.userId,
            email: data.email,
            full_name: data.fullName,
            phone: data.phone || null
        })

        return { success: true }
    } catch (error) {
        console.error('Upsert user profile error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create user profile'
        }
    }
}

/**
 * Updates user profile
 */
export async function updateUserProfile(
    userId: string,
    data: UpdateUserData
): Promise<ServiceResult> {
    try {
        // Validate full name if provided
        if (data.full_name !== undefined && data.full_name.trim().length === 0) {
            return { success: false, error: 'Full name cannot be empty' }
        }

        // Validate phone if provided
        if (data.phone !== undefined && data.phone.trim().length === 0) {
            return { success: false, error: 'Phone cannot be empty' }
        }

        await usersRepo.updateUser(userId, data)
        return { success: true }
    } catch (error) {
        console.error('Update user profile error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update user profile'
        }
    }
}

/**
 * Updates user phone number
 */
export async function updateUserPhone(userId: string, phone: string): Promise<ServiceResult> {
    try {
        // Validate phone
        if (!phone || phone.trim().length === 0) {
            return { success: false, error: 'Phone number is required' }
        }

        await usersRepo.updateUserPhone(userId, phone)
        return { success: true }
    } catch (error) {
        console.error('Update phone error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update phone number'
        }
    }
}

/**
 * Checks if user has completed their profile
 */
export async function hasCompletedProfile(userId: string): Promise<boolean> {
    try {
        return await usersRepo.userHasCompletedProfile(userId)
    } catch (error) {
        console.error('Check profile completion error:', error)
        return false
    }
}

/**
 * Updates user metadata in auth system
 */
export async function updateUserMetadata(
    metadata: Record<string, unknown>
): Promise<ServiceResult> {
    try {
        await usersRepo.updateUserAuthMetadata(metadata)
        return { success: true }
    } catch (error) {
        console.error('Update metadata error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update user metadata'
        }
    }
}

/**
 * Gets all users (admin)
 */
export async function getAllUsers(limit?: number, offset?: number): Promise<UserProfile[]> {
    try {
        return await usersRepo.findAllUsers(limit, offset)
    } catch (error) {
        console.error('Get all users error:', error)
        return []
    }
}

/**
 * Gets user count
 */
export async function getUserCount(role?: 'user' | 'admin'): Promise<number> {
    try {
        return await usersRepo.countUsers(role)
    } catch (error) {
        console.error('Get user count error:', error)
        return 0
    }
}
