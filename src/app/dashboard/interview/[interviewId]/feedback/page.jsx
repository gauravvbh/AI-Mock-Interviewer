'use client'

import { eq } from 'drizzle-orm';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { db } from 'utils/db';
import { UserAnswer } from 'utils/schema';
import { Collapsible } from "radix-ui";
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@mui/material';

const Feedback = () => {
    const params = useParams();
    const router = useRouter();
    const [feedbackList, setFeedbackList] = useState([]);

    const getFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id);

        setFeedbackList(result);
        console.log(result);
    };

    useEffect(() => {
        getFeedback();
    }, []);

    return (
        <div className="p-8 bg-white mt-10 text-gray-800 rounded-lg shadow-md border border-gray-300">
            {feedbackList.length === 0 ? (
                <h2 className="font-bold text-xl text-gray-500">No Interview Feedback Record Found</h2>
            ) : (
                <>
                    <h2 className="text-3xl font-bold text-green-600">🎉 Congratulations!</h2>
                    <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
                    <h2 className="text-lg text-gray-700 my-3">
                        Your overall interview rating: <strong className="text-gray-900">7/10</strong>
                    </h2>
                    <h2 className="text-sm text-gray-600">
                        Below are your interview questions with correct answers, your answers, and feedback for improvement.
                    </h2>

                    {/* Feedback List */}
                    <div className="mt-6 space-y-4">
                        {feedbackList.map((item, index) => (
                            <Collapsible.Root key={index} className="mt-6">
                                {/* Question Box */}
                                <Collapsible.Trigger className="w-full bg-gray-100 text-gray-900 rounded-lg flex justify-between items-center text-left border border-gray-300 p-4 shadow-sm hover:bg-gray-200 transition">
                                    <span>Question {index + 1}: {item.question}</span>
                                    <ChevronsUpDown className="h-5 w-5 text-gray-500" />
                                </Collapsible.Trigger>

                                {/* Collapsible Content */}
                                <Collapsible.Content>
                                    <div className="flex flex-col gap-3 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                                        <h2 className="text-red-600 bg-red-100 p-3 rounded-md border border-red-400">
                                            <strong>Rating:</strong> {item.rating}
                                        </h2>
                                        <h2 className="text-gray-700 bg-gray-100 p-3 rounded-md border border-gray-300">
                                            <strong>Your Answer:</strong> {item.userAnswer}
                                        </h2>
                                        <h2 className="text-green-700 bg-green-100 p-3 rounded-md border border-green-400">
                                            <strong>Correct Answer:</strong> {item.correctAns}
                                        </h2>
                                        <h2 className="text-blue-700 bg-blue-100 p-3 rounded-md border border-blue-400">
                                            <strong>Feedback:</strong> {item.feedback}
                                        </h2>
                                    </div>
                                </Collapsible.Content>
                            </Collapsible.Root>
                        ))}
                    </div>
                </>
            )}

            {/* Go Home Button */}
            <div className='mt-6'>
                <Button
                    onClick={() => router.replace('/dashboard')}
                    className="w-full"
                    variant="contained"
                    sx={{
                        backgroundColor: "#222",
                        color: "white",
                        "&:hover": { backgroundColor: "#444" },
                    }}
                >
                    Go Home
                </Button>
            </div>
        </div>
    );
};

export default Feedback;
