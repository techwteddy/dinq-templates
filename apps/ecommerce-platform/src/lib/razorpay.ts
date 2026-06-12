// Initialize Razorpay
export function loadRazorpay(): Promise<boolean> {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

// Create Razorpay order options
export function getRazorpayOptions(
    order: any,
    onSuccess: (response: any) => void,
    onFailure: () => void
) {
    return {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.total_amount * 100, // in paise
        currency: 'INR',
        name: 'HealMitra',
        description: `Order #${order.order_number}`,
        order_id: order.razorpay_order_id,
        handler: onSuccess,
        prefill: {
            email: order.customer_email,
            contact: order.customer_phone,
        },
        theme: {
            color: '#8B9D6D',
        },
        modal: {
            ondismiss: onFailure,
        },
    };
}
