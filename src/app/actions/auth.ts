'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { formatPhoneNumber } from '@/utils/formatters'
import { resend } from '@/lib/resend'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server.browser'
import WelcomeEmail from '@/components/emails/WelcomeEmail'
import { registerSchema, loginSchema } from '@/utils/validation'

export async function signup(formData: FormData) {
    // Validate input
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password'),
        full_name: formData.get('fullName'),
        phone: formData.get('phone') || undefined
    }

    const result = registerSchema.safeParse(rawData)
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { email, password, full_name: fullName, phone: rawPhone } = result.data
    const phone = rawPhone ? formatPhoneNumber(rawPhone) : undefined

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                phone: phone,
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    // Send welcome email (non-blocking)
    try {
        await resend.emails.send({
            from: 'St Mary Library <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to St Mary Library! 🎉',
            html: renderToStaticMarkup(createElement(WelcomeEmail, { name: fullName })),
        })
    } catch {
        // Email send failed - don't block signup
    }

    // If email confirmation is disabled, we could redirect to dashboard
    // But usually we redirect to a "check email" page or login
    redirect('/login?message=Check email to continue sign in process')
}

export async function login(formData: FormData) {
    // Validate input
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const result = loginSchema.safeParse(rawData)
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { email, password } = result.data

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function loginWithGoogle() {
    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    if (data.url) {
        redirect(data.url)
    }
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function sendPasswordResetEmail(formData: FormData) {
    const email = formData.get('email') as string
    
    if (!email) {
        return { error: 'Email is required' }
    }

    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function resetPassword(formData: FormData) {
    const password = formData.get('password') as string
    
    if (!password || password.length < 8) {
        return { error: 'Password must be at least 8 characters' }
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
        password: password,
    })

    if (error) {
        return { error: error.message }
    }

    redirect('/login?message=Password updated successfully')
}

export async function updatePhone(formData: FormData) {
    // Validate input
    const { phoneSchema } = await import('@/utils/validation')
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

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    // 1. Update Auth Metadata
    const { error: authError } = await supabase.auth.updateUser({
        data: { phone: phone },
    })

    if (authError) {
        return { error: authError.message }
    }

    // 2. Update Public Users Table via service
    const authSvc = await import('@/services/auth')
    const serviceResult = await authSvc.updateUserPhone({
        userId: user.id,
        phone
    })

    if (serviceResult.error) {
        return { error: serviceResult.error }
    }

    redirect('/')
}
