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
    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl">
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
