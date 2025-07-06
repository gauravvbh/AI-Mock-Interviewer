'use client'

import { plans } from '@/planData'
import { Button } from '@radix-ui/themes'
import axios from 'axios'
import Script from 'next/script'
import React, { useEffect, useState } from 'react'
import { PagesTopLoader } from 'nextjs-toploader/pages';
import { useUser } from '@clerk/nextjs'
import { db } from 'utils/db'
import { User } from 'utils/schema'
import { eq } from 'drizzle-orm'
import toast from 'react-hot-toast'

const UpgradePage = () => {
    const { user } = useUser();
    const [currentPlan, setCurrentPlan] = useState('');
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            getCurrentPlan();
        }
    }, [user]);

    const getCurrentPlan = async () => {
        const storedPlan = localStorage.getItem("userPlan");
        if (storedPlan) {
            setCurrentPlan(storedPlan);
        }

        try {
            const response = await db.select()
                .from(User)
                .where(eq(User.email, user.primaryEmailAddress?.emailAddress));

            if (response.length > 0) {
                setCurrentPlan(response[0].plan);
                localStorage.setItem("userPlan", response[0].plan);
            }
        } catch (error) {
            console.error("Error getting current plan:", error);
        }
    };

    const createOrder = async (amount) => {
        if (amount === 0) {
            toast.error("Already has a better plan");
            return;
        }
        const newPlan = amount === 100 ? "Monthly" : "Yearly";

        try {
            const res = await axios.post('/api/createOrder', { amount });

            const paymentData = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: amount * 100,
                currency: "INR",
                order_id: res.data.id,
                name: "Mock Interviewer",
                description: "Upgrade Plan",
                handler: async function (response) {
                    if (response.razorpay_order_id && response.razorpay_payment_id) {
                        try {
                            await axios.put("/api/updatePlan", {
                                order_id: response.razorpay_order_id,
                                payment_id: response.razorpay_payment_id,
                                plan: newPlan,
                                email: user.primaryEmailAddress.emailAddress,
                            });

                            window.location.href = `/payment-success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}`;
                        } catch (error) {
                            console.error("Error updating plan:", error);
                            window.location.href = "/payment-failure";
                        }
                    } else {
                        console.log("Missing order ID or payment ID:", response);
                        window.location.href = "/payment-failure";
                    }
                },
                theme: { color: "#000" },
                modal: {
                    ondismiss: function () {
                        window.location.href = "/payment-failure";
                    },
                },
            };

            const payment = new window.Razorpay(paymentData);
            payment.open();
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };
    console.log('currentPlan')
    console.log(currentPlan)
    return (
        <>
            <PagesTopLoader />
            <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 bg-white">
                <Script
                    id="razorpay-checkout-js"
                    src="https://checkout.razorpay.com/v1/checkout.js"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="divide-y divide-gray-300 rounded-2xl border border-gray-300 bg-white shadow-lg"
                        >
                            <div className="p-6 sm:px-8">
                                <div className="flex flex-col justify-center items-center">
                                    <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>

                                    <p className="mt-2 sm:mt-4">
                                        <strong className="text-3xl font-bold sm:text-4xl text-gray-900"> {plan.price}₹ </strong>
                                        <span className="text-sm font-medium text-gray-600"> /month </span>
                                    </p>
                                </div>

                                <Button
                                    disabled={currentPlan === plan.name}
                                    onClick={() => createOrder(plan.price)}
                                    className={`w-full mt-4 block rounded-lg border px-12 py-3 text-center text-sm font-medium sm:mt-6
                                        ${currentPlan === plan.name
                                            ? "border-gray-400 bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "border border-black bg-black text-white hover:bg-gray-800"}`}
                                >
                                    {
                                        currentPlan ? (<>
                                            {currentPlan === plan.name ? "In Use" : "Upgrade Plan"}
                                        </>) : ('Loading')
                                    }
                                </Button>
                            </div>

                            <div className="p-6 sm:px-8">
                                <p className="text-lg font-medium sm:text-xl text-gray-900">What's included:</p>

                                <ul className="mt-2 space-y-2 sm:mt-4">
                                    {plan.features.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2 text-gray-700">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-5 text-green-500"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            <span> {item} </span>
                                        </li>
                                    ))}

                                    {plan.noFeatures.map((item, index) => (
                                        <li key={index} className="flex items-center gap-2 text-gray-500">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="size-5 text-red-500"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <span> {item} </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default UpgradePage;
