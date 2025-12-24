import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm">
                {/* Home */}
                <li>
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                </li>

                {/* Breadcrumb items */}
                {items.map((item, index) => {
                    const isLast = index === items.length - 1

                    return (
                        <li key={index} className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-neutral-400 dark:text-neutral-500 transition-colors" />
                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className="text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors truncate max-w-[200px]"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-neutral-900 dark:text-white truncate max-w-[200px] transition-colors">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
