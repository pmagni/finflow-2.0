import type { ReactNode } from 'react';

interface CardProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({
  children,
  title,
  subtitle,
  action,
  className = '',
  padding = true,
}: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-surface-200 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-surface-900">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-sm text-surface-500">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={padding ? 'p-5' : ''}>{children}</div>
    </div>
  );
}
