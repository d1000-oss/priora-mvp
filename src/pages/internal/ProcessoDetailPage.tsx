import { useParams, useNavigate } from 'react-router-dom';
import { processos, decisoes, demurrageItems, couriers } from '../../data/mockData';
import { useGlobalState } from '../../context/GlobalState';
import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  Ship,
  Sparkles,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Truck,
  Mail,
  MessageSquare,
  Circle,
} from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';

function timeLabel(d: Date) {
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return 'Agora';
  if (diff < 3600) return `Há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Há ${Math.floor(diff / 3600)} hora${Math.floor(diff / 3600) !== 1 ? 's' : ''}`;
  return d.toLocaleDateString('pt-BR');
}

export function ProcessoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProcessState, timeline, events } = useGlobalState();

  const processo = processos.find((p) => p.codigo === id);
  const state = getProcessState(id ?? '');

  const processTimeline = timeline.filter((t) => t.processoCodigo === id);
  const telexConfirmadoPorAnalista = processTimeline.some((t) => t.tipo === 'telex_confirmado_analista');
  const processEvents = events.filter((e) => e.processoCodigo === id);
  const processDecisao = decisoes.find((d) => d.processoCodigo === id);
  const processDemurrage = demurrageItems.find((d) => d.processoCodigo === id);
  const processCourier = couriers.find((c) => c.processosVinculados.includes(id ?? ''));

  if (!processo) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => navigate('/app/processos')} className="btn-ghost text-sm mb-6">
            <ArrowLeft className="w-4 h-4" />
            Voltar aos processos
          </button>
          <div className="card text-center py-12">
            <p className="text-text-secondary">Processo não encontrado.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    if (status.includes('Demurrage') || status.includes('Crítico')) return 'red';
    if (status.includes('Responsabilidade')) return 'orange';
    if (status.includes('Aguardando') || status.includes('Pendência') || status.includes('Conflito')) return 'yellow';
    return 'green';
  };

  const timelineAutorIcon = (autor: string) => {
    if (autor === 'cliente') return <User className="w-3.5 h-3.5 text-priora-600" />;
    if (autor === 'analista') return <Sparkles className="w-3.5 h-3.5 text-success-600" />;
    return <Circle className="w-3.5 h-3.5 text-text-tertiary" />;
  };

  return (
    <div className="p-8">
      <div className="max-w-[1100px] mx-auto">
        {/* Back + Header */}
        <button onClick={() => navigate('/app/processos')} className="btn-ghost text-sm mb-5">
          <ArrowLeft className="w-4 h-4" />
          Voltar aos processos
        </button>

        {/* Process title card */}
        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-priora-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-priora-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-text-primary">{processo.codigo}</h1>
                  <StatusBadge variant={getStatusVariant(processo.status)}>
                    {processo.status}
                  </StatusBadge>
                </div>
                <div className="flex items-center gap-5 text-sm text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {processo.cliente}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Analista: {processo.analista}
                  </span>
                  {processo.armador && (
                    <span className="flex items-center gap-1.5">
                      <Ship className="w-3.5 h-3.5" />
                      {processo.armador}
                    </span>
                  )}
                  {processo.eta && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      ETA: {processo.eta}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/app/liberacao')} className="btn-secondary text-xs">
                <FileText className="w-3.5 h-3.5" />
                Liberação
              </button>
              <button onClick={() => navigate('/app/demurrage')} className="btn-secondary text-xs">
                <Truck className="w-3.5 h-3.5" />
                Demurrage
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left column */}
          <div className="space-y-5">
            {/* Containers */}
            {processo.containers && processo.containers.length > 0 && (
              <div className="card">
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-text-secondary" />
                  Containers
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {processo.containers.map((c) => (
                    <div key={c.id} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-bold font-mono text-text-primary">{c.numero}</p>
                      {processDemurrage && (
                        <p className="text-[11px] text-text-tertiary mt-1">
                          {processDemurrage.statusResumo}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents status */}
            <div className="card">
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-text-secondary" />
                Status Documental
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-text-secondary">Minuta de devolução</span>
                  {state.minutaRecebida ? (
                    <span className="flex items-center gap-1.5 text-success-600 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Recebida pelo cliente
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-danger-600 text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Não recebida
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-text-secondary">OHBL</span>
                  {state.ohblEnviado ? (
                    <span className="flex items-center gap-1.5 text-success-600 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Concluído
                    </span>
                  ) : state.telexConfirmado ? (
                    <span className="flex items-center gap-1.5 text-success-600 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Via Telex Release — não aplicável
                    </span>
                  ) : (
                    <span className="text-xs text-text-tertiary">Aguardando</span>
                  )}
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-text-secondary">Telex Release (HBL)</span>
                  {state.ohblEnviado && !state.telexConfirmado ? (
                    <span className="text-xs text-text-tertiary">Não necessário</span>
                  ) : state.telexConfirmado ? (
                    <span className="flex items-center gap-1.5 text-success-600 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {telexConfirmadoPorAnalista ? 'Confirmado' : 'Confirmado pelo cliente'}
                    </span>
                  ) : (
                    <span className="text-xs text-text-tertiary">Não informado</span>
                  )}
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-text-secondary">Retirada física solicitada</span>
                  {state.retiradaSolicitada ? (
                    <span className="flex items-center gap-1.5 text-success-600 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Sim
                    </span>
                  ) : (
                    <span className="text-xs text-text-tertiary">Não solicitada</span>
                  )}
                </div>
              </div>
            </div>

            {/* Demurrage info */}
            {processDemurrage && (
              <div className="card">
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-text-secondary" />
                  Demurrage
                </h2>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Status</span>
                  <span className="font-semibold text-text-primary">{processDemurrage.statusResumo}</span>
                </div>
                {processDemurrage.valorEstimado && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-text-secondary">Valor estimado</span>
                    <span className="font-bold text-danger-600">{processDemurrage.valorEstimado}</span>
                  </div>
                )}
                {processDemurrage.diasFreeTime && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-text-secondary">Dias de free time restantes</span>
                    <span className="font-bold text-warning-600">{processDemurrage.diasFreeTime}</span>
                  </div>
                )}
                <button onClick={() => navigate('/app/demurrage')} className="btn-ghost text-xs mt-3">
                  Ver no módulo de Demurrage
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                </button>
              </div>
            )}

            {/* Decision */}
            {processDecisao && (
              <div className="card">
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-text-secondary" />
                  Decisão Pendente
                </h2>
                <p className="text-sm font-semibold text-text-primary mb-1">{processDecisao.tipo}</p>
                <p className="text-xs text-text-tertiary mb-3">Analista: {processDecisao.analista}</p>
                <div className="space-y-1.5 mb-4">
                  {processDecisao.claraEncontrou.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
                      <CheckCircle className="w-3.5 h-3.5 text-priora-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/app/decisoes')} className="btn-secondary text-xs">
                  Ver na Fila de Decisões
                </button>
              </div>
            )}

            {/* Courier */}
            {processCourier && (
              <div className="card">
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-text-secondary" />
                  Courier
                </h2>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Tracking</span>
                  <span className="font-semibold text-text-primary font-mono">{processCourier.tracking}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-text-secondary">Status</span>
                  <StatusBadge variant={processCourier.status === 'Recebido' ? 'green' : processCourier.status.includes('Sem') ? 'red' : 'yellow'}>
                    {processCourier.status}
                  </StatusBadge>
                </div>
                {processCourier.origem && (
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-text-secondary">Rota</span>
                    <span className="font-semibold text-text-primary">
                      {processCourier.origem} → {processCourier.destino}
                    </span>
                  </div>
                )}
                <button onClick={() => navigate('/app/couriers')} className="btn-ghost text-xs mt-3">
                  Ver no módulo de Couriers
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                </button>
              </div>
            )}

            {/* Client events */}
            {processEvents.length > 0 && (
              <div className="card">
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-text-secondary" />
                  Ações do Cliente
                </h2>
                <div className="space-y-3">
                  {processEvents.map((e) => (
                    <div key={e.id} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-priora-50 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-priora-600" />
                      </div>
                      <div>
                        <p className="text-sm text-text-primary">{e.descricao}</p>
                        <p className="text-xs text-text-tertiary mt-0.5">{timeLabel(e.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Timeline */}
          <div className="space-y-5">
            {/* Clara summary */}
            <div className="right-panel-card">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-priora-600" />
                <h3 className="text-sm font-bold text-text-primary">Clara — Análise</h3>
              </div>
              <p className="text-xs text-text-secondary mb-3">
                Processo {processo.codigo} para {processo.cliente}.
              </p>
              <div className="space-y-2">
                {state.minutaRecebida && (
                  <div className="flex items-center gap-2 text-xs text-success-600">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    Minuta de devolução recebida.
                  </div>
                )}
                {!state.minutaRecebida && processDemurrage?.statusResumo === 'Em demurrage' && (
                  <div className="flex items-center gap-2 text-xs text-danger-600">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    {state.retiradaSolicitada
                      ? 'Container retirado pelo cliente e não devolvido — gerando demurrage.'
                      : 'Minuta pendente — processo gerando custo.'}
                  </div>
                )}
                {state.telexConfirmado && (
                  <div className="flex items-center gap-2 text-xs text-success-600">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {telexConfirmadoPorAnalista
                      ? 'Telex Release confirmado. Processo pronto para próxima etapa.'
                      : 'Telex Release confirmado pelo cliente.'}
                  </div>
                )}
                {state.ohblEnviado && (
                  <div className="flex items-center gap-2 text-xs text-success-600">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    OHBL recebido do cliente.
                  </div>
                )}
                {!state.telexConfirmado && !state.ohblEnviado && (
                  <div className="flex items-center gap-2 text-xs text-warning-600">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    Aguardando documentação do cliente.
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="right-panel-card">
              <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-secondary" />
                Timeline
              </h3>

              {processTimeline.length === 0 ? (
                <p className="text-xs text-text-tertiary py-2 text-center">
                  Nenhum evento registrado.
                </p>
              ) : (
                <div className="space-y-4">
                  {processTimeline.map((event) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {timelineAutorIcon(event.autor)}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-text-primary leading-relaxed">{event.descricao}</p>
                        <p className="text-[11px] text-text-tertiary mt-0.5">
                          {timeLabel(event.timestamp)} · {event.autor}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Static operational events for context */}
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Ship className="w-3.5 h-3.5 text-text-tertiary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Processo registrado no sistema.</p>
                    <p className="text-[11px] text-text-tertiary">Início</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
