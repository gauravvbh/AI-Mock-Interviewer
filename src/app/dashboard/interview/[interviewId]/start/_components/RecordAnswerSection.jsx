import { useUser } from '@clerk/nextjs';
import { Button } from '@mui/material';
import { Mic, StopCircle } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import toast from 'react-hot-toast';
import Webcam from 'react-webcam';
import chatSession from 'utils/AIModal';
import { db } from 'utils/db';
import { UserAnswer } from 'utils/schema';

const RecordAnswerSection = ({ mockInterviewQuestions, activeQuestionIndex, interviewData }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const {
        error,
        interimResult,
        isRecording,
        results,
        setResults,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        if (results.length > 0) {
            setUserAnswer(prevAns => prevAns + " " + results.map(result => result.transcript).join(" "));
        }
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            saveToDB();
        }
    }, [isRecording]);

    const startStopRecording = () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    };

    const saveToDB = async () => {
        try {
            setLoading(true);
            const feedbackPrompt =
                "Interview Question: " + mockInterviewQuestions[activeQuestionIndex]?.question +
                ", User Answer: " + userAnswer + ", depends on answer for the given interview question, please provide rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

            const result = await chatSession.sendMessage(feedbackPrompt);
            const mockJSONResponse = result.response.text().replace('```json', '').replace('```', '');
            const jsonFeedbackResp = JSON.parse(mockJSONResponse);

            const resp = await db.insert(UserAnswer).values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestions[activeQuestionIndex]?.question,
                correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
                userAnswer: userAnswer,
                feedback: jsonFeedbackResp?.feedback,
                rating: jsonFeedbackResp?.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-YYYY'),
            });

            if (resp) {
                toast.success('Answer saved successfully');
                setUserAnswer('');
                stopSpeechToText();
                setResults([]);
            }
        } catch (error) {
            console.error("Error saving answer:", error);
            toast.error("Failed to save answer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center flex-col">
            {/* Webcam Section */}
            <div className="flex flex-col justify-center items-center bg-gray-400 border border-gray-700 rounded-lg mt-10 shadow-lg mb-10">
                <Image
                    src={'/webcam.png'}
                    width={200}
                    height={200}
                    className="absolute opacity-50"
                    alt="webcam.png"
                />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10,
                        borderRadius: '8px',
                    }}
                />
            </div>

            {/* Recording Button */}
            <Button
                className="w-full"
                variant={isRecording ? 'contained' : 'outlined'}
                color={isRecording ? 'error' : 'primary'}
                onClick={startStopRecording}
                disabled={loading}
                sx={{
                    backgroundColor: isRecording ? '#dc2626' : 'transparent',
                    color: isRecording ? 'white' : '#222',
                    borderColor: isRecording ? '#dc2626' : '#888',
                    '&:hover': {
                        backgroundColor: isRecording ? '#b91c1c' : '#ddd',
                    },
                }}
            >
                {isRecording ? (
                    <h2 className="flex gap-2 items-center">
                        <StopCircle /> Stop Recording
                    </h2>
                ) : (
                    <h2 className="flex gap-2 items-center">
                        <Mic /> Start Recording
                    </h2>
                )}
            </Button>

            <div className='mt-8'>
                {/* Show Answer Button */}
                <Button
                    onClick={() => console.log(userAnswer)}
                    variant="outlined"
                    className="mt-4"
                    sx={{
                        borderColor: "#888",
                        color: "#222",
                        "&:hover": {
                            backgroundColor: "#ddd",
                            color: "#111",
                        },
                    }}
                >
                    Show Answer
                </Button>
            </div>
        </div>
    );
};

export default RecordAnswerSection;
