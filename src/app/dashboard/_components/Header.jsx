'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Header = () => {
  const path = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow relative">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="md:flex md:items-center md:gap-12">
            <a className="block text-teal-600" href="#">
              <span className="sr-only">Home</span>
              <Image
                className='cursor-pointer mt-[-20px] ml-6 md:ml-20 lg:ml-6'
                onClick={() => router.push('/')}
                src={'/interviewer.svg'}
                width={160}
                height={100}
                alt='logo'
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <a className={`hover:text-gray-700 transition-all cursor-pointer ${path === '/dashboard' && 'text-black font-bold'}`} href="/dashboard"> Dashboard </a>
                </li>
                <li>
                  <a className={`hover:text-gray-700 transition-all cursor-pointer ${path === '/dashboard/questions' && 'text-black font-bold'}`} href="/dashboard/questions"> Questions </a>
                </li>
                <li>
                  <a className={`hover:text-gray-700 transition-all cursor-pointer ${path === '/dashboard/upgrade' && 'text-black font-bold'}`} href="/dashboard/upgrade"> Upgrade </a>
                </li>
                <li>
                  <a className={`hover:text-gray-700 transition-all cursor-pointer ${path === '/dashboard/how' && 'text-black font-bold'}`}> How it Works? </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <UserButton />
            </div>

            {/* Mobile Menu Button */}
            <div className="block md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Sliding from Right) */}
      <div className={`z-50 fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          ✕
        </button>
        <nav className="mt-16 flex flex-col space-y-4 p-6 text-lg">
          <a onClick={() => setIsMenuOpen(false)} href="/dashboard" className={`block ${path === '/dashboard' && 'text-black font-bold'}`}>Dashboard</a>
          <a onClick={() => setIsMenuOpen(false)} href="/dashboard/questions" className={`block ${path === '/dashboard/questions' && 'text-black font-bold'}`}>Questions</a>
          <a onClick={() => setIsMenuOpen(false)} href="/dashboard/upgrade" className={`block ${path === '/dashboard/upgrade' && 'text-black font-bold'}`}>Upgrade</a>
          <a onClick={() => setIsMenuOpen(false)} href="/dashboard/how" className={`block ${path === '/dashboard/how' && 'text-black font-bold'}`}>How it Works?</a>
        </nav>
      </div>
    </header>
  )
}

export default Header;