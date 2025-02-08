"use client"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export const LinksBar = () => {
  const pathname = usePathname()

  const isInfoPage = pathname === "/teacher/analytics"
  const isStudentPage = pathname === "/teacher/analytics/students"

  return (
    <div className="flex py-1 px-2 transition-all gap-2 rounded-full border  border-black">
      <a 
        href='/teacher/analytics' 
        className={cn(
          "px-3 py-2 rounded-full transition-colors",
          "hover:bg-slate-200 text-slate-600",
          isInfoPage ? "bg-sky-50 text-blue-950 font-medium" : "hover:text-slate-900"
        )}
      >
        Informations
      </a>
      <a 
        href='/teacher/analytics/students' 
        className={cn(
          "px-3 py-2 rounded-full transition-colors",
          "hover:bg-slate-200 text-slate-600",
          isStudentPage ? "bg-sky-100 text-blue-950 font-medium" : "hover:text-slate-900"
        )}
      >
        Etudiants
      </a>
    </div>
  )
}