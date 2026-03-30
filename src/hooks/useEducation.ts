import { useState, useEffect, useCallback } from 'react';
import { educationApi } from '../services/api';
import type { EducationModule, UserEducationProgress } from '../types';
import { useAuth } from '../context/AuthContext';

export function useEducation() {
  const { user } = useAuth();
  const [modules, setModules] = useState<EducationModule[]>([]);
  const [progress, setProgress] = useState<UserEducationProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [modRes, progRes] = await Promise.all([
      educationApi.listModules(),
      educationApi.getMyProgress(),
    ]);
    if (modRes.error) setError(modRes.error);
    else if (progRes.error) setError(progRes.error);
    setModules(modRes.data || []);
    setProgress(progRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) refresh();
    else {
      setModules([]);
      setProgress([]);
      setLoading(false);
    }
  }, [user, refresh]);

  const progressByModuleId = useCallback(
    (moduleId: string) => progress.find((p) => p.module_id === moduleId),
    [progress],
  );

  return { modules, progress, loading, error, refresh, progressByModuleId };
}
