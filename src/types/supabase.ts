export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    full_name: string
                    email: string | null
                    phone: string | null
                    role: 'customer' | 'admin'
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name: string
                    email: string | null
                    phone: string | null
                    role?: 'customer' | 'admin'
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    email?: string | null
                    phone?: string | null
                    role?: 'customer' | 'admin'
                    created_at?: string
                }
            }
            categories: {
                Row: {
                    id: number
                    name_en: string
                    name_ar: string
                    image_url: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: number
                    name_en: string
                    name_ar: string
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: number
                    name_en?: string
                    name_ar?: string
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            products: {
                Row: {
                    id: number
                    category_id: number | null
                    name_en: string
                    name_ar: string
                    desc_en: string | null
                    desc_ar: string | null
                    price: number
                    stock_quantity: number
                    is_active: boolean
                    image_url: string | null
                    is_customizable: boolean
                    created_at: string
                }
                Insert: {
                    id?: number
                    category_id?: number | null
                    name_en: string
                    name_ar: string
                    desc_en?: string | null
                    desc_ar?: string | null
                    price: number
                    stock_quantity?: number
                    is_active?: boolean
                    image_url?: string | null
                    is_customizable?: boolean
                    created_at?: string
                }
                Update: {
                    id?: number
                    category_id?: number | null
                    name_en?: string
                    name_ar?: string
                    desc_en?: string | null
                    desc_ar?: string | null
                    price?: number
                    stock_quantity?: number
                    is_active?: boolean
                    image_url?: string | null
                    is_customizable?: boolean
                    created_at?: string
                }
            }
            orders: {
                Row: {
                    id: number
                    user_id: string
                    status: 'payment_pending' | 'processing' | 'wrapping' | 'out_for_delivery' | 'completed' | 'cancelled'
                    total_amount: number
                    delivery_fee: number
                    payment_method: 'cash' | 'instapay'
                    delivery_type: 'pickup' | 'delivery'
                    delivery_address: string | null
                    recipient_phone: string | null
                    scheduled_delivery_date: string | null
                    payment_proof_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    user_id: string
                    status?: 'payment_pending' | 'processing' | 'wrapping' | 'out_for_delivery' | 'completed' | 'cancelled'
                    total_amount: number
                    delivery_fee?: number
                    payment_method: 'cash' | 'instapay'
                    delivery_type: 'pickup' | 'delivery'
                    delivery_address?: string | null
                    recipient_phone?: string | null
                    scheduled_delivery_date?: string | null
                    payment_proof_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    user_id?: string
                    status?: 'payment_pending' | 'processing' | 'wrapping' | 'out_for_delivery' | 'completed' | 'cancelled'
                    total_amount?: number
                    delivery_fee?: number
                    payment_method?: 'cash' | 'instapay'
                    delivery_type?: 'pickup' | 'delivery'
                    delivery_address?: string | null
                    recipient_phone?: string | null
                    scheduled_delivery_date?: string | null
                    payment_proof_url?: string | null
                    created_at?: string
                }
            }
            order_items: {
                Row: {
                    id: number
                    order_id: number | null
                    product_id: number | null
                    quantity: number
                    price_at_purchase: number
                    gift_message: string | null
                    is_wrapped: boolean
                }
                Insert: {
                    id?: number
                    order_id?: number | null
                    product_id?: number | null
                    quantity: number
                    price_at_purchase: number
                    gift_message?: string | null
                    is_wrapped?: boolean
                }
                Update: {
                    id?: number
                    order_id?: number | null
                    product_id?: number | null
                    quantity?: number
                    price_at_purchase?: number
                    gift_message?: string | null
                    is_wrapped?: boolean
                }
            }
            cart: {
                Row: {
                    id: number
                    user_id: string
                    product_id: number | null
                    quantity: number
                    gift_message: string | null
                    is_wrapped: boolean
                    created_at: string
                }
                Insert: {
                    id?: number
                    user_id: string
                    product_id?: number | null
                    quantity?: number
                    gift_message?: string | null
                    is_wrapped?: boolean
                    created_at?: string
                }
                Update: {
                    id?: number
                    user_id?: string
                    product_id?: number | null
                    quantity?: number
                    gift_message?: string | null
                    is_wrapped?: boolean
                    created_at?: string
                }
            }
        }
    }
}
