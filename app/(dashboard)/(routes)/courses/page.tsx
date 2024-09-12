import { db } from "@/lib/db";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import ToggleCourses from "./_components/toggle-courses"; // Import the new Client Component
import Navbar from "@/app/(dashboard)/_components/navbar";

const ListingPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirectToSignIn();
  }

  // Fetch the categories and formationCourses data
  const categories = await db.category.findMany({
    include: {
      courses: true,
      bundlePurchases: {
        where: {
          userId: userId || undefined,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const formationCourses = await db.course.findMany({
    where: {
      isCourse: false,
    },
    include: {
      category: true,
      chapters: {
        where: {
          isPublished: true,
        },
        select: {
          id: true,
        },
      },
      purchases: {
        where: {
          userId: userId || undefined,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Pass the fetched data to the ToggleCourses component
  return (
    <div className="flex w-full h-full min-h-screen flex-col items-center justify-start">
      <ToggleCourses categories={categories} formationCourses={formationCourses} />
    </div>
  );
};

export default ListingPage;
