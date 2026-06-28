import { AlertTriangle } from 'lucide-react';
import { ExigemAtencao } from './gestao/ExigemAtencao';

export function GestaoExigemAtencaoPage() {
  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-danger-500" />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Exigem Atenção</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Problemas operacionais que exigem acompanhamento imediato.
            </p>
          </div>
        </div>
        <ExigemAtencao />
      </div>
    </div>
  );
}
