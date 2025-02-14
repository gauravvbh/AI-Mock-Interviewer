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
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <QuestionsSection mockInterviewQuestions={mockInterviewQuestions} activeQuestionIndex={activeQuestionIndex} />
                {mockInterviewQuestions && interviewData && (
                    <RecordAnswerSection
                        mockInterviewQuestions={mockInterviewQuestions}
                        activeQuestionIndex={activeQuestionIndex}
                        interviewData={interviewData}
                    />
                )}
            </div>
            <div className='flex justify-end gap-6'>
                {activeQuestionIndex > 0 && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>
                )}
                {activeQuestionIndex < (mockInterviewQuestions?.length - 1) && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>
                )}
                {activeQuestionIndex === (mockInterviewQuestions?.length - 1) && (
                    <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                        <Button>End Interview</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default StartInterview;
