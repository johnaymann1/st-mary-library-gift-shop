/**
 * Users Repository
 * Pure database operations for user management.
 * Zero business logic - only data access.
 */
import { createClient } from '@/lib/supabase/server'

/**
 * User profile entity
 */
export interface UserEntity {
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
export interface UpdateUserEntity {
    full_name?: string
    phone?: string
    role?: 'user' | 'admin'
}

/**
 * User creation/upsert data
 */
export interface UpsertUserEntity {
    id: string
    email: string
    full_name: string
    phone?: string | null
    role?: 'user' | 'admin'
}

/**
 * Gets the current authenticated user from Supabase Auth
 */
export async function getCurrentAuthUser(): Promise<{ id: string; email: string } | null> {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return null

    return {
        id: user.id,
        email: user.email ?? ''
    }
}

/**
 * Finds a user by ID
 */
export async function findUserById(userId: string): Promise<UserEntity | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

    if (error) throw new Error(`Failed to fetch user: ${error.message}`)

    return data as UserEntity | null
}

/**
 * Finds a user's role
 */
export async function findUserRole(userId: string): Promise<'user' | 'admin' | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

    if (error) throw new Error(`Failed to fetch user role: ${error.message}`)

    return data?.role as 'user' | 'admin' | null
}

/**
 * Creates or updates a user profile
 */
export async function upsertUser(entity: UpsertUserEntity): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('users')
        .upsert(
            {
                id: entity.id,
                email: entity.email,
                full_name: entity.full_name,
                phone: entity.phone || null,
                role: entity.role || 'user'
            },
            {
                onConflict: 'id'
            }
        )

    if (error) throw new Error(`Failed to upsert user: ${error.message}`)
}

/**
 * Updates user profile
 */
export async function updateUser(userId: string, entity: UpdateUserEntity): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('users')
        .update(entity)
        .eq('id', userId)

    if (error) throw new Error(`Failed to update user: ${error.message}`)
}

/**
 * Updates user phone number
 */
export async function updateUserPhone(userId: string, phone: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('users')
        .update({ phone })
        .eq('id', userId)

    if (error) throw new Error(`Failed to update phone: ${error.message}`)
}

/**
 * Checks if user has completed their profile
 */
export async function userHasCompletedProfile(userId: string): Promise<boolean> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('users')
        .select('full_name, phone')
        .eq('id', userId)
        .maybeSingle()

    if (error || !data) return false

    return !!(data.full_name && data.phone)
}

/**
 * Counts total users
 */
export async function countUsers(role?: 'user' | 'admin'): Promise<number> {
    const supabase = await createClient()

    let query = supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    if (role) {
        query = query.eq('role', role)
    }

    const { count, error } = await query

    if (error) throw new Error(`Failed to count users: ${error.message}`)

    return count || 0
}

/**
 * Finds all users (admin)
 */
export async function findAllUsers(limit?: number, offset?: number): Promise<UserEntity[]> {
    const supabase = await createClient()

    let query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

    if (limit) {
        query = query.limit(limit)
    }
    if (offset && limit) {
        query = query.range(offset, offset + limit - 1)
    }

    const { data, error } = await query

    if (error) throw new Error(`Failed to fetch users: ${error.message}`)

    return data as UserEntity[]
}

/**
 * Updates user metadata in Supabase Auth
 */
export async function updateUserAuthMetadata(metadata: Record<string, unknown>): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        data: metadata
    })

    if (error) throw new Error(`Failed to update user metadata: ${error.message}`)
}

/**
 * Deletes a user (admin operation)
 */
export async function deleteUser(userId: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

    if (error) throw new Error(`Failed to delete user: ${error.message}`)
}
