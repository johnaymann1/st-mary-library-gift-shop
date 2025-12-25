import { redirect } from 'next/navigation'
import ProfileEditClient from './profile-edit-client'
import * as UsersService from '@/services/users.service'
import * as AddressService from '@/services/addresses'

export default async function EditProfilePage() {
    const user = await UsersService.getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    const userProfile = await UsersService.getUserById(user.id)
    const addresses = await AddressService.getAddressesByUserId(user.id)

    const userData = {
        email: user.email || '',
        full_name: userProfile?.full_name || '',
        phone: userProfile?.phone || null
    }

    return <ProfileEditClient user={userData} addresses={addresses} userId={user.id} />
}
