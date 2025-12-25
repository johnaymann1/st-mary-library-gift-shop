-- Create or replace the place_order function to use sale prices
-- This function creates an order from the user's cart items, properly handling sale prices

CREATE OR REPLACE FUNCTION place_order(
    p_user_id UUID,
    p_delivery_type TEXT,
    p_address TEXT,
    p_phone TEXT,
    p_delivery_date DATE,
    p_payment_method TEXT,
    p_payment_proof_url TEXT DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id BIGINT;
    v_total_amount NUMERIC(10,2) := 0;
    v_delivery_fee NUMERIC(10,2) := 0;
    v_cart_item RECORD;
    v_effective_price NUMERIC(10,2);
BEGIN
    -- Get delivery fee from store settings
    SELECT delivery_fee INTO v_delivery_fee FROM store_settings LIMIT 1;
    
    -- If no settings found, use default delivery fee
    IF v_delivery_fee IS NULL THEN
        v_delivery_fee := 0;
    END IF;
    
    -- Apply delivery fee only for delivery orders
    IF p_delivery_type = 'pickup' THEN
        v_delivery_fee := 0;
    END IF;

    -- Calculate total from cart items using sale prices when applicable
    FOR v_cart_item IN
        SELECT 
            c.product_id, 
            c.quantity, 
            p.price,
            p.sale_price,
            p.sale_end_date
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = p_user_id
    LOOP
        -- Use sale price if it exists and is still valid
        IF v_cart_item.sale_price IS NOT NULL 
           AND v_cart_item.sale_price > 0 
           AND v_cart_item.sale_price < v_cart_item.price
           AND (v_cart_item.sale_end_date IS NULL OR v_cart_item.sale_end_date >= CURRENT_DATE) THEN
            v_effective_price := v_cart_item.sale_price;
        ELSE
            v_effective_price := v_cart_item.price;
        END IF;
        
        v_total_amount := v_total_amount + (v_effective_price * v_cart_item.quantity);
    END LOOP;

    -- Add delivery fee to total
    v_total_amount := v_total_amount + v_delivery_fee;

    -- Create order
    INSERT INTO orders (
        user_id, 
        status, 
        total_amount, 
        delivery_fee,
        payment_method, 
        delivery_type, 
        delivery_address, 
        recipient_phone,
        scheduled_delivery_date,
        payment_proof_url
    )
    VALUES (
        p_user_id,
        'pending_payment',
        v_total_amount,
        v_delivery_fee,
        p_payment_method,
        p_delivery_type,
        p_address,
        p_phone,
        p_delivery_date,
        p_payment_proof_url
    )
    RETURNING id INTO v_order_id;

    -- Insert order items from cart using sale prices when applicable
    INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
    SELECT 
        v_order_id,
        c.product_id,
        c.quantity,
        CASE 
            WHEN p.sale_price IS NOT NULL 
                 AND p.sale_price > 0 
                 AND p.sale_price < p.price
                 AND (p.sale_end_date IS NULL OR p.sale_end_date >= CURRENT_DATE)
            THEN p.sale_price
            ELSE p.price
        END AS price_at_purchase
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = p_user_id;

    -- Clear the user's cart
    DELETE FROM cart WHERE user_id = p_user_id;

    RETURN v_order_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION place_order(UUID, TEXT, TEXT, TEXT, DATE, TEXT, TEXT) TO authenticated;
