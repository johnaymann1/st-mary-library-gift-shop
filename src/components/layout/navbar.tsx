'use client'

import Link from 'next/link'
import { Gift, Home, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavbarScroll } from './navbar-scroll'
import { NavbarSearch } from './navbar-search'
import { NavbarCart } from './navbar-cart'
import { NavbarUser } from './navbar-user'
import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { siteConfig } from '@/config/site'

interface NavbarProps {
    storeName?: string
}

export function Navbar({ storeName = siteConfig.displayName }: NavbarProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)

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

    return (
        <NavbarScroll>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-rose-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500">
                            <Gift className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-neutral-900 leading-none">{storeName}</span>
                            <span className="text-xs text-rose-600 font-medium tracking-widest uppercase">{siteConfig.tagline}</span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <Suspense fallback={<div className="hidden md:flex flex-1 max-w-xl mx-8 h-10 bg-neutral-100 rounded-lg animate-pulse" />}>
                        <NavbarSearch />
                    </Suspense>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="text-neutral-700 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                                <Home className="h-5 w-5" />
                            </Button>
                        </Link>
                        {user && isAdmin && (
                            <Link href="/admin">
                                <Button variant="ghost" size="icon" className="text-neutral-700 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Admin Dashboard">
                                    <LayoutDashboard className="h-5 w-5" />
                                </Button>
                            </Link>
                        )}
                        <NavbarCart />
                        <NavbarUser user={user} />
                    </div>
                </div>
            </div>
        </NavbarScroll>
    )
}
