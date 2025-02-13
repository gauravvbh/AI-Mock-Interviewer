'use client';

import { Button } from '@radix-ui/themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PaymentFailure() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="bg-white p-8 md:p-10 rounded-lg shadow-xl transition-shadow hover:shadow-2xl text-center max-w-md w-full">

                {/* Failure Icon */}
                <svg viewBox="0 0 24 24" className="text-red-600 w-16 h-16 mx-auto mb-6">
                    <path fill="currentColor" d="M12 0A12 12 0 1 0 24 12 12.014 12.014 0 0 0 12 0Zm6.364 15.778a1 1 0 0 1-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 0 1-1.414-1.414L10.586 12 5.636 7.05A1 1 0 0 1 7.05 5.636L12 10.586l4.95-4.95a1 1 0 0 1 1.414 1.414L13.414 12l4.95 4.95Z"></path>
                </svg>

                {/* Failure Message */}
                <h2 className="text-2xl font-semibold text-gray-900">Payment Failed ❌</h2>
                <p className="text-gray-600 mt-2">Oops! Something went wrong.</p>
                <p className="text-gray-500 mt-2">Please try again later.</p>

                {/* Buttons */}
                <div className="mt-6 flex flex-col gap-3">
                    <Button
                        onClick={() => router.replace('/dashboard/upgrade')}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all hover:bg-blue-500">
                        Try Again
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
