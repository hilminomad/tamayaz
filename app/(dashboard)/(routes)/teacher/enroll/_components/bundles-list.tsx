'use client';

import { useState } from 'react';
import axios from 'axios';
import { BundlePurchase, Category } from '@prisma/client';

import { cn } from '@/lib/utils';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

import toast from 'react-hot-toast';

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

interface BundlePurchaseListProps {
  items: (BundlePurchase & {
    category: Category;
  })[];
  users: User[];
}

export const BundlePurchaseList = ({ items, users }: BundlePurchaseListProps) => {
  const [bundles, setBundles] = useState(items);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async (bundleId: string) => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/bundles/${bundleId}`);
      toast.success('Inscription supprimée avec succès');
      setBundles((prevBundles) => prevBundles.filter((b) => b.id !== bundleId));
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : 'Utilisateur inconnu';
  };

  return (
    <div className={cn(
      "mb-6 mt-6 border rounded-md flex  flex-col items-center justify-between"
    )}>
      {bundles.map((bundle) => (
        <div
          key={bundle.id}
          className={cn(
            "w-full py-1 px-4 flex items-center justify-between border hover:bg-sky-100 cursor-pointer transition-all"
          )}
        >
          <div>
            <span className="font-semibold">
              {getUserName(bundle.userId)}
            </span>
            <span className="ml-2 text-sm text-slate-700">
              ({bundle.category.name})
            </span>
          </div>
          <Button
            onClick={() => handleDelete(bundle.id)}
            disabled={isDeleting}
            variant="destructive"
            size="sm"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};