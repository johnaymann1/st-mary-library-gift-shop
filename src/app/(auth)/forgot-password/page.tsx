'use client'

import { sendPasswordResetEmail } from '@/app/actions/auth'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gift, Mail, ArrowLeft, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState('')

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        const result = await sendPasswordResetEmail(formData)

        if (result?.error) {
            toast.error(result.error)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-6 bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
                            <Check className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                            Check Your Email
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            We&apos;ve sent a password reset link to <strong>{email}</strong>
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-8">
                            Click the link in the email to reset your password. The link will expire in 1 hour.
                        </p>
                        <Link href="/login">
                            <Button className="w-full">
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-7 bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl mb-4">
                        <Gift className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Forgot Password?
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Enter your email and we&apos;ll send you a reset link
                    </p>
                </div>

                <form className="space-y-6" action={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="email-address" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none flex">
                                <Mail className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                            </div>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12 pr-4 h-12 text-sm"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </Button>
                </form>

                <div className="text-center pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-500 dark:hover:text-rose-400 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
