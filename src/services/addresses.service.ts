/**
 * Addresses Service
 * Business logic layer for user address management.
 * Uses addresses repository for data access.
 */
import * as addressesRepo from './repositories/addresses.repository'
import type { SavedAddress } from '@/types'

/**
 * Service result type
 */
export interface ServiceResult<T = void> {
    success: boolean
    data?: T
    error?: string
}

/**
 * Address creation data
 */
export interface CreateAddressData {
    userId: string
    label: string
    address: string
    isDefault?: boolean
}

/**
 * Address update data
 */
export interface UpdateAddressData {
    label?: string
    address?: string
    isDefault?: boolean
}

/**
 * Gets all addresses for a user
 */
export async function getAddressesByUserId(userId: string): Promise<SavedAddress[]> {
    try {
        return await addressesRepo.findAddressesByUserId(userId)
    } catch (error) {
        console.error('Get addresses error:', error)
        return []
    }
}

/**
 * Gets default address for a user
 */
export async function getDefaultAddress(userId: string): Promise<SavedAddress | null> {
    try {
        return await addressesRepo.findDefaultAddress(userId)
    } catch (error) {
        console.error('Get default address error:', error)
        return null
    }
}

/**
 * Creates a new address
 */
export async function createAddress(data: CreateAddressData): Promise<ServiceResult> {
    try {
        // Validate label
        if (!data.label || data.label.trim().length === 0) {
            return { success: false, error: 'Address label is required' }
        }

        // Validate address
        if (!data.address || data.address.trim().length === 0) {
            return { success: false, error: 'Address is required' }
        }

        // If setting as default, unset other defaults first
        if (data.isDefault) {
            await addressesRepo.unsetDefaultAddresses(data.userId)
        }

        await addressesRepo.createAddress(data)
        return { success: true }
    } catch (error) {
        console.error('Create address error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create address'
        }
    }
}

/**
 * Updates an existing address
 */
export async function updateAddress(
    userId: string,
    addressId: number,
    data: UpdateAddressData
): Promise<ServiceResult> {
    try {
        // Validate label if provided
        if (data.label !== undefined && data.label.trim().length === 0) {
            return { success: false, error: 'Address label cannot be empty' }
        }

        // Validate address if provided
        if (data.address !== undefined && data.address.trim().length === 0) {
            return { success: false, error: 'Address cannot be empty' }
        }

        // Verify ownership
        const isOwner = await addressesRepo.verifyAddressOwnership(userId, addressId)
        if (!isOwner) {
            return { success: false, error: 'Unauthorized to update this address' }
        }

        // If setting as default, unset other defaults first
        if (data.isDefault) {
            await addressesRepo.unsetDefaultAddresses(userId, addressId)
        }

        await addressesRepo.updateAddress(userId, addressId, data)
        return { success: true }
    } catch (error) {
        console.error('Update address error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update address'
        }
    }
}

/**
 * Deletes an address
 */
export async function deleteAddress(userId: string, addressId: number): Promise<ServiceResult> {
    try {
        // Verify ownership
        const isOwner = await addressesRepo.verifyAddressOwnership(userId, addressId)
        if (!isOwner) {
            return { success: false, error: 'Unauthorized to delete this address' }
        }

        await addressesRepo.deleteAddress(userId, addressId)
        return { success: true }
    } catch (error) {
        console.error('Delete address error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete address'
        }
    }
}

/**
 * Sets an address as default
 */
export async function setAddressAsDefault(
    userId: string,
    addressId: number
): Promise<ServiceResult> {
    try {
        // Verify ownership
        const isOwner = await addressesRepo.verifyAddressOwnership(userId, addressId)
        if (!isOwner) {
            return { success: false, error: 'Unauthorized to update this address' }
        }

        await addressesRepo.setAddressAsDefault(userId, addressId)
        return { success: true }
    } catch (error) {
        console.error('Set default address error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to set default address'
        }
    }
}

/**
 * Gets address count for a user
 */
export async function getAddressCount(userId: string): Promise<number> {
    try {
        return await addressesRepo.countUserAddresses(userId)
    } catch (error) {
        console.error('Get address count error:', error)
        return 0
    }
}
