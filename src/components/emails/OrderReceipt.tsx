import * as React from 'react'
import { siteConfig } from '@/config/site'

interface OrderItem {
    product_name: string
    quantity: number
    price: number
}

interface OrderReceiptProps {
    orderId: string
    customerName: string
    items: OrderItem[]
    totalAmount: number
    deliveryAddress: string
    phone: string
}

export const OrderReceipt: React.FC<OrderReceiptProps> = ({
    orderId,
    customerName,
    items,
    totalAmount,
    deliveryAddress,
    phone,
}) => (
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
                                    <h1 style={{ color: '#ffffff', margin: 0, fontSize: '32px', fontWeight: 'bold' }}>Order Confirmed! ✓</h1>
                                    <p style={{ color: '#ffffff', margin: '8px 0 0 0', fontSize: '16px', opacity: 0.9 }}>Order #{orderId}</p>
                                </td>
                            </tr>

                            {/* Content */}
                            <tr>
                                <td style={{ padding: '40px 30px' }}>
                                    <h2 style={{ color: '#171717', fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                                        Thank you, {customerName}!
                                    </h2>
                                    <p style={{ color: '#525252', fontSize: '16px', lineHeight: '24px', margin: '0 0 30px 0' }}>
                                        We're preparing your order with care. You'll receive a notification once it's on the way.
                                    </p>

                                    {/* Order Items */}
                                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '30px' }}>
                                        <thead>
                                            <tr>
                                                <td style={{ borderBottom: '2px solid #e5e5e5', paddingBottom: '12px', color: '#737373', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Item</td>
                                                <td style={{ borderBottom: '2px solid #e5e5e5', paddingBottom: '12px', color: '#737373', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', textAlign: 'center' }}>Qty</td>
                                                <td style={{ borderBottom: '2px solid #e5e5e5', paddingBottom: '12px', color: '#737373', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', textAlign: 'right' }}>Price</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {items.map((item, index) => (
                                                <tr key={index}>
                                                    <td style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', color: '#171717', fontSize: '15px' }}>
                                                        {item.product_name}
                                                    </td>
                                                    <td style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', color: '#525252', fontSize: '15px', textAlign: 'center' }}>
                                                        {item.quantity}
                                                    </td>
                                                    <td style={{ padding: '16px 0', borderBottom: '1px solid #f5f5f5', color: '#171717', fontSize: '15px', textAlign: 'right', fontWeight: '500' }}>
                                                        {(item.price * item.quantity).toLocaleString()} {siteConfig.currency.code}
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* Total */}
                                            <tr>
                                                <td colSpan={2} style={{ paddingTop: '16px', color: '#171717', fontSize: '16px', fontWeight: 'bold' }}>
                                                    Total
                                                </td>
                                                <td style={{ paddingTop: '16px', color: '#f43f5e', fontSize: '18px', fontWeight: 'bold', textAlign: 'right' }}>
                                                    {totalAmount.toLocaleString()} {siteConfig.currency.code}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* Delivery Info */}
                                    <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
                                        <tr>
                                            <td>
                                                <h3 style={{ color: '#171717', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
                                                    📍 Delivery Information
                                                </h3>
                                                <p style={{ color: '#525252', fontSize: '14px', lineHeight: '20px', margin: '0 0 8px 0' }}>
                                                    <strong>Address:</strong> {deliveryAddress}
                                                </p>
                                                <p style={{ fontSize: '14px', lineHeight: '24px', color: '#6b7280', margin: '0' }}>
                                                    If you have any questions about your order, please don&apos;t hesitate to contact us.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    {/* Track Order Button */}
                                    <table width="100%" cellPadding="0" cellSpacing="0">
                                        <tr>
                                            <td align="center" style={{ paddingBottom: '20px' }}>
                                                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/orders/${orderId}" style={{ display: 'inline-block', backgroundColor: '#f43f5e', color: '#ffffff', textDecoration: 'none', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: '600' }}>
                                                    Track Your Order
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style={{ color: '#737373', fontSize: '14px', lineHeight: '20px', margin: 0, textAlign: 'center' }}>
                                        Need help? Contact us anytime – we're here for you!
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
                                        Order ID: {orderId}
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

export default OrderReceipt
