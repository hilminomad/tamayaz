"use client"

// app/components/CategoryGrid.tsx
import Link from "next/link";
import { cn } from "@/lib/utils";
import CategoryCard from "./semester-card";

interface CategoryGridProps {
  categories: Array<any>; // Define a proper type based on your category data structure
}

const CategoryGrid = ({ categories }: CategoryGridProps) => {
  //const courseLength = categories.cou
  return (
    <div className="w-full grid min-h-[2104px] grid-cols-1 md:min-h-[1192px] md:grid-cols-2 xl:min-h-[888px] xl:grid-cols-3 gap-6 max-w-6xl mb-8">
      {categories.length > 0 &&
        categories.map((category) => (
          <Link href={`/courses/semester/${category.id}`} key={category.id}>
            <CategoryCard category={category} />
          </Link>
        ))}
    </div>
  );
};

export default CategoryGrid;
