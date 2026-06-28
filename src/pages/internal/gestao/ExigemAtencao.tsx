import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gestaoRisks } from '../../../data/gestaoData';
import { StatusBadge } from '../../../components/StatusBadge';
import { Toast } from '../../../components/Toast';
import { AlertTriangle, ChevronDown, ChevronUp, Sparkles, ArrowRight, Eye, ExternalLink, CheckCircle, User } from 'lucide-react';

export function ExigemAtencao() {
  const navigate = useNavigate();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ visible: false, message: '' });
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(gestaoRisks.map((r) => r.id)));
  };

  const scrollToHighestRisk = () => {
    const highestRisk = gestaoRisks.reduce((a, b) => (a.criticidade > b.criticidade ? a : b));
    setExpandedIds((prev) => new Set([...prev, highestRisk.id]));
    setHighlightedId(highestRisk.id);
    cardRefs.current[highestRisk.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => setHighlightedId(null), 2500);
  };

  const markAsTracked = (id: string) => {
    setMarkedIds((prev) => new Set([...prev, id]));
    setToast({ visible: true, message: 'Processo marcado como acompanhado.' });
  };

  const handleAction = (action: string, processo: string) => {
    setToast({ visible: true, message: `Ação "${action}" executada para ${processo}.` });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* Main content */}
      <div className="space-y-6">
        {/* Clara interactive card */}
        <div className="card">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-priora-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-priora-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-priora-700">Clara</p>
              <p className="text-sm text-text-secondary mt-1">
                Analisei 23 situações operacionais. Identifiquei {gestaoRisks.length} problemas que exigem atenção imediata.
              </p>
            </div>
            <div className="border-l border-gray-100 pl-4">
              <p className="text-xs text-text-tertiary mb-1">Maior risco atual:</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-danger-500" />
                <span className="text-sm font-semibold text-text-primary">IM2567 — Demurrage ativo há 6 dias.</span>
              </div>
              <button onClick={scrollToHighestRisk} className="btn-primary-purple text-xs">
                Ver maior risco
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-tertiary flex items-center gap-1">
            Ordenado por criticidade
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          </p>
          <p className="text-xs text-text-tertiary">Atualizado agora há 2 min</p>
        </div>

        {/* Risk cards */}
        <div className="space-y-3">
          {gestaoRisks.map((risk) => {
            const isExpanded = expandedIds.has(risk.id);
            const isHighlighted = highlightedId === risk.id;
            const isMarked = markedIds.has(risk.id);

            return (
              <div
                key={risk.id}
                ref={(el) => { cardRefs.current[risk.id] = el; }}
                className={`card transition-all duration-300 ${
                  isHighlighted ? 'ring-2 ring-priora-500 ring-offset-2' : ''
                } ${isMarked ? 'opacity-60' : ''}`}
              >
                {/* Collapsed */}
                <div className="flex items-start gap-4">
                  <span className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                    risk.badgeVariant === 'red' ? 'bg-danger-500' : risk.badgeVariant === 'orange' ? 'bg-orange-500' : 'bg-warning-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-text-primary">{risk.processo}</span>
                      <span className="text-sm font-semibold text-priora-700">{risk.categoria}</span>
                    </div>
                    <StatusBadge variant={risk.badgeVariant}>{risk.badgeLabel}</StatusBadge>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium">{risk.resumo}</p>
                    <div className="flex items-start gap-2 mt-2">
                      <Sparkles className="w-3.5 h-3.5 text-priora-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-semibold text-priora-600">Clara</span>
                        <p className="text-xs text-text-secondary mt-0.5">{risk.claraAnalise}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-priora-100 flex items-center justify-center text-[10px] font-bold text-priora-700">
                        {risk.responsavel[0]}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-text-primary">{risk.responsavel}</p>
                        <p className="text-[10px] text-text-tertiary">Responsável</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpand(risk.id)}
                      className="btn-secondary text-xs"
                    >
                      Ver detalhes
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-semibold text-text-primary mb-2 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-priora-500" />
                          Evidências encontradas
                        </p>
                        <div className="space-y-1.5">
                          {risk.evidencias.map((ev, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                              <CheckCircle className="w-3 h-3 text-priora-400 mt-0.5 flex-shrink-0" />
                              {ev}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-primary mb-2 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-priora-500" />
                          Análise da Clara
                        </p>
                        <p className="text-xs text-text-secondary">{risk.claraAnalise}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-primary mb-2">Recomendação</p>
                        <p className="text-xs text-text-secondary mb-2">{risk.recomendacao}</p>
                        <p className="text-xs font-semibold text-text-primary mb-1">Próxima ação sugerida</p>
                        <p className="text-xs text-priora-600 font-medium">{risk.proximaAcao}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => navigate(risk.moduloLink)} className="btn-secondary text-xs">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Abrir processo
                      </button>
                      {!isMarked && (
                        <button onClick={() => markAsTracked(risk.id)} className="btn-secondary text-xs">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Marcar como acompanhado
                        </button>
                      )}
                      {risk.proximaAcao.includes('cliente') && (
                        <button onClick={() => handleAction('Cobrar cliente', risk.processo)} className="btn-primary-purple text-xs">
                          <User className="w-3.5 h-3.5" />
                          Cobrar cliente
                        </button>
                      )}
                      {risk.proximaAcao.includes('agente') && (
                        <button onClick={() => handleAction('Cobrar agente', risk.processo)} className="btn-primary-purple text-xs">
                          <User className="w-3.5 h-3.5" />
                          Cobrar agente
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quote */}
        <div className="text-center py-4">
          <p className="text-sm text-text-tertiary italic">
            "O virtuoso exibe todas as informações. O mestre exibe apenas as necessárias."
          </p>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="right-panel">
        <div className="right-panel-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-priora-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-priora-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">Clara</p>
              <p className="text-[11px] text-text-tertiary">Resumo Executivo</p>
            </div>
          </div>

          <p className="text-xs text-text-secondary mb-4">
            Analisei toda a operação. Identifiquei:
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-danger-50 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-danger-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-primary">3 processos</p>
                <p className="text-[11px] text-text-tertiary">gerando custos</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-primary">4 processos</p>
                <p className="text-[11px] text-text-tertiary">aguardando validação operacional</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-warning-50 flex items-center justify-center">
                <ExternalLink className="w-3.5 h-3.5 text-warning-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-primary">2 couriers</p>
                <p className="text-[11px] text-text-tertiary">sem atualização recente</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-priora-50 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-priora-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-primary">6 processos</p>
                <p className="text-[11px] text-text-tertiary">aguardando cliente</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 mb-4">
            <p className="text-xs text-text-tertiary mb-1">Maior risco atual:</p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-danger-500" />
              <p className="text-xs font-semibold text-text-primary">IM2567 — Demurrage ativo há 6 dias.</p>
            </div>
          </div>

          <button onClick={expandAll} className="btn-primary w-full text-xs">
            Ver todos os riscos
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  );
}
