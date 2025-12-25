import { Input } from '@/components/ui/input'

interface PaymentSettingsSectionProps {
    instapayEnabled: boolean
    instapayPhone: string | null
}

export function PaymentSettingsSection({ instapayEnabled, instapayPhone }: PaymentSettingsSectionProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Payment Settings</h2>
            
            <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                <input
                    type="checkbox"
                    id="instapay_enabled"
                    name="instapay_enabled"
                    defaultChecked={instapayEnabled}
                    className="w-5 h-5 text-rose-600 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-rose-500"
                />
                <label htmlFor="instapay_enabled" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    Enable InstaPay Payments
                </label>
            </div>

            <div className="space-y-2">
                <label htmlFor="instapay_phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    InstaPay Phone Number
                </label>
                <Input
                    type="tel"
                    id="instapay_phone"
                    name="instapay_phone"
                    defaultValue={instapayPhone || ''}
                    placeholder="01000000000"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Phone number for InstaPay payments (11 digits)
                </p>
            </div>
        </div>
    )
}
