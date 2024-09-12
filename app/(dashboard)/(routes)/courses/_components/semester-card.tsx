"use Client"

// app/components/CategoryCard.tsx
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { BundlePurchase, Category, Course } from "@prisma/client";
import { FileStackIcon } from "lucide-react";

interface CategoryCardProps {
  category: Category & {courses: Course[], bundlePurchases: BundlePurchase[]}; // Define a proper type based on your category data structure
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const coursesLength = category.courses.length
  console.log(coursesLength)
  return (
    <div
      className={cn(
        "group relative min-h-[240px] overflow-hidden flex flex-col justify-between items-center p-3 rounded-xl bg-slate-300 bg-opacity-80 w-full",
        category.bundlePurchases.length > 0 && "bg-emerald-300 bg-opacity-70"
      )}
    >
      <div className="absolute top-0 z-[-1] h-full w-full group-hover:scale-110 transition">
        <Image fill className="object-cover" alt="background" src="/bluebg.jpg" />
      </div>

      <div className="w-full flex justify-between">
        <div className="flex items-center gap-x-1 text-slate-800 shadow-sm">
          <FileStackIcon />
          <span>
            {coursesLength} {coursesLength === 1 ? 'Chapitre' : 'Chapitres'}
          </span>
        </div>
        {category.bundlePurchases.length > 0 ? (
          <div className="p-2 rounded-xl bg-black">
            <p className="text-slate-200 text-xs">Semestre Acheté</p>
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-black">
            <p className="text-slate-200 text-xs">{formatPrice(category.price || 20)}</p>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-extrabold text-[4rem] group-hover:scale-125 transition">{category.name}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;
