import { useUser } from '@clerk/nextjs'
import { Button } from '@mui/material'
import { Mic, StopCircle } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useSpeechToText from 'react-hook-speech-to-text'
import toast from 'react-hot-toast'
import Webcam from 'react-webcam'
import chatSession from 'utils/AIModal'
import { db } from 'utils/db'
import { UserAnswer } from 'utils/schema'

const RecordAnswerSection = ({ mockInterviewQuestions, activeQuestionIndex, interviewData }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(false)
    const { user } = useUser();

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        setUserAnswer(prevAns => prevAns + results.map(result => result.transcript));
    }, [results])


    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            saveToDB();
        }
    }, [userAnswer])

    const startStopRecording = () => {
        if (isRecording) {
            setLoading(true);
            stopSpeechToText();
            if (userAnswer.length < 10) {
                setLoading(false);
                toast.error('Error while saving your answer, Please try again later');
                return;
            }
        }
        else {
            startSpeechToText()
        }
    }

    const saveToDB = async () => {
        setLoading(true);
        const feedbackPrompt = "Question:" + mockInterviewQuestions[activeQuestionIndex]?.question + ", User Answer: " + userAnswer + ", Depends on Question and User Answer for given interview question please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJSONResponse = (result.response.text()).replace('```json', '').replace('```', '');
        const jsonFeedbackResp = JSON.parse(mockJSONResponse);

        const resp = db.insert(UserAnswer)
            .values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestions[activeQuestionIndex]?.question,
                correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
                userAnswer: userAnswer,
                feedback: jsonFeedbackResp?.feedback,
                rating: jsonFeedbackResp?.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-YYYY'),
            })


        if (resp) {
            toast.success('Answer saved successfully');
            setUserAnswer('');
            stopSpeechToText();
        }
        setLoading(false);
    }

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col justify-center items-center bg-secondary rounded-lg mt-20 p-5'>
                <Image src={'/webcam.png'} width={200} height={200} className='absolute' alt='webcam.png' />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,

                    }} />
            </div>
            <Button className='mt-10' variant='outline' onClick={startStopRecording} disabled={loading}>
                {
                    isRecording ?
                        <h2 className='text-red-600 flex gap-2 animate-pulse items-center justify-center'>
                            <StopCircle />Stop Recording
                        </h2>
                        :
                        <h2 className='text-primary flex gap-2 items-center'>
                            <Mic />Start Recording
                        </h2>
                }
            </Button>
            <Button onClick={() => console.log(userAnswer)}>Show Answer</Button>

        </div>
    )
}

export default RecordAnswerSection