'use server'

import { revalidatePath } from 'next/cache'
import { addressSchema } from '@/utils/validation'
import * as addressService from '@/services/addresses'
import * as authService from '@/services/auth'
import * as userService from '@/services/users'

export async function saveAddress(formData: FormData) {
    // Validate input
    const rawData = {
        label: formData.get('label'),
        address: formData.get('address'),
        is_default: formData.get('is_default') === 'true'
    }

    const result = addressSchema.safeParse(rawData)
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { label, address, is_default: isDefault } = result.data

    const user = await userService.getCurrentUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const serviceResult = await addressService.createAddress({
        userId: user.id,
        label,
        address,
        isDefault
    })

    if (serviceResult.error) {
        return { error: serviceResult.error }
    }

    revalidatePath('/checkout')
    revalidatePath('/account/edit')
    return { success: true }
}

export async function updateAddress(addressId: number, formData: FormData) {
    // Validate input
    const rawData = {
        label: formData.get('label'),
        address: formData.get('address'),
        is_default: formData.get('is_default') === 'true'
    }

    const result = addressSchema.safeParse(rawData)
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { label, address, is_default: isDefault } = result.data

    const user = await userService.getCurrentUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const serviceResult = await addressService.updateAddress(user.id, addressId, {
        label,
        address,
        isDefault
    })

    if (serviceResult.error) {
        return { error: serviceResult.error }
    }

    revalidatePath('/checkout')
    revalidatePath('/account/edit')
    return { success: true }
}

export async function deleteAddress(addressId: number) {
    const user = await userService.getCurrentUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const serviceResult = await addressService.deleteAddress(user.id, addressId)

    if (serviceResult.error) {
        return { error: serviceResult.error }
    }

    revalidatePath('/checkout')
    revalidatePath('/account/edit')
    return { success: true }
}

export async function updateUserPhone(phone: string) {
    // Validate input
    const { phoneSchema } = await import('@/utils/validation')
    const phoneResult = phoneSchema.safeParse({ phone })
    if (!phoneResult.success) {
        const errors = phoneResult.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Invalid phone number'
        return { error: errorMessage }
    }

    const user = await userService.getCurrentUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const serviceResult = await authService.updateUserPhone({
        userId: user.id,
        phone: phoneResult.data.phone
    })

    if (serviceResult.error) {
        return { error: serviceResult.error }
    }

    revalidatePath('/checkout')
    return { success: true }
}

export async function getUserAddresses() {
    const user = await userService.getCurrentUser()
    if (!user) {
        return { error: 'Unauthorized', addresses: [] }
    }

    const addresses = await addressService.getAddressesByUserId(user.id)
    return { success: true, addresses }
}
