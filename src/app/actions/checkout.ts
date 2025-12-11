'use server'

import { revalidatePath } from 'next/cache'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server.browser'
import { resend } from '@/lib/resend'
import { siteConfig } from '@/config/site'
import OrderReceipt from '@/components/emails/OrderReceipt'
import * as orderService from '@/services/orders'
import * as userService from '@/services/users'
import * as storageService from '@/services/storage'
import { checkoutSchema, validateImageFile } from '@/utils/validation'

/**
 * Places a new order
 */
export async function placeOrder(formData: FormData) {
    const user = await userService.getCurrentUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Validate input
    const rawData = {
        delivery_type: formData.get('delivery_type'),
        address: formData.get('address') || undefined,
        phone: formData.get('phone') || undefined,
        payment_method: formData.get('payment_method'),
        proof_image: formData.get('proof_image')
    }

    const validationResult = checkoutSchema.safeParse(rawData)
    if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { delivery_type: deliveryType, address, phone, payment_method: paymentMethod } = validationResult.data
    const proofImage = formData.get('proof_image') as File | null

    let proofUrl: string | null = null

    if (paymentMethod === 'instapay') {
        if (!proofImage || proofImage.size === 0) {
            return { error: 'Payment proof screenshot is required for InstaPay' }
        }

        // Validate image file
        const fileValidation = validateImageFile(proofImage)
        if (!fileValidation.valid) {
            return { error: fileValidation.error || 'Invalid payment proof image' }
        }

        const uploadResult = await storageService.uploadPaymentProof(proofImage)
        if (uploadResult.error) {
            return { error: uploadResult.error }
        }
        proofUrl = uploadResult.url ?? null
    }

    // Create the order using service
    const orderResult = await orderService.createOrder({
        userId: user.id,
        deliveryType,
        address: address || null,
        phone: phone || null,
        paymentMethod,
        paymentProofUrl: proofUrl
    })

    if (orderResult.error) {
        return { error: orderResult.error }
    }

    const orderId = orderResult.orderId!

    // Send emails asynchronously without blocking response
    // This significantly speeds up checkout (emails sent in background)
    Promise.all([
        (async () => {
            try {
                const orderData = await orderService.getOrderForEmail(orderId)
                if (!orderData) return

                const userData = await userService.getUserById(orderData.user_id)
                if (!userData) return

                // Send order receipt to customer
                await resend.emails.send({
                    from: siteConfig.email.from,
                    to: userData.email,
                    subject: `Order Confirmed: #${orderId}`,
                    html: renderToStaticMarkup(createElement(OrderReceipt, {
                        orderId: orderId.toString(),
                        customerName: userData.full_name ?? 'Customer',
                        items: orderData.items,
                        totalAmount: orderData.total_amount,
                        deliveryAddress: orderData.delivery_address || 'Store Pickup',
                        phone: orderData.phone || 'N/A'
                    }))
                })

                // Send notification to admin
                const adminEmail = siteConfig.email.adminEmail
                if (adminEmail) {
                    await resend.emails.send({
                        from: siteConfig.email.from,
                        to: adminEmail,
                        subject: '🔔 New Order Received!',
                        html: `
                            <h2>New Order #${orderId}</h2>
                            <p><strong>Customer:</strong> ${userData.full_name}</p>
                            <p><strong>Total:</strong> ${orderData.total_amount.toLocaleString()} ${siteConfig.currency.code}</p>
                            <p><strong>Items:</strong> ${orderData.items.length}</p>
                            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/orders">View in Admin Panel</a></p>
                        `
                    })
                }
            } catch (error) {
                // Log error but don't fail the order
                console.error('Email send failed:', error)
            }
        })()
    ]).catch(() => {
        // Emails failed, but order succeeded - this is ok
    })

    revalidatePath('/orders')
    return { success: true, orderId }
}
