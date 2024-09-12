import { getArticle } from '@/actions/get-article'
import { Preview } from '@/components/preview'
import {db} from '@/lib/db'
import { Clock } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'

const ArticleIdPage =async ({ params } : {params: {articleId:string}}) => {
  const article  = await getArticle({articleId: params.articleId})

  if(!article) {
    redirect('/');
    return null;
  }

  const readingTime = Math.ceil(Number(article.description!.length / 1025));
  const formattedTime = article.createdAt.toLocaleDateString('fr-FR', { year: '2-digit', month: 'long', day: 'numeric' })

  return(
    <>
      <div className="w-full flex flex-col  items-center">
        <div className='w-full first-letter: flex flex-col  items-center bg-gradient-to-l from-blue-900 to-black' >
          <div className='mt-16  max-w-5xl gap-6 px-3 w-full flex flex-col'>
            <div className="w-full flex">
              <p className='rounded-xl border-2 font-medium bordred-white p-2  text-white'>{article.tag!.name}</p>
            </div>
            <h2 className='md:text-[4rem] font-semibold text-white text-[1.7rem]'>{article.title}</h2>
            <p className='text-slate-400 text-lg'>{article.texte}</p>
            <div className='flex w-full justify-between'>
              <div className='flex gap-2 items-center'>
                < Clock className='h-4 w-4 text-slate-500'/>
                <p className='text-s text-slate-500'>  Temps de lecture : {readingTime} minutes</p>
              </div>
              <p className='text-s text-slate-500'>{formattedTime}</p>
            </div>
            
            
            <div className='relative mb-8 overflow-hidden w-full rounded-xl aspect-video'>
              <Image fill className="object-cover" alt={article.title} src={article.imageUrl!} />
            </div>
          </div>
        </div>
        
        
        <div className='my-16 max-w-5xl w-full flex flex-col'>
          
          <Preview value={article.description!}/> 
        </div>
      </div>
      
      
    </>
  )
}

export default ArticleIdPage;