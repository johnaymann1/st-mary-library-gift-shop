import * as React from 'react'
import { siteConfig } from '@/config/site'

interface WelcomeEmailProps {
    name: string
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => (
    <html>
        <head>
            <meta charSet="utf-8" />
        </head>
        <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', backgroundColor: '#f5f5f5', margin: 0, padding: 0 }}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f5f5f5', padding: '40px 20px' }}>
                <tr>
                    <td align="center">
                        <table width="600" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            {/* Header */}
                            <tr>
                                <td style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)', padding: '40px 30px', textAlign: 'center' }}>
                                    <h1 style={{ color: '#ffffff', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{siteConfig.name}</h1>
                                    <p style={{ color: '#ffffff', margin: '8px 0 0 0', fontSize: '14px', opacity: 0.9 }}>Your Destination for Knowledge & Gifts</p>
                                </td>
                            </tr>

                            {/* Content */}
                            <tr>
                                <td style={{ padding: '40px 30px' }}>
                                    <h2 style={{ color: '#171717', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
                                        Welcome, {name}! 🎉
                                    </h2>
                                    <p style={{ color: '#525252', fontSize: '16px', lineHeight: '24px', margin: '0 0 20px 0' }}>
                                        We are thrilled to have you join the {siteConfig.name} community! Your account has been successfully created.
                                    </p>
                                    <p style={{ color: '#5255252', fontSize: '16px', lineHeight: '24px', margin: '0 0 30px 0' }}>
                                        We&apos;re excited to have you join our community of book lovers and gift enthusiasts.
                                        At St. Mary Library, we believe in the power of thoughtful gifts and inspiring reads.
                                    </p>
                                    <p style={{ fontSize: '16px', lineHeight: '26px', color: '#4b5563', marginBottom: '32px' }}>
                                        Feel free to browse our collection and don&apos;t hesitate to reach out if you need any assistance.
                                    </p>
                                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                        <a href={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}`} style={{ display: 'inline-block', backgroundColor: '#f43f5e', color: '#ffffff', textDecoration: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: '600' }}>
                                            Start Shopping
                                        </a>
                                    </div>
                                    <p style={{ fontSize: '14px', lineHeight: '24px', color: '#6b7280', margin: '0' }}>
                                        If you didn&apos;t create an account, please ignore this email.
                                    </p>
                                    <p style={{ color: '#737373', fontSize: '14px', lineHeight: '20px', margin: 0 }}>
                                        If you have any questions, feel free to reach out to our support team. We&apos;re always happy to help!
                                    </p>
                                </td>
                            </tr>

                            {/* Footer */}
                            <tr>
                                <td style={{ backgroundColor: '#fafafa', padding: '30px', textAlign: 'center', borderTop: '1px solid #e5e5e5' }}>
                                    <p style={{ color: '#a3a3a3', fontSize: '13px', margin: '0 0 8px 0' }}>
                                        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                                    </p>
                                    <p style={{ color: '#a3a3a3', fontSize: '13px', margin: 0 }}>
                                        You received this email because you created an account with us.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
    </html>
)

export default WelcomeEmail
