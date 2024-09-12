import { CoursesList } from '@/components/courses-list-guest';
import { getCourses } from '@/actions/get-courses-guest';
import { Button } from '@/components/ui/button';

export default async function CoursesGrid() {
  const courses = await getCourses(); // Assuming getCourses returns an array of courses

  return (
    <div className='max-w-7xl min-h-screen flex flex-col justify-center gap-8 w-full mt-16'>
      <h2 className='text-4xl'>Nos cours et formations</h2>
      <CoursesList items={courses} />
      <div className='w-full flex justify-center mt-16'>
      <Button size='lg'>Voir tous les cours</Button>
      </div>
      
    </div>
  );
}