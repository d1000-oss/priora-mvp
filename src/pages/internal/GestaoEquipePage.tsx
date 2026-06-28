import { Users } from 'lucide-react';
import { EquipeDesempenho } from './gestao/EquipeDesempenho';

export function GestaoEquipePage() {
  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-priora-500" />
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Equipe & Desempenho</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Visibilidade da distribuição operacional e dos gargalos da equipe.
            </p>
          </div>
        </div>
        <EquipeDesempenho />
      </div>
    </div>
  );
}
