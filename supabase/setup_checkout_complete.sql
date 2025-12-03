-- ============================================
-- UPDATED CHECKOUT SETUP SCRIPT
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create payment-proofs storage bucket
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

-- 2. Set up storage policies for payment proofs
drop policy if exists "Anyone can upload payment proofs" on storage.objects;
drop policy if exists "Anyone can view payment proofs" on storage.objects;
drop policy if exists "Users can update their own payment proofs" on storage.objects;

create policy "Anyone can upload payment proofs"
on storage.objects for insert
to authenticated
with check (bucket_id = 'payment-proofs');

create policy "Anyone can view payment proofs"
on storage.objects for select
to public
using (bucket_id = 'payment-proofs');

create policy "Users can update their own payment proofs"
on storage.objects for update
to authenticated
using (bucket_id = 'payment-proofs');

-- 3. Drop and recreate place_order function with fixes
drop function if exists place_order(uuid, text, text, text, date, text, text);

create or replace function place_order(
  p_user_id uuid,
  p_delivery_type text,
  p_address text default null,
  p_phone text default null,
  p_delivery_date date default null,
  p_payment_method text default 'cash',
  p_payment_proof_url text default null
)
returns bigint
language plpgsql
security definer
as $$
declare
  v_order_id bigint;
  v_total numeric(10,2);
  v_delivery_fee numeric(10,2);
  cart_item record;
begin
  -- Calculate totals from cart
  select coalesce(sum(c.quantity * p.price), 0)
  into v_total
  from cart c
  join products p on p.id = c.product_id
  where c.user_id = p_user_id;

  -- Set delivery fee
  if p_delivery_type = 'delivery' then
    v_delivery_fee := 50.00;
  else
    v_delivery_fee := 0;
  end if;

  v_total := v_total + v_delivery_fee;

  -- Insert order
  insert into orders (
    user_id,
    status,
    total_amount,
    delivery_fee,
    payment_method,
    delivery_type,
    delivery_address,
    phone,
    delivery_date,
    payment_proof_url,
    created_at
  ) values (
    p_user_id,
    case when p_payment_method = 'instapay' then 'payment_pending' else 'processing' end,
    v_total,
    v_delivery_fee,
    p_payment_method,
    p_delivery_type,
    p_address,
    p_phone,
    p_delivery_date,
    p_payment_proof_url,
    now()
  )
  returning id into v_order_id;

  -- Move cart items to order_items (FIXED: price_at_purchase instead of price)
  for cart_item in
    select c.product_id, c.quantity, p.price
    from cart c
    join products p on p.id = c.product_id
    where c.user_id = p_user_id
  loop
    insert into order_items (order_id, product_id, quantity, price_at_purchase)
    values (v_order_id, cart_item.product_id, cart_item.quantity, cart_item.price);
  end loop;

  -- Clear the cart
  delete from cart where user_id = p_user_id;

  return v_order_id;
end;
$$;

-- Done! Your checkout system is now ready.
-- All payment methods ('cash', 'instapay') match the database constraints.
-- order_items now uses 'price_at_purchase' column correctly.
