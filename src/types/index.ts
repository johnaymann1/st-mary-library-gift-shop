export interface Category {
    id: number
    name_en: string
    name_ar: string
    image_url: string | null
    is_active: boolean
    created_at?: string
}

export interface Product {
    id: number
    name_en: string
    name_ar: string
    desc_en: string | null
    desc_ar: string | null
    price: number
    in_stock: boolean
    image_url: string | null
    category_id: number
    is_active: boolean
    created_at: string
    categories?: {
        name_en: string
    } | null
}

export interface CartItem {
    id: number
    product_id: number
    quantity: number
    product: {
        name_en: string
        name_ar: string
        price: number
        image_url: string | null
        in_stock: boolean
    }
}

export interface SavedAddress {
    id: number
    label: string
    address: string
    is_default: boolean
}
export interface OrderItem {
    id: number
    order_id: number
    product_id: number
    quantity: number
    price_at_purchase: number
    product: {
        name_en: string
        name_ar: string
        image_url: string | null
    }
}

export interface Order {
    id: number
    user_id: string
    status: 'pending_payment' | 'payment_confirmation_pending' | 'processing' | 'wrapping' | 'out_for_delivery' | 'completed' | 'cancelled'
    total_amount: number
    delivery_type: 'delivery' | 'pickup'
    delivery_address: string | null
    phone: string | null
    delivery_date: string | null
    payment_method: 'cash' | 'instapay'
    payment_proof_url: string | null
    created_at: string
    updated_at: string
    items?: OrderItem[]
    user?: {
        full_name: string | null
        email: string | null
        phone: string | null
    }
}
