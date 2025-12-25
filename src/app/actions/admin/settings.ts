'use server'

import { revalidatePath } from 'next/cache'
import * as settingsService from '@/services/settings'
import * as storageService from '@/services/storage'

/**
 * Admin Settings Actions
 * Server-side only functions for store settings management
 */

/**
 * Updates store settings in the database
 */
export async function updateStoreSettings(formData: FormData) {
    const storeName = formData.get('store_name') as string
    const description = formData.get('description') as string
    const phone = formData.get('phone') as string
    const phone2 = formData.get('phone_2') as string
    const phone3 = formData.get('phone_3') as string
    const address = formData.get('address') as string
    const workingHours = formData.get('working_hours') as string
    const deliveryFee = parseFloat(formData.get('delivery_fee') as string)
    const deliveryTimeDays = formData.get('delivery_time_days') as string
    const freeDeliveryThreshold = formData.get('free_delivery_threshold') as string
    const heroImage = formData.get('hero_image') as File | null
    const instapayEnabled = formData.get('instapay_enabled') === 'on'
    const instapayPhone = formData.get('instapay_phone') as string
    const facebookUrl = formData.get('facebook_url') as string
    const instagramUrl = formData.get('instagram_url') as string
    const twitterUrl = formData.get('twitter_url') as string
    const linkedinUrl = formData.get('linkedin_url') as string
    const activeTheme = (formData.get('active_theme') as string) || 'default'

    // Validation
    if (!storeName || !phone || !address || isNaN(deliveryFee)) {
        return { error: 'Please fill in all required fields' }
    }

    // Handle hero image upload if provided
    let heroImageUrl: string | undefined
    if (heroImage && heroImage.size > 0) {
        const uploadResult = await storageService.uploadHeroImage(heroImage)
        if (uploadResult.error) {
            return { error: uploadResult.error }
        }
        heroImageUrl = uploadResult.url
    }

    const result = await settingsService.updateSettings({
        store_name: storeName,
        description: description,
        phone: phone,
        phone_2: phone2 || null,
        phone_3: phone3 || null,
        address: address,
        working_hours: workingHours || null,
        delivery_fee: deliveryFee,
        delivery_time_days: deliveryTimeDays || null,
        free_delivery_threshold: freeDeliveryThreshold ? parseFloat(freeDeliveryThreshold) : null,
        instapay_enabled: instapayEnabled,
        instapay_phone: instapayPhone || null,
        ...(heroImageUrl && { hero_image_url: heroImageUrl }),
        facebook_url: facebookUrl || null,
        instagram_url: instagramUrl || null,
        twitter_url: twitterUrl || null,
        linkedin_url: linkedinUrl || null,
        active_theme: activeTheme,
    })

    if (result.error) {
        return { error: result.error }
    }

    // Revalidate all pages that use settings including root layout for theme changes
    revalidatePath('/', 'layout')
    revalidatePath('/admin/settings')
    revalidatePath('/checkout')
    revalidatePath('/not-found')
    revalidatePath('/admin')
    revalidatePath('/account')

    return { success: true }
}
