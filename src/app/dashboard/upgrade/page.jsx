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

const UpgradePage = () => {

    const { user } = useUser();
    const [currentPlan, setCurrentPlan] = useState('Free');

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

                theme: {
                    color: "#3399cc",
                },
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



    return (
        <>
            <PagesTopLoader />
            <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                <Script
                    id="razorpay-checkout-js"
                    src="https://checkout.razorpay.com/v1/checkout.js"
                />


                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:grid-cols-3 md:gap-8">
                    {
                        plans.map((plan) => (
                            <div key={plan.id} className="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-xs">
                                <div className="p-6 sm:px-8">
                                    <div className='flex flex-col justify-center items-center'>
                                        <h2 className="text-lg font-medium text-gray-900">
                                            {plan.name}
                                            <span className="sr-only">Plan</span>
                                        </h2>


                                        <p className="mt-2 sm:mt-4">
                                            <strong className="text-3xl font-bold text-gray-900 sm:text-4xl"> {plan.price}₹ </strong>

                                            <span className="text-sm font-medium text-gray-700">/month</span>
                                        </p>
                                    </div>

                                    <Button
                                        disabled={currentPlan === plan.name}
                                        onClick={() => createOrder(plan.price)}
                                        className={`w-full mt-4 block rounded-sm border px-12 py-3 text-center text-sm font-medium focus:ring-3 focus:outline-hidden sm:mt-6 ${currentPlan === plan.name ? "border-gray-400 bg-gray-400 text-gray-200 cursor-not-allowed" : "border border-primary bg-primary text-white hover:bg-transparent hover:text-primary hover:border-primary"}`}
                                    >
                                        {currentPlan === plan.name ? "In Use" : "Get Started For Free"}
                                    </Button>
                                </div>

                                <div className="p-6 sm:px-8">
                                    <p className="text-lg font-medium text-gray-900 sm:text-xl">What's included:</p>

                                    <ul className="mt-2 space-y-2 sm:mt-4">
                                        {
                                            plan.features.length > 0 && plan.features.map((item, index) => (
                                                <li key={index} className="flex items-center gap-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-5 text-indigo-700"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>

                                                    <span className="text-gray-700"> {item} </span>
                                                </li>
                                            ))
                                        }
                                        {
                                            plan.features.length > 0 && plan.noFeatures.map((item, index) => (
                                                <li key={index} className="flex items-center gap-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-5 text-red-700"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>

                                                    <span className="text-gray-700"> {item} </span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>

    )
}

export default UpgradePage