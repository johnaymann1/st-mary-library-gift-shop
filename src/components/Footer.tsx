'use client'

import Link from 'next/link'
import { Gift, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-neutral-200 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                                <Gift className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold text-neutral-900">{siteConfig.displayName}</span>
                        </Link>
                        <p className="text-neutral-600 text-sm leading-relaxed">
                            Quality religious books and gifts
                        </p>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-neutral-900 font-bold mb-4">Follow Us</h3>
                        <div className="flex gap-3">
                            {siteConfig.links.facebook && (
                                <a 
                                    href={siteConfig.links.facebook} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-100 hover:bg-rose-600 hover:text-white text-neutral-700 rounded-lg flex items-center justify-center transition-all"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {siteConfig.links.instagram && (
                                <a 
                                    href={siteConfig.links.instagram} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-100 hover:bg-rose-600 hover:text-white text-neutral-700 rounded-lg flex items-center justify-center transition-all"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {siteConfig.links.twitter && (
                                <a 
                                    href={siteConfig.links.twitter} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-100 hover:bg-rose-600 hover:text-white text-neutral-700 rounded-lg flex items-center justify-center transition-all"
                                    aria-label="Twitter"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                            )}
                            {siteConfig.links.linkedin && (
                                <a 
                                    href={siteConfig.links.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-100 hover:bg-rose-600 hover:text-white text-neutral-700 rounded-lg flex items-center justify-center transition-all"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-neutral-900 font-bold mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href={`tel:${siteConfig.contact.phone}`} className="text-neutral-600 hover:text-rose-600 transition-colors text-sm flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-rose-500" />
                                    <span>{siteConfig.contact.phone}</span>
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${siteConfig.contact.email}`} className="text-neutral-600 hover:text-rose-600 transition-colors text-sm flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-rose-500" />
                                    <span>{siteConfig.contact.email}</span>
                                </a>
                            </li>
                            <li>
                                <div className="text-neutral-600 text-sm flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-rose-500 mt-0.5" />
                                    <span>{siteConfig.contact.address}</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-neutral-200 text-center">
                    <p className="text-neutral-500 text-sm">
                        © {currentYear} {siteConfig.name}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
