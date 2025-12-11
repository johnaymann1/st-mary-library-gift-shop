'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface ProductDetailsClientProps {
    categoryId: number
}

export function ProductDetailsClient({ categoryId }: ProductDetailsClientProps) {
    const router = useRouter()

    return (
        <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-neutral-600 hover:text-rose-600 hover:bg-rose-50"
        >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
        </Button>
    )
}
