'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveAddress(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const label = formData.get('label') as string
    const address = formData.get('address') as string
    const isDefault = formData.get('is_default') === 'true'

    if (!label || !address) {
        return { error: 'Label and address are required' }
    }

    // If setting as default, unset other default addresses
    if (isDefault) {
        await supabase
            .from('user_addresses')
            .update({ is_default: false })
            .eq('user_id', user.id)
    }

    const { error } = await supabase
        .from('user_addresses')
        .insert({
            user_id: user.id,
            label,
            address,
            is_default: isDefault
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/checkout')
    return { success: true }
}

export async function updateAddress(addressId: number, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const label = formData.get('label') as string
    const address = formData.get('address') as string
    const isDefault = formData.get('is_default') === 'true'

    if (!label || !address) {
        return { error: 'Label and address are required' }
    }

    // If setting as default, unset other default addresses
    if (isDefault) {
        await supabase
            .from('user_addresses')
            .update({ is_default: false })
            .eq('user_id', user.id)
            .neq('id', addressId)
    }

    const { error } = await supabase
        .from('user_addresses')
        .update({
            label,
            address,
            is_default: isDefault
        })
        .eq('id', addressId)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/checkout')
    return { success: true }
}

export async function deleteAddress(addressId: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/checkout')
    return { success: true }
}

export async function updateUserPhone(phone: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    if (!phone) {
        return { error: 'Phone number is required' }
    }

    const { error } = await supabase
        .from('users')
        .update({ phone })
        .eq('id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/checkout')
    return { success: true }
}
