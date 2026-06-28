import { Sparkles } from 'lucide-react';
import { type ReactNode } from 'react';

interface ClaraEvidence {
  text: string;
  color?: 'red' | 'orange' | 'yellow' | 'green' | 'gray';
}

interface ClaraCardProps {
  title?: string;
  summary: string;
  evidence?: (string | ClaraEvidence)[];
  recommendation?: string;
  actions?: ReactNode;
  compact?: boolean;
}

const dotColors: Record<string, string> = {
  red: 'bg-danger-500',
  orange: 'bg-orange-500',
  yellow: 'bg-warning-500',
  green: 'bg-success-500',
  gray: 'bg-gray-400',
};

export function ClaraCard({ title, summary, evidence, recommendation, actions, compact }: ClaraCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
      <div className="flex items-start gap-3">
        {/* Clara avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-priora-100 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-priora-600" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold text-text-primary">Clara</span>
            <span className="px-1.5 py-0.5 bg-priora-100 text-priora-700 text-[10px] font-bold rounded">IA</span>
            {title && <span className="text-sm text-text-secondary">— {title}</span>}
          </div>

          {/* Summary */}
          <p className={`text-sm text-text-primary leading-relaxed ${compact ? '' : 'mb-3'}`}>{summary}</p>

          {/* Evidence list */}
          {evidence && evidence.length > 0 && (
            <div className="mt-3 space-y-2">
              {evidence.map((item, i) => {
                const text = typeof item === 'string' ? item : item.text;
                const color = typeof item === 'string' ? 'orange' : (item.color || 'orange');
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${dotColors[color]} flex-shrink-0 mt-1.5`} />
                    <span className="text-sm text-text-secondary">{text}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recommendation */}
          {recommendation && (
            <div className="mt-3 pt-3 border-t border-gray-50">
              <p className="text-sm text-text-primary">
                <span className="font-semibold">Recomendação:</span> {recommendation}
              </p>
            </div>
          )}

          {/* Actions */}
          {actions && <div className="flex items-center gap-2 mt-4">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
