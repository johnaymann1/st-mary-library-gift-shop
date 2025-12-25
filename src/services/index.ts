/**
 * Services Index
 * Re-exports all service modules for convenient imports.
 * 
 * Architecture:
 * - *.service.ts files contain business logic
 * - repositories/*.repository.ts files contain pure data access
 * - All Supabase access is isolated to repository layer
 */

// Business Logic Services (Use these in Server Actions and Pages)
export * as CartService from './cart.service'
export * as ProductsService from './products.service'
export * as OrdersService from './orders.service'
export * as CategoriesService from './categories.service'
export * as UsersService from './users.service'
export * as AddressesService from './addresses.service'
export * as SettingsService from './settings.service'
export * as StorageService from './storage.service'
export * as AuthService from './auth.service'

// Legacy exports (deprecated - use service layer instead)
export * from './products'
export * from './orders'
export * from './cart'
export * from './categories'
export * from './users'
export * from './storage'
export * from './addresses'
export * from './auth'
export * from './settings'
