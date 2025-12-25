import { Input } from '@/components/ui/input'

interface SocialMediaSectionProps {
    facebookUrl: string | null
    instagramUrl: string | null
    twitterUrl: string | null
    linkedinUrl: string | null
}

export function SocialMediaSection({ facebookUrl, instagramUrl, twitterUrl, linkedinUrl }: SocialMediaSectionProps) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Social Media Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="facebook_url" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Facebook URL
                    </label>
                    <Input
                        type="url"
                        id="facebook_url"
                        name="facebook_url"
                        defaultValue={facebookUrl || ''}
                        placeholder="https://facebook.com/yourpage"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="instagram_url" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Instagram URL
                    </label>
                    <Input
                        type="url"
                        id="instagram_url"
                        name="instagram_url"
                        defaultValue={instagramUrl || ''}
                        placeholder="https://instagram.com/yourpage"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="twitter_url" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Twitter URL
                    </label>
                    <Input
                        type="url"
                        id="twitter_url"
                        name="twitter_url"
                        defaultValue={twitterUrl || ''}
                        placeholder="https://twitter.com/yourpage"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="linkedin_url" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        LinkedIn URL
                    </label>
                    <Input
                        type="url"
                        id="linkedin_url"
                        name="linkedin_url"
                        defaultValue={linkedinUrl || ''}
                        placeholder="https://linkedin.com/company/yourpage"
                    />
                </div>
            </div>
        </div>
    )
}
