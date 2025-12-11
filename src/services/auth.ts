/**
 * Auth Service
 * Centralized data access for authentication-related operations.
 */
import { createClient } from '@/lib/supabase/server'

export interface UpdateUserPhoneData {
    userId: string
    phone: string
}

export interface CreateUserProfileData {
    userId: string
    email: string
    fullName: string
    phone?: string
}

/**
 * Updates a user's phone number in the database
 */
export async function updateUserPhone(data: UpdateUserPhoneData): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('users')
            .update({ phone: data.phone })
            .eq('id', data.userId)

        if (error) {
            return { error: error.message }
        }

        return { success: true }
    } catch (err) {
        return { error: 'Failed to update phone number' }
    }
}

/**
 * Updates user metadata in auth system
 */
export async function updateUserMetadata(userId: string, metadata: Record<string, unknown>): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    try {
        const { error } = await supabase.auth.updateUser({
            data: metadata
        })

        if (error) {
            return { error: error.message }
        }

        return { success: true }
    } catch (err) {
        return { error: 'Failed to update user metadata' }
    }
}

/**
 * Creates or updates a user profile in the public users table
 */
export async function upsertUserProfile(data: CreateUserProfileData): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('users')
            .upsert({
                id: data.userId,
                email: data.email,
                full_name: data.fullName,
                phone: data.phone || null,
                role: 'user'
            }, {
                onConflict: 'id'
            })

        if (error) {
            return { error: error.message }
        }

        return { success: true }
    } catch (err) {
        return { error: 'Failed to create user profile' }
    }
}

/**
 * Checks if a user has completed their profile
 */
export async function hasCompletedProfile(userId: string): Promise<boolean> {
    const supabase = await createClient()

    const { data } = await supabase
        .from('users')
        .select('full_name, phone')
        .eq('id', userId)
        .single()

    if (!data) {
        return false
    }

    return !!(data.full_name && data.phone)
}
