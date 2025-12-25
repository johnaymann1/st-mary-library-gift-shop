import { Input } from '@/components/ui/input'

interface StoreInfoSectionProps {
    storeName: string
    description: string
}

export function StoreInfoSection({ storeName, description }: StoreInfoSectionProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Store Information</h2>
            
            <div className="space-y-2">
                <label htmlFor="store_name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Store Name <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <Input
                    type="text"
                    id="store_name"
                    name="store_name"
                    defaultValue={storeName}
                    required
                    placeholder="St. Mary Gift Shop"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={description}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                    placeholder="Discover a curated collection of books, stationery, and unique gifts..."
                />
            </div>
        </div>
    )
}
