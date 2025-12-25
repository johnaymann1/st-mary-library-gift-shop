/**
 * Settings Repository
 * Pure database operations for store settings management.
 * Zero business logic - only data access.
 */
import { createClient } from '@/lib/supabase/server'

/**
 * Store settings entity
 */
export interface StoreSettingsEntity {
    id: number
    store_name: string
    description: string
    phone: string
    phone_2: string | null
    phone_3: string | null
    address: string
    working_hours: string | null
    delivery_fee: number
    delivery_time_days: string | null
    free_delivery_threshold: number | null
    currency_code: string
    currency_symbol: string
    hero_image_url: string | null
    instapay_enabled: boolean
    instapay_phone: string | null
    facebook_url: string | null
    instagram_url: string | null
    twitter_url: string | null
    linkedin_url: string | null
    active_theme: string | null
    created_at: string
    updated_at: string
}

/**
 * Settings update data
 */
export interface UpdateSettingsEntity {
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
    hero_image_url?: string | null
    instapay_enabled?: boolean
    instapay_phone?: string | null
    facebook_url?: string | null
    instagram_url?: string | null
    twitter_url?: string | null
    linkedin_url?: string | null
    active_theme?: string | null
}

/**
 * Finds store settings (always ID = 1)
 */
export async function findStoreSettings(): Promise<StoreSettingsEntity | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle()

    if (error) throw new Error(`Failed to fetch settings: ${error.message}`)

    return data as StoreSettingsEntity | null
}

/**
 * Updates store settings
 */
export async function updateStoreSettings(entity: UpdateSettingsEntity): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('store_settings')
        .update({
            ...entity,
            updated_at: new Date().toISOString()
        })
        .eq('id', 1)

    if (error) throw new Error(`Failed to update settings: ${error.message}`)
}

/**
 * Updates only the hero image URL
 */
export async function updateHeroImage(imageUrl: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('store_settings')
        .update({
            hero_image_url: imageUrl,
            updated_at: new Date().toISOString()
        })
        .eq('id', 1)

    if (error) throw new Error(`Failed to update hero image: ${error.message}`)
}

/**
 * Updates only the active theme
 */
export async function updateActiveTheme(theme: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('store_settings')
        .update({
            active_theme: theme,
            updated_at: new Date().toISOString()
        })
        .eq('id', 1)

    if (error) throw new Error(`Failed to update active theme: ${error.message}`)
}

/**
 * Toggles InstaPay payment method
 */
export async function toggleInstaPay(enabled: boolean, phone?: string): Promise<void> {
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {
        instapay_enabled: enabled,
        updated_at: new Date().toISOString()
    }

    if (phone) {
        updateData.instapay_phone = phone
    }

    const { error } = await supabase
        .from('store_settings')
        .update(updateData)
        .eq('id', 1)

    if (error) throw new Error(`Failed to toggle InstaPay: ${error.message}`)
}

/**
 * Updates delivery configuration
 */
export async function updateDeliveryConfig(
    fee: number,
    timeDays: string,
    freeThreshold?: number
): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('store_settings')
        .update({
            delivery_fee: fee,
            delivery_time_days: timeDays,
            free_delivery_threshold: freeThreshold || null,
            updated_at: new Date().toISOString()
        })
        .eq('id', 1)

    if (error) throw new Error(`Failed to update delivery config: ${error.message}`)
}

/**
 * Updates social media links
 */
export async function updateSocialLinks(links: {
    facebook?: string | null
    instagram?: string | null
    twitter?: string | null
    linkedin?: string | null
}): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('store_settings')
        .update({
            ...links,
            updated_at: new Date().toISOString()
        })
        .eq('id', 1)

    if (error) throw new Error(`Failed to update social links: ${error.message}`)
}

/**
 * Creates initial settings record (if doesn't exist)
 */
export async function createInitialSettings(entity: Partial<StoreSettingsEntity>): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('store_settings')
        .insert({
            id: 1,
            store_name: entity.store_name || 'St. Mary Gift Shop',
            description: entity.description || '',
            phone: entity.phone || '',
            address: entity.address || '',
            delivery_fee: entity.delivery_fee || 0,
            currency_code: entity.currency_code || 'EGP',
            currency_symbol: entity.currency_symbol || '£',
            instapay_enabled: entity.instapay_enabled ?? false,
            ...entity
        })

    if (error) throw new Error(`Failed to create initial settings: ${error.message}`)
}
