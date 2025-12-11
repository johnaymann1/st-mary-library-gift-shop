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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-neutral-200">
                <div>
                    <h2 className="text-center text-3xl font-bold text-neutral-900">
                        Complete Your Profile
                    </h2>
                    <p className="mt-2 text-center text-sm text-neutral-600">
                        We need your phone number to coordinate gift deliveries.
                    </p>
                </div>

                <form className="mt-8 space-y-6" action={handleSubmit}>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-2">
                            Phone Number
                        </label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            required
                            placeholder="Phone Number (e.g. +20...)"
                            className="text-[16px]"
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
