'use client'

import { resetPassword } from '@/app/actions/auth'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gift, Lock, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(true)
    const [hasValidSession, setHasValidSession] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Check if user has a valid session from the reset link
        const checkSession = async () => {
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()
            
            if (!session) {
                toast.error('Invalid or expired reset link')
                router.push('/forgot-password')
                return
            }
            
            setHasValidSession(true)
            setChecking(false)
        }
        
        checkSession()
    }, [router])

    async function handleSubmit(formData: FormData) {
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)

        const result = await resetPassword(formData)

        if (result?.error) {
            toast.error(result.error)
            setLoading(false)
        }
        // On success, the action will redirect
    }

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
                <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
            </div>
        )
    }

    if (!hasValidSession) {
        return null // Will redirect
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-7 bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl mb-4">
                        <Gift className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Reset Password
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                        Enter your new password
                    </p>
                </div>

                <form className="space-y-6" action={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none flex">
                                <Lock className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={8}
                                className="pl-12 pr-4 h-12 text-sm"
                                placeholder="At least 8 characters"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none flex">
                                <Lock className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                            </div>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={8}
                                className="pl-12 pr-4 h-12 text-sm"
                                placeholder="Confirm your password"
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
                                Resetting...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}
