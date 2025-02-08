import { getStudent } from "@/actions/get-student";
import { time } from "console";
import { ArrowLeft, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import StudentHeader from "./_components/student-header";
import StudentInfo from "./_components/student-info";
import StudentSessions from "./_components/student-sessions";



const studentPage = async ({ params }: { params: { studentId: string } }) => {
  const student = await getStudent(params.studentId);

  if(!student){
    redirect('/')
  }

  const {studentHeader} = student;
  
  return(
    <div className="p-6 gap-8 flex flex-col">
      <Link href='/teacher/analytics/students'
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à étudiants
      </Link>
      
      <div className="w-full">
        <StudentHeader initialData={studentHeader} />
      </div>
      <div className="w-full">         
        <StudentSessions userId={params.studentId}/>
      </div>
    </div>
  )

}

export default studentPage;