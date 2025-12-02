'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Store, X, Menu, LayoutDashboard, Package, FolderOpen, ShoppingBag, Home } from 'lucide-react'
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

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
            {/* Desktop Sidebar - Fixed */}
            <aside className="hidden md:flex md:flex-col fixed left-0 top-20 bottom-0 w-64 bg-white border-r border-neutral-200 shadow-lg z-40">
                {/* Logo Section */}
                <div className="h-20 flex items-center justify-center px-6 border-b border-neutral-200">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2.5 rounded-xl">
                            <Store className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-neutral-900">Admin Panel</h1>
                            <p className="text-xs text-neutral-500">St Mary Library</p>
                        </div>
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
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                                    isActive 
                                        ? 'bg-rose-600 text-white' 
                                        : 'text-neutral-700 hover:bg-neutral-100'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Action */}
                <div className="p-4 border-t border-neutral-200">
                    <Link href="/">
                        <Button variant="outline" className="w-full gap-2">
                            <Home className="h-4 w-4" />
                            Back to Store
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header with Menu Button */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 z-50 h-16 flex items-center justify-between px-4 shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="text-neutral-700"
                >
                    <Menu className="h-6 w-6" />
                </Button>
                
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-lg">
                        <Store className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-neutral-900">Admin Panel</span>
                </Link>

                <Link href="/">
                    <Button variant="ghost" size="icon" className="text-neutral-700">
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
                    <div className="md:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl transform transition-transform">
                        {/* Drawer Header */}
                        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
                            <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-lg">
                                    <Store className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-neutral-900">Admin Panel</h2>
                                    <p className="text-xs text-neutral-500">St Mary Library</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
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
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                                            isActive 
                                                ? 'bg-rose-600 text-white' 
                                                : 'text-neutral-700 hover:bg-neutral-100'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Drawer Footer */}
                        <div className="p-4 border-t border-neutral-200">
                            <Link href="/">
                                <Button variant="outline" className="w-full gap-2">
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
