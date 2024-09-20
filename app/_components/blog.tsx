import { getBannerArticles } from "@/actions/get-banner-articles";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function BlogSection() {

  const bannerPreArticles = await getBannerArticles()
  const items = bannerPreArticles.slice(0,3)

  return(
    <>
      <div className="w-full min-h-screen py-16 p-6 flex flex-col justify-center items-center bg-gradient-to-l from-blue-900 to-black">
        <div className="grid md:grid-cols-2 gap-4 w-full max-w-7xl">
          {/* First column with one element spanning three rows */}
          {items.length > 0 && (
            <div className="md:row-span-3">
              <h2 className="text-white text-5xl mb-4">Blog</h2>
              
              
            </div>
          )}

          {/* Second column with three elements, each in its own row */}
          <div className="grid md:grid-rows-3 gap-4">
            {items.map((item, index) => (
              <Link key={index} href={`/blog/${item.id}`}>
              <div
                className="p-4 hover:border rounded-md shadow-md gap-4 flex justify-between"
              > 
                <div className="w-2/3">
                  <h2 className="text-lg text-white font-bold line-clamp-2">{item.title}</h2>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.texte}</p>
                  {item.tag && (
                    <span className="text-xs text-blue-500">{item.tag.name}</span>
                  )}
                </div>
                <div className='relative mb-8 overflow-hidden w-1/3 rounded-xl aspect-video'>
                  <Image fill className="object-cover" alt={item.title} src={item.imageUrl!} />
                </div>
                
              </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="w-full my-4 flex justify-center">
        <Link href={`/blog/}`}>
                <Button variant='secondary'>
                  Voir plus
                </Button>
                
              </Link>

        </div>
        {items.length === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-10">
            Aucun article trouvé
          </div>
        )}
      </div>
    </>
  )

  
}