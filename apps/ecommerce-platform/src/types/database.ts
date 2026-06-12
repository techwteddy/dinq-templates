export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    category: string;
    price: number;
    mrp: number;
    stock_quantity: number;
    sku: string;
    weight: string;
    images: string[];
    ingredients?: string[];
    benefits: string[];
    usage_instructions: string;
    is_active: boolean;
    featured: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Customer {
    id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    created_at?: string;
}

export interface Address {
    id: string;
    customer_id: string;
    type: 'shipping' | 'billing';
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    is_default: boolean;
}

export interface Order {
    id: string;
    order_number: string;
    customer_id?: string;
    customer_email: string;
    customer_phone: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed';
    payment_method: 'online' | 'cod';
    subtotal: number;
    tax_amount: number;
    shipping_amount: number;
    discount_amount: number;
    total_amount: number;
    shipping_address: any;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    tracking_number?: string;
    created_at?: string;
    updated_at?: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface CartItem {
    id?: string;
    customer_id?: string;
    product_id: string;
    product_name: string;
    product_image: string;
    price: number;
    quantity: number;
}

export interface Review {
    id: string;
    product_id: string;
    customer_id?: string;
    customer_name: string;
    rating: number;
    title: string;
    comment: string;
    verified_purchase: boolean;
    is_approved: boolean;
    created_at?: string;
}

export interface Discount {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    min_order_amount?: number;
    max_discount_amount?: number;
    usage_limit?: number;
    usage_count: number;
    start_date?: string;
    end_date?: string;
    is_active: boolean;
    created_at?: string;
}
