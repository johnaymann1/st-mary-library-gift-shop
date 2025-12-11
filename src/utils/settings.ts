import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export type StoreSettings = {
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
  active_theme: 'default' | 'christmas' | 'easter' | 'summer' | 'halloween'
  created_at: string
  updated_at: string
}

/**
 * Fetches store settings from the database.
 * Falls back to static config if database fetch fails.
 * 
 * Note: Cache is disabled to ensure theme changes are reflected immediately.
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      return getFallbackSettings()
    }

    return data
  } catch {
    return getFallbackSettings()
  }
}

/**
 * Returns fallback settings from static config
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
    active_theme: 'default',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}
