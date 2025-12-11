'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Mail, Phone, Loader2, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProfileEditClientProps {
    user: {
        email: string
        full_name: string
        phone: string | null
    }
}

export default function ProfileEditClient({ user }: ProfileEditClientProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: user.full_name || '',
        phone: user.phone || '',
        email: user.email || '',
        newEmail: ''
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        try {
            // Update name if changed
            if (formData.fullName !== user.full_name) {
                const response = await fetch('/api/profile/update-name', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName: formData.fullName })
                })
                if (!response.ok) {
                    const data = await response.json()
                    throw new Error(data.error || 'Failed to update name')
                }
            }

            // Update phone if changed
            if (formData.phone !== user.phone) {
                const { updateUserPhone } = await import('@/app/actions/address')
                const result = await updateUserPhone(formData.phone)
                if (result?.error) {
                    throw new Error(result.error)
                }
            }

            // Update email if new email provided
            if (formData.newEmail && formData.newEmail !== user.email) {
                const response = await fetch('/api/profile/update-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.newEmail })
                })
                if (!response.ok) {
                    const data = await response.json()
                    throw new Error(data.error || 'Failed to update email')
                }
                toast.success('Profile updated! Check your new email for verification link.')
            } else {
                toast.success('Profile updated successfully!')
            }

            setTimeout(() => {
                router.push('/account')
                router.refresh()
            }, 1000)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-rose-50">
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/account" className="inline-flex items-center gap-2 text-neutral-600 hover:text-rose-600 transition-colors mb-6">
                    <ArrowLeft className="h-5 w-5" />
                    Back to Account
                </Link>

                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-neutral-900 mb-2">Edit Profile</h1>
                    <p className="text-neutral-600">Update your account information</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="block text-sm font-semibold text-neutral-700">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none flex">
                                    <User className="h-4 w-4 text-neutral-400" />
                                </div>
                                <Input
                                    id="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                    className="pl-12 pr-4 h-12 text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none flex">
                                    <Phone className="h-4 w-4 text-neutral-400" />
                                </div>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="pl-12 pr-4 h-12 text-sm"
                                    placeholder="01012345678"
                                />
                            </div>
                            <p className="text-xs text-neutral-500">Format: 01012345678 (11 digits starting with 01)</p>
                        </div>

                        <div className="border-t border-neutral-200 pt-6">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Change Email</h3>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="currentEmail" className="block text-sm font-semibold text-neutral-700">
                                        Current Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none flex">
                                            <Mail className="h-4 w-4 text-neutral-400" />
                                        </div>
                                        <Input
                                            id="currentEmail"
                                            type="email"
                                            disabled
                                            value={formData.email}
                                            className="pl-12 pr-4 h-12 text-sm bg-neutral-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="newEmail" className="block text-sm font-semibold text-neutral-700">
                                        New Email (Optional)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none flex">
                                            <Mail className="h-4 w-4 text-neutral-400" />
                                        </div>
                                        <Input
                                            id="newEmail"
                                            type="email"
                                            value={formData.newEmail}
                                            onChange={(e) => setFormData(prev => ({ ...prev, newEmail: e.target.value }))}
                                            className="pl-12 pr-4 h-12 text-sm"
                                            placeholder="newemail@example.com"
                                        />
                                    </div>
                                    <p className="text-xs text-neutral-500">
                                        If you change your email, you&apos;ll need to verify it before you can use it to log in.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/account')}
                                className="flex-1 text-neutral-900"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
