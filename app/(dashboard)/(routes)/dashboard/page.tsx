import { redirect } from 'next/navigation';

import { auth, clerkClient, currentUser } from '@clerk/nextjs';
import { CheckCircle, Clock, Monitor } from 'lucide-react';

import { CoursesList } from '@/components/courses-list';
import { InfoCard } from './_components/info-card';

import { getDashboardCourses } from '@/actions/get-dashboard-courses';

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect('/')
  }

  // To do: get sessions and keep only one
 

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    userId
  );


  return (
    <div className="p-6 space-y-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="Continuer les cours"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Modules terminés"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
