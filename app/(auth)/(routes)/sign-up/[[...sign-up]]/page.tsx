import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
  return(
    <div className='w-full h-full min-h-screen flex items-center'>
      <div className='relative p-6 hidden md:flex md:w-1/2 w-full min-h-screen h-full'>
      <Image fill className="absolute t-0 b-0 z-[-1] w-full h-full object-cover" alt="sign up banner" src="/signupbanner.png" />
      </div>
      <div className='p-6 md:w-1/2 w-full h-full flex justify-center items-center'>
        <SignUp />
      </div>
      
    </div>
  ) ;
}
