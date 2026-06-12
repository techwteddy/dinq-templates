import { NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay-server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            order_id
        } = await request.json();

        // 1. Verify Signature
        const isValid = verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            return NextResponse.json({ success: false, error: 'INVALID_SIGNATURE' }, { status: 400 });
        }

        // 2. Update Supabase Order Status
        const { error: dbError } = await supabaseAdmin
            .from('orders')
            .update({
                payment_status: 'paid',
                status: 'processing',
                razorpay_payment_id: razorpay_payment_id
            })
            .eq('id', order_id);

        if (dbError) throw new Error(`Database Update Error: ${dbError.message}`);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('RAZORPAY_VERIFY_PAYMENT_ERROR:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
