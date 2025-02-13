import { data } from '@/questionData'
import React from 'react'

const page = () => {
    return (
        <div className='mt-10 mb-10'>
            <div className="space-y-4 flex justify-center items-center flex-col">
                {
                    data.map((item, index) => (
                        <details key={index} className="w-3/5 group [&_summary::-webkit-details-marker]:hidden">
                            <summary
                                className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-200 p-4 text-gray-900"
                            >
                                <h2 className="font-medium">{item.question}</h2>

                                <svg
                                    className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>

                            <p className="mt-4 px-4 leading-relaxed text-gray-700">{item.answer}</p>
                        </details>
                    ))
                }


            </div>
        </div>
    )
}

export default page