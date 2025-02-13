'use client'

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { db } from 'utils/db';
import { MockInterview } from 'utils/schema';
import QuestionsSection from './_components/QuestionsSection';
import { eq } from 'drizzle-orm';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@mui/material';
import Link from 'next/link';

function StartInterview() {
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestions, setMockInterviewQuestions] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const params = useParams();

    useEffect(() => {
        getInterviewDetails()
    }, [])

    const getInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
        const jsonMockResponse = JSON.parse(result[0].aiMockResponses);
        setInterviewData(result[0]);
        setMockInterviewQuestions(jsonMockResponse);
    }
    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions */}
                <QuestionsSection mockInterviewQuestions={mockInterviewQuestions} activeQuestionIndex={activeQuestionIndex} />

                {/* Video/ AUdio recording */}
                <RecordAnswerSection mockInterviewQuestions={mockInterviewQuestions} activeQuestionIndex={activeQuestionIndex} interviewData={interviewData} />
            </div>
            <div className='flex justify-end gap-6 '>
                {activeQuestionIndex > 0 &&
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>
                }
                {activeQuestionIndex !== mockInterviewQuestions?.length - 1 &&
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>
                }
                {activeQuestionIndex == mockInterviewQuestions?.length - 1 &&
                    <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
                        <Button>End Interview</Button>
                    </Link>
                }
            </div>
        </div>
    )
}

export default StartInterview