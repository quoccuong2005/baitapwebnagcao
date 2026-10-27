'use client';

import { useSession } from 'next-auth/react';
import { Deadline, Subject } from '@/types';
import DeadlineFilter from '@/components/DeadlineFilter';

interface DeadlineFilterWrapperProps {
  initialDeadlines: Deadline[];
  subjects: Subject[];
  preselectedSubjectId?: string;
}

export default function DeadlineFilterWrapper({
  initialDeadlines,
  subjects,
  preselectedSubjectId,
}: DeadlineFilterWrapperProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const isLoggedIn = !!session?.user;

  return (
    <DeadlineFilter
      initialDeadlines={initialDeadlines}
      subjects={subjects}
      currentUserId={currentUserId}
      isLoggedIn={isLoggedIn}
      preselectedSubjectId={preselectedSubjectId}
    />
  );
}
