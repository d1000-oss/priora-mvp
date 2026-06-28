import { type ReactNode } from 'react';

type BadgeVariant = 'green' | 'yellow' | 'orange' | 'red' | 'gray' | 'purple' | 'blue';

interface StatusBadgeProps {
  children: ReactNode;
  variant: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  green: 'bg-success-50 text-success-700 border-success-200',
  yellow: 'bg-warning-50 text-warning-700 border-warning-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  red: 'bg-danger-50 text-danger-700 border-danger-200',
  gray: 'bg-gray-50 text-gray-600 border-gray-200',
  purple: 'bg-priora-50 text-priora-700 border-priora-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
};

export function StatusBadge({ children, variant }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}

export function getStatusVariant(status: string): BadgeVariant {
  const lower = status.toLowerCase();
  if (lower.includes('liberado') || lower.includes('sem pendência') || lower.includes('dentro do prazo') || lower.includes('recebido') || lower.includes('apto') || lower.includes('evidência forte'))
    return 'green';
  if (lower.includes('aguardando cliente') || lower.includes('próximo do vencimento') || lower.includes('aguardando validação') || lower.includes('aguardando minuta') || lower.includes('pendência'))
    return 'yellow';
  if (lower.includes('aguardando agente') || lower.includes('courier atrasado') || lower.includes('sem atualização') || lower.includes('aguardando telex') || lower.includes('atenção'))
    return 'orange';
  if (lower.includes('crítico') || lower.includes('demurrage') || lower.includes('responsabilidade') || lower.includes('decisão') || lower.includes('conflitante'))
    return 'red';
  return 'gray';
}
