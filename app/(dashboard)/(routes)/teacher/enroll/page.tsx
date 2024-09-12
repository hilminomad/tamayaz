import { IconBadge } from '@/components/icon-badge';
import { BookPlusIcon, LayoutDashboard, ListPlusIcon } from 'lucide-react';
import EnrollForm from './_components/bundle-enroll-form';
import { db } from '@/lib/db';
import { clerkClient } from '@clerk/nextjs/server'; 
import { redirect } from 'next/navigation';
import FormationEnrollForm from './_components/formation-enroll-form';

const EnrollPage = async () => {

  const students = await clerkClient.users.getUserList();

  const categories = await db.category.findMany();
  const courses = await db.course.findMany(
    {
      where: {
        isCourse: false,
        isPublished: true,
      }
    }
  )
  
  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Inscrire les étudiants</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListPlusIcon} />
              <h2 className="text-xl">Inscrire étudiant à semestre</h2>
            </div>
            <EnrollForm
              options={categories.map((category) => ({
                label: category.name || '',  // Handle null case if necessary
                value: category.id,
              }))}
              students={students.map((student) => ({
                label: `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim(),
                value: student.id,
              }))}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={BookPlusIcon} />
              <h2 className="text-xl">Inscrire étudiant à formation</h2>
            </div>
            <FormationEnrollForm
              options={courses.map((course) => ({
                label: course.title || '',  // Handle null case if necessary
                value: course.id,
              }))}
              students={students.map((student) => ({
                label: `${student.firstName ?? ''} ${student.lastName ?? ''}`.trim(),
                value: student.id,
              }))}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default EnrollPage;
