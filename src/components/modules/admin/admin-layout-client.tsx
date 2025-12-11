'use client'

import { AdminSidebar } from './admin-sidebar'
import { useEffect, useState } from 'react'
import type { NavigationItem } from '@/types/navigation'

interface AdminLayoutClientProps {
    navigation: NavigationItem[]
    children: React.ReactNode
}

export function AdminLayoutClient({ navigation, children }: AdminLayoutClientProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // Listen for sidebar collapse state changes
    useEffect(() => {
        const handleStorageChange = () => {
            const collapsed = localStorage.getItem('sidebarCollapsed') === 'true'
            setSidebarCollapsed(collapsed)
        }

        // Check initial state
        handleStorageChange()

        // Listen for changes
        window.addEventListener('storage', handleStorageChange)
        // Custom event for same-tab updates
        window.addEventListener('sidebarToggle', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('sidebarToggle', handleStorageChange)
        }
    }, [])

    return (
        <div className="min-h-screen bg-neutral-50">
            <AdminSidebar navigation={navigation} />

            {/* Main Content - dynamic offset based on sidebar state */}
            <main
                className={`pt-20 md:pt-24 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
                    }`}
            >
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
