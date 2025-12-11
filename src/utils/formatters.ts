import { siteConfig } from '@/config/site'

/**
 * Formats a price with the configured currency
 * @param price - The numeric price value
 * @param includeSymbol - Whether to include the currency symbol (default: true)
 * @returns Formatted price string (e.g., "1,250 EGP")
 */
export function formatPrice(price: number, includeSymbol: boolean = true): string {
    const formatted = price.toLocaleString()
    return includeSymbol ? `${formatted} ${siteConfig.currency.code}` : formatted
}

/**
 * Formats a phone number to consistent storage format (01xxxxxxxxx)
 * @param phone - The phone number to format
 * @returns Formatted phone number as 01xxxxxxxxx
 */
export function formatPhoneNumber(phone: string): string {
    // 1. Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')

    // 2. If it starts with 20 (country code), remove it to get local format
    if (cleaned.startsWith('20') && cleaned.length === 12) {
        return `0${cleaned.substring(2)}`
    }

    // 3. If it starts with 1 and is 10 digits, add 0 at the start
    if (cleaned.startsWith('1') && cleaned.length === 10) {
        return `0${cleaned}`
    }

    // 4. If it already starts with 0 and is 11 digits, return as is
    if (cleaned.startsWith('0') && cleaned.length === 11) {
        return cleaned
    }

    // 5. If it's already in correct format (01xxxxxxxxx), return it
    if (cleaned.startsWith('01') && cleaned.length === 11) {
        return cleaned
    }

    // 6. Fallback: return cleaned digits
    return cleaned
}
