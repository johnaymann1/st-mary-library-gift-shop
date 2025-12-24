'use client'

import { login, loginWithGoogle } from '@/app/actions/auth'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BackButton } from '@/components/ui/back-button'
import { Gift, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    async function handleLogin(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await login(formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-7 sm:space-y-8 bg-white dark:bg-neutral-900 p-8 sm:p-8 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors">
                {/* Back Button */}
                <div className="-mt-2">
                    <BackButton href="/" label="Back to Home" />
                </div>

                {/* Logo & Title */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl mb-4">
                        <Gift className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2 transition-colors">
                        Welcome Back
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-300 transition-colors">Sign in to St. Mary Library</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 transition-colors">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5 transition-colors" />
                            <p className="text-sm text-rose-800 dark:text-rose-300 font-medium transition-colors">{error}</p>
                        </div>
                    </div>
                )}

                {/* Google Login */}
                <form action={async () => {
                    setGoogleLoading(true)
                    const result = await loginWithGoogle()
                    if (result?.error) {
                        setError(result.error)
                        setGoogleLoading(false)
                    }
                }}>
                    <Button
                        type="submit"
                        variant="outline"
                        disabled={googleLoading || loading}
                        className="w-full h-12 border-2 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-neutral-900 dark:text-white dark:border-neutral-700 transition-colors"
                    >
                        {googleLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        {googleLoading ? 'Signing in...' : 'Continue with Google'}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200 dark:border-neutral-800 transition-colors" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 font-medium transition-colors">Or continue with email</span>
                    </div>
                </div>

                {/* Email Login */}
                <form className="space-y-5 sm:space-y-6" action={handleLogin}>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email-address" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition-colors">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none hidden sm:flex">
                                    <Mail className="h-4 w-4 text-neutral-400" />
                                </div>
                                <Input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    autoComplete="email"
                                    required
                                    className="pl-4 sm:pl-12 pr-4 h-12 text-[16px] sm:text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition-colors">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none hidden sm:flex">
                                    <Lock className="h-4 w-4 text-neutral-400" />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="pl-4 sm:pl-12 pr-4 h-12 text-sm"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end mb-4">
                        <Link href="/forgot-password" className="text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading || googleLoading}
                            className="w-full h-12 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold"
                        >
                        {loading ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Signing in...</>
                        ) : (
                            'Sign in to your account'
                        )}
                    </Button>
                    </div>
                </form>

                <div className="text-center pt-4 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 transition-colors">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
