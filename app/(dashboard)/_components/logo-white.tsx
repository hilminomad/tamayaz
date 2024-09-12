import Image from 'next/image';
import Link from 'next/link';

const LogoWhite = () => {
  return <>
    <Link href='/'>
    <div className='flex items-center'>
      <Image height={40} width={40} alt="Tamayaz logo" src="/logoiconwhite.svg" />
      <div className='hidden md:block'>
        <Image height={130} width={130} alt="Tamayaz logo" src="/logotextwhite.svg" />
      </div>
    </div>
    </Link>
   </>
};

export default LogoWhite;
