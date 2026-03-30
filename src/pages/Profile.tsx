import { useEffect } from 'react';
import { useGamification } from '../hooks/useGamification';
import { useAuth } from '../context/AuthContext';
import type { Achievement } from '../types';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Shield,
  Target,
  CalendarCheck,
  Loader2,
  Award,
  Heart,
  Mail,
  User,
  Building2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const achievementIcons: Record<string, LucideIcon> = {
  'First Debt Paid Off': Trophy,
  'Savings Goal Reached': Target,
  'Consistent Budgeting': CalendarCheck,
  'Emergency Fund Created': Shield,
};

export default function Profile() {
  const { user } = useAuth();
  const { achievements, score, loading, error, fetchGamificationData } = useGamification();

  useEffect(() => {
    fetchGamificationData();
  }, [fetchGamificationData]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-danger-50 border border-danger-200 p-3.5">
        <p className="text-sm text-danger-700">Error: {error}</p>
      </div>
    );
  }

  const healthScore = score?.score ?? null;
  const healthLabel =
    healthScore === null ? '--' :
    healthScore >= 80 ? 'Excelente' :
    healthScore >= 60 ? 'Bueno' :
    healthScore >= 40 ? 'Regular' : 'Necesita atención';

  const healthColor =
    healthScore === null ? 'text-surface-400' :
    healthScore >= 80 ? 'text-success-600' :
    healthScore >= 60 ? 'text-primary-600' :
    healthScore >= 40 ? 'text-warning-600' : 'text-danger-600';

  return (
    <div className="space-y-6 max-w-3xl">
      {/* User info */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-100">
            <User className="w-7 h-7 text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-surface-900">
              {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-surface-400" />
              <p className="text-sm text-surface-500">{user?.email}</p>
            </div>
            <Link
              to="/organizations"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              <Building2 className="w-4 h-4" />
              Organizaciones
            </Link>
          </div>
        </div>
      </Card>

      {/* Financial Health Score */}
      <Card title="Salud Financiera">
        <div className="flex items-center gap-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-surface-50 border border-surface-200">
            <Heart className={`w-8 h-8 ${healthColor}`} />
          </div>
          <div>
            <p className={`text-4xl font-bold tabular-nums ${healthColor}`}>
              {healthScore !== null ? healthScore : '--'}
              <span className="text-lg font-normal text-surface-400">/100</span>
            </p>
            <p className="mt-1 text-sm font-medium text-surface-600">{healthLabel}</p>
            <p className="mt-0.5 text-xs text-surface-500">
              Basado en tu presupuesto, ahorros y deudas.
            </p>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card title="Logros">
        {achievements.length === 0 ? (
          <EmptyState
            icon={Award}
            title="Sin logros aún"
            description="Sigue gestionando tus finanzas para desbloquear logros y recompensas."
          />
        ) : (
          <div className="space-y-3">
            {achievements.map((ach: Achievement) => {
              const Icon = achievementIcons[ach.title] || Award;
              return (
                <div
                  key={ach.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-surface-200"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-50 shrink-0">
                    <Icon className="w-5 h-5 text-accent-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900">{ach.title}</p>
                    <p className="text-xs text-surface-500">{ach.description}</p>
                  </div>
                  <span className="text-xs text-surface-400 shrink-0">
                    {new Date(ach.achieved_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
