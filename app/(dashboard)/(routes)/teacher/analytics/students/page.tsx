import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DataCard } from "../_components/data-card";
import { getLastActivity } from "@/actions/get-students-last-activty";
import { LastActivities } from "./_components/last-activities";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getStudentAnalytics } from "@/actions/get-students-analytics";
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

const StudentsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const progressData = await getLastActivity()

  if(!progressData)
  {
    return redirect('/');
  }

  const studentData = await getStudentAnalytics()

  


  //console.log(studentData)

  //console.log(sessions)

  return(
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col flex-grow gap-4 md:col-span-2 mb-6">
            <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm h-screen">
              <p className='text-lg font-semibold mb-8'>Etudiants</p>
              {studentData && <DataTable columns={columns} data={studentData} />}    
            </div>              
          </div>
          <div className="p-6 flex flex-col gap-4 rounded-lg border bg-card text-card-foreground shadow-sm ">
            <p className='text-lg font-semibold mb-8'>Dernières activités</p>
            <ScrollArea className='h-[600px]'>
            <div className="flex w-full flex-col gap-4">
              {
                
                progressData.length > 0  && progressData.map((activity, index) => (

                  
                  <div key={index}>
                    <LastActivities
                    chapter={activity.chapter}
                    course={activity.course}
                    time={activity.time}
                    name={activity.studentFirstName+' '+activity.studentLastName}
                    category={activity.category || ''}           
                    />
                  </div>
                ))
              }
              {
                progressData === null && <p>Aucune Activité disponnible</p>
              }
            </div>
            </ScrollArea>
            
          </div>          
      </div>      
    </div>
  )
}

export default StudentsPage;