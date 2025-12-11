/**
 * Users Service
 * Centralized data access for user-related operations.
 */
import { createClient } from '@/lib/supabase/server'

export interface UserProfile {
    id: string
    email: string
    full_name: string | null
    phone: string | null
    role: 'user' | 'admin'
    created_at: string
}

/**
 * Gets the current authenticated user
 */
export async function getCurrentUser(): Promise<{ id: string; email: string } | null> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    return { id: user.id, email: user.email ?? '' }
}

/**
 * Gets the current user's role
 */
export async function getUserRole(userId: string): Promise<'user' | 'admin' | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

    if (error || !data) {
        return null
    }

    return data.role as 'user' | 'admin'
}

/**
 * Checks if the current user is an admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
    const user = await getCurrentUser()
    if (!user) return false

    const role = await getUserRole(user.id)
    return role === 'admin'
}

/**
 * Gets full user profile by ID
 */
export async function getUserById(userId: string): Promise<UserProfile | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

    if (error || !data) {
        return null
    }

    return data as UserProfile
}

/**
 * Updates user profile
 */
export async function updateUserProfile(userId: string, data: Partial<Pick<UserProfile, 'full_name' | 'phone'>>): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
