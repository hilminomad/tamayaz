'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';
import StudentSessions from './student-sessions';

interface StudentInfoProps {
  userId: string;
}

const StudentInfo = ({ userId }: StudentInfoProps) => {
  

  return (
    <div className="p-6 rounded-lg flex flex-col gap-4 border bg-card text-card-foreground shadow-sm">
      <h2 className="text-xl font-bold">Student Info</h2>

      
      <StudentSessions userId={userId} />
    </div>
  );
};

export default StudentInfo;
