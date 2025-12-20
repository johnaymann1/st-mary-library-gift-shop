import { getStoreSettings } from '@/utils/settings'
import SettingsForm from './settings-form'
import { Settings } from 'lucide-react'

export const metadata = {
    title: 'Settings',
    description: 'Manage store settings',
}

// Force dynamic rendering to ensure theme changes are reflected
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SettingsPage() {
    const settings = await getStoreSettings()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Store Settings</h1>
                    <p className="text-sm text-neutral-600">
                        Manage your store information, delivery settings, and contact details
                    </p>
                </div>
            </div>

            {/* Settings Form */}
            <SettingsForm settings={settings} />
        </div>
    )
}
