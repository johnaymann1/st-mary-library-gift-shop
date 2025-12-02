'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CheckoutError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const router = useRouter()

    useEffect(() => {
        console.error('Checkout error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-8 w-8 text-rose-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                        Checkout Error
                    </h2>
                    <p className="text-neutral-600">
                        We couldn&apos;t complete your checkout. Your cart is still safe!
                    </p>
                </div>

                {error.message && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-rose-800">
                            <strong>Error:</strong> {error.message}
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    <Button
                        onClick={reset}
                        className="w-full bg-rose-600 hover:bg-rose-700"
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/cart')}
                        className="w-full"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Cart
                    </Button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-neutral-500">
                        Need help? Contact{' '}
                        <a href="mailto:support@stmarylibrary.com" className="text-rose-600 hover:underline">
                            support@stmarylibrary.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
