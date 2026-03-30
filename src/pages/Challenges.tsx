import { useEffect, useMemo } from 'react';
import Card from '../components/Card';
import { useGamification } from '../hooks/useGamification';
import { useDebts } from '../hooks/useDebts';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import {
  Trophy,
  Flame,
  Target,
  Zap,
  Clock,
  Lock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const difficultyColor: Record<string, string> = {
  Principiante: 'bg-success-50 text-success-700',
  Intermedio: 'bg-warning-50 text-warning-700',
  Avanzado: 'bg-danger-50 text-danger-700',
};

type ChallengeDef = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  difficulty: string;
  points: number;
  locked: boolean;
  done: boolean;
};

export default function Challenges() {
  const {
    pointsTotal,
    activityStreak,
    achievements,
    events,
    loading,
    error,
    fetchGamificationData,
  } = useGamification();
  const { debts } = useDebts();
  const { goals } = useSavingsGoals();

  useEffect(() => {
    fetchGamificationData();
  }, [fetchGamificationData]);

  const totalSaved = useMemo(
    () => goals.reduce((s, g) => s + (g.current_amount || 0), 0),
    [goals],
  );
  const budgetSaveCount = useMemo(
    () => events.filter((e) => e.event_type === 'budget_saved').length,
    [events],
  );
  const debtPaidOff = useMemo(
    () => events.some((e) => e.event_type === 'debt_paid_off'),
    [events],
  );
  const hasRecordedDebt = debts.length > 0;

  const challenges: ChallengeDef[] = useMemo(
    () => [
      {
        id: 'impulse',
        title: 'Reto de 30 días sin gastos innecesarios',
        description: 'Evita compras impulsivas durante un mes completo (seguimiento manual por ahora).',
        icon: Flame,
        difficulty: 'Intermedio',
        points: 500,
        locked: totalSaved < 100,
        done: activityStreak >= 30,
      },
      {
        id: 'save1000',
        title: 'Ahorra tu primer $1,000',
        description: 'Alcanza $1,000 acumulados en tus metas de ahorro.',
        icon: Target,
        difficulty: 'Principiante',
        points: 300,
        locked: goals.length === 0,
        done: totalSaved >= 1000,
      },
      {
        id: 'payDebt',
        title: 'Paga una deuda completa',
        description: 'Marca una deuda como pagada (elimínala cuando el balance sea $0).',
        icon: Zap,
        difficulty: 'Avanzado',
        points: 1000,
        locked: !hasRecordedDebt,
        done: debtPaidOff,
      },
      {
        id: 'budget3',
        title: 'Presupuesto consistente',
        description: 'Guarda tu presupuesto al menos 3 veces (cada guardado cuenta).',
        icon: Clock,
        difficulty: 'Intermedio',
        points: 750,
        locked: budgetSaveCount === 0,
        done: budgetSaveCount >= 3,
      },
    ],
    [
      activityStreak,
      totalSaved,
      goals.length,
      debtPaidOff,
      hasRecordedDebt,
      budgetSaveCount,
    ],
  );

  const completedChallenges = challenges.filter((c) => c.done).length;

  if (loading && events.length === 0 && achievements.length === 0) {
    return (
      <div className="flex justify-center py-16 max-w-3xl">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {error && (
        <div className="rounded-lg bg-danger-50 border border-danger-200 p-3.5 text-sm text-danger-700">
          {error}
        </div>
      )}

      <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-7 h-7" />
          <h2 className="text-xl font-bold">Retos Financieros</h2>
        </div>
        <p className="text-sm text-accent-100 leading-relaxed">
          Completa retos para ganar puntos y mejorar tu salud financiera. Los puntos se registran cuando usas la app
          (presupuesto, deudas, ahorros).
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-2xl font-bold tabular-nums">{completedChallenges}</p>
            <p className="text-xs text-accent-200">Retos completados</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{achievements.length}</p>
            <p className="text-xs text-accent-200">Logros en perfil</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{pointsTotal}</p>
            <p className="text-xs text-accent-200">Puntos (eventos)</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{activityStreak || '—'}</p>
            <p className="text-xs text-accent-200">Racha (días con actividad)</p>
          </div>
        </div>
      </div>

      <Card title="Retos disponibles">
        <div className="space-y-3">
          {challenges.map((challenge) => {
            const Icon = challenge.icon;
            const inactive = challenge.locked && !challenge.done;
            return (
              <div
                key={challenge.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  inactive ? 'border-surface-200 bg-surface-50 opacity-70' : 'border-surface-200 hover:border-surface-300'
                }`}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-50 shrink-0">
                  {challenge.done ? (
                    <CheckCircle2 className="w-5 h-5 text-success-600" />
                  ) : inactive ? (
                    <Lock className="w-5 h-5 text-surface-400" />
                  ) : (
                    <Icon className="w-5 h-5 text-accent-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-sm font-semibold text-surface-900">{challenge.title}</p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                        difficultyColor[challenge.difficulty] ?? 'bg-surface-100 text-surface-700'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    {challenge.done && (
                      <span className="text-xs font-medium text-success-700">Completado</span>
                    )}
                  </div>
                  <p className="text-xs text-surface-500">{challenge.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-accent-600 tabular-nums">{challenge.points}</p>
                  <p className="text-xs text-surface-500">pts guía</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
