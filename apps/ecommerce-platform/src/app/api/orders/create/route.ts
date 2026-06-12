import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customer, shippingAddress, items, paymentMethod, subtotal, shipping, tax, total } = body;

        // Generate order number
        const orderNumber = generateOrderNumber();

        // Create order
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                order_number: orderNumber,
                customer_email: customer.email,
                customer_phone: customer.phone,
                status: 'pending',
                payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
                payment_method: paymentMethod,
                subtotal,
                tax_amount: tax,
                shipping_amount: shipping,
                discount_amount: 0,
                total_amount: total,
                shipping_address: shippingAddress,
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_image: item.product_image,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
        }));

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItems);

        if (itemsError) throw itemsError;

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                order_number: orderNumber,
                total_amount: total,
                customer_email: customer.email,
                customer_phone: customer.phone,
            },
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    }
}
