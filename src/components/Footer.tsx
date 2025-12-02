'use client'

import Link from 'next/link'
import { Gift, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-2.5 rounded-xl group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                                <Gift className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-white leading-none">{siteConfig.displayName}</span>
                                <span className="text-xs text-rose-400 font-medium tracking-widest uppercase">{siteConfig.tagline}</span>
                            </div>
                        </Link>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            {siteConfig.description.slice(0, 120)}...
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-neutral-400 hover:text-rose-400 transition-colors text-sm flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/search" className="text-neutral-400 hover:text-rose-400 transition-colors text-sm flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="text-neutral-400 hover:text-rose-400 transition-colors text-sm flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    My Orders
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="text-neutral-400 hover:text-rose-400 transition-colors text-sm flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                    Cart
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li>
                                <a href={`tel:${siteConfig.contact.phone}`} className="text-neutral-400 hover:text-rose-400 transition-colors text-sm flex items-start gap-3 group">
                                    <Phone className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                                    <span>{siteConfig.contact.phone}</span>
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${siteConfig.contact.email}`} className="text-neutral-400 hover:text-rose-400 transition-colors text-sm flex items-start gap-3 group">
                                    <Mail className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                                    <span>{siteConfig.contact.email}</span>
                                </a>
                            </li>
                            <li>
                                <div className="text-neutral-400 text-sm flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                                    <span>{siteConfig.contact.address}</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media & Newsletter */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Follow Us</h3>
                        <div className="flex gap-3 mb-6">
                            {siteConfig.links.facebook && (
                                <a 
                                    href={siteConfig.links.facebook} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-800 hover:bg-rose-600 rounded-lg flex items-center justify-center transition-all duration-500 hover:scale-110"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {siteConfig.links.instagram && (
                                <a 
                                    href={siteConfig.links.instagram} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-800 hover:bg-rose-600 rounded-lg flex items-center justify-center transition-all duration-500 hover:scale-110"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {siteConfig.links.twitter && (
                                <a 
                                    href={siteConfig.links.twitter} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-800 hover:bg-rose-600 rounded-lg flex items-center justify-center transition-all duration-500 hover:scale-110"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                            )}
                            {siteConfig.links.linkedin && (
                                <a 
                                    href={siteConfig.links.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-neutral-800 hover:bg-rose-600 rounded-lg flex items-center justify-center transition-all duration-500 hover:scale-110"
                                >
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                        <p className="text-neutral-500 text-xs leading-relaxed">
                            Stay updated with our latest collections and special offers.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-neutral-700">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-neutral-500 text-sm text-center md:text-left">
                            © {currentYear} {siteConfig.name}. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-neutral-500">
                            <Link href="/orders" className="hover:text-rose-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/orders" className="hover:text-rose-400 transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
