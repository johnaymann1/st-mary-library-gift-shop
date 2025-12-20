'use client'

import Link from 'next/link'
import { Gift, Home, LayoutDashboard, Menu, Search as SearchIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { NavbarScroll } from './navbar-scroll'
import { NavbarCart } from './navbar-cart'
import { NavbarUser } from './navbar-user'
import { NavbarLiveSearch } from './navbar-live-search'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { siteConfig } from '@/config/site'

interface NavbarProps {
    storeName?: string
}

export function Navbar({ storeName = siteConfig.displayName }: NavbarProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    // Debounced search effect
    useEffect(() => {
        if (!searchQuery.trim()) return

        const timeoutId = setTimeout(() => {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
        }, 500) // 500ms delay after user stops typing

        return () => clearTimeout(timeoutId)
    }, [searchQuery, router])

    useEffect(() => {
        const supabase = createClient()

        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)

            // Check if user is admin
            if (user) {
                supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                    .then(({ data }) => {
                        setIsAdmin(data?.role === 'admin')
                    })
            } else {
                setIsAdmin(false)
            }
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)

            // Immediately clear admin status when logging out
            if (!session?.user) {
                setIsAdmin(false)
                return
            }

            // Check admin status on login
            supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single()
                .then(
                    ({ data }) => {
                        setIsAdmin(data?.role === 'admin')
                    },
                    () => {
                        setIsAdmin(false)
                    }
                )
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
            setSearchOpen(false)
            setSearchQuery('')
        }
    }

    return (
        <NavbarScroll>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Mobile: Hamburger Menu */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="md:hidden min-w-[44px] min-h-[44px] hover:bg-rose-50"
                            >
                                <Menu className="h-6 w-6 text-neutral-700" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-gradient-to-br from-rose-50 via-white to-pink-50">
                            <div className="flex flex-col h-full">
                                {/* Menu Header */}
                                <div className="flex items-center gap-2 pb-6 border-b border-rose-100">
                                    <div className="bg-rose-600 text-white p-2 rounded-xl">
                                        <Gift className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-bold text-neutral-900">{storeName}</span>
                                        <span className="text-xs text-rose-600 font-medium uppercase">{siteConfig.tagline}</span>
                                    </div>
                                </div>

                                {/* Menu Links */}
                                <nav className="flex-1 py-6 space-y-1">
                                    <SheetClose asChild>
                                        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 transition-colors min-h-[44px]">
                                            <Home className="h-5 w-5 text-neutral-700" />
                                            <span className="text-[16px] font-medium text-neutral-900">Home</span>
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="/cart" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 transition-colors min-h-[44px]">
                                            <Gift className="h-5 w-5 text-neutral-700" />
                                            <span className="text-[16px] font-medium text-neutral-900">Cart</span>
                                        </Link>
                                    </SheetClose>
                                    {user && isAdmin && (
                                        <SheetClose asChild>
                                            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 transition-colors min-h-[44px]">
                                                <LayoutDashboard className="h-5 w-5 text-neutral-700" />
                                                <span className="text-[16px] font-medium text-neutral-900">Admin Panel</span>
                                            </Link>
                                        </SheetClose>
                                    )}
                                </nav>

                                {/* Menu Footer - Auth */}
                                <div className="pt-6 border-t border-rose-100">
                                    {user ? (
                                        <SheetClose asChild>
                                            <Link href="/account">
                                                <Button className="w-full gap-2 min-h-[44px] text-[16px] bg-rose-600 hover:bg-rose-700 text-white">
                                                    My Account
                                                </Button>
                                            </Link>
                                        </SheetClose>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <SheetClose asChild>
                                                <Link href="/login" className="block">
                                                    <Button variant="outline" className="w-full min-h-[44px] text-[16px] border-rose-300 text-neutral-900 hover:bg-rose-50">
                                                        Log in
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link href="/register" className="block">
                                                    <Button className="w-full min-h-[44px] text-[16px] bg-rose-600 hover:bg-rose-700 text-white">
                                                        Sign up
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Logo - Centered on Mobile */}
                    <Link href="/" className="flex items-center gap-2 group absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
                        <div className="bg-rose-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500">
                            <Gift className="h-5 w-5 md:h-6 md:w-6" />
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-lg md:text-xl font-bold text-neutral-900 leading-none">{storeName}</span>
                            <span className="text-xs text-rose-600 font-medium tracking-widest uppercase">{siteConfig.tagline}</span>
                        </div>
                    </Link>

                    {/* Desktop: Live Search Bar */}
                    <div className="hidden md:block flex-1">
                        <NavbarLiveSearch />
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Mobile: Search Icon */}
                        <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
                            <SheetTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="md:hidden min-w-[44px] min-h-[44px] hover:bg-rose-50"
                                >
                                    <SearchIcon className="h-5 w-5 text-neutral-700" />
                                    <span className="sr-only">Search</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="h-auto bg-gradient-to-br from-rose-50 via-white to-pink-50">
                                <form onSubmit={handleSearch} className="pt-6">
                                    <div className="relative">
                                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                        <Input
                                            type="search"
                                            placeholder="Search for gifts..."
                                            className="pl-11 pr-4 h-12 text-[16px] bg-white border-rose-100 focus:bg-white rounded-xl focus:ring-2 focus:ring-rose-500"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <Button type="submit" className="w-full mt-3 h-12 text-[16px]">
                                        Search
                                    </Button>
                                </form>
                            </SheetContent>
                        </Sheet>

                        {/* Desktop: Home & Admin Icons */}
                        <Link href="/" className="hidden md:block">
                            <Button variant="ghost" size="icon" className="min-w-[44px] min-h-[44px] text-neutral-700 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                                <Home className="h-5 w-5" />
                            </Button>
                        </Link>
                        {user && isAdmin && (
                            <Link href="/admin" className="hidden md:block">
                                <Button variant="ghost" size="icon" className="min-w-[44px] min-h-[44px] text-neutral-700 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Admin Dashboard">
                                    <LayoutDashboard className="h-5 w-5" />
                                </Button>
                            </Link>
                        )}

                        {/* Cart & User - Always visible */}
                        <NavbarCart />
                        <div className="hidden md:block">
                            <NavbarUser user={user} />
                        </div>
                    </div>
                </div>
            </div>
        </NavbarScroll>
    )
}
