import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { educationApi } from '../services/api';
import type { EducationModule } from '../types';
import Card from '../components/Card';
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

type ModuleContent = {
  sections?: { heading?: string; body?: string }[];
};

export default function EducationModule() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const [mod, setMod] = useState<EducationModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const load = useCallback(async () => {
    if (!moduleId) return;
    setLoading(true);
    setError(null);
    const { data, error: e } = await educationApi.getModule(moduleId);
    if (e) setError(e);
    else setMod(data);
    const prog = await educationApi.getMyProgress();
    if (!prog.error && prog.data) {
      const row = prog.data.find((p) => p.module_id === moduleId);
      setCompleted(row?.completed ?? false);
    }
    setLoading(false);
  }, [moduleId]);

  useEffect(() => {
    load();
  }, [load]);

  const content = mod?.content as ModuleContent | undefined;
  const sections = content?.sections ?? [];

  const markComplete = async () => {
    if (!moduleId) return;
    setSaving(true);
    const { error: e } = await educationApi.upsertProgress(moduleId, {
      completed: true,
      progress_percentage: 100,
    });
    if (e) setError(e);
    else setCompleted(true);
    setSaving(false);
  };

  const markProgress = async (pct: number) => {
    if (!moduleId) return;
    setSaving(true);
    const { error: e } = await educationApi.upsertProgress(moduleId, {
      completed: pct >= 100,
      progress_percentage: pct,
    });
    if (e) setError(e);
    else if (pct >= 100) setCompleted(true);
    setSaving(false);
  };

  if (loading || !moduleId) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error && !mod) {
    return (
      <div className="max-w-3xl space-y-4">
        <p className="text-sm text-danger-700">{error}</p>
        <Link to="/education" className="text-sm text-primary-600 font-medium">
          Volver
        </Link>
      </div>
    );
  }

  if (!mod) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        to="/education"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al centro
      </Link>

      <Card title={mod.title} subtitle={mod.description ?? mod.category}>
        {error && (
          <p className="text-sm text-danger-600 mb-4">{error}</p>
        )}

        <div className="prose prose-sm prose-surface max-w-none dark:prose-invert">
          {sections.length === 0 ? (
            <p className="text-sm text-surface-500">Contenido no disponible.</p>
          ) : (
            sections.map((sec, i) => (
              <div key={i} className="mb-6">
                {sec.heading && (
                  <h3 className="text-base font-semibold text-surface-900 mb-2">{sec.heading}</h3>
                )}
                {sec.body && (
                  <div className="text-surface-700 text-sm leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{sec.body}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {!completed ? (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={() => markProgress(50)}
                className="px-4 py-2 rounded-lg border border-surface-300 text-sm font-medium text-surface-800 hover:bg-surface-50 disabled:opacity-50 cursor-pointer"
              >
                Marcar 50% visto
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={markComplete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Marcar completado
              </button>
            </>
          ) : (
            <p className="text-sm font-medium text-success-700 inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Módulo completado
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
