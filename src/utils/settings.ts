import { createClient } from '@/utils/supabase/server'
import { siteConfig } from '@/config/site'

export type StoreSettings = {
  id: number
  store_name: string
  description: string
  phone: string
  support_email: string
  address: string
  delivery_fee: number
  free_delivery_threshold: number | null
  currency_code: string
  currency_symbol: string
  facebook_url: string | null
  instagram_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  created_at: string
  updated_at: string
}

/**
 * Fetches store settings from the database.
 * Falls back to static config if database fetch fails.
 * 
 * Note: This function is called on every request but Supabase client
 * handles connection pooling. For production, consider adding Redis caching.
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
      console.error('Failed to fetch store settings:', error)
      return getFallbackSettings()
    }

    return data
  } catch (error) {
    console.error('Error fetching store settings:', error)
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
    support_email: siteConfig.contact.email,
    address: siteConfig.contact.address,
    delivery_fee: siteConfig.delivery.fee,
    free_delivery_threshold: siteConfig.delivery.freeThreshold,
    currency_code: siteConfig.currency.code,
    currency_symbol: siteConfig.currency.symbol,
    facebook_url: siteConfig.links.facebook || null,
    instagram_url: siteConfig.links.instagram || null,
    twitter_url: siteConfig.links.twitter || null,
    linkedin_url: siteConfig.links.linkedin || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}
