import { Input } from '@/components/ui/input'

interface DeliverySettingsSectionProps {
    deliveryFee: number
    freeDeliveryThreshold: number | null
    deliveryTimeDays: string | null
}

export function DeliverySettingsSection({ deliveryFee, freeDeliveryThreshold, deliveryTimeDays }: DeliverySettingsSectionProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Delivery Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="delivery_fee" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Delivery Fee (EGP) <span className="text-red-500 dark:text-red-400">*</span>
                    </label>
                    <Input
                        type="number"
                        id="delivery_fee"
                        name="delivery_fee"
                        defaultValue={deliveryFee}
                        required
                        min="0"
                        step="0.01"
                        placeholder="50"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="free_delivery_threshold" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Free Delivery Threshold (EGP)
                    </label>
                    <Input
                        type="number"
                        id="free_delivery_threshold"
                        name="free_delivery_threshold"
                        defaultValue={freeDeliveryThreshold || ''}
                        min="0"
                        step="0.01"
                        placeholder="1000 (optional)"
                    />
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Leave empty for no free delivery threshold
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="delivery_time_days" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Delivery Time
                </label>
                <Input
                    type="text"
                    id="delivery_time_days"
                    name="delivery_time_days"
                    defaultValue={deliveryTimeDays || ''}
                    placeholder="1-3 business days"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Example: 1-3 business days, 2-5 days, Same day delivery
                </p>
            </div>
        </div>
    )
}
