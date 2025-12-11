'use client'

import { Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface OrderFilterBarProps {
    filter: string
    onFilterChange: (value: string) => void
    filteredCount: number
    totalCount: number
}

export function OrderFilterBar({ filter, onFilterChange, filteredCount, totalCount }: OrderFilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
                    <Filter className="h-5 w-5 text-neutral-600" />
                </div>
                <div>
                    <p className="font-semibold text-neutral-900">Filter Orders</p>
                    <p className="text-sm text-neutral-600">Showing {filteredCount} of {totalCount} orders</p>
                </div>
            </div>
            <Select value={filter} onValueChange={onFilterChange}>
                <SelectTrigger className="w-full sm:w-[220px] h-11 bg-white border-neutral-200 text-neutral-900">
                    <SelectValue placeholder="All Orders" />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-200">
                    <SelectItem value="all" className="text-neutral-900">All Orders</SelectItem>
                    <SelectItem value="pending_payment" className="text-neutral-900">Pending Payment</SelectItem>
                    <SelectItem value="processing" className="text-neutral-900">Processing</SelectItem>
                    <SelectItem value="out_for_delivery" className="text-neutral-900">Out for Delivery</SelectItem>
                    <SelectItem value="ready_for_pickup" className="text-neutral-900">Ready for Pickup</SelectItem>
                    <SelectItem value="completed" className="text-neutral-900">Completed</SelectItem>
                    <SelectItem value="cancelled" className="text-neutral-900">Cancelled</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
