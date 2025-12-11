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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-600 mb-1">Total Orders</p>
                        <p className="text-3xl font-bold text-neutral-900">{total}</p>
                    </div>
                    <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-neutral-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-600 mb-1">Pending Review</p>
                        <p className="text-3xl font-bold text-blue-600">{pending}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-600 mb-1">In Progress</p>
                        <p className="text-3xl font-bold text-indigo-600">{processing}</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Package className="h-6 w-6 text-indigo-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-neutral-600 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-600">{completed}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                </div>
            </div>
        </div>
    )
}
