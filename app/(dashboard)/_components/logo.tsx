import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return <>
    <Link href='/'>
    <div className='flex items-center'>
      <Image height={40} width={40} alt="Tamayaz logo" src="/logoicon.svg" />
      <div className='hidden md:block'>
        <Image height={130} width={130} alt="Tamayaz logo" src="/logotext.svg" />
      </div>
    </div>
    </Link>
   </>
};

export default Logo;
