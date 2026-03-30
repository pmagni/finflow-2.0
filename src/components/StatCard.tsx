import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  iconColor?: string;
  iconBg?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  iconColor = 'text-primary-600',
  iconBg = 'bg-primary-50',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-500 truncate">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-surface-900 tracking-tight">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trend.positive ? (
                <TrendingUp className="w-4 h-4 text-success-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger-600" />
              )}
              <span
                className={`text-xs font-medium ${
                  trend.positive ? 'text-success-600' : 'text-danger-600'
                }`}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${iconBg} shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
