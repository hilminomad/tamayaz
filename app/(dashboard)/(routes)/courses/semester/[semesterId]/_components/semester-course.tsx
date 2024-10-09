'use client'
import { Chapter, Course } from "@prisma/client";
import { BookOpen } from "lucide-react";

interface SemesterCourseProps{
  course : Course & {chapters: Chapter[]};
}

export const SemesterCourse = ({course} : SemesterCourseProps) => {
  return(
    <>
      <div className="group relative overflow-hidden w-full flex flex-col md:flex-row gap-2 justify-between items-center px-2 py-4 transition-all hover:bg-gradient-to-t from-blue-200 via-blue-50   to-white rounded-2xl   border-b-2  hover:shadow-md hover:border-black">
        <h3 className="text-lg font-medium">{course.title}</h3>
        <div>
          <div className="flex gap-1 opacity-0 items-center translate-y-full transition-all group-hover:opacity-100 group-hover:translate-y-0">
            <BookOpen className="h-5 w-5"/>
            <p>{course.chapters.length} {course.chapters.length === 1 ? ' Cours' : ' Cours'}</p>
          </div>

        </div>
      </div>
    </>
  )
}