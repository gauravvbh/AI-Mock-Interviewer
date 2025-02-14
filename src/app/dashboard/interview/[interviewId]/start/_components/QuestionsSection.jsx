import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

const QuestionsSection = ({ mockInterviewQuestions, activeQuestionIndex }) => {
    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = text;
            speech.volume = 1;
            speech.rate = 1;
            speech.pitch = 1;
            speechSynthesis.speak(speech);
        } else {
            alert('Sorry, Speech synthesis is not supported in this browser.');
        }
    };

    return (
        <div className="border border-gray-700 shadow-sm rounded-lg p-5">
            {/* Question Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {mockInterviewQuestions?.map((data, index) => (
                    <h2
                        key={index}
                        className={`p-2 text-xs md:text-sm text-center rounded-full border border-gray-600 cursor-pointer transition-all 
                        ${activeQuestionIndex === index ? 'bg-primary text-white font-semibold' : 'hover:bg-gray-200'}`}
                    >
                        Question #{index + 1}
                    </h2>
                ))}
            </div>

            {/* Current Question Display */}
            {mockInterviewQuestions && (
                <>
                    <h2 className="my-5 text-lg text-gray-800 font-medium">
                        {mockInterviewQuestions[activeQuestionIndex]?.question}
                    </h2>

                    {/* Text-to-Speech Button */}
                    <Volume2
                        className="cursor-pointer text-gray-600 hover:text-blue-500 transition-all"
                        onClick={() => textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)}
                        size={24}
                    />
                </>
            )}

            {/* Information Section */}
            <div className="border border-yellow-400 rounded-lg p-5 bg-yellow-100 mt-10">
                <h2 className="flex gap-2 items-center text-yellow-700">
                    <Lightbulb />
                    <strong>NOTE:</strong>
                </h2>
                <h2 className="text-sm text-yellow-700 my-2">
                    {process.env.NEXT_PUBLIC_INFORMATION}
                </h2>
            </div>
        </div>
    );
};

export default QuestionsSection;
