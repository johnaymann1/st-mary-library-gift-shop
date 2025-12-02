'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Store, ChevronLeft, ChevronRight, LayoutDashboard, Package, FolderOpen, ShoppingBag } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface NavigationItem {
    name: string
    href: string
    icon: string
}

interface AdminSidebarProps {
    navigation: NavigationItem[]
}

const iconMap = {
    LayoutDashboard,
    ShoppingBag,
    Package,
    FolderOpen,
}

export function AdminSidebar({ navigation }: AdminSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    // Update body margin when sidebar collapses/expands
    useEffect(() => {
        const root = document.documentElement
        if (isCollapsed) {
            root.style.setProperty('--admin-sidebar-width', '5rem')
        } else {
            root.style.setProperty('--admin-sidebar-width', '18rem')
        }
    }, [isCollapsed])

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex md:flex-col fixed left-0 top-0 h-screen bg-white border-r border-neutral-200 shadow-sm transition-all duration-300 z-10 ${isCollapsed ? 'md:w-20' : 'md:w-72'}`}>
                {/* Logo and Collapse Button */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 mt-20">
                    {!isCollapsed ? (
                        <>
                            <Link href="/admin" className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-xl shadow-md">
                                    <Store className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-neutral-900">St Mary Library</h1>
                                    <p className="text-xs text-neutral-600 font-medium">Admin Panel</p>
                                </div>
                            </Link>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="px-2"
                            >
                                <ChevronLeft className="h-4 w-4 text-neutral-600" />
                            </Button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2 mx-auto pt-2">
                            <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-xl shadow-md">
                                <Store className="h-5 w-5 text-white" />
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="px-2"
                            >
                                <ChevronRight className="h-4 w-4 text-neutral-600" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = iconMap[item.icon as keyof typeof iconMap]
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium group ${
                                    isActive 
                                        ? 'bg-rose-50 text-rose-700' 
                                        : 'text-neutral-700 hover:bg-rose-50 hover:text-rose-700'
                                } ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? item.name : ''}
                            >
                                <Icon className={`h-5 w-5 ${isActive ? 'text-rose-600' : 'text-neutral-500 group-hover:text-rose-600'}`} />
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        )
                    })}
                </nav>

            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 z-50 h-16 flex items-center justify-between px-4 shadow-sm">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-lg shadow-md">
                        <Store className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-neutral-900">Admin</span>
                </Link>
                <Link href="/" className="text-sm text-rose-600 hover:text-rose-700 font-semibold">
                    Exit
                </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 shadow-lg">
                <nav className="flex justify-around py-2">
                    {navigation.map((item) => {
                        const Icon = iconMap[item.icon as keyof typeof iconMap]
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 px-4 py-2 ${
                                    isActive ? 'text-rose-600' : 'text-neutral-600 hover:text-rose-600'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </>
    )
}
