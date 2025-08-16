import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req) {
    try {
        const instance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const { amount } = await req.json();

        const order = await instance.orders.create({
            amount: amount * 100,
            currency: 'INR',
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
