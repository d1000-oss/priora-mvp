import { KPICard } from '../../components/KPICard';
import { ActivityFeed } from '../../components/ActivityFeed';
import { SearchBar } from '../../components/SearchBar';
import { decisoes } from '../../data/mockData';
import { useGlobalState } from '../../context/GlobalState';
import { AlertCircle, CheckCircle, Clock, Eye, ArrowRight, X, Sparkles, AlertTriangle, Zap, FileText } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';

const filterTags = ['Todos', 'Telex Release', 'OHBL', 'Procuração', 'Termo', 'Courier', 'Retirada', 'Financeiro'];

export function DecisoesPage() {
  const { events, decisionStates, confirmDecision, rejectDecision } = useGlobalState();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [evidenceModal, setEvidenceModal] = useState<string | null>(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const navigate = useNavigate();

  const clienteDecisoes = events
    .filter((e) => e.type === 'telex_confirmado')
    .map((e) => ({
      id: e.id,
      processoCodigo: e.processoCodigo,
      tipo: 'Confirmar Telex Release (HBL)',
      analista: 'Pedro',
      claraEncontrou: ['Cliente marcou Telex Release no portal do cliente', 'HBL liberado eletronicamente', 'Aguarda validação do analista'],
      cliente: 'COBRAX',
      tempo: 'Agora',
      evidencia: 'Pendência documental' as const,
      recomendacao: 'Confirmar Telex Release no HBL',
    }));

  const formattedDecisoes = decisoes.map((d) => ({
    ...d,
    cliente: d.processoCodigo === 'IM2591' ? 'BRA TRADE' : d.processoCodigo === 'IM2580' ? 'KLABIN' : 'EXTRUSA',
    tempo: d.id === '1' ? 'Há 2 horas' : d.id === '2' ? 'Há 1 hora' : 'Há 3 dias',
    evidencia: d.id === '1' ? 'Evidência Forte' : d.id === '2' ? 'Pendência documental' : 'Evidência Conflitante',
    recomendacao: d.id === '1' ? 'Confirmar Telex Release' : d.id === '2' ? 'Cobrar cliente' : 'Informações conflitantes',
  }));

  const allDecisoes = [...clienteDecisoes, ...formattedDecisoes];

  const getEvidenciaStyle = (ev: string) => {
    if (ev.includes('Forte')) return { bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-200', icon: <CheckCircle className="w-3.5 h-3.5 text-success-500" /> };
    if (ev.includes('Conflitante')) return { bg: 'bg-danger-50', text: 'text-danger-700', border: 'border-danger-200', icon: <AlertCircle className="w-3.5 h-3.5 text-danger-500" /> };
    return { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-200', icon: <Clock className="w-3.5 h-3.5 text-warning-500" /> };
  };

  const handleConfirm = (id: string, processoCodigo: string, tipo: string) => {
    confirmDecision(id, processoCodigo, tipo);
    setToast({ visible: true, message: `Decisão confirmada para ${processoCodigo}.` });
  };

  const handleReject = (id: string, processoCodigo: string) => {
    rejectDecision(id, processoCodigo);
    setToast({ visible: true, message: `Processo ${processoCodigo} encaminhado para revisão.` });
  };

  const pendingDecisoes = allDecisoes.filter((d) => !decisionStates[d.id] || decisionStates[d.id] === 'pendente');

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Fila de Decisões</h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Apenas processos que exigem validação humana.
              </p>
            </div>
          </div>
          <div className="w-80">
            <SearchBar placeholder="Buscar processo, cliente, navio ou container..." />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main content */}
          <div className="space-y-6">
            {/* KPIs */}
            <div className="kpi-grid">
              <KPICard
                label="Críticas"
                value={3}
                sublabel="Exigem atenção"
                icon={<AlertCircle className="w-5 h-5 text-danger-500" />}
                variant="danger"
              />
              <KPICard
                label="Pendentes"
                value={pendingDecisoes.length}
                sublabel="Aguardando decisão"
                icon={<Clock className="w-5 h-5 text-warning-500" />}
                variant="warning"
              />
              <KPICard
                label="Resolvidas hoje"
                value={14 + (allDecisoes.length - pendingDecisoes.length)}
                sublabel="Decisões concluídas"
                icon={<CheckCircle className="w-5 h-5 text-success-500" />}
                variant="success"
              />
              <KPICard
                label="Total"
                value={allDecisoes.length}
                sublabel="Na fila de decisões"
                icon={<Clock className="w-5 h-5 text-gray-400" />}
                variant="info"
              />
            </div>

            {/* Filter tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeFilter === tag
                      ? 'bg-priora-600 text-white'
                      : 'bg-white border border-gray-200 text-text-secondary hover:border-priora-300'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Decision cards */}
            <div className="space-y-4">
              {allDecisoes.map((d) => {
                const evStyle = getEvidenciaStyle(d.evidencia);
                const status = decisionStates[d.id];
                const isResolved = status === 'confirmada' || status === 'rejeitada';

                return (
                  <div key={d.id} className={`card transition-all ${isResolved ? 'opacity-60' : ''}`}>
                    {/* Resolved banner */}
                    {isResolved && (
                      <div className={`flex items-center gap-2 mb-3 px-3 py-2 rounded-lg text-xs font-semibold ${
                        status === 'confirmada' ? 'bg-success-50 text-success-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {status === 'confirmada' ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        {status === 'confirmada' ? 'Decisão confirmada' : 'Encaminhado para revisão'}
                      </div>
                    )}

                    {/* Header row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-full bg-danger-50 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-danger-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/app/processos/${d.processoCodigo}`)}
                              className="text-base font-bold text-priora-700 hover:text-priora-900 hover:underline"
                            >
                              {d.processoCodigo}
                            </button>
                            <span className="text-base font-bold text-text-primary">— {d.cliente}</span>
                          </div>
                          <p className="text-sm text-text-secondary">{d.tipo}</p>
                          <p className="text-xs text-text-tertiary flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {d.tempo}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${evStyle.bg} ${evStyle.text} ${evStyle.border}`}>
                        {evStyle.icon}
                        {d.evidencia}
                      </span>
                    </div>

                    {/* Clara recommendation */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-priora-100 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-priora-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-text-tertiary mb-1">Clara recomenda:</p>
                          <p className="text-sm font-bold text-priora-700">{d.recomendacao}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-tertiary mb-1">Porque:</p>
                          <div className="space-y-1">
                            {d.claraEncontrou.map((item, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <CheckCircle className={`w-3.5 h-3.5 ${d.evidencia.includes('Conflitante') ? 'text-danger-500' : 'text-success-500'}`} />
                                <span className="text-xs text-text-secondary">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                      {!isResolved ? (
                        <>
                          <button
                            onClick={() => handleConfirm(d.id, d.processoCodigo, d.tipo)}
                            className="btn-ghost text-xs flex-1 text-success-600 border border-success-200 hover:bg-success-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Confirmar
                          </button>
                          <button
                            onClick={() => handleReject(d.id, d.processoCodigo)}
                            className="btn-ghost text-xs flex-1 text-danger-600 border border-danger-200 hover:bg-danger-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            Revisar
                          </button>
                        </>
                      ) : (
                        <div className="flex-1" />
                      )}
                      <button
                        onClick={() => navigate(`/app/processos/${d.processoCodigo}`)}
                        className="btn-ghost text-xs flex-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver Processo
                      </button>
                      <button
                        onClick={() => setEvidenceModal(d.id)}
                        className="btn-ghost text-xs flex-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Evidências
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="right-panel">
            <div className="right-panel-card">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-priora-600" />
                <h3 className="text-sm font-bold text-text-primary">Clara — Resumo da Fila</h3>
              </div>
              <p className="text-sm text-text-secondary mb-4">{pendingDecisoes.length} decisões aguardando.</p>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/app/processos/IM2540')}
                  className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-danger-500" />
                      <span className="text-xs font-semibold text-danger-700">Maior risco</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text-tertiary" />
                  </div>
                  <p className="text-xs text-text-secondary mt-1">IM2540 possui evidências conflitantes.</p>
                </button>

                <div className="p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-warning-500" />
                      <span className="text-xs font-semibold text-text-primary">Mais antiga</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">IM1571 aguardando há 4 dias.</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-priora-500" />
                      <span className="text-xs font-semibold text-text-primary">Categoria mais frequente</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">Telex Release — 3 casos</p>
                </div>

                <div className="p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-priora-500" />
                      <span className="text-xs font-semibold text-text-primary">Tempo médio de validação</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">7 minutos por decisão</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/app/processos/IM2540')}
                className="btn-primary w-full mt-5 text-xs"
              >
                Ver Processo Prioritário
              </button>
            </div>

            <ActivityFeed />
          </div>
        </div>
      </div>

      {/* Evidence Modal */}
      <Modal
        open={evidenceModal !== null}
        onClose={() => setEvidenceModal(null)}
        title="Evidências da Decisão"
      >
        {evidenceModal && (() => {
          const d = allDecisoes.find((x) => x.id === evidenceModal);
          if (!d) return null;
          return (
            <div>
              <p className="text-sm font-semibold text-text-primary mb-1">{d.processoCodigo} — {d.tipo}</p>
              <p className="text-xs text-text-tertiary mb-4">Analista: {d.analista}</p>
              <div className="space-y-2">
                {d.claraEncontrou.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-priora-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-text-secondary">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => {
                    setEvidenceModal(null);
                    navigate(`/app/processos/${d.processoCodigo}`);
                  }}
                  className="btn-primary-purple text-sm flex-1"
                >
                  <Eye className="w-4 h-4" />
                  Ver Processo Completo
                </button>
                <button onClick={() => setEvidenceModal(null)} className="btn-ghost text-sm flex-1">
                  Fechar
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  );
}
