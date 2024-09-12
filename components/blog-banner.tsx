import { Article, Tag } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type ArticleWithTag = Article & {
  tag: Tag | null;
};

interface BlogBannerProps {
  items: ArticleWithTag[];
}

export const BlogBanner = ({ items }: BlogBannerProps) => {
  return (
    <>
      <div className="w-full min-h-screen p-6 flex justify-center items-center bg-gradient-to-l from-blue-900 to-black">
        <div className="grid md:grid-cols-2 gap-4 w-full max-w-7xl">
          {/* First column with one element spanning three rows */}
          {items.length > 0 && (
            <div className="md:row-span-3 p-4 hover:border rounded-md shadow-md">
              <Link href={`/blog/${items[0].id}`}>
                <div className='relative mb-8 overflow-hidden w-full rounded-xl aspect-video'>
                  <Image fill className="object-cover" alt={items[0].title} src={items[0].imageUrl!} />
                </div>
                <h2 className="text-xl text-white font-bold">{items[0].title}</h2>
                <p className="text-sm text-gray-500">{items[0].texte}</p>
                {items[0].tag && (
                  <span className="text-xs text-blue-500">{items[0].tag.name}</span>
                )}
              </Link>
              
            </div>
          )}

          {/* Second column with three elements, each in its own row */}
          <div className="grid md:grid-rows-3 gap-4">
            {items.slice(1).map((item, index) => (
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

        {items.length === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-10">
            Aucun article trouvé
          </div>
        )}
      </div>
    </>
  );
};
