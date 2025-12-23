'use server'

import { revalidateTag } from 'next/cache'

/**
 * Revalidates store settings cache when admin updates settings
 * This ensures theme changes are reflected immediately
 */
export async function revalidateSettings() {
  revalidateTag('store-settings')
}
