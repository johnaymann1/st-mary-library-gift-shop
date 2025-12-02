import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import Navbar from '@/components/Navbar'

export const dynamic = 'force-dynamic'

export default function NotFound() {
    return (
        <>
            <Navbar />
            <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4">
                <div className="max-w-2xl w-full text-center">
                    {/* 404 Illustration */}
                    <div className="mb-8">
                        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-pink-600">
                            404
                        </h1>
                        <div className="mt-4 text-6xl">📚</div>
                    </div>

                    {/* Message */}
                    <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
                        Oops! The page you're looking for seems to have wandered off our shelves. 
                        Let's get you back to browsing our collection.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            <Home className="h-5 w-5" />
                            Back to Home
                        </Link>
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-700 font-semibold rounded-xl border-2 border-neutral-200 hover:border-rose-300 hover:bg-rose-50 transition-all"
                        >
                            <Search className="h-5 w-5" />
                            Search Products
                        </Link>
                    </div>

                    {/* Help Text */}
                    <div className="mt-12 pt-8 border-t border-neutral-200">
                        <p className="text-sm text-neutral-500">
                            Need help? Check out our{' '}
                            <Link href="/" className="text-rose-600 hover:text-rose-700 font-medium underline">
                                popular categories
                            </Link>{' '}
                            or browse{' '}
                            <Link href="/" className="text-rose-600 hover:text-rose-700 font-medium underline">
                                featured products
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
