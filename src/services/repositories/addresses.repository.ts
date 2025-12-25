/**
 * Addresses Repository
 * Pure database operations for user address management.
 * Zero business logic - only CRUD operations.
 */
import { createClient } from '@/lib/supabase/server'
import type { SavedAddress } from '@/types'

/**
 * Address creation data
 */
export interface CreateAddressEntity {
    userId: string
    label: string
    address: string
    isDefault?: boolean
}

/**
 * Address update data
 */
export interface UpdateAddressEntity {
    label?: string
    address?: string
    isDefault?: boolean
}

/**
 * Finds all addresses for a user
 */
export async function findAddressesByUserId(userId: string): Promise<SavedAddress[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to fetch addresses: ${error.message}`)

    return data as SavedAddress[]
}

/**
 * Finds a single address by ID
 */
export async function findAddressById(addressId: number): Promise<SavedAddress | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('id', addressId)
        .maybeSingle()

    if (error) throw new Error(`Failed to fetch address: ${error.message}`)

    return data as SavedAddress | null
}

/**
 * Finds the default address for a user
 */
export async function findDefaultAddress(userId: string): Promise<SavedAddress | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .maybeSingle()

    if (error) throw new Error(`Failed to fetch default address: ${error.message}`)

    return data as SavedAddress | null
}

/**
 * Creates a new address
 */
export async function createAddress(entity: CreateAddressEntity): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('user_addresses')
        .insert({
            user_id: entity.userId,
            label: entity.label,
            address: entity.address,
            is_default: entity.isDefault ?? false
        })

    if (error) throw new Error(`Failed to create address: ${error.message}`)
}

/**
 * Updates an existing address
 */
export async function updateAddress(
    userId: string,
    addressId: number,
    entity: UpdateAddressEntity
): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('user_addresses')
        .update(entity)
        .eq('id', addressId)
        .eq('user_id', userId)

    if (error) throw new Error(`Failed to update address: ${error.message}`)
}

/**
 * Deletes an address
 */
export async function deleteAddress(userId: string, addressId: number): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId)

    if (error) throw new Error(`Failed to delete address: ${error.message}`)
}

/**
 * Unsets all default addresses for a user
 */
export async function unsetDefaultAddresses(userId: string, exceptId?: number): Promise<void> {
    const supabase = await createClient()

    let query = supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId)

    if (exceptId) {
        query = query.neq('id', exceptId)
    }

    const { error } = await query

    if (error) throw new Error(`Failed to unset default addresses: ${error.message}`)
}

/**
 * Sets an address as default
 */
export async function setAddressAsDefault(userId: string, addressId: number): Promise<void> {
    const supabase = await createClient()

    // First unset all defaults
    await unsetDefaultAddresses(userId)

    // Then set the specified address as default
    const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', userId)

    if (error) throw new Error(`Failed to set default address: ${error.message}`)
}

/**
 * Counts addresses for a user
 */
export async function countUserAddresses(userId: string): Promise<number> {
    const supabase = await createClient()

    const { count, error } = await supabase
        .from('user_addresses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

    if (error) throw new Error(`Failed to count addresses: ${error.message}`)

    return count || 0
}

/**
 * Verifies address ownership
 */
export async function verifyAddressOwnership(userId: string, addressId: number): Promise<boolean> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('id', addressId)
        .eq('user_id', userId)
        .maybeSingle()

    if (error) return false

    return !!data
}
