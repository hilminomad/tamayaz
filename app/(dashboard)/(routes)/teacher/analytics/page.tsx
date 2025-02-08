import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { clerkClient } from '@clerk/nextjs/server'; 
import { DataCard } from './_components/data-card';
import { Chart } from './_components/chart';
import { getAnalytics } from '@/actions/get-analytics';
import { SemesterCard } from './_components/semester-card';
import { db } from '@/lib/db';
import { FormationCard } from './_components/formation-card';
import { ScrollArea } from '@/components/ui/scroll-area';

const AnalyticsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }


    const students = await clerkClient.users.getUserList({
      limit: 500,
    });
    const studentsCount = students.length;
 
  

  
  
  const categories = await db.category.findMany({
    include: {
      courses: true,
      bundlePurchases: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const formations = await db.course.findMany({
    where:{
      isCourse: false,
      isPublished: true,
    },
    include: {
      purchases: true,
      chapters: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          label="Revenue Total"
          value={totalRevenue}
          shouldFormat={true}
        />
        <DataCard label="Cours Vendues" value={totalSales} />
        <DataCard label="Nombre des Etudiants" value={studentsCount|0} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-6 rounded-md border">
          <p className='text-lg font-semibold'>Niveaux</p>
          <ScrollArea className='h-[460px]'>
          {categories.length > 0 && (
            <div>
              {categories.map((category) => (
                <SemesterCard key={category.id} category={category} />
              ))}
            </div>
          )}
          </ScrollArea>
          
        </div>
        <div className="p-6 rounded-md border">
          <p className='text-lg font-semibold'>Formations</p>
          <ScrollArea className='h-[440px]'>
            {formations.length > 0 && (
              <div>
                {formations.map((formation) => (
                  <FormationCard key={formation.id} course={formation} />
                ))}
              </div>
            )}
          </ScrollArea>
          
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;