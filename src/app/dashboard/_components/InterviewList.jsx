'use client'

import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { db } from 'utils/db';
import { MockInterview } from 'utils/schema';
import InterviewItemCard from './InterviewItemCard';

const InterviewList = () => {

  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    user && getInterviewList();
  }, [user])

  const getInterviewList = async () => {
    try {
      const result = await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id))

      setInterviewList(result)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const cards = Array.from({ length: 8 });

  return (
    <div>
      <h2 className=' text-xl font-semibold'>Previous Mock Interview</h2>
      {
        loading ? (
          <section className="bg-white dark:bg-gray-900">
            <div className="container py-10 mx-auto animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
                {cards.map((_, idx) => (
                  <div key={idx} className="w-full">
                    <div className="w-full h-36 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
            {
              interviewList && interviewList.map((interview) => (
                <InterviewItemCard key={interview.id} interview={interview} />
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default InterviewList