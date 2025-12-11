import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileEditClient from './profile-edit-client'

export default async function EditProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const userData = {
        email: user.email || '',
        full_name: user.user_metadata.full_name || '',
        phone: user.user_metadata.phone || null
    }

    return <ProfileEditClient user={userData} />
}
