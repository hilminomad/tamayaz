import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import HeroImg from '../(dashboard)/_components/hero'
import { auth } from '@clerk/nextjs'

export default function Hero() {

    const {userId } = auth()
  return (
    <section className='flex justify-center w-full bg-gradient-to-br from-white via-white  to-blue-200 rounded-br-[100px]'>
        <div className="max-w-7xl w-full min-h-[85vh] mt-6   gap-10 md:gap-0 p-6 flex flex-col md:flex-row justify-center">
            <div className="h-full w-full  md:w-1/2 flex flex-col justify-center gap-8">
                <h1 className='md:text-5xl text-3xl'>Réussir ses études<br/>et sa carrière</h1>
                <p>Des clés pour ouvrir les portes de votre avenir.<br/>Des cours adaptés à vos besoins et à vos objectifs.</p>
                <div className="flex gap-4">
                    {
                        !userId && <Link href='/sign-up'>
                        <Button variant='outline' size='lg'>S&apos;incrire</Button>
                    </Link>
                    }
                    
                    <Link href='/courses'>
                        <Button   size='lg'>Voir les cours</Button>
                    </Link>
                </div>
                 
            </div>
            <div className="h-full md:w-1/2 w-full flex flex-col justify-center items-center">
                <HeroImg/>
            </div>
        </div>
    </section>
  )
}
