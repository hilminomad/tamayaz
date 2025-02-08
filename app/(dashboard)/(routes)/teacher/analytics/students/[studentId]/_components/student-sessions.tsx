'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import axios from 'axios';
import { Dot } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StudentSessionsProps {
  userId: string;
}

const StudentSessions = ({ userId }: StudentSessionsProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [studentSessions, setStudentSessions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentSessions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/users/${userId}/sessions`);
        console.log(response)
        setStudentSessions(response.data.sessions);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while fetching sessions.');
        setStudentSessions([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStudentSessions();
    }
  }, [userId]);

  console.log(studentSessions)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Sessions</h2>

      {loading && <p>Loading student sessions...</p>}

      {error && (
        <p className="text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && studentSessions.length > 0 && (
        <ScrollArea className=" w-120 rounded-md ">
          <div className="flex gap-2">
          {studentSessions.map((session) => (
            <div key={session.id} className="gap-2 border bg-card text-card-foreground shadow-sm rounded-md flex w-80 p-2 flex-col mb-2 border-l">
              {/*<p><strong>Device:</strong> {session.deviceType}</p>
              <p><strong>Browser:</strong> {session.browserName}</p>
              <p><strong>Location:</strong> {session.location}</p>*/}
                {
                  session.isOnline ? 
                  <div className='flex items-center bg-green-100 p-1 rounded text-green-700 text-bold'><Dot/> Connecté</div> 
                  : <div className='flex items-center bg-red-100 p-1 rounded text-red-700 text-bold'><Dot/> Hors ligne</div>
                }
                <div className="flex flex-col gap-1">
                <p className='text-sm'><strong>Dernière connection:</strong> {new Date(session.lastActiveAt).toLocaleString('fr-FR', { hour12: false })}</p>
                <p className='text-sm'><strong>Session créee le:</strong> {new Date(session.createdAt).toLocaleString('fr-FR', { hour12: false })}</p>
                </div>
            </div>
          ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        
      )}

      {!loading && !error && studentSessions.length === 0 && (
        <p>No sessions found for this student.</p>
      )}
    </div>
  );
};

export default StudentSessions;
