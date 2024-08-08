import { CoursesList } from '@/components/courses-list-guest';
import { getCourses } from '@/actions/get-courses-guest';

export default async function CoursesGrid() {
  const courses = await getCourses(); // Assuming getCourses returns an array of courses

  return (
    <div>
      <CoursesList items={courses} />
    </div>
  );
}