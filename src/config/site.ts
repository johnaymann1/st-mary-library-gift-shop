/**
 * Site Configuration
 * 
 * This file contains all centralized configuration values for the St. Mary Library application.
 * Update these values to reflect your store's information.
 */

export const siteConfig = {
  name: 'St. Mary Gift Shop',
  displayName: 'St. Mary Gift Shop',
  tagline: 'Gifts & More',
  description: 'Discover a curated collection of books, stationery, and unique gifts at St Mary Library. Find the perfect gift for every occasion, from educational materials to premium gift items.',
  
  contact: {
    phone: '+20 123 456 7890', // Update with your actual phone number
    email: 'support@stmarylibrary.com', // Update with your actual email
    address: 'St Mary Church Faggalah ,Cairo, Egypt', // Update with your actual physical address
  },
  
  currency: {
    code: 'EGP',
    symbol: 'EGP',
    locale: 'en-EG',
  },
  
  delivery: {
    fee: 50, // Delivery fee in EGP
    freeThreshold: 1000, // Free delivery over this amount (optional)
  },
  
  links: {
    facebook: '', // Add your Facebook page URL
    instagram: '', // Add your Instagram profile URL
    twitter: '', // Add your Twitter profile URL
    linkedin: '', // Add your LinkedIn profile URL
  },
  
  seo: {
    keywords: ['St Mary Gift Shop', 'books', 'stationery', 'gifts', 'library', 'bookstore', 'gift shop', 'Cairo', 'Egypt'] as string[],
    ogImage: '/og-image.png',
  },
  
  email: {
    from: 'St Mary Gift shop <onboarding@resend.dev>', // Update with your verified email domain
    adminEmail: process.env.ADMIN_EMAIL || 'admin@stmarylibrary.com',
  },
} as const

export type SiteConfig = typeof siteConfig
