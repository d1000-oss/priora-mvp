import { useState } from 'react';
import { gestaoAnalistas } from '../../../data/gestaoData';
import { KPICard } from '../../../components/KPICard';
import { Toast } from '../../../components/Toast';
import { Modal } from '../../../components/Modal';
import {
  Users, Package, AlertTriangle, ChevronDown, ChevronUp, ArrowRight,
  CheckCircle, Shuffle, AlertCircle, Clock, ChevronRight, Bot,
} from 'lucide-react';

function LoadBar({ value }: { value: number }) {
  const color = value >= 90 ? 'bg-danger-500' : value >= 70 ? 'bg-warning-500' : value >= 55 ? 'bg-success-500' : 'bg-priora-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-semibold text-text-primary w-8 text-right">{value}%</span>
    </div>
  );
}

export function EquipeDesempenho() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [redistribuirModal, setRedistribuirModal] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(gestaoAnalistas.map((a) => a.id)));
  };

  const totalProcessos = gestaoAnalistas.reduce((s, a) => s + a.processos, 0);
  const totalCriticos = gestaoAnalistas.reduce((s, a) => s + a.criticos, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* Main */}
      <div className="space-y-6">
        {/* KPIs */}
        <div className="kpi-grid">
          <KPICard label="Analistas Ativos" value={4} icon={<Users className="w-5 h-5 text-priora-500" />} variant="purple" />
          <KPICard label="Processos Ativos" value={totalProcessos} icon={<Package className="w-5 h-5 text-warning-500" />} variant="warning" />
          <KPICard label="Processos Críticos" value={totalCriticos} icon={<AlertTriangle className="w-5 h-5 text-danger-500" />} variant="danger" />
          <KPICard label="Distribuição" value="Saudável" icon={<Shuffle className="w-5 h-5 text-success-500" />} variant="success" />
        </div>

        {/* Carteira dos Analistas */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-1">1. Carteira dos Analistas</h2>
          <p className="text-sm text-text-secondary mb-4">Visão da distribuição de processos por analista.</p>

          <div className="space-y-3">
            {gestaoAnalistas.map((analista) => {
              const isExpanded = expandedIds.has(analista.id);
              return (
                <div key={analista.id} className="card">
                  {/* Row */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-priora-100 flex items-center justify-center text-base font-bold text-priora-700 flex-shrink-0">
                      {analista.nome[0]}
                    </div>

                    <div className="w-28 flex-shrink-0">
                      <span className="text-sm font-bold text-text-primary block">{analista.nome}</span>
                      {isExpanded && (
                        <span className="inline-block text-[10px] font-medium text-priora-600 bg-priora-50 px-1.5 py-0.5 rounded mt-0.5">
                          Expandido
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-5 flex-1">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3 text-priora-500" />
                          <p className="text-sm font-bold text-text-primary">{analista.processos}</p>
                        </div>
                        <p className="text-[10px] text-text-tertiary">processos</p>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-danger-500" />
                          <p className="text-sm font-bold text-danger-600">{analista.criticos}</p>
                        </div>
                        <p className="text-[10px] text-text-tertiary">críticos</p>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-warning-500" />
                          <p className="text-sm font-bold text-warning-600">{analista.aguardandoCliente}</p>
                        </div>
                        <p className="text-[10px] text-text-tertiary">aguardando cliente</p>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-success-500" />
                          <p className="text-sm font-bold text-success-600">{analista.saudaveis}</p>
                        </div>
                        <p className="text-[10px] text-text-tertiary">saudáveis</p>
                      </div>
                    </div>

                    <div className="w-52 flex-shrink-0">
                      <p className="text-[10px] text-text-tertiary mb-1">Carga operacional</p>
                      <LoadBar value={analista.cargaOperacional} />
                    </div>

                    <button onClick={() => toggleExpand(analista.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
                    </button>
                  </div>

                  {/* Expanded */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                      <div className="grid grid-cols-2 gap-6 mb-4">
                        {/* Resumo detalhado */}
                        <div>
                          <p className="text-xs font-semibold text-text-primary mb-2">Resumo detalhado</p>
                          <div className="space-y-0.5">
                            {[
                              { dot: 'bg-danger-500', label: 'Processos críticos', value: analista.criticos },
                              { dot: 'bg-warning-500', label: 'Aguardando cliente', value: analista.aguardandoCliente },
                              { dot: 'bg-priora-400', label: 'Aguardando agente', value: analista.pendencias.length },
                              { dot: 'bg-danger-400', label: 'Em demurrage', value: analista.riscos.length },
                              { dot: 'bg-warning-400', label: 'Atracados sem liberação', value: analista.gargalos.length },
                            ].map((row) => (
                              <div key={row.label} className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-gray-50 group cursor-pointer">
                                <div className="flex items-center gap-2.5">
                                  <span className={`w-2 h-2 rounded-full ${row.dot} flex-shrink-0`} />
                                  <span className="text-xs text-text-secondary">{row.label}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-semibold text-text-primary">{row.value}</span>
                                  <ChevronRight className="w-3 h-3 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Principais processos críticos */}
                        <div>
                          <p className="text-xs font-semibold text-text-primary mb-2">Principais processos críticos</p>
                          <div className="space-y-2">
                            {analista.processosDetalhados.slice(0, 2).map((p) => (
                              <div key={p.codigo} className="flex items-start gap-2.5 p-2.5 rounded-lg border border-gray-100 bg-gray-50/60">
                                <span className="w-2 h-2 rounded-full bg-danger-500 mt-1.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <span className="text-xs font-bold text-text-primary">{p.codigo}</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-danger-200 bg-danger-50 text-danger-700 font-medium whitespace-nowrap">{p.cliente}</span>
                                  </div>
                                  <p className="text-[11px] text-text-secondary">{p.status}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setToast({ visible: true, message: `Visualizando processos de ${analista.nome}.` })}
                          className="btn-secondary text-xs flex-1"
                        >
                          Ver todos os processos do {analista.nome}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setRedistribuirModal(true)} className="btn-secondary text-xs px-3">
                          <Shuffle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-text-tertiary mt-3 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Clique em um analista para ver o detalhamento dos processos.
          </p>
        </div>

        {/* Saúde da Operação */}
        <div>
          <h2 className="text-base font-bold text-text-primary mb-1">2. Saúde da Operação</h2>
          <p className="text-sm text-text-secondary mb-4">Panorama geral da operação com dados reais.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Liberações do mês', valor: '164', icon: <Package className="w-4 h-4 text-priora-500" /> },
              { label: 'Demurrages ativas', valor: '2', icon: <AlertTriangle className="w-4 h-4 text-warning-500" /> },
              { label: 'Couriers atrasados', valor: '3', icon: <Package className="w-4 h-4 text-priora-400" /> },
              { label: 'Processos críticos', valor: '5', icon: <AlertTriangle className="w-4 h-4 text-danger-500" /> },
              { label: 'Processos liberados', valor: '121', icon: <CheckCircle className="w-4 h-4 text-success-500" /> },
              { label: 'Pendências de cliente', valor: '14', icon: <Clock className="w-4 h-4 text-warning-500" /> },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <div className="flex justify-center mb-2">{item.icon}</div>
                <p className="text-[10px] text-text-tertiary mb-0.5">{item.label}</p>
                <p className="text-lg font-bold text-text-primary">{item.valor}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="text-center py-4">
          <p className="text-sm text-text-tertiary italic">
            "Uma operação eficiente não é aquela que trabalha mais. É aquela que distribui melhor sua capacidade."
          </p>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="right-panel">
        <div className="right-panel-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-priora-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-7 h-7 text-priora-600" />
            </div>
            <div>
              <p className="text-base font-bold text-text-primary">Clara</p>
              <p className="text-xs text-text-tertiary">Análise Operacional</p>
            </div>
          </div>

          <p className="text-xs text-text-secondary mb-2">Analisei a distribuição da operação.</p>
          <p className="text-xs font-semibold text-text-primary mb-2">Identifiquei:</p>

          <div className="space-y-2.5 text-xs text-text-secondary mb-4">
            <p>&#8226; Pedro possui a maior concentração de processos ativos.</p>
            <p>&#8226; 2 dos 5 processos críticos estão sob sua responsabilidade.</p>
            <p>&#8226; Kaio e Gilmar possuem capacidade para absorver novos processos.</p>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-bold text-priora-700 mb-1.5">Recomendação:</p>
            <p className="text-xs text-text-secondary">
              Redistribuir novas entradas para Kaio e Gilmar até que a carga operacional seja equilibrada.
            </p>
          </div>

          <button onClick={expandAll} className="btn-secondary w-full mt-4 text-xs">
            <Users className="w-3.5 h-3.5" />
            Ver todos os detalhes
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Redistribuir Modal */}
      <Modal open={redistribuirModal} onClose={() => setRedistribuirModal(false)} title="Redistribuir Processos">
        <p className="text-sm text-text-secondary mb-4">
          Selecione o analista de destino para redistribuição de processos não-críticos.
        </p>
        <div className="space-y-2 mb-5">
          {gestaoAnalistas.filter(a => a.cargaOperacional < 70).map((a) => (
            <button
              key={a.id}
              onClick={() => { setRedistribuirModal(false); setToast({ visible: true, message: `Processos redistribuídos para ${a.nome}.` }); }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-priora-300 hover:bg-priora-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-priora-100 flex items-center justify-center text-xs font-bold text-priora-700">
                  {a.nome[0]}
                </div>
                <span className="text-sm font-medium text-text-primary">{a.nome}</span>
              </div>
              <span className="text-xs text-text-tertiary">Carga: {a.cargaOperacional}%</span>
            </button>
          ))}
        </div>
        <button onClick={() => setRedistribuirModal(false)} className="btn-ghost text-sm w-full">Cancelar</button>
      </Modal>

      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  );
}
