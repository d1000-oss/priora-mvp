import { useState } from 'react';
import { ClaraCard } from '../../components/ClaraCard';
import { KPICard } from '../../components/KPICard';
import { SearchBar } from '../../components/SearchBar';
import { ActivityFeed } from '../../components/ActivityFeed';
import { processos } from '../../data/mockData';
import { AlertTriangle, Clock, CheckCircle, Package, ArrowRight, Ship, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProcessosPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = processos.filter(
    (p) =>
      !search ||
      p.codigo.toLowerCase().includes(search.toLowerCase()) ||
      p.cliente.toLowerCase().includes(search.toLowerCase()) ||
      (p.armador?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const atencao = filtered.filter(p => p.status.includes('Demurrage') || p.status.includes('Responsabilidade'));
  const aguardando = filtered.filter(p => p.status.includes('Pendência') || p.status.includes('Aguardando'));

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Processos</h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Visualize rapidamente os embarques que exigem sua atenção.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            placeholder="Buscar processo, cliente, navio, container ou armador..."
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main content */}
          <div className="space-y-6">
            {/* KPIs */}
            <div className="kpi-grid">
              <KPICard
                label="Exigem atenção"
                value={4}
                icon={<AlertTriangle className="w-5 h-5 text-danger-500" />}
                variant="danger"
              />
              <KPICard
                label="Pendências externas"
                value={7}
                icon={<Clock className="w-5 h-5 text-warning-500" />}
                variant="warning"
              />
              <KPICard
                label="Liberados"
                value={18}
                icon={<CheckCircle className="w-5 h-5 text-success-500" />}
                variant="success"
              />
              <KPICard
                label="Total de processos"
                value={29}
                icon={<Package className="w-5 h-5 text-gray-400" />}
                variant="info"
              />
            </div>

            {/* Atenção agora */}
            {atencao.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger-500" />
                  <h2 className="text-base font-semibold text-text-primary">Sua atenção agora</h2>
                  <span className="text-xs text-text-tertiary ml-2">Processos que exigem ação imediata.</span>
                </div>

                <div className="space-y-3">
                  {atencao.map((p) => (
                    <div key={p.id} className="card-hover">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-danger-500 mt-2 flex-shrink-0" />
                          <div>
                            <button
                              onClick={() => navigate(`/app/processos/${p.codigo}`)}
                              className="font-bold text-sm text-priora-700 hover:text-priora-900 hover:underline text-left"
                            >
                              {p.codigo} — {p.cliente}
                            </button>
                            <div className="flex items-center gap-4 mt-1.5 text-xs text-text-tertiary">
                              {p.armador && (
                                <span className="flex items-center gap-1">
                                  <Ship className="w-3 h-3" />
                                  {p.armador}
                                </span>
                              )}
                              {p.eta && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  ETA {p.eta}
                                </span>
                              )}
                            </div>
                            <div className="mt-2.5 grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs font-semibold text-danger-600">Problema identificado</p>
                                <p className="text-xs text-text-secondary mt-0.5">{p.status}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-text-secondary">Impacto</p>
                                <p className="text-xs text-text-secondary mt-0.5">Carga atracada aguardando liberação.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => navigate(`/app/processos/${p.codigo}`)}
                            className="btn-primary-purple text-xs"
                          >
                            Abrir processo
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aguardando */}
            {aguardando.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-warning-500" />
                  <h2 className="text-base font-semibold text-text-primary">Aguardando terceiros</h2>
                  <span className="text-xs text-text-tertiary ml-2">Processos que dependem de cliente, agente ou armador.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {aguardando.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/app/processos/${p.codigo}`)}
                      className="card-hover flex items-center justify-between text-left w-full"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-warning-50 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-warning-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{p.codigo} — {p.cliente}</p>
                          <p className="text-xs text-text-tertiary mt-0.5">{p.status}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-text-tertiary" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All processes list */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <h2 className="text-base font-semibold text-text-primary">Todos os processos</h2>
              </div>
              <div className="space-y-2">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/app/processos/${p.codigo}`)}
                    className="card-hover flex items-center justify-between text-left w-full"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-text-primary w-16">{p.codigo}</span>
                      <span className="text-sm text-text-secondary w-32">{p.cliente}</span>
                      <span className="text-xs text-text-tertiary">{p.analista}</span>
                      <span className="text-xs text-text-secondary">{p.status}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-tertiary" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="right-panel">
            <ClaraCard
              summary="Analisei os 29 processos da sua carteira."
              evidence={[
                { text: '2 processos com risco de atraso na liberação', color: 'red' },
                { text: '1 courier sem rastreamento atualizado', color: 'red' },
                { text: '4 processos aguardando ação do cliente', color: 'yellow' },
                { text: '18 processos sem pendências', color: 'green' },
              ]}
              recommendation="Priorize IM1604 e IM1599."
            />

            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
