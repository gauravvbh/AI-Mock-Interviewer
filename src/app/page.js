'use client'

import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { db } from "utils/db";
import { User } from "utils/schema";
import { Button } from '@mui/material';

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setUserData();
    }
  }, [user]);

  const setUserData = async () => {
    try {
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

  // Typewriter effect logic
  const phrases = ["Software Interviews.", "Your Dream Job.", "Any Industry, Any Level."];
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = phrases[index];

    if (isDeleting) {
      if (charIndex > 0) {
        setTimeout(() => setCharIndex(charIndex - 1), 50);
      } else {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % phrases.length);
      }
    } else {
      if (charIndex < currentText.length) {
        setTimeout(() => setCharIndex(charIndex + 1), 100);
      } else {
        setTimeout(() => setIsDeleting(true), 1000);
      }
    }

    setText(currentText.substring(0, charIndex));
  }, [charIndex, index, isDeleting]);

  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-screen-xl px-6 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-6xl">
            Ace Your
            <strong className="block font-extrabold text-gray-700">
              <span className="lg:whitespace-nowrap">{text}</span>
              <span className="animate-blink">|</span>
            </strong>
          </h1>

          <p className="mt-6 text-lg text-gray-700 sm:text-xl">
            Prepare for your interviews with real-time voice-to-voice mock interviews with the world's most advanced AI. Say goodbye to interview performance anxiety. Master any role, any level, any industry and land your Dream job. Get detailed feedback on your answers and suggestions to improve them.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <Button
              href="/dashboard"
              variant="contained"
              sx={{
                backgroundColor: "#222",
                color: "white",
                "&:hover": { backgroundColor: "#444" }
              }}
            >
              Get Started
            </Button>

            <Button
              href="#"
              variant="outlined"
              sx={{
                borderColor: "#777",
                color: "#333",
                "&:hover": {
                  backgroundColor: "#ddd",
                  color: "#111",
                }
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
