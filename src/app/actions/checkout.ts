'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { resend } from '@/lib/resend'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server.browser'
import OrderReceipt from '@/components/emails/OrderReceipt'
import { siteConfig } from '@/config/site'

// Helper to upload image
async function uploadProofImage(file: File) {
    const supabase = await createClient()

    // Sanitize filename
    const fileExt = file.name.split('.').pop()
    const fileName = `proof-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload to 'payment-proofs' bucket
    const { error } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, file)

    if (error) {
        throw new Error(`Image upload failed: ${error.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName)

    return publicUrl
}

export async function placeOrder(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const deliveryType = formData.get('delivery_type') as string
    const address = formData.get('address') as string | null
    const phone = formData.get('phone') as string | null
    const paymentMethod = formData.get('payment_method') as string
    const proofImage = formData.get('proof_image') as File | null



    // Validate delivery type
    if (!deliveryType || !paymentMethod) {
        return { error: 'Missing required fields' }
    }

    // Validate payment method
    if (!['cash', 'instapay'].includes(paymentMethod)) {
        return { error: 'Invalid payment method' }
    }

    // Validate address/phone for delivery type
    if (deliveryType === 'delivery') {
        if (!address || !phone) {
            return { error: 'Address and phone are required for home delivery' }
        }
    }

    let proofUrl = null

    if (paymentMethod === 'instapay') {
        if (!proofImage || proofImage.size === 0) {
            return { error: 'Payment proof screenshot is required for InstaPay' }
        }
        try {
            proofUrl = await uploadProofImage(proofImage)
        } catch (e) {
            return { error: e instanceof Error ? e.message : 'Image upload failed' }
        }
    }

    // Call RPC with correct parameters
    const { data: orderId, error } = await supabase.rpc('place_order', {
        p_user_id: user.id,
        p_delivery_type: deliveryType,
        p_address: address,
        p_phone: phone,
        p_delivery_date: null,
        p_payment_method: paymentMethod,
        p_payment_proof_url: proofUrl
    })

    if (error) {
        console.error('Place order error:', error)
        return { error: error.message }
    }

    // Fetch order details for email
    try {
        const { data: orderData } = await supabase
            .from('orders')
            .select(`
                id,
                total_amount,
                delivery_address,
                phone,
                user_id,
                order_items!inner(
                    quantity,
                    price,
                    products!inner(name)
                )
            `)
            .eq('id', orderId)
            .single()

        if (orderData) {
            // Fetch user details separately
            const { data: userData } = await supabase
                .from('users')
                .select('full_name, email')
                .eq('id', orderData.user_id)
                .single()

            if (!userData) {
                throw new Error('User not found')
            }

            const items = orderData.order_items.map((item: { products: { name: string } | { name: string }[], quantity: number, price: number }) => {
                const product = Array.isArray(item.products) ? item.products[0] : item.products
                return {
                    product_name: product?.name || 'Unknown Product',
                    quantity: item.quantity,
                    price: item.price
                }
            })

            // Send order receipt to customer
            await resend.emails.send({
                from: siteConfig.email.from,
                to: userData.email,
                subject: `Order Confirmed: #${orderId}`,
                html: renderToStaticMarkup(createElement(OrderReceipt, {
                    orderId: orderId.toString(),
                    customerName: userData.full_name,
                    items,
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
                        <h2>New Order #{orderId}</h2>
                        <p><strong>Customer:</strong> {userData.full_name}</p>
                        <p><strong>Total:</strong> {orderData.total_amount.toLocaleString()} {siteConfig.currency.code}</p>
                        <p><strong>Items:</strong> ${items.length}</p>
                        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/orders">View in Admin Panel</a></p>
                    `
                })
            }
        }
    } catch (emailError) {
        // Log error but don't block order completion
        console.error('Failed to send order emails:', emailError)
    }

    revalidatePath('/orders')
    return { success: true, orderId }
}
