/**
 * Addresses Service
 * Centralized data access for user address operations.
 */
import { createClient } from '@/lib/supabase/server'
import type { SavedAddress } from '@/types'

export interface CreateAddressData {
    userId: string
    label: string
    address: string
    isDefault?: boolean
}

export interface UpdateAddressData {
    label: string
    address: string
    isDefault?: boolean
}

/**
 * Gets all addresses for a user
 */
export async function getAddressesByUserId(userId: string): Promise<SavedAddress[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        return []
    }

    return data as SavedAddress[]
}

/**
 * Creates a new address for a user
 */
export async function createAddress(data: CreateAddressData): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    try {
        // If setting as default, unset other default addresses
        if (data.isDefault) {
            await supabase
                .from('user_addresses')
                .update({ is_default: false })
                .eq('user_id', data.userId)
        }

        const { error } = await supabase
            .from('user_addresses')
            .insert({
                user_id: data.userId,
                label: data.label,
                address: data.address,
                is_default: data.isDefault ?? false
            })

        if (error) {
            return { error: error.message }
        }

        return { success: true }
    } catch (err) {
        return { error: 'Failed to create address' }
    }
}

/**
 * Updates an existing address
 */
export async function updateAddress(
    userId: string,
    addressId: number,
    data: UpdateAddressData
): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    try {
        // If setting as default, unset other default addresses
        if (data.isDefault) {
            await supabase
                .from('user_addresses')
                .update({ is_default: false })
                .eq('user_id', userId)
                .neq('id', addressId)
        }

        const { error } = await supabase
            .from('user_addresses')
            .update({
                label: data.label,
                address: data.address,
                is_default: data.isDefault ?? false
            })
            .eq('id', addressId)
            .eq('user_id', userId)

        if (error) {
            return { error: error.message }
        }

        return { success: true }
    } catch (err) {
        return { error: 'Failed to update address' }
    }
}

/**
 * Deletes an address
 */
export async function deleteAddress(userId: string, addressId: number): Promise<{ success?: boolean; error?: string }> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('user_addresses')
            .delete()
            .eq('id', addressId)
            .eq('user_id', userId)

        if (error) {
            return { error: error.message }
        }

        return { success: true }
    } catch (err) {
        return { error: 'Failed to delete address' }
    }
}

/**
 * Gets the default address for a user
 */
export async function getDefaultAddress(userId: string): Promise<SavedAddress | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single()

    if (error || !data) {
        return null
    }

    return data as SavedAddress
}
