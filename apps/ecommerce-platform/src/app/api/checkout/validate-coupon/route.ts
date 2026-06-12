import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: Request) {
    try {
        const { code, cartTotal } = await req.json();

        if (!code) {
            return NextResponse.json(
                { success: false, message: 'Coupon code is required' },
                { status: 400 }
            );
        }

        // Fetch coupon from database
        const { data: coupon, error } = await supabase
            .from('discounts')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('is_active', true)
            .single();

        if (error || !coupon) {
            return NextResponse.json(
                { success: false, message: 'Invalid coupon code' },
                { status: 400 }
            );
        }

        // Check validity dates
        const now = new Date();
        if (coupon.start_date && new Date(coupon.start_date) > now) {
            return NextResponse.json(
                { success: false, message: 'Coupon not yet active' },
                { status: 400 }
            );
        }
        if (coupon.end_date && new Date(coupon.end_date) < now) {
            return NextResponse.json(
                { success: false, message: 'Coupon expired' },
                { status: 400 }
            );
        }

        // Check minimum order amount
        if (coupon.min_order_amount && cartTotal < coupon.min_order_amount) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Minimum order value ₹${coupon.min_order_amount} required`
                },
                { status: 400 }
            );
        }

        // Check usage limit
        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
            return NextResponse.json(
                { success: false, message: 'Coupon usage limit reached' },
                { status: 400 }
            );
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.type === 'percentage') {
            discountAmount = (cartTotal * coupon.value) / 100;
            if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
                discountAmount = coupon.max_discount_amount;
            }
        } else if (coupon.type === 'fixed') {
            discountAmount = coupon.value;
        }

        // Round to 2 decimals
        discountAmount = Math.round(discountAmount * 100) / 100;

        return NextResponse.json({
            success: true,
            coupon: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                discountAmount
            }
        });
    } catch (error) {
        console.error('COUPON_VALIDATION_ERROR:', error);
        return NextResponse.json(
            { success: false, message: 'Something went wrong' },
            { status: 500 }
        );
    }
}
