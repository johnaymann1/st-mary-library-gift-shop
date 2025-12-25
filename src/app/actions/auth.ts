'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { formatPhoneNumber } from '@/utils/formatters'
import { registerSchema, loginSchema, phoneSchema } from '@/utils/validation'
import * as AuthService from '@/services/auth.service'

/**
 * Authentication Actions
 * Server actions for user authentication and account management.
 * Uses AuthService for all business logic - zero direct database access.
 */

/**
 * User Registration (Sign Up)
 * Creates a new user account with email and password
 * Sends a welcome email upon successful registration
 */
export async function signup(formData: FormData) {
    // Extract and validate form data
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password'),
        full_name: formData.get('fullName'),
        phone: formData.get('phone') || undefined
    }

    // Validate using Zod schema
    const result = registerSchema.safeParse(rawData)
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { email, password, full_name: fullName, phone: rawPhone } = result.data
    const phone = rawPhone ? formatPhoneNumber(rawPhone) : undefined

    // Use service layer for signup
    const serviceResult = await AuthService.signup({
        email,
        password,
        fullName,
        phone
    })

    if (!serviceResult.success) {
        return { error: serviceResult.error || 'Failed to create account' }
    }

    // Redirect to login with success message
    redirect('/login?message=Check email to continue sign in process')
}

/**
 * User Login
 * Authenticates a user with email and password
 */
export async function login(formData: FormData) {
    // Extract and validate login credentials
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    // Validate using Zod schema
    const result = loginSchema.safeParse(rawData)
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { email, password } = result.data

    // Use service layer for login
    const serviceResult = await AuthService.login({ email, password })

    if (!serviceResult.success) {
        return { error: serviceResult.error || 'Login failed' }
    }

    // Revalidate cached data after login
    revalidatePath('/', 'layout')
    redirect('/')
}

/**
 * Google OAuth Login
 * Initiates Google OAuth authentication flow
 */
export async function loginWithGoogle() {
    const origin = (await headers()).get('origin') || ''

    // Use service layer for Google OAuth
    const serviceResult = await AuthService.loginWithGoogle(origin)

    if (!serviceResult.success || !serviceResult.data) {
        return { error: serviceResult.error || 'Failed to initiate Google login' }
    }

    // Redirect to Google for authentication
    redirect(serviceResult.data)
}

/**
 * User Logout
 * Signs out the current user and clears session
 */
export async function logout() {
    // Use service layer for logout
    await AuthService.logout()
    
    // Revalidate cached data after logout
    revalidatePath('/', 'layout')
    redirect('/login')
}

/**
 * Send Password Reset Email
 * Sends a password reset link to the user's email
 */
export async function sendPasswordResetEmail(formData: FormData) {
    const email = formData.get('email') as string
    
    if (!email) {
        return { error: 'Email is required' }
    }

    const origin = (await headers()).get('origin') || ''

    // Use service layer for password reset
    const serviceResult = await AuthService.sendPasswordResetEmail(email, origin)

    if (!serviceResult.success) {
        return { error: serviceResult.error || 'Failed to send reset email' }
    }

    return { success: true }
}

/**
 * Reset Password
 * Updates the user's password after clicking reset link
 */
export async function resetPassword(formData: FormData) {
    const password = formData.get('password') as string
    
    // Validate password length
    if (!password || password.length < 8) {
        return { error: 'Password must be at least 8 characters' }
    }

    // Use service layer for password reset
    const serviceResult = await AuthService.resetPassword(password)

    if (!serviceResult.success) {
        return { error: serviceResult.error || 'Failed to reset password' }
    }

    // Redirect to login with success message
    redirect('/login?message=Password updated successfully')
}

/**
 * Update Phone Number
 * Updates the user's phone number in auth metadata and database
 * Used for profile completion flow
 */
export async function updatePhone(formData: FormData) {
    // Validate phone number
    const rawData = {
        phone: formData.get('phone')
    }

    const result = phoneSchema.safeParse(rawData)
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Invalid phone number'
        return { error: errorMessage }
    }

    const rawPhone = result.data.phone
    const phone = formatPhoneNumber(rawPhone)

    // Get current user session
    const session = await AuthService.getCurrentSession()
    if (!session) {
        return { error: 'Not authenticated' }
    }

    // Use service layer to update phone
    const serviceResult = await AuthService.updatePhone(session.userId, phone)

    if (!serviceResult.success) {
        return { error: serviceResult.error || 'Failed to update phone' }
    }

    // Redirect to home after successful phone update
    redirect('/')
}
