'use client'

import { Button } from '@mui/material'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'  // Import dynamic from Next.js

const Webcam = dynamic(() => import('react-webcam'), { ssr: false }) // Disable SSR

import { db } from 'utils/db'
import { MockInterview } from 'utils/schema'

const Page = () => {
  const [interviewData, setInterviewData] = useState();
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    getInterviewDetails()
  }, [])

  const getInterviewDetails = async () => {
    const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
    setInterviewData(result[0]);
    console.log(result[0])
  }

  return (
    <div className='my-10 flex justify-center flex-col'>
      <h1 className='font-bold text-2xl'>Let's Get Started</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-20'>

        <div className='flex flex-col my-5 gap-10'>
          <div className='flex flex-col p-5 rounded-lg border gap-5'>
            <h2 className='text-lg'><strong>Job Role/Job Position: </strong>{interviewData?.jobPosition}</h2>
            <h2 className='text-lg'><strong>Job Description/Tech Stack: </strong>{interviewData?.jobDescription}</h2>
            <h2 className='text-lg'><strong>Years of Experience: </strong>{interviewData?.jobExperience}</h2>
          </div>

          <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
            <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /><strong>Information</strong></h2>
            <h2 className='mt-3 text-yellow-500 '>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        <div>
          {
            webcamEnabled ?
              <Webcam
                onUserMedia={() => setWebcamEnabled(true)}
                onUserMediaError={() => setWebcamEnabled(false)}
                mirrored={true}
                style={{ height: 300, width: 300 }}
              />
              :
              <>
                <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg' />
                <Button className='w-full flex items-center' variant='ghost' onClick={() => setWebcamEnabled(true)}>Enable Web Cam and Microphone</Button>
              </>
          }
        </div>
      </div>

      <div className=' flex justify-end items-end w-full'>
        <Button onClick={() => router.push(`/dashboard/interview/${params.interviewId}/start`)}>Start Interview</Button>
      </div>
    </div>
  )
}

export default Page