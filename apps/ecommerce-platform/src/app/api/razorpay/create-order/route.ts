import { NextResponse } from 'next/server';
import { razorpayInstance, formatAmountForRazorpay } from '@/lib/razorpay-server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const { amount, customer, items, clerk_user_id } = await request.json();

        // 1. Sync Profile (Upsert user data from Clerk)
        if (clerk_user_id) {
            await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: clerk_user_id,
                    email: customer.email,
                    full_name: `${customer.firstName} ${customer.lastName}`,
                    phone: customer.phone,
                });
        }

        // 2. Create Order in Supabase
        const orderData = {
            user_id: clerk_user_id || null,
            customer_email: customer.email,
            customer_phone: customer.phone,
            total_amount: amount,
            status: 'pending',
            payment_status: 'pending',
            payment_method: 'online',
        };

        const { data: dbOrder, error: dbError } = await supabaseAdmin
            .from('orders')
            .insert(orderData)
            .select()
            .single();

        if (dbError) throw new Error(`Database Error: ${dbError.message}`);

        // 2. Create Order Items
        const orderItems = items.map((item: any) => ({
            order_id: dbOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }));

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw new Error(`Order Items Error: ${itemsError.message}`);

        // 3. Create Razorpay Order
        const options = {
            amount: formatAmountForRazorpay(amount),
            currency: 'INR',
            receipt: `receipt_${dbOrder.id}`,
        };

        const rzpOrder = await razorpayInstance.orders.create(options);

        // 4. Update Supabase with Razorpay Order ID
        await supabaseAdmin
            .from('orders')
            .update({ razorpay_order_id: rzpOrder.id })
            .eq('id', dbOrder.id);

        return NextResponse.json({
            success: true,
            order_id: dbOrder.id,
            razorpay_order_id: rzpOrder.id,
            amount: amount
        });

    } catch (error: any) {
        console.error('RAZORPAY_CREATE_ORDER_ERROR:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
