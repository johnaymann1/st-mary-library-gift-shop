'use client'

import { signup } from '@/app/actions/auth'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Gift, User, Mail, Phone, Lock, Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: ''
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        
        const formDataObj = new FormData(e.currentTarget)
        const result = await signup(formDataObj)

        if (result?.error) {
            toast.error(result.error)
            setLoading(false)
        }
        // On success, the action will redirect, no need to setLoading(false)
    }

    function handleInputChange(field: string, value: string) {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-6 sm:space-y-6 bg-white p-8 sm:p-8 rounded-2xl shadow-lg border border-neutral-200">
                {/* Logo & Title */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl mb-3">
                        <Gift className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-1">
                        Join St. Mary Library
                    </h2>
                    <p className="text-sm text-neutral-600">Create your account to start shopping</p>
                </div>

                {/* Google Signup */}
                <form action={async () => {
                    // We can reuse the loginWithGoogle action as it handles both login and signup
                    const { loginWithGoogle } = await import('@/app/actions/auth')
                    const result = await loginWithGoogle()
                    if (result?.error) {
                        toast.error(result.error)
                    }
                }}>
                    <Button
                        type="submit"
                        variant="outline"
                        disabled={loading}
                        className="w-full h-10 border-2 hover:border-rose-300 hover:bg-rose-50 text-neutral-900"
                    >
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign up with Google
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-4 bg-white text-neutral-500 font-medium tracking-wider">Or sign up with email</span>
                    </div>
                </div>

                <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="block text-sm font-semibold text-neutral-700">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none hidden sm:flex">
                                    <User className="h-4 w-4 text-neutral-400" />
                                </div>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    className="pl-4 sm:pl-12 pr-4 h-11 text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 items-center pointer-events-none hidden sm:flex">
                                    <Phone className="h-4 w-4 text-neutral-400" />
                                </div>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="pl-4 sm:pl-12 pr-4 h-11 text-sm"
                                    placeholder="01012345678"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email-address" className="block text-sm font-semibold text-neutral-700">
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
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="pl-4 sm:pl-12 pr-4 h-11 text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-semibold text-neutral-700">
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
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="pl-4 sm:pl-12 pr-4 h-11 text-sm"
                                    placeholder="At least 8 characters"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 sm:pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold"
                        >
                        {loading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>
                        ) : (
                            'Create your account'
                        )}
                    </Button>
                    </div>
                </form>

                <div className="text-center pt-2 border-t border-neutral-200">
                    <p className="text-sm text-neutral-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-semibold text-rose-600 hover:text-rose-700 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
