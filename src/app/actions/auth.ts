'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { formatPhoneNumber } from '@/utils/formatters'
import { resend } from '@/lib/resend'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server.browser'
import WelcomeEmail from '@/components/emails/WelcomeEmail'

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const rawPhone = formData.get('phone') as string
    const phone = formatPhoneNumber(rawPhone)

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
    } catch (emailError) {
        // Log error but don't block signup
        console.error('Failed to send welcome email:', emailError)
    }

    // If email confirmation is disabled, we could redirect to dashboard
    // But usually we redirect to a "check email" page or login
    redirect('/login?message=Check email to continue sign in process')
}

export async function login(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

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
    redirect('/login')
}

export async function updatePhone(formData: FormData) {
    const supabase = await createClient()
    const rawPhone = formData.get('phone') as string
    const phone = formatPhoneNumber(rawPhone)

    const {
        data: { user },
    } = await supabase.auth.getUser()

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

    // 2. Update Public Users Table
    const { error: dbError } = await supabase
        .from('users')
        .update({ phone: phone })
        .eq('id', user.id)

    if (dbError) {
        return { error: dbError.message }
    }

    redirect('/')
}
