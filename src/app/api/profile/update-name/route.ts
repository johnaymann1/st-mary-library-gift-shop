import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { fullName } = await request.json()

        if (!fullName || fullName.trim().length < 2) {
            return NextResponse.json(
                { error: 'Name must be at least 2 characters' },
                { status: 400 }
            )
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Update auth metadata
        const { error: authError } = await supabase.auth.updateUser({
            data: { full_name: fullName }
        })

        if (authError) {
            return NextResponse.json(
                { error: authError.message },
                { status: 500 }
            )
        }

        // Update users table
        const { error: dbError } = await supabase
            .from('users')
            .update({ full_name: fullName })
            .eq('id', user.id)

        if (dbError) {
            return NextResponse.json(
                { error: dbError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update name' },
            { status: 500 }
        )
    }
}
