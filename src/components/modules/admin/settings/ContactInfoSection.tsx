import { Input } from '@/components/ui/input'

interface ContactInfoSectionProps {
    phone: string
    phone2: string | null
    phone3: string | null
    address: string
    workingHours: string | null
}

export function ContactInfoSection({ phone, phone2, phone3, address, workingHours }: ContactInfoSectionProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Contact Information</h2>
            
            <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Primary Phone Number <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={phone}
                    required
                    placeholder="+20 123 456 7890"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="phone_2" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Secondary Phone Number
                </label>
                <Input
                    type="tel"
                    id="phone_2"
                    name="phone_2"
                    defaultValue={phone2 || ''}
                    placeholder="+20 123 456 7891 (optional)"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="phone_3" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Third Phone Number
                </label>
                <Input
                    type="tel"
                    id="phone_3"
                    name="phone_3"
                    defaultValue={phone3 || ''}
                    placeholder="+20 123 456 7892 (optional)"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Address <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <Input
                    type="text"
                    id="address"
                    name="address"
                    defaultValue={address}
                    required
                    placeholder="St Mary Church Faggalah, Cairo, Egypt"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="working_hours" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Working Hours
                </label>
                <Input
                    type="text"
                    id="working_hours"
                    name="working_hours"
                    defaultValue={workingHours || ''}
                    placeholder="Sunday - Thursday: 9:00 AM - 9:00 PM"
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Example: Sunday - Thursday: 9:00 AM - 9:00 PM
                </p>
            </div>
        </div>
    )
}
