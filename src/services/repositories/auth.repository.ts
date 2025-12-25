/**
 * Authentication Repository
 * Pure database operations for authentication.
 * Handles Supabase Auth operations.
 */
import { createClient } from '@/lib/supabase/server'

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
    email: string,
    password: string
): Promise<{ userId: string } | null> {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    })

    if (error) throw new Error(`Sign up failed: ${error.message}`)
    if (!data.user) throw new Error('No user returned from sign up')

    return { userId: data.user.id }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
    email: string,
    password: string
): Promise<{ userId: string } | null> {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) throw new Error(`Sign in failed: ${error.message}`)
    if (!data.user) throw new Error('No user returned from sign in')

    return { userId: data.user.id }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(origin: string): Promise<{ url: string }> {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`
        }
    })

    if (error) throw new Error(`Google sign in failed: ${error.message}`)
    if (!data.url) throw new Error('No redirect URL returned')

    return { url: data.url }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) throw new Error(`Sign out failed: ${error.message}`)
}

/**
 * Sends password reset email
 */
export async function sendPasswordResetEmail(
    email: string,
    origin: string
): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password`
    })

    if (error) throw new Error(`Password reset failed: ${error.message}`)
}

/**
 * Updates user password
 */
export async function updatePassword(newPassword: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) throw new Error(`Password update failed: ${error.message}`)
}

/**
 * Gets current session
 */
export async function getCurrentSession(): Promise<{
    userId: string
    email: string
} | null> {
    const supabase = await createClient()

    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) return null

    return {
        userId: session.user.id,
        email: session.user.email ?? ''
    }
}

/**
 * Refreshes the current session
 */
export async function refreshSession(): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase.auth.refreshSession()

    if (error) throw new Error(`Session refresh failed: ${error.message}`)
}
