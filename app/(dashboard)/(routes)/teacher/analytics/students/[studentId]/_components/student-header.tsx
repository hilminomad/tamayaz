'use client'

import { Calendar } from "lucide-react"
import Image from "next/image"

interface studentHeaderProps {
  initialData : {
    name : string,
    email : string,
    imageUrl : string,
    startDate : number,
    levels : [],
    Progress: number
  }
}

const StudentHeader = ({initialData} : studentHeaderProps ) => {

      // Create a new Date object from the ISO string
const date = new Date(initialData.startDate);

// Extract the day, month, year, and time components
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const year = date.getFullYear();
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');

// Format the date and time as desired
const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;
  return(
    <div className="lex flex-col gap-4 ">
        <div className="flex gap-4">
          <div >
            <Image
              src={initialData.imageUrl || "/logoicon.svg"} 
              height={60}
              width={60}
              alt="student image"
              className="rounded-full p-1"
            />        
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl capitalize">{initialData.name}</h2>
            <p className="text-sm text-slate-500">{initialData.email}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 text-sm items-center text-slate-500">
            <Calendar className="h-3 w-3 "/>
            <p className="">Inscrit(e) le {formattedDate}</p>
          </div>
          {initialData.levels.length > 0 ? (
            <div className="flex gap-2 text-sm items-center text-slate-700 " >
              {initialData.levels.map((level: string, index: number) => (
              <div key={index}>
                <p className="px-2 rounded-sm bg-sky-100">{level}</p>
              </div>
              ))}
            </div>
            ) : (
            <p className="px-2 rounded-sm bg-sky-100">Aucune inscription à Nivaux</p>
          )}
        </div> 
      </div>
  )
}

export default StudentHeader