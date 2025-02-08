import { Badge } from "@/components/ui/badge"
import { BundlePurchase, Category, Course } from "@prisma/client"
import { User } from "lucide-react"

interface SemesterCardProps {
  category: Category & {
    courses: Course[], 
    bundlePurchases: BundlePurchase[]
  }
}

export const SemesterCard = ({ category }: SemesterCardProps) => {
  return (
    <div className="flex w-full justify-between py-2 items-center">
      <h3 className="text-3xl font-bold text-sky-700" >{category.name}</h3>
      <div className="flex gap-2 items-center">
      <Badge>
        <div className="flex gap-1">
          <User className="h-4 w-4"/>
          {category.bundlePurchases.length}
        </div>
      </Badge>
      <Badge>
        <div className="flex gap-1">
          <p>Modules :</p>
          {category.bundlePurchases.length}
        </div>
      </Badge>
      </div>
    </div>
  )
}