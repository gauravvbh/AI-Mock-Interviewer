'use client'

import { eq } from 'drizzle-orm';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { db } from 'utils/db';
import { UserAnswer } from 'utils/schema';
import { Collapsible } from "radix-ui";
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@mui/material';

const Feedback = () => {
    const params = useParams();
    const router = useRouter();
    const [feedbackList, setFeedbackList] = useState([])

    const getFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id)

        setFeedbackList(result)
        console.log(result)
    }


    useEffect(() => {
        getFeedback();
    }, [])


    return (
        <div className='p-10'>
            {feedbackList.length == 0 ?
                <h2 className='font-bold text-xl text-gray-500'>No Interview Feedback Record Found</h2>
                :
                <>
                    <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
                    <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
                    <h2 className='text-primary text-lg my-3'>Your overall interview rating: <strong>7/10</strong></h2>
                    <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, your answer and feedback for improvement</h2>

                    <div className="mt-5 space-y-4">
                        {feedbackList.map((item, index) => (
                            <Collapsible.Root key={index} className="mt-10">
                                <Collapsible.Trigger className="w-full bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 border p-3 shadow">
                                    Question {index + 1}: {item.question} <ChevronsUpDown className='h-5 w-5' />
                                </Collapsible.Trigger>
                                <Collapsible.Content>
                                    <div className='flex flex-col gap-2'>
                                        <h2 className='mt-4 text-red-500 p-2 border rounded-lg'><strong>Rating:</strong> {item.rating}</h2>
                                        <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer:</strong> {item.userAnswer}</h2>
                                        <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer:</strong> {item.correctAns}</h2>
                                        <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary"><strong>Feedback:</strong> {item.feedback}</h2>
                                    </div>
                                </Collapsible.Content>
                            </Collapsible.Root>
                        ))}
                    </div>
                </>
            }
            <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
        </div>
    )
}

export default Feedback