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
    // console.log(result[0])
  }

  return (
    <div className='my-10 flex justify-center flex-col max-w-6xl mx-auto'>
      <h1 className='font-bold text-2xl text-primary text-center'>Let's Get Started</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-6'>

        {/* Interview Details Card */}
        <div className='flex flex-col gap-6'>
          <div className='p-5 border border-gray-700 shadow-sm rounded-lg'>
            <h2 className='font-bold text-primary text-lg'>{interviewData?.jobPosition}</h2>
            <h2 className='text-gray-600 text-sm'><strong>Tech Stack: </strong>{interviewData?.jobDescription}</h2>
            <h2 className='text-gray-400 text-xs'><strong>Experience: </strong>{interviewData?.jobExperience} Years</h2>
          </div>

          {/* Information Section */}
          <div className='p-5 border border-yellow-300 bg-yellow-100 rounded-lg'>
            <h2 className='flex gap-2 items-center text-yellow-500'>
              <Lightbulb /><strong>Information</strong>
            </h2>
            <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        {/* Webcam Section */}
        <div className='flex flex-col items-center justify-center'>
          {
            webcamEnabled ? (
              <Webcam
                onUserMedia={() => setWebcamEnabled(true)}
                onUserMediaError={() => setWebcamEnabled(false)}
                mirrored={true}
                style={{ height: 300, width: 500, borderRadius: '8px' }}
              />
            ) : (
              <>
                <WebcamIcon className='h-72 w-full my-7 p-20 bg-gray-100 rounded-lg text-gray-700' />
                <Button
                  variant="outlined"
                  className='w-full flex items-center mt-4'
                  onClick={() => setWebcamEnabled(true)}
                  sx={{
                    borderColor: "#888",
                    color: "#222",
                    "&:hover": {
                      backgroundColor: "#ddd",
                      color: "#111",
                    }
                  }}
                >
                  Enable Web Cam and Microphone
                </Button>
              </>
            )
          }
        </div>
      </div>

      {/* Start Interview Button */}
      <div className='flex justify-end w-full mt-8'>
        <Button
          onClick={() => router.push(`/dashboard/interview/${params.interviewId}/start`)}
          variant="contained"
          sx={{
            backgroundColor: "#222",
            color: "white",
            "&:hover": { backgroundColor: "#444" }
          }}
        >
          Start Interview
        </Button>
      </div>
    </div>
  )
}

export default Page
