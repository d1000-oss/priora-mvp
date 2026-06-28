import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ClaraCard } from '../../components/ClaraCard';
import { KPICard } from '../../components/KPICard';
import { ActivityFeed } from '../../components/ActivityFeed';
import { Toast } from '../../components/Toast';
import { useGlobalState } from '../../context/GlobalState';
import {
  Truck, AlertTriangle, DollarSign, Clock, FileText, Package, ArrowRight, User,
  ChevronDown, ChevronUp, CheckCircle,
} from 'lucide-react';

export function DemurragePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getProcessState } = useGlobalState();

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [minutaSolicitada, setMinutaSolicitada] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ visible: false, message: '' });
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const im2567State = getProcessState('IM2567');
  const minutaRecebida = im2567State.minutaRecebida;

  const targetProcesso = searchParams.get('processo');
  useEffect(() => {
    if (!targetProcesso) return;
    setExpandedCards((prev) => new Set([...prev, targetProcesso]));
    const timer = setTimeout(() => {
      cardRefs.current[targetProcesso]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
    return () => clearTimeout(timer);
  }, [targetProcesso]);

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSolicitarMinuta = (processoCodigo: string) => {
    setMinutaSolicitada((prev) => new Set([...prev, processoCodigo]));
    setToast({ visible: true, message: 'Notificação enviada no portal do cliente.' });
  };

  const isHighlighted = (codigo: string) => targetProcesso === codigo;

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Demurrage</h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Acompanhe devoluções de containers, riscos e custos em aberto.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main content */}
          <div className="space-y-6">
            {/* KPIs */}
            <div className="kpi-grid">
              <KPICard
                label="Custo ativo ao cliente"
                value="6"
                sublabel="R$ 4.260 estimados"
                sublabelColor="text-danger-600"
                icon={<AlertTriangle className="w-5 h-5 text-danger-500" />}
                variant="danger"
              />
              <KPICard
                label="Risco iminente"
                value="12"
                sublabel="R$ 9.320 estimados"
                sublabelColor="text-warning-600"
                icon={<Clock className="w-5 h-5 text-warning-500" />}
                variant="warning"
              />
              <KPICard
                label="Pendências documentais"
                value={minutaRecebida ? '3' : '4'}
                sublabel="R$ 0"
                icon={<FileText className="w-5 h-5 text-success-500" />}
                variant="success"
              />
              <KPICard
                label="Impacto total estimado"
                value="R$ 18.420"
                sublabel="em custos potenciais aos clientes"
                icon={<DollarSign className="w-5 h-5 text-priora-500" />}
                variant="purple"
              />
            </div>

            {/* CUSTO ATIVO AO CLIENTE */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-danger-500" />
                  <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">CUSTO ATIVO AO CLIENTE</h2>
                  <span className="text-xs text-text-tertiary">Processos que já estão gerando custos.</span>
                </div>
                <span className="text-xs text-text-tertiary">6 processos</span>
              </div>

              {/* IM2567 */}
              <div
                ref={(el) => { cardRefs.current['IM2567'] = el; }}
                className={`border rounded-xl p-4 mb-4 transition-all ${isHighlighted('IM2567') ? 'border-danger-300 ring-2 ring-danger-100' : 'border-gray-100'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-danger-50 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-danger-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-danger-600">Cliente acumulando R$ 460/dia em demurrage</p>
                      <button
                        onClick={() => navigate('/app/processos/IM2567')}
                        className="text-sm font-semibold text-priora-700 hover:text-priora-900 hover:underline"
                      >
                        IM2567 — BRA TRADE
                      </button>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-text-tertiary">
                        <span className="flex items-center gap-1"><Package className="w-3 h-3" />2 containers em demurrage</span>
                        <span className="flex items-center gap-1"><User className="w-3 h-3" />Cliente: BRA TRADE</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-text-primary">R$ 1.840</p>
                    <p className="text-xs text-text-tertiary">estimados acumulados</p>
                    <p className="text-xs text-danger-600 font-medium mt-0.5">+ R$ 460/dia</p>
                    <p className="text-[11px] text-text-tertiary">custo adicional por dia</p>
                  </div>
                </div>

                {expandedCards.has('IM2567') && (
                  <div className="mb-4 animate-fade-in space-y-4">
                    {/* Containers */}
                    <div className="grid grid-cols-2 gap-3">
                      {['FBIU5238915', 'GAOU6159773'].map((cont) => (
                        <div key={cont} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-bold text-text-primary font-mono">{cont}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-text-tertiary">
                            <span>Retirado: 12/05/2026</span>
                            <span>Free Time: 21 dias</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[11px]">
                            <span className="text-danger-600">Dias em demurrage: 4</span>
                            <span className="text-text-secondary">Valor estimado: R$ 920</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`w-2 h-2 rounded-full ${minutaRecebida ? 'bg-success-500' : 'bg-danger-500'}`} />
                            <span className={`text-[11px] ${minutaRecebida ? 'text-success-600' : 'text-danger-600'}`}>
                              Minuta: {minutaRecebida ? 'Recebida pelo cliente' : 'Não recebida'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Operational details */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1">Free time</p>
                        <p className="text-sm font-bold text-danger-600">Vencido</p>
                        <p className="text-[11px] text-text-tertiary">21 dias — esgotado</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1">Responsável</p>
                        <p className="text-sm font-bold text-danger-600">Cliente</p>
                        <p className="text-[11px] text-text-tertiary">BRA TRADE</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1">Motivo</p>
                        <p className="text-sm font-bold text-text-primary">Não devolução</p>
                        <p className="text-[11px] text-text-tertiary">Prazo excedido</p>
                      </div>
                    </div>

                    {/* Clara */}
                    <div className="bg-gray-50 rounded-xl p-3">
                      <ClaraCard
                        summary={minutaRecebida
                          ? 'Cliente enviou a minuta de devolução. Aguardando processamento interno.'
                          : '2 containers fora do free time há 4 dias. Responsabilidade do cliente BRA TRADE. Solicitar minuta urgente para documentar a cobrança.'}
                        compact
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    disabled={minutaSolicitada.has('IM2567')}
                    onClick={() => handleSolicitarMinuta('IM2567')}
                    className={`btn-secondary text-xs ${minutaSolicitada.has('IM2567') ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {minutaSolicitada.has('IM2567') ? (
                      <><CheckCircle className="w-3.5 h-3.5" />Minuta solicitada</>
                    ) : (
                      <><FileText className="w-3.5 h-3.5" />Solicitar Minuta</>
                    )}
                  </button>
                  <button
                    onClick={() => toggleExpand('IM2567')}
                    className="btn-ghost text-xs"
                  >
                    {expandedCards.has('IM2567') ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {expandedCards.has('IM2567') ? 'Recolher' : 'Ver detalhes'}
                  </button>
                </div>
              </div>
            </div>

            {/* RISCO IMINENTE */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-warning-500" />
                  <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">RISCO IMINENTE</h2>
                  <span className="text-xs text-text-tertiary">Processos que podem começar a gerar custos em breve.</span>
                </div>
                <span className="text-xs text-text-tertiary">12 processos</span>
              </div>

              <div
                ref={(el) => { cardRefs.current['IM2588'] = el; }}
                className={`border rounded-xl p-4 transition-all ${isHighlighted('IM2588') ? 'border-warning-300 ring-2 ring-warning-100' : 'border-gray-100'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-warning-50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-warning-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-warning-600">Risco de gerar custo ao cliente em até 3 dias</p>
                      <button
                        onClick={() => navigate('/app/processos/IM2588')}
                        className="text-sm font-semibold text-priora-700 hover:text-priora-900 hover:underline"
                      >
                        IM2588 — KLABIN
                      </button>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-text-tertiary">
                        <span>2 containers</span>
                        <span>Cliente: KLABIN</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-tertiary">Restam</p>
                    <p className="text-2xl font-bold text-warning-600">3 dias</p>
                    <p className="text-xs text-text-tertiary">de Free Time</p>
                  </div>
                </div>

                {expandedCards.has('IM2588') && (
                  <div className="mt-4 animate-fade-in space-y-4">
                    {/* Containers */}
                    <div className="grid grid-cols-2 gap-3">
                      {['TCLU7887654', 'MSKU2233445'].map((cont) => (
                        <div key={cont} className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-bold text-text-primary font-mono">{cont}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-text-tertiary">
                            <span>Free Time: 21 dias</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[11px]">
                            <span className="text-warning-600 font-semibold">Restam: 3 dias</span>
                            <span className="text-text-secondary">Custo potencial: R$ 920</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Operational details */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1">Free time restante</p>
                        <p className="text-sm font-bold text-warning-600">3 dias</p>
                        <p className="text-[11px] text-text-tertiary">Vence em breve</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1">Responsável</p>
                        <p className="text-sm font-bold text-warning-600">Cliente</p>
                        <p className="text-[11px] text-text-tertiary">KLABIN</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1">Custo estimado</p>
                        <p className="text-sm font-bold text-text-primary">R$ 1.840</p>
                        <p className="text-[11px] text-text-tertiary">se não devolvido</p>
                      </div>
                    </div>

                    {/* Clara */}
                    <div className="bg-gray-50 rounded-xl p-3">
                      <ClaraCard
                        summary="3 dias antes de gerar custo. Entrar em contato com KLABIN para antecipar devolução e evitar cobrança de demurrage."
                        compact
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => toggleExpand('IM2588')}
                    className="btn-secondary text-xs"
                  >
                    {expandedCards.has('IM2588') ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {expandedCards.has('IM2588') ? 'Recolher' : 'Ver detalhes'}
                  </button>
                  <button
                    onClick={() => navigate('/app/processos/IM2588')}
                    className="btn-ghost text-xs"
                  >
                    Ver Processo
                  </button>
                </div>
              </div>
            </div>

            {/* PENDÊNCIAS DOCUMENTAIS */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-priora-500" />
                  <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">PENDÊNCIAS DOCUMENTAIS</h2>
                  <span className="text-xs text-text-tertiary">Processos já devolvidos, mas aguardando comprovante do cliente.</span>
                </div>
                <span className="text-xs text-text-tertiary">{minutaRecebida ? '3' : '4'} processos</span>
              </div>

              {!minutaRecebida && (
                <div
                  ref={(el) => { cardRefs.current['IM2550'] = el; }}
                  className={`border rounded-xl p-4 transition-all ${isHighlighted('IM2550') ? 'border-priora-300 ring-2 ring-priora-100' : 'border-gray-100'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-priora-50 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-priora-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-priora-600">Minuta pendente após devolução</p>
                        <button
                          onClick={() => navigate('/app/processos/IM2550')}
                          className="text-sm font-semibold text-priora-700 hover:text-priora-900 hover:underline"
                        >
                          IM2550 — JBS
                        </button>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-text-tertiary">
                          <span>1 container devolvido</span>
                          <span>Cliente: JBS</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-text-tertiary">Devolução realizada</p>
                      <p className="text-sm font-bold text-success-600">15/06/2026</p>
                      <p className="text-xs text-text-tertiary">Aguardando minuta</p>
                    </div>
                  </div>

                  {expandedCards.has('IM2550') && (
                    <div className="mt-4 animate-fade-in space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1">Status</p>
                          <p className="text-sm font-bold text-success-600">Devolvido</p>
                          <p className="text-[11px] text-text-tertiary">15/06/2026</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1">Minuta</p>
                          <p className="text-sm font-bold text-danger-600">Não localizada</p>
                          <p className="text-[11px] text-text-tertiary">Pendente do cliente</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1">Custo</p>
                          <p className="text-sm font-bold text-text-primary">R$ 0</p>
                          <p className="text-[11px] text-text-tertiary">Sem custo ativo</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <ClaraCard
                          summary="Container devolvido mas minuta não localizada. Solicitar confirmação ao cliente JBS para encerrar pendência documental."
                          compact
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      disabled={minutaSolicitada.has('IM2550')}
                      onClick={() => handleSolicitarMinuta('IM2550')}
                      className={`btn-secondary text-xs ${minutaSolicitada.has('IM2550') ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {minutaSolicitada.has('IM2550') ? (
                        <><CheckCircle className="w-3.5 h-3.5" />Minuta solicitada</>
                      ) : (
                        <><FileText className="w-3.5 h-3.5" />Solicitar Minuta</>
                      )}
                    </button>
                    <button
                      onClick={() => toggleExpand('IM2550')}
                      className="btn-ghost text-xs"
                    >
                      {expandedCards.has('IM2550') ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {expandedCards.has('IM2550') ? 'Recolher' : 'Ver detalhes'}
                    </button>
                  </div>
                </div>
              )}

              {minutaRecebida && (
                <div className="border border-success-100 bg-success-50 rounded-xl p-4 flex items-center gap-3">
                  <Package className="w-5 h-5 text-success-500" />
                  <div>
                    <p className="text-sm font-semibold text-success-700">IM2567 — BRA TRADE</p>
                    <p className="text-xs text-success-600">Minuta recebida pelo cliente via portal.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quote */}
            <div className="text-center py-4">
              <p className="text-sm text-text-tertiary italic">
                "Custos não surgem de surpresa. Eles surgem de falta de acompanhamento."
              </p>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="right-panel">
            <div className="right-panel-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-100 to-priora-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-priora-600" />
                </div>
                <h3 className="text-sm font-bold text-text-primary">Resumo geral</h3>
              </div>
              <p className="text-xs text-text-secondary mb-4">
                Analisei todos os processos e identifiquei:
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-danger-500" />
                    <span className="text-xs text-text-secondary">6 processos gerando custos ao cliente</span>
                  </div>
                  <span className="text-xs font-bold text-danger-600">R$ 4.260</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-warning-500" />
                    <span className="text-xs text-text-secondary">12 processos próximos de gerar custo</span>
                  </div>
                  <span className="text-xs font-bold text-warning-600">R$ 9.320</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-priora-500" />
                    <span className="text-xs text-text-secondary">{minutaRecebida ? '3' : '4'} processos aguardando minuta</span>
                  </div>
                  <span className="text-xs font-bold text-text-primary">R$ 0</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-priora-500" />
                    <span className="text-xs font-semibold text-text-primary">R$ 18.420</span>
                  </div>
                  <span className="text-[11px] text-text-tertiary">impacto total estimado aos clientes</span>
                </div>
              </div>
            </div>

            <div className="right-panel-card">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-danger-500" />
                <h3 className="text-xs font-bold text-danger-700">Maior risco atual</h3>
              </div>
              <p className="text-xs font-semibold text-text-primary">IM2567 — BRA TRADE</p>
              <p className="text-xs text-text-secondary mt-1">R$ 460/dia em demurrage</p>
              <p className="text-xs text-text-secondary">2 containers em demurrage</p>
              <button
                onClick={() => {
                  setExpandedCards((prev) => new Set([...prev, 'IM2567']));
                  setTimeout(() => cardRefs.current['IM2567']?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
                }}
                className="btn-primary w-full mt-4 text-xs"
              >
                Ver caso prioritário
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <ActivityFeed />
          </div>
        </div>
      </div>

      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  );
}
