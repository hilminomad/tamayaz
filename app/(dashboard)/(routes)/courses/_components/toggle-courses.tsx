"use client";

import { Button } from "@/components/ui/button";
import { CoursesList } from "@/components/courses-list-guest";
import CategoryGrid from "@/app/(dashboard)/(routes)/courses/_components/semesters-grid";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Utility to handle conditional classes

interface ToggleCoursesProps {
  categories: any[];
  formationCourses: any[];
}

const ToggleCourses: React.FC<ToggleCoursesProps> = ({ categories, formationCourses }) => {
  const [isFormations, setIsFormations] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // To track animation status

  // Function to handle transitions
  const handleToggle = (showFormations: boolean) => {
    setIsAnimating(true); // Start the animation
    setTimeout(() => {
      setIsFormations(showFormations); // Switch view after animation delay
      setIsAnimating(false); // End animation
    }, 300); // Match this timeout to your CSS transition duration
  };

  return (
    <div className="w-full flex flex-col gap-10 items-center justify-center p-6">
      <div className="flex gap-4 items-center justify-center">
        <Button size="lg" variant={!isFormations ? 'default': 'outline'} onClick={() => handleToggle(false)}>
          Cours
        </Button>
        <Button size="lg" variant={isFormations ? 'default': 'outline'} onClick={() => handleToggle(true)}>
          Formations
        </Button>
      </div>

      <div className="relative w-full max-w-6xl">
        {/* CategoryGrid Transition */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            isFormations || isAnimating ? "opacity-0" : "opacity-100"
          )}
          style={{ visibility: isFormations ? "hidden" : "visible" }}
        >
          <CategoryGrid categories={categories} />
        </div>

        {/* CoursesList Transition */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            !isFormations || isAnimating ? "opacity-0" : "opacity-100"
          )}
          style={{ visibility: !isFormations ? "hidden" : "visible" }}
        >
          <CoursesList items={formationCourses} />
        </div>
      </div>
    </div>
  );
};

export default ToggleCourses;
