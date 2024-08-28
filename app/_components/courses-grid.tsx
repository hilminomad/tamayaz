import { CoursesList } from '@/components/courses-list-guest';
import { getCourses } from '@/actions/get-courses-guest';
import { Button } from '@/components/ui/button';

export default async function CoursesGrid() {
  const courses = await getCourses(); // Assuming getCourses returns an array of courses

  return (
    <div className='max-w-7xl w-full mt-16'>
      <CoursesList items={courses} />
      <div className='w-full flex justify-center mt-16'>
      <Button size='lg'>Voir tous les cours</Button>
      </div>
      
    </div>
  );
}