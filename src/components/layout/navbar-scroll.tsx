'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface NavbarScrollProps {
    children: React.ReactNode
}

export function NavbarScroll({ children }: NavbarScrollProps) {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300 border-b",
            isScrolled 
                ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-neutral-200 dark:border-neutral-800 shadow-sm" 
                : "bg-white dark:bg-neutral-950 border-transparent"
        )}>
            {children}
        </nav>
    )
}
