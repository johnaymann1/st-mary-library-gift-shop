import { Palette } from 'lucide-react'
import { themes } from '@/config/themes'

interface ThemeSelectionSectionProps {
    activeTheme?: string
}

export function ThemeSelectionSection({ activeTheme = 'default' }: ThemeSelectionSectionProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Store Theme</h2>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Choose a theme for your store. You have full control over which theme is active.
            </p>
            
            <div className="space-y-2">
                <label htmlFor="active_theme" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Active Theme
                </label>
                <select
                    id="active_theme"
                    name="active_theme"
                    defaultValue={activeTheme}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                >
                    {Object.entries(themes).map(([key, theme]) => (
                        <option key={key} value={key} className="text-neutral-900 dark:text-white dark:bg-neutral-800">
                            {theme.name}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    The selected theme will be applied across your entire store
                </p>
            </div>
        </div>
    )
}
