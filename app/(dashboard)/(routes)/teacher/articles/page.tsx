import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

// Components
import { Button } from '@/components/ui/button';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

// Database
import { db } from '@/lib/db';

const ArticlesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const articles = await db.article.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={articles} />
    </div>
  );
};

export default ArticlesPage;
