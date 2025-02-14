"use client";

import { Suspense } from "react";
import PaymentSuccessContent from "./_components/PaymentSuccessContent";

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
