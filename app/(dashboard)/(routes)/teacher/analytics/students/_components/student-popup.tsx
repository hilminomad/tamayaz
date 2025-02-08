'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface StudentPopupProps {
  studentId: string;
  onClose: () => void;
}

export const StudentPopup: React.FC<StudentPopupProps> = ({
  studentId,
  onClose,
}) => {
  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/get-student?studentId=${studentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }

        const data = await response.json();
        setStudent(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Détails de l'étudiant</h2>
        {loading ? (
          <p className="mb-4">Chargement...</p>
        ) : error ? (
          <p className="mb-4 text-red-500">{error}</p>
        ) : student ? (
          <div>
            <p className="mb-4">Nom : {student.firstName} {student.lastName}</p>
            <p className="mb-4">Email : {student.emailAddress}</p>
          </div>
        ) : (
          <p className="mb-4">Aucune donnée disponible pour le moment</p>
        )}
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};
