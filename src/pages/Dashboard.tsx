import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  PiggyBank,
  Wallet,
  Heart,
  ArrowRight,
  Sparkles,
  TrendingDown,
  Trophy,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDebts } from '../hooks/useDebts';
import { useSavingsGoals } from '../hooks/useSavingsGoals';
import { useGamification } from '../hooks/useGamification';
import { formatCurrency } from '../utils/formatters';
import StatCard from '../components/StatCard';
import Card from '../components/Card';

export default function Dashboard() {
  const { user } = useAuth();
  const { debts } = useDebts();
  const { goals } = useSavingsGoals();
  const { score, pointsTotal, activityStreak, fetchGamificationData } = useGamification();

  useEffect(() => {
    fetchGamificationData();
  }, [fetchGamificationData]);

  const stats = useMemo(() => {
    const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
    const totalSaved = goals.reduce((sum, g) => sum + (g.current_amount || 0), 0);
    const totalSavingsTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);
    return { totalDebt, totalSaved, totalSavingsTarget, debtCount: debts.length, goalCount: goals.length };
  }, [debts, goals]);

  const firstName = user?.email?.split('@')[0] ?? 'Usuario';

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-surface-900">
          Hola, {firstName}
        </h2>
        <p className="mt-1 text-sm text-surface-500">
          Aquí tienes un resumen de tu salud financiera.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Deuda Total"
          value={formatCurrency(stats.totalDebt)}
          icon={CreditCard}
          iconColor="text-danger-600"
          iconBg="bg-danger-50"
        />
        <StatCard
          label="Deudas Activas"
          value={String(stats.debtCount)}
          icon={TrendingDown}
          iconColor="text-accent-600"
          iconBg="bg-accent-50"
        />
        <StatCard
          label="Total Ahorrado"
          value={formatCurrency(stats.totalSaved)}
          icon={PiggyBank}
          iconColor="text-success-600"
          iconBg="bg-success-50"
        />
        <StatCard
          label="Salud Financiera"
          value={score?.score != null ? `${score.score}/100` : '--'}
          icon={Heart}
          iconColor="text-primary-600"
          iconBg="bg-primary-50"
        />
        <StatCard
          label="Puntos gamificación"
          value={String(pointsTotal)}
          icon={Trophy}
          iconColor="text-accent-600"
          iconBg="bg-accent-50"
        />
        <StatCard
          label="Racha (días)"
          value={activityStreak > 0 ? String(activityStreak) : '—'}
          icon={Sparkles}
          iconColor="text-warning-600"
          iconBg="bg-warning-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Debts summary */}
        <Card
          title="Mis Deudas"
          subtitle={`${stats.debtCount} deudas activas`}
          action={
            <Link to="/debts" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer transition-colors">
              Ver todo <ArrowRight className="w-4 h-4" />
            </Link>
          }
        >
          {debts.length === 0 ? (
            <p className="text-sm text-surface-500">No tienes deudas registradas.</p>
          ) : (
            <ul className="space-y-3">
              {debts.slice(0, 4).map((debt) => (
                <li key={debt.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-danger-400 shrink-0" />
                    <span className="text-sm font-medium text-surface-800 truncate">{debt.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-surface-900 tabular-nums shrink-0 ml-3">
                    {formatCurrency(debt.balance)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Savings Goals */}
        <Card
          title="Metas de Ahorro"
          subtitle={`${stats.goalCount} metas activas`}
          action={
            <Link to="/savings" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer transition-colors">
              Ver todo <ArrowRight className="w-4 h-4" />
            </Link>
          }
        >
          {goals.length === 0 ? (
            <p className="text-sm text-surface-500">No tienes metas de ahorro.</p>
          ) : (
            <ul className="space-y-4">
              {goals.slice(0, 3).map((goal) => {
                const pct = goal.target_amount > 0
                  ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
                  : 0;
                return (
                  <li key={goal.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-surface-800 truncate">{goal.name}</span>
                      <span className="text-xs font-semibold text-surface-600 tabular-nums shrink-0 ml-2">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-success-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-surface-500 tabular-nums">
                      {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Quick actions */}
        <Card title="Acciones Rápidas">
          <div className="space-y-3">
            <Link
              to="/debts"
              className="flex items-center gap-3 p-3 rounded-lg border border-surface-200 hover:bg-surface-50 hover:border-surface-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-danger-50 group-hover:bg-danger-100 transition-colors">
                <CreditCard className="w-4.5 h-4.5 text-danger-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800">Agregar deuda</p>
                <p className="text-xs text-surface-500">Registra una nueva deuda</p>
              </div>
              <ArrowRight className="w-4 h-4 text-surface-400" />
            </Link>

            <Link
              to="/budget"
              className="flex items-center gap-3 p-3 rounded-lg border border-surface-200 hover:bg-surface-50 hover:border-surface-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent-50 group-hover:bg-accent-100 transition-colors">
                <Wallet className="w-4.5 h-4.5 text-accent-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800">Configurar presupuesto</p>
                <p className="text-xs text-surface-500">Define tu presupuesto mensual</p>
              </div>
              <ArrowRight className="w-4 h-4 text-surface-400" />
            </Link>

            <Link
              to="/chat"
              className="flex items-center gap-3 p-3 rounded-lg border border-surface-200 hover:bg-surface-50 hover:border-surface-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 group-hover:bg-primary-100 transition-colors">
                <Sparkles className="w-4.5 h-4.5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800">Consultar asistente IA</p>
                <p className="text-xs text-surface-500">Obtén consejos personalizados</p>
              </div>
              <ArrowRight className="w-4 h-4 text-surface-400" />
            </Link>

            <Link
              to="/savings"
              className="flex items-center gap-3 p-3 rounded-lg border border-surface-200 hover:bg-surface-50 hover:border-surface-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-success-50 group-hover:bg-success-100 transition-colors">
                <PiggyBank className="w-4.5 h-4.5 text-success-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800">Nueva meta de ahorro</p>
                <p className="text-xs text-surface-500">Crea un objetivo financiero</p>
              </div>
              <ArrowRight className="w-4 h-4 text-surface-400" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
