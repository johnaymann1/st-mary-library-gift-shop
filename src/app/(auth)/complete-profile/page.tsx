'use client'

import { updatePhone } from '@/app/actions/auth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export const dynamic = 'force-dynamic'

export default function CompleteProfilePage() {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const result = await updatePhone(formData)
        
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Profile updated successfully!')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 transition-colors">
                <div>
                    <h2 className="text-center text-3xl font-bold text-neutral-900 dark:text-white transition-colors">
                        Complete Your Profile
                    </h2>
                    <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400 transition-colors">
                        We need your phone number to coordinate gift deliveries.
                    </p>
                </div>

                <form className="mt-8 space-y-6" action={handleSubmit}>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 transition-colors">
                            Phone Number
                        </label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            required
                            placeholder="Phone Number (e.g. +20...)"
                            className="text-[16px] dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500 transition-colors"
                        />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                            size="lg"
                        >
                            {loading ? 'Saving...' : 'Save & Continue'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
