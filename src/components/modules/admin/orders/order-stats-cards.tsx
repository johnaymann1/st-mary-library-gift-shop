'use client'

import { ShoppingBag, AlertCircle, Package, CheckCircle2 } from 'lucide-react'

interface OrderStatsProps {
    total: number
    pending: number
    processing: number
    completed: number
}

export function OrderStatsCards({ total, pending, processing, completed }: OrderStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 transition-colors hover:shadow-md dark:hover:shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1 font-bold uppercase tracking-wide transition-colors">Total Orders</p>
                        <p className="text-3xl font-bold text-neutral-900 dark:text-white transition-colors">{total}</p>
                    </div>
                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center transition-colors">
                        <ShoppingBag className="h-6 w-6 text-neutral-600 dark:text-neutral-400 transition-colors" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 transition-colors hover:shadow-md dark:hover:shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1 font-bold uppercase tracking-wide transition-colors">Pending Review</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors">{pending}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center transition-colors">
                        <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 transition-colors" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 transition-colors hover:shadow-md dark:hover:shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1 font-bold uppercase tracking-wide transition-colors">In Progress</p>
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 transition-colors">{processing}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center transition-colors">
                        <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400 transition-colors" />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800 transition-colors hover:shadow-md dark:hover:shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1 font-bold uppercase tracking-wide transition-colors">Completed</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 transition-colors">{completed}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center transition-colors">
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    )
}
