-- ============================================================================
-- create_order — server-side, tamper-proof order creation
-- ============================================================================
-- MANUAL SETUP STEPS (run these yourself):
--
--   1. Run this entire file in the Supabase SQL editor.
--   2. Enable RLS on `orders` and `order_items`.
--   3. Add a policy that does NOT allow anon INSERT on those two tables
--      (the RPC is now the only write path). Keep existing SELECT policies
--      only if the success page needs to read the order back.
--   4. Confirm the anon role has EXECUTE on create_order.
-- ============================================================================

create or replace function create_order(
  p_customer_name text,
  p_customer_phone text,
  p_type text,
  p_notes text,
  p_items jsonb
)
returns table (id uuid, order_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_total numeric := 0;
  v_item jsonb;
  v_menu_item_id uuid;
  v_quantity int;
  v_price numeric;
  v_is_available boolean;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  -- Insert the order shell first; the total is updated once items are priced.
  insert into orders (customer_name, customer_phone, type, source, status, total_price, notes)
  values (p_customer_name, nullif(p_customer_phone, ''), p_type, 'online', 'pending', 0, nullif(p_notes, ''))
  returning orders.id, orders.order_number into v_order_id, v_order_number;

  -- Price every item from the CURRENT menu_items row — never trust the client.
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_menu_item_id := (v_item->>'menu_item_id')::uuid;
    v_quantity := (v_item->>'quantity')::int;

    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Invalid quantity for item %', v_menu_item_id;
    end if;

    select price, is_available
    into v_price, v_is_available
    from menu_items
    where menu_items.id = v_menu_item_id;

    if not found then
      raise exception 'Menu item % does not exist', v_menu_item_id;
    end if;

    if not v_is_available then
      raise exception 'Menu item % is not available', v_menu_item_id;
    end if;

    insert into order_items (order_id, menu_item_id, quantity, item_price)
    values (v_order_id, v_menu_item_id, v_quantity, v_price);

    v_total := v_total + (v_price * v_quantity);
  end loop;

  update orders set total_price = v_total where orders.id = v_order_id;

  return query select v_order_id, v_order_number;
end;
$$;
