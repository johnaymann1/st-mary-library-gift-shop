'use client'

import { Button } from '@/components/ui/button'
import { User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

export default function NavbarUser({ user }: { user: User | null }) {
    if (user) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="hover:bg-rose-50"
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
            <Button variant="ghost" asChild className="hidden sm:inline-flex text-neutral-900 hover:text-rose-600 hover:bg-rose-50 font-semibold">
                <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-full px-6 font-semibold shadow-sm">
                <Link href="/register">Sign up</Link>
            </Button>
        </div>
    )
}
