'use client';

import { Button } from '@radix-ui/themes';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const orderId = searchParams.get('order_id');
    const paymentId = searchParams.get('payment_id');

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="bg-white p-8 md:p-10 rounded-lg shadow-xl transition-shadow hover:shadow-2xl text-center max-w-md w-full">

                {/* Success Icon */}
                <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto mb-6">
                    <path fill="currentColor" d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"></path>
                </svg>

                {/* Payment Message */}
                <h2 className="text-2xl font-semibold text-gray-900">Payment Successful 🎉</h2>
                <p className="text-gray-600 mt-2">Thank you for completing your secure online payment.</p>
                <p className="text-gray-500 mt-2">Order ID: <span className="font-medium">{orderId || 'N/A'}</span></p>
                <p className="text-gray-500 mt-1">Payment ID: <span className="font-medium">{paymentId || 'N/A'}</span></p>

                {/* Buttons */}
                <div className="mt-6 flex flex-col gap-3">
                    <Button
                        onClick={() => router.replace('/dashboard')}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all hover:bg-blue-500">
                        Go to Dashboard
                    </Button>

                    <Link
                        href="/"
                        className="block px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-md shadow-md hover:shadow-lg transition-all hover:bg-gray-400">
                        Go Home
                    </Link>
                </div>

            </div>
        </div>
    );
}
