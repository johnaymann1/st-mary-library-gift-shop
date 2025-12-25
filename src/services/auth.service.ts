/**
 * Authentication Service
 * Business logic layer for authentication operations.
 * Uses auth repository and users repository for data access.
 */
import * as authRepo from './repositories/auth.repository'
import * as usersRepo from './repositories/users.repository'
import { resend } from '@/lib/resend'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server.browser'
import WelcomeEmail from '@/components/emails/WelcomeEmail'

/**
 * Service result type
 */
export interface ServiceResult<T = void> {
    success: boolean
    data?: T
    error?: string
}

/**
 * Sign up data
 */
export interface SignUpData {
    email: string
    password: string
    fullName: string
    phone?: string
}

/**
 * Login data
 */
export interface LoginData {
    email: string
    password: string
}

/**
 * Signs up a new user
 */
export async function signup(data: SignUpData): Promise<ServiceResult> {
    try {
        // Validate email
        if (!data.email || !data.email.includes('@')) {
            return { success: false, error: 'Valid email is required' }
        }

        // Validate password (minimum 6 characters)
        if (!data.password || data.password.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters' }
        }

        // Validate full name
        if (!data.fullName || data.fullName.trim().length === 0) {
            return { success: false, error: 'Full name is required' }
        }

        // Create auth user
        const authUser = await authRepo.signUpWithEmail(data.email, data.password)
        if (!authUser) {
            return { success: false, error: 'Failed to create account' }
        }

        // Create user profile in database
        await usersRepo.upsertUser({
            id: authUser.userId,
            email: data.email,
            full_name: data.fullName,
            phone: data.phone || null
        })

        // Send welcome email (don't await - fire and forget)
        sendWelcomeEmail(data.email, data.fullName).catch(console.error)

        return { success: true }
    } catch (error) {
        console.error('Signup error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create account'
        }
    }
}

/**
 * Logs in a user
 */
export async function login(data: LoginData): Promise<ServiceResult> {
    try {
        // Validate credentials
        if (!data.email || !data.password) {
            return { success: false, error: 'Email and password are required' }
        }

        await authRepo.signInWithEmail(data.email, data.password)
        return { success: true }
    } catch (error) {
        console.error('Login error:', error)
        return {
            success: false,
            error: 'Invalid email or password'
        }
    }
}

/**
 * Logs in with Google OAuth
 */
export async function loginWithGoogle(origin: string): Promise<ServiceResult<string>> {
    try {
        const { url } = await authRepo.signInWithGoogle(origin)
        return { success: true, data: url }
    } catch (error) {
        console.error('Google login error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to login with Google'
        }
    }
}

/**
 * Logs out the current user
 */
export async function logout(): Promise<ServiceResult> {
    try {
        await authRepo.signOut()
        return { success: true }
    } catch (error) {
        console.error('Logout error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to logout'
        }
    }
}

/**
 * Sends password reset email
 */
export async function sendPasswordResetEmail(
    email: string,
    origin: string
): Promise<ServiceResult> {
    try {
        if (!email || !email.includes('@')) {
            return { success: false, error: 'Valid email is required' }
        }

        await authRepo.sendPasswordResetEmail(email, origin)
        return { success: true }
    } catch (error) {
        console.error('Password reset error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send reset email'
        }
    }
}

/**
 * Resets user password
 */
export async function resetPassword(newPassword: string): Promise<ServiceResult> {
    try {
        if (!newPassword || newPassword.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters' }
        }

        await authRepo.updatePassword(newPassword)
        return { success: true }
    } catch (error) {
        console.error('Reset password error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to reset password'
        }
    }
}

/**
 * Updates user phone number
 */
export async function updatePhone(userId: string, phone: string): Promise<ServiceResult> {
    try {
        if (!phone || phone.trim().length === 0) {
            return { success: false, error: 'Phone number is required' }
        }

        await usersRepo.updateUserPhone(userId, phone)
        
        // Update auth metadata
        await usersRepo.updateUserAuthMetadata({ phone })

        return { success: true }
    } catch (error) {
        console.error('Update phone error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update phone number'
        }
    }
}

/**
 * Gets current session
 */
export async function getCurrentSession(): Promise<{
    userId: string
    email: string
} | null> {
    try {
        return await authRepo.getCurrentSession()
    } catch (error) {
        console.error('Get session error:', error)
        return null
    }
}

/**
 * Sends welcome email to new user
 */
async function sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    try {
        await resend.emails.send({
            from: 'St. Mary Gift Shop <noreply@stmarygiftshop.com>',
            to: email,
            subject: 'Welcome to St. Mary Gift Shop!',
            html: renderToStaticMarkup(createElement(WelcomeEmail, { name: fullName }))
        })
    } catch (error) {
        console.error('Failed to send welcome email:', error)
        // Don't throw - email failure shouldn't block signup
    }
}
