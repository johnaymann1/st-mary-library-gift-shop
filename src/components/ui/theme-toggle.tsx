'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                aria-label="Toggle theme"
                disabled
            >
                <Sun className="h-4 w-4 opacity-50" />
            </Button>
        )
    }

    const isDark = theme === 'dark'

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark'
        setTheme(newTheme)
        console.log('Theme changed to:', newTheme)
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun className="h-4 w-4 text-rose-600 dark:text-rose-400 transition-colors" />
            ) : (
                <Moon className="h-4 w-4 text-rose-600 transition-colors" />
            )}
        </Button>
    )
}
