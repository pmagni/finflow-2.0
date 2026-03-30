import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { GraduationCap, BookOpen, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { useEducation } from '../hooks/useEducation';
import type { EducationModule } from '../types';

const difficultyLabel: Record<EducationModule['difficulty_level'], string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

const difficultyStyle: Record<EducationModule['difficulty_level'], string> = {
  beginner: 'bg-success-50 text-success-700',
  intermediate: 'bg-warning-50 text-warning-700',
  advanced: 'bg-danger-50 text-danger-700',
};

export default function Education() {
  const { modules, loading, error, progressByModuleId } = useEducation();

  const completed = modules.filter((m) => progressByModuleId(m.id)?.completed).length;

  if (loading) {
    return (
      <div className="flex justify-center py-16 max-w-3xl">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap className="w-7 h-7" />
          <h2 className="text-xl font-bold">Centro de Educación Financiera</h2>
        </div>
        <p className="text-sm text-primary-100 leading-relaxed">
          Módulos breves basados en tu progreso. Los datos vienen de Supabase; marca cada módulo al terminarlo.
        </p>
        <div className="mt-4 flex items-center gap-6">
          <div>
            <p className="text-2xl font-bold tabular-nums">{completed}</p>
            <p className="text-xs text-primary-200">Completados</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{modules.length}</p>
            <p className="text-xs text-primary-200">Disponibles</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-danger-50 border border-danger-200 p-3.5 text-sm text-danger-700">
          {error}
        </div>
      )}

      <Card title="Módulos">
        {modules.length === 0 ? (
          <p className="text-sm text-surface-500">
            No hay módulos activos. Ejecuta las migraciones y el seed en Supabase.
          </p>
        ) : (
          <ul className="space-y-3">
            {modules.map((mod) => {
              const p = progressByModuleId(mod.id);
              const pct = p?.progress_percentage ?? 0;
              const done = p?.completed ?? false;
              return (
                <li key={mod.id}>
                  <Link
                    to={`/education/${mod.id}`}
                    className="flex items-start gap-4 p-4 rounded-lg border border-surface-200 hover:border-primary-300 hover:bg-primary-50/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 shrink-0">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-surface-900">{mod.title}</p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyStyle[mod.difficulty_level]}`}
                        >
                          {difficultyLabel[mod.difficulty_level]}
                        </span>
                        {done && (
                          <span className="text-xs font-medium text-success-700">Completado</span>
                        )}
                      </div>
                      <p className="text-xs text-surface-500 mt-0.5">{mod.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="inline-flex items-center gap-1 text-xs text-surface-400">
                          <Clock className="w-3.5 h-3.5" />
                          {mod.estimated_duration_minutes} min
                        </span>
                        <span className="text-xs text-surface-500">{mod.category}</span>
                      </div>
                      {!done && (
                        <div className="mt-2 h-1.5 rounded-full bg-surface-100 overflow-hidden max-w-xs">
                          <div
                            className="h-full rounded-full bg-primary-500 transition-all"
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-surface-400 group-hover:text-primary-600 shrink-0 mt-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
