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
 * Formats a phone number to Egyptian international format
 * @param phone - The phone number to format
 * @returns Formatted phone number with +20 country code
 */
export function formatPhoneNumber(phone: string): string {
    // 1. Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')

    // 2. Check for Egyptian mobile numbers starting with '01'
    // e.g., 01234567890 -> +201234567890
    if (cleaned.startsWith('01')) {
        return `+20${cleaned.substring(1)}`
    }

    // 3. Check if it starts with '1' (assuming user omitted the leading 0 for Egypt)
    // e.g., 1234567890 -> +201234567890
    if (cleaned.startsWith('1') && cleaned.length === 10) {
        return `+20${cleaned}`
    }

    // 4. If it already has country code (starts with 20), just prepend +
    if (cleaned.startsWith('20')) {
        return `+${cleaned}`
    }

    // 5. Fallback: If it doesn't start with +, add it (assuming it's a full number)
    if (!phone.startsWith('+')) {
        return `+${cleaned}`
    }

    return phone
}
