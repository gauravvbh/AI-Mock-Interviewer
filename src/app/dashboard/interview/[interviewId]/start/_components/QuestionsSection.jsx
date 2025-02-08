import { Lightbulb, Volume2 } from 'lucide-react'
import React from 'react'

const QuestionsSection = ({ mockInterviewQuestions, activeQuestionIndex }) => {
    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = text;
            speech.volume = 1;
            speech.rate = 1;
            speech.pitch = 1;
            speechSynthesis.speak(speech);
        }
        else {
            alert('Sorry, Speech synthesis is not supported in this browser.');
        }
    }


    return (
        <div className='p-5 border rounded-lg my-10'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {
                    mockInterviewQuestions?.map((data, index) => (
                        <h2 className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex == index && 'bg-primary text-white'}`} key={index} > Question #{index + 1}</h2>
                    ))
                }
            </div>
            {mockInterviewQuestions &&
                <>
                    <h2 className='my-5 text-sm md:text-lg'>{mockInterviewQuestions[activeQuestionIndex]?.question}</h2>
                    <Volume2 className='cursor-pointer' onClick={() => textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)} />
                </>
            }

            <div className='border rounded-lg p-5 bg-blue-100 mt-10'>
                <h2 className='flex gap-2 items-center text-primary'>
                    <Lightbulb />
                    <strong>NOTE:</strong>
                </h2>
                <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
            </div>
        </div >
    )
}

export default QuestionsSection