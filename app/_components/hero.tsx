import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import HeroImg from '../(dashboard)/_components/hero'

export default function Hero() {
  return (
    <section className='flex justify-center w-full'>
        <div className="max-w-7xl w-full h-screen p-6 flex justify-center flex-row">
            <div className="h-full w-1/2 flex flex-col justify-center gap-8">
                <h1 className='text-5xl'>Réussir ses études<br/>et sa carrière</h1>
                <p>Des clés pour ouvrir les portes de votre avenir.<br/>Des cours adaptés à vos besoins et à vos objectifs.</p>
                <div className="flex gap-4">
                    <Link href='/sign-up'>
                        <Button size='lg'>S'incrire</Button>
                    </Link>
                    <Link href='/sign-up'>
                        <Button  variant='outline' size='lg'>Voir les cours</Button>
                    </Link>
                </div>
                 
            </div>
            <div className="h-full w-1/2 flex flex-col justify-center items-center">
                <HeroImg/>
            </div>
        </div>
    </section>
  )
}
