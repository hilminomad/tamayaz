
interface LastActivitiesInterface{
  name: String;
  chapter: String;
  course: String;
  category: String;
  time : Date;
} 

export const LastActivities = ({
  name,
  chapter,
  course,
  category,
  time
} : LastActivitiesInterface ) => {



  // Create a new Date object from the ISO string
const date = new Date(time);

// Extract the day, month, year, and time components
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const year = date.getFullYear();
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');

// Format the date and time as desired
const formattedDate = `${day} ${month} ${year} ${hours}:${minutes}`;


  return(
    <div className="flex w-full border-b flex-col gap-1">
      <div className="w-full flex justify-end">
        <p className="text-xs text-slate-500">{formattedDate}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <p className="font-semibold text-sm">{name}</p>
        <p className="text-sm">a terminé</p>
        <p className="text-sm font-semibold text-sky-700">{chapter}</p>
      </div>
      <div className=" w-full flex gap-2">
        <p className="text-xs text-slate-700">{course} {category}</p>
       </div>
    </div>   
  )
}