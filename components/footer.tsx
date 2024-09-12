"use client"
import { Separator } from "@radix-ui/react-separator"
import { Facebook, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
  return(
    <div className="w-full">

    
    <div className="w-full relative z-[100]  ">
      <div className="w-full relative z-100 text-slate-300 text-sm  p-3 bg-slate-900 grid md:grid-cols-4 grid-col-1 gap-4">
        
        <div className="p-3 flex md:text-start text-center  flex-col gap-2">
          <p className="text-white font-medium">Liens utiles</p>
          <Link  href='/courses'>
            <p className="text-slate-200 font-light transition-all hover:text-white">Cours</p>          
          </Link>
          <Link  href='/courses'>
            <p className="text-slate-200 font-light  transition-all hover:text-white">Formation</p>
          </Link>
          <Link  href='/'>
            <p className="text-slate-200 font-light  transition-all hover:text-white">Blog</p>
          </Link>
        </div>
        <div className="p-3 flex md:text-start text-center   flex-col gap-2">
          <p className="text-white font-medium">Liens d'utilsateur</p>
          <Link  href='/sign-up'>
            <p className="text-slate-200 transition-all font-light  hover:text-white">S'inscrire</p>          
          </Link>
          <Link  href='/sign-in'>
            <p className="text-slate-200 transition-all font-light  hover:text-white">Se connecter</p>
          </Link>
          <Link  href='/terms-and-conditions'>
            <p className="text-slate-200 transition-all font-light  hover:text-white">Politique de confidentialité</p>
          </Link>
          <Link  href='/faq'>
            <p className="text-slate-200 transition-all font-light  hover:text-white">Termes et conditions</p>
          </Link>
        </div>
        <div className="p-3 flex md:justify-center items-center gap-4">
          <Link href='/blog'>
            <Facebook/>
          </Link>
          <Link href='/blog'>
            <Instagram/>
          </Link>
          <Link href='/blog'>
            <Linkedin/>
          </Link>
        </div>
        <div className="p-3 h-full w-full flex gap-2 items-center justify-center">
          <Link href='/'>
            <Image height={50} width={120} alt='Tamayaz logo' src='/logotextwhite.svg' />
          </Link>
          <div className="bg-white w-[1px] h-8"/>
          <Link href='/'>
            <Image height={50} width={80} alt='Index logo' src='/logoindex.png' />
          </Link>
          
        </div>
      </div>
      <div className="w-full p-6 flex items-center bg-slate-900 justify-center">
        <Image height={50} width={130} alt='CMI' src='/logocmi.png'/>
      </div>
      <div className="w-full text-slate-300 bg-slate-900 p-6">
        <div className="w-full border-t-2 border-slate-300 ">
          <p className="xs">Tamayaz &copy; 2024</p>
        </div>
      </div>
    </div>
    </div>
  )    
}