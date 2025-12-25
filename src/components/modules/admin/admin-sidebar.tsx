'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Store, X, Menu, LayoutDashboard, Package, FolderOpen, ShoppingBag, Home, ChevronLeft, ChevronRight, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { NavigationItem } from '@/types/navigation'

interface AdminSidebarProps {
    navigation: NavigationItem[]
}

const iconMap = {
    LayoutDashboard,
    ShoppingBag,
    Package,
    FolderOpen,
    Settings,
}

export function AdminSidebar({ navigation }: AdminSidebarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    // Load collapse state from localStorage
    useEffect(() => {
        const collapsed = localStorage.getItem('sidebarCollapsed') === 'true'
        setIsCollapsed(collapsed)
    }, [])

    // Save collapse state and trigger update
    const toggleCollapse = () => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        localStorage.setItem('sidebarCollapsed', String(newState))
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event('sidebarToggle'))
    }

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileMenuOpen])

    return (
        <>
            {/* Desktop Sidebar - Fixed and Collapsible */}
            <aside className={`hidden md:flex md:flex-col fixed left-0 top-20 bottom-0 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 shadow-lg z-40 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                {/* Collapse Toggle Button */}
                <button
                    onClick={toggleCollapse}
                    className="absolute -right-3 top-8 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full p-1 shadow-md hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors z-50"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4 text-neutral-600 dark:text-neutral-400 transition-colors" />
                    ) : (
                        <ChevronLeft className="h-4 w-4 text-neutral-600 dark:text-neutral-400 transition-colors" />
                    )}
                </button>

                {/* Logo Section */}
                <div className={`h-20 flex items-center px-6 border-b border-neutral-200 dark:border-neutral-800 transition-colors ${isCollapsed ? 'justify-center' : ''}`}>
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2.5 rounded-xl flex-shrink-0">
                            <Store className="h-6 w-6 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div>
                                <h1 className="text-base font-bold text-neutral-900 dark:text-white transition-colors">Admin Panel</h1>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 transition-colors">St Mary Library</p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = iconMap[item.icon as keyof typeof iconMap]
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive
                                        ? 'bg-rose-600 dark:bg-rose-500 text-white'
                                        : 'text-neutral-800 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && <span>{item.name}</span>}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Action */}
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
                    <Link href="/">
                        <Button variant="outline" className={`w-full gap-2 border-2 border-neutral-400 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-500 dark:hover:border-neutral-500 font-semibold transition-colors ${isCollapsed ? 'px-2' : ''}`} title={isCollapsed ? 'Back to Store' : undefined}>
                            <Home className="h-4 w-4 flex-shrink-0" />
                            {!isCollapsed && 'Back to Store'}
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header with Menu Button */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-50 h-16 flex items-center justify-between px-4 shadow-sm transition-colors">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </Button>

                <Link href="/admin" className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-lg">
                        <Store className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-neutral-900 dark:text-white transition-colors">Admin Panel</span>
                </Link>

                <Link href="/">
                    <Button variant="ghost" size="icon" className="text-neutral-700 dark:text-neutral-300 transition-colors">
                        <Home className="h-5 w-5" />
                    </Button>
                </Link>
            </div>

            {/* Mobile Drawer Menu */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 z-50 transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-neutral-900 z-50 shadow-2xl transform transition-all">
                        {/* Drawer Header */}
                        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
                            <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-lg">
                                    <Store className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-neutral-900 dark:text-white transition-colors">Admin Panel</h2>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 transition-colors">St Mary Library</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-neutral-700 dark:text-neutral-300 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                            {navigation.map((item) => {
                                const Icon = iconMap[item.icon as keyof typeof iconMap]
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive
                                                ? 'bg-rose-600 dark:bg-rose-500 text-white'
                                                : 'text-neutral-800 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Drawer Footer */}
                        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
                            <Link href="/">
                                <Button variant="outline" className="w-full gap-2 border-2 border-neutral-400 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-500 dark:hover:border-neutral-500 font-semibold transition-colors">
                                    <Home className="h-4 w-4" />
                                    Back to Store
                                </Button>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
