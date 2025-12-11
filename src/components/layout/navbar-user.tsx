'use client'

import { Button } from '@/components/ui/button'
import { User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'

interface NavbarUserProps {
    user: User | null
}

export function NavbarUser({ user }: NavbarUserProps) {
    if (user) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-rose-50 min-w-[44px] min-h-[44px]"
                asChild
            >
                <Link href="/account">
                    <UserIcon className="h-5 w-5 text-neutral-700" />
                    <span className="sr-only">Account</span>
                </Link>
            </Button>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex text-neutral-900 hover:text-rose-600 hover:bg-rose-50 font-semibold min-h-[44px]">
                <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-full px-4 sm:px-6 font-semibold shadow-sm min-h-[44px] text-[16px]">
                <Link href="/register">Sign up</Link>
            </Button>
        </div>
    )
}
