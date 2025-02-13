
import Navbar from "./(dashboard)/_components/navbar";
import Hero from "./_components/hero";
import CoursesGrid from "./_components/courses-grid";

import { MacbookScrollDemo } from "./_components/boxesbg";
import BlogSection from "./_components/blog";

export default async function Home() {
    return(
        < >
            <div className="flex flex-col w-full">
                <Navbar></Navbar>
                <Hero/>

                <div className="p-6 w-full flex justify-center align-center">
                    <CoursesGrid/>
                </div>
                <div className="relative w-full flex justify-center align-center">
                    <MacbookScrollDemo/>
                </div>
                
            </div>
            <BlogSection/>
        </>
    
    )
}