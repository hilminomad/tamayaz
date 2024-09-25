import { Button } from "@/components/ui/button";
import { db } from "@/lib/db"; // Import your prisma instance
import { auth } from "@clerk/nextjs";
import { Book, Check, CopyCheck, Save } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation"; 

import { formatPrice } from '@/lib/format';
import { SemesterCourse } from "./_components/semester-course";
import ChaptersForm from "../../../teacher/courses/[courseId]/_components/chapters-form";

export default async function SemesterIdPage({ params }: { params: { semesterId: string } }) {
  const { semesterId } = params;

  const {userId} = auth()

  if (!userId) {
    return redirect('/');
  }

  if (!semesterId) {
    return redirect('/');
  }

  const category = await db.category.findUnique({
    where: {
      id: semesterId, // Ensure this value is properly passed
    },
    include: {
      courses: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        include: {
          chapters : {
            orderBy : {
              position : 'asc'
            }
          }
        }
      },
      bundlePurchases: {
        where: { userId: userId },
      },
    },
  });



  

  if (!category) {
    return redirect('/'); // Redirect if no category is found
  }

  const purchase = await db.bundlePurchase.findUnique({
    where: {
      userId_categoryId: {
        userId: userId,
        categoryId: category.id,
      },
    },
  });

  // Return your page content with the `category` data
  return (
    <div>
      <div className="p-6 flex flex-col bg-slate-50">
      <div className='w-full max-w-7xl my-10 flex flex-col gap-4 md:flex-row items-center justify-between'>
        <div>
          <h1 className="font-bold text-[4rem] mb-4">{category.name}</h1>
          <div className='flex gap-1 text-slate-600'>
            <Book/>
            <p className='text-xl text-blue font-semibold'>
            {category.courses.length}
            {category.courses.length === 1 ? ' Module' : ' Modules'} 
            </p>
              
            </div>
        </div>
        {!purchase ? 
          <Link href='/'>
            <Button variant='default' size='lg'>
              Acheter le semestre : {formatPrice(category.price || 20)}
            </Button>
          </Link>
          :
          <div className='p-4 flex gap-1 bg-black text-white rounded-2xl'>
            <p>Semestre Acheté</p>
            <Check/>
          </div> 
          
        }
      </div>
      
    </div>
    <div className="p-6 my-8 flex w-full max-w-7xl flex-col items-center">
      {
        category.courses.length > 0 && category.courses.map((course) => (
          <Link className="w-full" href={`/courses/${course.id}`} key={course.id}>
            <SemesterCourse course={course}/>
          </Link>
        ))
      }
    </div>
    </div>
  );
}