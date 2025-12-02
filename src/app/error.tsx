'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log error to monitoring service (e.g., Sentry)
        console.error('Error caught by boundary:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="h-8 w-8 text-rose-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    Something went wrong!
                </h2>
                <p className="text-neutral-600 mb-6">
                    We encountered an unexpected error. Don&apos;t worry, your data is safe.
                </p>
                {error.message && (
                    <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-neutral-700 font-mono break-words">
                            {error.message}
                        </p>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="bg-rose-600 hover:bg-rose-700"
                    >
                        Try Again
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                    >
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    )
}
