/**
 * Settings Service
 * Business logic layer for store settings management.
 * Uses settings repository for data access.
 */
import * as settingsRepo from './repositories/settings.repository'
import { siteConfig } from '@/config/site'

/**
 * Service result type
 */
export interface ServiceResult<T = void> {
    success: boolean
    data?: T
    error?: string
}

/**
 * Store settings type
 */
export type StoreSettings = settingsRepo.StoreSettingsEntity

/**
 * Settings update data
 */
export interface UpdateSettingsData {
    store_name?: string
    description?: string
    phone?: string
    phone_2?: string | null
    phone_3?: string | null
    address?: string
    working_hours?: string | null
    delivery_fee?: number
    delivery_time_days?: string | null
    free_delivery_threshold?: number | null
    hero_image_url?: string
    instapay_enabled?: boolean
    instapay_phone?: string | null
    facebook_url?: string | null
    instagram_url?: string | null
    twitter_url?: string | null
    linkedin_url?: string | null
    active_theme?: string
}

/**
 * Gets store settings with fallback to config
 */
export async function getSettings(): Promise<StoreSettings> {
    try {
        const settings = await settingsRepo.findStoreSettings()
        
        if (settings) {
            return settings
        }

        // Return fallback settings if not found in database
        return getFallbackSettings()
    } catch (error) {
        console.error('Get settings error:', error)
        return getFallbackSettings()
    }
}

/**
 * Updates store settings
 */
export async function updateSettings(data: UpdateSettingsData): Promise<ServiceResult> {
    try {
        // Validate delivery fee if provided
        if (data.delivery_fee !== undefined && data.delivery_fee < 0) {
            return { success: false, error: 'Delivery fee cannot be negative' }
        }

        // Validate free delivery threshold if provided
        if (data.free_delivery_threshold !== undefined && data.free_delivery_threshold !== null) {
            if (data.free_delivery_threshold < 0) {
                return { success: false, error: 'Free delivery threshold cannot be negative' }
            }
        }

        // Validate InstaPay phone if InstaPay is enabled
        if (data.instapay_enabled && !data.instapay_phone) {
            return { success: false, error: 'InstaPay phone number is required when enabled' }
        }

        await settingsRepo.updateStoreSettings(data)
        return { success: true }
    } catch (error) {
        console.error('Update settings error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update settings'
        }
    }
}

/**
 * Updates hero image
 */
export async function updateHeroImage(imageUrl: string): Promise<ServiceResult> {
    try {
        if (!imageUrl || imageUrl.trim().length === 0) {
            return { success: false, error: 'Image URL is required' }
        }

        await settingsRepo.updateHeroImage(imageUrl)
        return { success: true }
    } catch (error) {
        console.error('Update hero image error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update hero image'
        }
    }
}

/**
 * Updates active theme
 */
export async function updateActiveTheme(theme: string): Promise<ServiceResult> {
    try {
        // Validate theme
        const validThemes = ['default', 'christmas']
        if (!validThemes.includes(theme)) {
            return { success: false, error: 'Invalid theme selected' }
        }

        await settingsRepo.updateActiveTheme(theme)
        return { success: true }
    } catch (error) {
        console.error('Update active theme error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update theme'
        }
    }
}

/**
 * Toggles InstaPay payment method
 */
export async function toggleInstaPay(enabled: boolean, phone?: string): Promise<ServiceResult> {
    try {
        if (enabled && !phone) {
            return { success: false, error: 'Phone number is required to enable InstaPay' }
        }

        await settingsRepo.toggleInstaPay(enabled, phone)
        return { success: true }
    } catch (error) {
        console.error('Toggle InstaPay error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to toggle InstaPay'
        }
    }
}

/**
 * Returns fallback settings from config
 */
function getFallbackSettings(): StoreSettings {
    return {
        id: 1,
        store_name: siteConfig.name,
        description: siteConfig.description,
        phone: siteConfig.contact.phone,
        phone_2: null,
        phone_3: null,
        address: siteConfig.contact.address,
        working_hours: 'Sunday - Thursday: 9:00 AM - 9:00 PM',
        delivery_fee: siteConfig.delivery.fee,
        delivery_time_days: '1-3 business days',
        free_delivery_threshold: siteConfig.delivery.freeThreshold,
        currency_code: siteConfig.currency.code,
        currency_symbol: siteConfig.currency.symbol,
        hero_image_url: '/hero-image.jpg',
        instapay_enabled: true,
        instapay_phone: '01000000000',
        facebook_url: siteConfig.links.facebook || null,
        instagram_url: siteConfig.links.instagram || null,
        twitter_url: siteConfig.links.twitter || null,
        linkedin_url: siteConfig.links.linkedin || null,
        active_theme: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
}
