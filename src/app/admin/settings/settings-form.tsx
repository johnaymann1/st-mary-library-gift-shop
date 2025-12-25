'use client'

import { updateStoreSettings } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { StoreSettings } from '@/utils/settings'
import { HeroImageSection } from '@/components/modules/admin/settings/HeroImageSection'
import { StoreInfoSection } from '@/components/modules/admin/settings/StoreInfoSection'
import { ContactInfoSection } from '@/components/modules/admin/settings/ContactInfoSection'
import { DeliverySettingsSection } from '@/components/modules/admin/settings/DeliverySettingsSection'
import { PaymentSettingsSection } from '@/components/modules/admin/settings/PaymentSettingsSection'
import { SocialMediaSection } from '@/components/modules/admin/settings/SocialMediaSection'
import { ThemeSelectionSection } from '@/components/modules/admin/settings/ThemeSelectionSection'
import { useSettingsForm } from '@/components/modules/admin/settings/useSettingsForm'

export default function SettingsForm({ settings }: { settings: StoreSettings }) {
    const { loading, setLoading } = useSettingsForm()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const result = await updateStoreSettings(formData)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Settings updated successfully!')
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update settings')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <HeroImageSection initialImage={settings.hero_image_url || null} />
            
            <StoreInfoSection 
                storeName={settings.store_name} 
                description={settings.description} 
            />
            
            <ContactInfoSection
                phone={settings.phone}
                phone2={settings.phone_2}
                phone3={settings.phone_3}
                address={settings.address}
                workingHours={settings.working_hours}
            />
            
            <DeliverySettingsSection
                deliveryFee={settings.delivery_fee}
                freeDeliveryThreshold={settings.free_delivery_threshold}
                deliveryTimeDays={settings.delivery_time_days}
            />
            
            <PaymentSettingsSection
                instapayEnabled={settings.instapay_enabled}
                instapayPhone={settings.instapay_phone}
            />
            
            <SocialMediaSection
                facebookUrl={settings.facebook_url}
                instagramUrl={settings.instagram_url}
                twitterUrl={settings.twitter_url}
                linkedinUrl={settings.linkedin_url}
            />
            
            <ThemeSelectionSection activeTheme={settings.active_theme} />

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading}
                    className="min-w-[120px]"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
