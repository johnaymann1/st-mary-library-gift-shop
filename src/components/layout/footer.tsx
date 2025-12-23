'use client'

import Link from 'next/link'
import { Gift, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Truck } from 'lucide-react'
import { siteConfig } from '@/config/site'
import type { StoreSettings } from '@/utils/settings'

interface FooterProps {
    settings: StoreSettings
}

export function Footer({ settings }: FooterProps) {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-neutral-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                                <Gift className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold">{settings.store_name}</span>
                        </Link>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            {settings.description}
                        </p>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Follow Us</h3>
                        <div className="flex gap-3">
                            {settings.facebook_url && (
                                <a
                                    href={settings.facebook_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-800 hover:bg-rose-600 rounded-lg flex items-center justify-center transition-colors"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {settings.instagram_url && (
                                <a
                                    href={settings.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-800 hover:bg-rose-600 rounded-lg flex items-center justify-center transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {settings.twitter_url && (
                                <a
                                    href={settings.twitter_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-800 hover:bg-rose-600 rounded-lg flex items-center justify-center transition-colors"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                            )}
                            {settings.linkedin_url && (
                                <a
                                    href={settings.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-800 hover:bg-rose-600 rounded-lg flex items-center justify-center transition-colors"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href={`tel:${settings.phone}`} className="text-neutral-400 hover:text-rose-400 transition-colors text-sm flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-rose-500" />
                                    <span>{settings.phone}</span>
                                </a>
                            </li>
                            {settings.phone_2 && (
                                <li>
                                    <a href={`tel:${settings.phone_2}`} className="text-neutral-400 hover:text-rose-400 transition-colors text-sm flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-rose-500" />
                                        <span>{settings.phone_2}</span>
                                    </a>
                                </li>
                            )}
                            {settings.phone_3 && (
                                <li>
                                    <a href={`tel:${settings.phone_3}`} className="text-neutral-400 hover:text-rose-400 transition-colors text-sm flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-rose-500" />
                                        <span>{settings.phone_3}</span>
                                    </a>
                                </li>
                            )}
                            <li>
                                <div className="text-neutral-400 text-sm flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-rose-500 mt-0.5" />
                                    <span>{settings.address}</span>
                                </div>
                            </li>
                            {settings.working_hours && (
                                <li>
                                    <div className="text-neutral-400 text-sm flex items-start gap-2">
                                        <svg className="h-4 w-4 text-rose-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{settings.working_hours}</span>
                                    </div>
                                </li>
                            )}
                            {settings.delivery_time_days && (
                                <li>
                                    <div className="text-neutral-400 text-sm flex items-start gap-2">
                                        <Truck className="h-4 w-4 text-rose-500 mt-0.5" />
                                        <span>Delivery: {settings.delivery_time_days}</span>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-neutral-800 text-center">
                    <p className="text-neutral-500 text-sm">
                        © {currentYear} {siteConfig.name}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
