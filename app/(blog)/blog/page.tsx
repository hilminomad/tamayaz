import { db } from '@/lib/db';
import { getArticles } from "@/actions/get-articles"
import { BlogBanner } from "@/components/blog-banner"
import { Categories } from "./_components/tags";
import { ArticlesList } from '@/components/articles-list';
import { getBannerArticles } from '@/actions/get-banner-articles';

interface SearchPageProps {
  searchParams: {
    title: string;
    tagId: string;
  };
}


const BlogPage = async ({ searchParams }: SearchPageProps) => {

  const tags = await db.tag.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const articles = await getArticles({...searchParams});
  const bannerPreArticles = await getBannerArticles()
  
  const bannerArticles = bannerPreArticles.slice(0,4)
  return (
    <>
      <BlogBanner items={bannerArticles}/>
      <div className='w-full my-8'>
        <div className='w-full px-6 flex justify-center'>
          <Categories items={tags} />
        </div>
        <ArticlesList items={articles}/>
      </div>
      
    </>
  )

}

export default BlogPage;