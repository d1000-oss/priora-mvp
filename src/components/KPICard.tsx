import { type ReactNode } from 'react';

type KPIVariant = 'danger' | 'warning' | 'success' | 'info' | 'purple';

interface KPICardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  sublabelColor?: string;
  icon: ReactNode;
  variant?: KPIVariant;
}

const variantBg: Record<KPIVariant, string> = {
  danger: 'bg-danger-50',
  warning: 'bg-warning-50',
  success: 'bg-success-50',
  info: 'bg-blue-50',
  purple: 'bg-priora-50',
};

export function KPICard({ label, value, sublabel, sublabelColor, icon, variant = 'info' }: KPICardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full ${variantBg[variant]} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary leading-none">{value}</p>
        <p className="text-xs text-text-secondary font-medium mt-1">{label}</p>
        {sublabel && (
          <p className={`text-xs mt-0.5 font-medium ${sublabelColor || 'text-text-tertiary'}`}>
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
