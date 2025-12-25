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
 * Checkout Server Actions
 * Handles order placement, payment proof upload, and email notifications
 */

/**
 * Places a new order with validation and email notifications
 * 
 * Process:
 * 1. Validate checkout form data
 * 2. Upload payment proof if InstaPay
 * 3. Create order in database
 * 4. Send confirmation emails (async, non-blocking)
 * 
 * @param formData - Form data containing delivery, payment, and contact info
 * @returns Success with order ID or error message
 */
export async function placeOrder(formData: FormData) {
    // Ensure user is authenticated
    const user = await userService.getCurrentUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Extract and validate form data
    const rawData = {
        delivery_type: formData.get('delivery_type'),
        address: formData.get('address') || undefined,
        phone: formData.get('phone') || undefined,
        payment_method: formData.get('payment_method'),
        proof_image: formData.get('proof_image')
    }

    // Validate using Zod schema
    const validationResult = checkoutSchema.safeParse(rawData)
    if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors
        const errorMessage = Object.values(errors).flat()[0] || 'Validation failed'
        return { error: errorMessage }
    }

    const { delivery_type: deliveryType, address, phone, payment_method: paymentMethod } = validationResult.data
    const proofImage = formData.get('proof_image') as File | null

    let proofUrl: string | null = null

    // Handle InstaPay payment proof upload
    // Only validate and upload image if payment method is InstaPay
    if (paymentMethod === 'instapay') {
        // Validate that image exists and is not empty
        if (!proofImage || proofImage.size === 0) {
            return { error: 'Payment proof screenshot is required for InstaPay' }
        }

        // Validate image file (size, type)
        const fileValidation = validateImageFile(proofImage)
        if (!fileValidation.valid) {
            return { error: fileValidation.error || 'Invalid payment proof image' }
        }

        // Upload to Supabase Storage
        const uploadResult = await storageService.uploadPaymentProof(proofImage)
        if (uploadResult.error) {
            return { error: uploadResult.error }
        }
        proofUrl = uploadResult.data ?? null
    }
    // For cash payment, no image validation or upload is required - proofUrl remains null

    // Create the order in database
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

    /**
     * Send email notifications asynchronously (non-blocking)
     * This significantly speeds up checkout response time
     * Emails are sent in the background
     */
    Promise.all([
        (async () => {
            try {
                // Fetch order details for email
                const orderData = await orderService.getOrderForEmail(orderId)
                if (!orderData) return

                const userData = await userService.getUserById(orderData.user_id)
                if (!userData) return

                // Send order confirmation email to customer
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

                // Send notification email to admin
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
        // Emails failed, but order succeeded - this is acceptable
        // The order is still created successfully
    })

    // Revalidate orders page to show new order
    revalidatePath('/orders')
    
    return { success: true, orderId }
}
