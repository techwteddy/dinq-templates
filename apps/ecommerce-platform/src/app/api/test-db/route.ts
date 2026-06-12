import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
    try {
        // Create Supabase client with Service Role Key for elevated diagnostic access
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Fetch all active products to verify data flow
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)

        if (error) {
            throw error
        }

        return NextResponse.json({
            success: true,
            message: 'Database connection successful! HealMitra resources detected.',
            count: products?.length || 0,
            products: products
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            details: 'Failed to connect to Supabase. Check your environment variables and ensure SQL setup is executed.'
        }, { status: 500 })
    }
}
