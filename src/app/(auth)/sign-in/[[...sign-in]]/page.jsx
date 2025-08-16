import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-white">
            {/* Left side - White hero image */}
            <div className="relative lg:w-1/2 h-64 lg:h-auto bg-white">
                <Image
                    src="https://plus.unsplash.com/premium_photo-1682608388268-d2fe94141e13?q=80&w=705&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Replace with your white image path
                    alt="White background"
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                />

                {/* Logo on top */}
                <div className="absolute lg:left-6 left-4 z-20 h-16 md:h-24 lg:h-auto bg-white p-1">
                    <Image
                        src={'/interviewer.svg'}
                        width={150}
                        height={150}
                        alt='logo'
                        className="cursor-pointer w-20 sm:w-28 lg:w-40  lg:mt-0 h-auto"
                    />
                </div>


                <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-16">
                    <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2">
                        Welcome to AI Mock Interviewer
                    </h1>
                    <p className="text-white/70 text-sm lg:text-base">
                        Practice, learn, and improve your skills with our AI-powered mock interviews.
                    </p>
                </div>
            </div>

            {/* Right side - Sign-in form */}
            <div className="flex-1 flex items-center justify-center px-8 py-12 lg:px-16 lg:py-24 bg-[#8B8784]">
                <SignIn />
            </div>
        </div>
    )
}
