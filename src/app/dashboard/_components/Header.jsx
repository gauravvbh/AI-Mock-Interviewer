'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {

  const path = usePathname();
  
  return (
    <div className='flex p-4 items-center justify-between bg-slate-600'>
      <Image src={'/logo.svg'} width={160} height={100} alt='logo'></Image>
      <ul className='hidden md:flex gap-6'>
        <li className={`hover:text-black transition-all cursor-pointer ${path == '/dashboard' && 'text-black font-bold'}`}>Dashboard</li>
        <li className={`hover:text-black transition-all cursor-pointer ${path == '/dashboard/questions' && 'text-black font-bold'}`}>Questions</li>
        <li className={`hover:text-black transition-all cursor-pointer ${path == '/dashboard/upgrade' && 'text-black font-bold'}`}>Upgrade</li>
        <li className={`hover:text-black transition-all cursor-pointer ${path == '/dashboard/how' && 'text-black font-bold'}`}>How it Works?</li>
      </ul>
      <UserButton />
    </div>
  )
}

export default Header