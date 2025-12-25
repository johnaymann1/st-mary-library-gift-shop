'use client'

import { Filter, Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface OrderFilterBarProps {
    filter: string
    onFilterChange: (value: string) => void
    searchQuery: string
    onSearchChange: (value: string) => void
    filteredCount: number
    totalCount: number
}

export function OrderFilterBar({ filter, onFilterChange, searchQuery, onSearchChange, filteredCount, totalCount }: OrderFilterBarProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center transition-colors">
                        <Filter className="h-5 w-5 text-neutral-600 dark:text-neutral-400 transition-colors" />
                    </div>
                    <div>
                        <p className="font-semibold text-neutral-900 dark:text-white transition-colors">Filter Orders</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors">Showing {filteredCount} of {totalCount} orders</p>
                    </div>
                </div>
                <Select value={filter} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-full sm:w-[220px] h-11 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white transition-colors">
                        <SelectValue placeholder="All Orders" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                        <SelectItem value="all" className="text-neutral-900 dark:text-white focus:bg-neutral-100 dark:focus:bg-neutral-700">All Orders</SelectItem>
                        <SelectItem value="pending_payment" className="text-neutral-900 dark:text-white focus:bg-neutral-100 dark:focus:bg-neutral-700">Pending Payment</SelectItem>
                        <SelectItem value="processing" className="text-neutral-900 dark:text-white focus:bg-neutral-100 dark:focus:bg-neutral-700">Processing</SelectItem>
                        <SelectItem value="out_for_delivery" className="text-neutral-900 dark:text-white focus:bg-neutral-100 dark:focus:bg-neutral-700">Out for Delivery</SelectItem>
                        <SelectItem value="ready_for_pickup" className="text-neutral-900 dark:text-white focus:bg-neutral-100 dark:focus:bg-neutral-700">Ready for Pickup</SelectItem>
                        <SelectItem value="completed" className="text-neutral-900 dark:text-white focus:bg-neutral-100 dark:focus:bg-neutral-700">Completed</SelectItem>
                        <SelectItem value="cancelled" className="text-neutral-900 dark:text-white focus:bg-neutral-100 dark:focus:bg-neutral-700">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                <Input
                    type="text"
                    placeholder="Search by name, email, phone, or order ID..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 h-11 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 transition-colors"
                />
            </div>
        </div>
    )
}
