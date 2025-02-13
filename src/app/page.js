'use client'

import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { useEffect } from "react";
import { db } from "utils/db";
import { User } from "utils/schema";

export default function Home() {
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      setUserData();
    }
  }, [user])

  const setUserData = async () => {
    try {

      // Check if user already exists
      const existingUser = await db.select().from(User).where(eq(User.email, user.primaryEmailAddress.emailAddress));

      if (existingUser.length > 0) {
        console.log("User already exists in DB.");
        return;
      }

      await db.insert(User).values({
        email: user.primaryEmailAddress.emailAddress,
        createdAt: new Date(user.createdAt),
      });

      console.log("User inserted successfully");

    } catch (error) {
      console.error("Database error:", error);
    }
  };


  return (
    <section className="">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl text-primary font-extrabold sm:text-5xl">
            Ace your
            <strong className="font-extrabold text-gray-400 sm:block"> Software interviews. </strong>
          </h1>

          <p className="mt-10 sm:text-xl/relaxed">
            Prepare for your interviews with real-time voice-to-voice mock interviews with the world's most advanced AI. Say goodbye to interview performance anxiety. Master any role, any level, any industry and land your Dream job. Get detailed feedback on your answers and suggestions to improve them.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              className="group relative inline-block text-sm font-medium text-white focus:ring-3 focus:outline-hidden"
              href="/dashboard"
            >
              <span className="absolute inset-0 border border-gray-600"></span>
              <span
                className="block border border-gray-600 bg-gray-500 px-12 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
              >
                Get Started
              </span>
            </a>

            <a
              className="group relative inline-block text-sm font-medium text-gray-600 focus:ring-3 focus:outline-hidden"
              href="#"
            >
              <span className="absolute inset-0 border border-current"></span>
              <span
                className="block border border-current bg-white px-12 py-3 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
              >
                Learn More
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}