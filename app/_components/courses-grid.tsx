import { CoursesList } from '@/components/courses-list-guest';
import { getCourses } from '@/actions/get-courses-guest';
import { Button } from '@/components/ui/button';

export default async function CoursesGrid() {
  const courses = await getCourses(); // Assuming getCourses returns an array of courses
  const firstThreeCourses = courses.slice(0, 3);

  return (
    <div className='max-w-7xl py-8 min-h-screen flex flex-col justify-center gap-8 w-full mt-16'>
      <h2 className='text-4xl'>Nos cours et formations</h2>
      <CoursesList items={firstThreeCourses} />
      <div className='w-full flex justify-center mt-16'>
      <Button size='lg'>Voir tous les cours</Button>
      </div>
      
    </div>
  );
}