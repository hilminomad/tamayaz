import { Badge } from "@/components/ui/badge"
import { BundlePurchase, Category, Chapter, Course, Purchase } from "@prisma/client"
import { User } from "lucide-react"

interface SemesterCardProps {
  course: Course & {
    chapters: Chapter[], 
    purchases: Purchase[]
  }
}

export const FormationCard = ({ course }: SemesterCardProps) => {
  return (
    <div className="flex w-full justify-between py-2 items-center">
      <h3 className="text-3xl font-bold text-sky-700" >{course.title}</h3>
      <div className="flex gap-2 items-center">
      <Badge>
        <div className="flex gap-1">
          <User className="h-4 w-4"/>
          {course.purchases.length}
        </div>
      </Badge>
      <Badge>
        <div className="flex gap-1">
          <p>Cours :</p>
          {course.chapters.length}
        </div>
      </Badge>
      </div>
    </div>
  )
}