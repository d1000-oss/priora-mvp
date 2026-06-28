import { FileText } from 'lucide-react';
import { Relatorios } from './gestao/Relatorios';

export function GestaoRelatoriosPage() {
  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-priora-500" />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Relatórios</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Entenda a evolução da operação através de dados e tendências.
            </p>
          </div>
        </div>
        <Relatorios />
      </div>
    </div>
  );
}
