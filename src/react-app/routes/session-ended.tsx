import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleSessionEnded } from '@/shared/auth/session-ended';

export function SessionEndedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(handleSessionEnded(), { replace: true });
  }, [navigate]);

  return null;
}
