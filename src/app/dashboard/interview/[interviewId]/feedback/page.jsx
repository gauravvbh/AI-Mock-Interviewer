'use client'

import { eq } from 'drizzle-orm';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { db } from 'utils/db';
import { MockInterview, UserAnswer } from 'utils/schema';
import { Collapsible } from "radix-ui";
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@mui/material';

const Feedback = () => {
    const params = useParams();
    const router = useRouter();
    const [feedbackList, setFeedbackList] = useState([]);
    const [notAnswered, setNotAnswered] = useState([]);
    const [overallRating, setOverallRating] = useState(0);
    const [loading, setLoading] = useState(true)

    const getFeedback = async () => {
        try {
            const answered = await db.select()
                .from(UserAnswer)
                .where(eq(UserAnswer.mockIdRef, params.interviewId))
                .orderBy(UserAnswer.id);

            const result2 = await db.select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId))


            const answeredQuestions = answered.map(ans => ans.question.trim());
            const allQuestions = result2[0].aiMockResponses ? JSON.parse(result2[0].aiMockResponses) : [];


            const unanswered = allQuestions.filter(q => {
                if (!q.question) {
                    console.log("Invalid question:", q); // Debugging
                }
                return q.question && !answeredQuestions.includes(q.question.trim());
            });


            setFeedbackList(answered);
            setNotAnswered(unanswered);
            // console.log(result);

            const totalRating = answered.reduce((acc, item) => {
                // Extract numerical rating (e.g., '1/5' -> 1)
                const rating = parseInt(item.rating.split('/')[0], 10);
                return acc + rating;
            }, 0);

            const averageRating = answered.length > 0 ? totalRating / answered.length : 0;
            setOverallRating(averageRating);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    };

    useEffect(() => {
        getFeedback();
    }, []);

    return (
        <div className="p-8 bg-white mt-10 text-gray-800 rounded-lg shadow-md border border-gray-300">
            {
                loading ? (
                    <div className="container mx-auto p-4">
                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                        </div>

                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-300 rounded w-2/6 mb-6"></div>
                        </div>

                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
                        </div>

                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-300 rounded w-3/4 mb-6"></div>
                        </div>

                        <div className="animate-pulse">
                            <div className="w-full h-20 bg-gray-300 rounded mb-6"></div>
                        </div>

                        <div className="animate-pulse">
                            <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
                        </div>

                        <div className="animate-pulse">
                            <div className="w-full h-20 bg-gray-300 rounded mb-6"></div>
                        </div>
                        <div className="animate-pulse">
                            <div className="w-full h-20 bg-gray-300 rounded mb-6"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {feedbackList.length === 0? (
                            <>
                                <h2 className="font-bold text-xl text-gray-500">No Interview Feedback Record Found</h2>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-green-600">🎉 Congratulations!</h2>
                                <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
                                <h2 className="text-lg text-gray-700 my-3">
                                    Your overall interview rating: <strong className="text-gray-900">{overallRating.toFixed(1)}/5</strong>
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

                                {notAnswered.length > 0 && (
                                    <>
                                        <h2 className="mt-10 text-xl font-semibold text-red-600">
                                            ⚠️ Unanswered Questions
                                        </h2>
                                        <div className="mt-4 space-y-4">
                                            {notAnswered.map((item, index) => (
                                                <div key={index} className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                                                    <h3 className="text-gray-800 font-medium">Question: {item.question}</h3>
                                                    <p className="text-sm text-gray-500">This question was not answered.</p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                    </>
                )
            }

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
