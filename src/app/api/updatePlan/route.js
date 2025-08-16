import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { db } from 'utils/db';
import { User } from 'utils/schema';

export async function PUT(req) {
    try {
        const { order_id, payment_id, plan, email } = await req.json();

        const isPaymentValid = await verifyPayment(order_id, payment_id);

        if (!isPaymentValid) {
            return NextResponse.json({ error: "Invalid payment" }, { status: 400 });
        }

        const res = await db.update(User)
            .set({ plan })
            .where(eq(User.email, email))


        return NextResponse.json({ message: "Plan updated successfully" });

    } catch (error) {
        console.error('Error updating plan:', error);
        return NextResponse.json({ error: 'Failed to update the plan' }, { status: 500 });
    }
}


const verifyPayment = async (order_id, payment_id) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const payment = await razorpay.payments.fetch(payment_id);
        return payment.status === "captured";
    } catch (error) {
        console.error("Payment verification failed:", error);
        return false;
    }
};
