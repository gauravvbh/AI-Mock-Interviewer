'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { db } from 'utils/db';
import { MockInterview } from 'utils/schema';
import QuestionsSection from './_components/QuestionsSection';
import { eq } from 'drizzle-orm';
import { Button } from '@mui/material';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// ✅ Fix: Dynamically import RecordAnswerSection to prevent SSR issues
const RecordAnswerSection = dynamic(() => import('./_components/RecordAnswerSection'), { ssr: false });

function StartInterview() {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const params = useParams();

    useEffect(() => {
        getInterviewDetails();
    }, []);

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
        if (result.length > 0) {
            const jsonMockResponse = JSON.parse(result[0].aiMockResponses || '[]');
            setInterviewData(result[0]);
            setMockInterviewQuestions(jsonMockResponse);
        }
    };

    return (
        <div className="max-w-6xl mx-auto my-10">
            {/* Header */}
            <h1 className="font-bold text-2xl text-primary text-center mb-6">Mock Interview</h1>

            {/* Grid Layout for Questions & Answer Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Questions Section */}
                <div className="border border-gray-700 shadow-sm rounded-lg p-5">
                    <QuestionsSection
                        mockInterviewQuestions={mockInterviewQuestions}
                        activeQuestionIndex={activeQuestionIndex}
                    />
                </div>

                {/* Record Answer Section */}
                {mockInterviewQuestions && interviewData && (
                    <div className="border border-gray-700 shadow-sm rounded-lg p-5">
                        <RecordAnswerSection
                            mockInterviewQuestions={mockInterviewQuestions}
                            activeQuestionIndex={activeQuestionIndex}
                            interviewData={interviewData}
                        />
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 mt-6">
                {/* Previous Question */}
                {activeQuestionIndex > 0 && (
                    <Button
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                        variant="outlined"
                        sx={{
                            borderColor: "#888",
                            color: "#222",
                            "&:hover": {
                                backgroundColor: "#ddd",
                                color: "#111",
                            }
                        }}
                    >
                        Previous Question
                    </Button>
                )}

                {/* Next Question */}
                {activeQuestionIndex < (mockInterviewQuestions?.length - 1) && (
                    <Button
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                        variant="contained"
                        sx={{
                            backgroundColor: "#222",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "#444",
                            }
                        }}
                    >
                        Next Question
                    </Button>
                )}

                {/* End Interview */}
                {activeQuestionIndex === (mockInterviewQuestions?.length - 1) && (
                    <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#222",
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "#444",
                                }
                            }}
                        >
                            End Interview
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default StartInterview;
