import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { KPICard } from '../../components/KPICard';
import { StatusBadge } from '../../components/StatusBadge';
import { ActivityFeed } from '../../components/ActivityFeed';
import { SearchBar } from '../../components/SearchBar';
import { Toast } from '../../components/Toast';
import { Modal } from '../../components/Modal';
import {
  liberacaoProcessos,
  sortOptions,
  type LiberacaoProcesso,
  type SortOption,
  type Evidencia,
} from '../../data/liberacaoData';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  User,
  Ship,
  Calendar,
  MapPin,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  FileCheck,
  Play,
  Mail,
  FileText,
  Package,
  Send,
  Search,
  X,
  Sparkles,
  Anchor,
  Download,
  ExternalLink,
  CalendarCheck,
} from 'lucide-react';

function getStatusBadgeVariant(status: string) {
  if (status.includes('resolvido')) return 'green';
  if (status.includes('Apto')) return 'green';
  if (status.includes('Cliente')) return 'yellow';
  if (status.includes('Agente')) return 'orange';
  if (status.includes('Armador')) return 'blue';
  if (status.includes('Crítico')) return 'red';
  if (status.includes('Conflito')) return 'red';
  if (status.includes('Liberado')) return 'green';
  return 'gray';
}

function getResponsabilidadeColor(resp: string) {
  switch (resp) {
    case 'Cliente': return 'text-warning-600';
    case 'Rocket': return 'text-danger-600';
    case 'Agente': return 'text-orange-600';
    case 'Armador': return 'text-blue-600';
    case 'Conflito': return 'text-danger-600';
    default: return 'text-text-tertiary';
  }
}

function getCardIcon(processo: LiberacaoProcesso) {
  if (processo.status === 'Processo Crítico') return <AlertTriangle className="w-5 h-5 text-danger-500" />;
  if (processo.status === 'Apto para Liberação') return <CheckCircle className="w-5 h-5 text-success-500" />;
  if (processo.status === 'Conflito') return <AlertCircle className="w-5 h-5 text-danger-500" />;
  if (processo.status === 'Aguardando Armador') return <Anchor className="w-5 h-5 text-blue-500" />;
  return <User className="w-5 h-5 text-warning-500" />;
}

function getCardIconBg(processo: LiberacaoProcesso) {
  if (processo.status === 'Processo Crítico') return 'bg-danger-50';
  if (processo.status === 'Apto para Liberação') return 'bg-success-50';
  if (processo.status === 'Conflito') return 'bg-danger-50';
  if (processo.status === 'Aguardando Armador') return 'bg-blue-50';
  return 'bg-warning-50';
}

function getEvidenciaIcon(tipo: string) {
  switch (tipo) {
    case 'email': return <Mail className="w-3.5 h-3.5 text-priora-500" />;
    case 'termo': return <FileText className="w-3.5 h-3.5 text-priora-500" />;
    case 'ohbl': return <FileCheck className="w-3.5 h-3.5 text-priora-500" />;
    case 'courier': return <Package className="w-3.5 h-3.5 text-priora-500" />;
    case 'agendamento': return <Calendar className="w-3.5 h-3.5 text-priora-500" />;
    case 'memorando': return <FileText className="w-3.5 h-3.5 text-priora-500" />;
    case 'telex': return <Send className="w-3.5 h-3.5 text-priora-500" />;
    case 'procuracao': return <FileCheck className="w-3.5 h-3.5 text-priora-500" />;
    default: return <FileText className="w-3.5 h-3.5 text-priora-500" />;
  }
}

function getActionIcon(tipo: string) {
  switch (tipo) {
    case 'agendar': return <Play className="w-3.5 h-3.5" />;
    case 'cobrar_agente': return <Mail className="w-3.5 h-3.5" />;
    case 'solicitar_ohbl': return <FileCheck className="w-3.5 h-3.5" />;
    case 'contatar_cliente': return <User className="w-3.5 h-3.5" />;
    case 'revisar_conflito': return <Search className="w-3.5 h-3.5" />;
    case 'enviar_memorando': return <FileText className="w-3.5 h-3.5" />;
    default: return <ArrowRight className="w-3.5 h-3.5" />;
  }
}

function sortProcessos(processos: LiberacaoProcesso[], sort: SortOption): LiberacaoProcesso[] {
  const sorted = [...processos];
  switch (sort) {
    case 'criticidade': return sorted.sort((a, b) => b.criticidade - a.criticidade);
    case 'eta': return sorted.sort((a, b) => a.eta.localeCompare(b.eta));
    case 'parado': return sorted.sort((a, b) => b.diasParado - a.diasParado);
    case 'rocket': return sorted.filter(p => p.responsabilidade === 'Rocket').concat(sorted.filter(p => p.responsabilidade !== 'Rocket'));
    case 'cliente': return sorted.filter(p => p.responsabilidade === 'Cliente').concat(sorted.filter(p => p.responsabilidade !== 'Cliente'));
    case 'agente': return sorted.filter(p => p.responsabilidade === 'Agente').concat(sorted.filter(p => p.responsabilidade !== 'Agente'));
    case 'armador': return sorted.filter(p => p.responsabilidade === 'Armador').concat(sorted.filter(p => p.responsabilidade !== 'Armador'));
    default: return sorted;
  }
}

export function LiberacaoPage() {
  const [searchParams] = useSearchParams();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const target = searchParams.get('processo');
    if (target) {
      const match = liberacaoProcessos.find((p) => p.codigo === target);
      if (match) return new Set([match.id]);
    }
    return new Set();
  });
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [currentSort, setCurrentSort] = useState<SortOption>('criticidade');
  const [drawerEvidence, setDrawerEvidence] = useState<Evidencia | null>(null);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [agendamentoModal, setAgendamentoModal] = useState<{ open: boolean; codigo: string; id: string }>({ open: false, codigo: '', id: '' });
  const [agendamentoFeito, setAgendamentoFeito] = useState<Set<string>>(new Set());
  const [conflitosModal, setConflitosModal] = useState<{ open: boolean; processoId: string }>({ open: false, processoId: '' });
  const [negarModal, setNegarModal] = useState(false);
  const [conflitoResolucao, setConflitoResolucao] = useState<Record<string, 'telex_aceito' | 'telex_negado'>>({});
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = searchParams.get('processo');
    if (!target) return;
    const match = liberacaoProcessos.find((p) => p.codigo === target);
    if (!match) return;
    const timer = setTimeout(() => {
      cardRefs.current[match.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sorted = sortProcessos(liberacaoProcessos, currentSort);

  const handleAction = (label: string, codigo: string) => {
    setToast({ visible: true, message: `"${label}" executado para ${codigo}.` });
  };

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Liberação</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Fila inteligente de processos prontos para liberação
            </p>
          </div>
          <div className="w-80">
            <SearchBar placeholder="Buscar processo, cliente, navio ou container..." showShortcut />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main */}
          <div className="space-y-6">
            {/* KPIs */}
            <div className="kpi-grid">
              <KPICard
                label="Aptos para Liberação"
                value={18}
                sublabel="Processos prontos"
                icon={<CheckCircle className="w-5 h-5 text-success-500" />}
                variant="success"
              />
              <KPICard
                label="Aguardando Cliente"
                value={6}
                sublabel="Documentação pendente"
                icon={<User className="w-5 h-5 text-warning-500" />}
                variant="warning"
              />
              <KPICard
                label="Aguardando Agente"
                value={3}
                sublabel="Aguardando ação"
                icon={<Clock className="w-5 h-5 text-orange-500" />}
                variant="info"
              />
              <KPICard
                label="Aguardando Rocket"
                value={2}
                sublabel="Análise interna pendente"
                icon={<AlertCircle className="w-5 h-5 text-danger-500" />}
                variant="danger"
              />
            </div>

            {/* Sort bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-text-tertiary mr-1">Ordenar por:</span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setCurrentSort(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    currentSort === opt.id
                      ? 'bg-priora-600 text-white'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Process cards */}
            <div className="space-y-3">
              {sorted.map((p) => {
                const isExpanded = expandedIds.has(p.id);
                const resolucao = conflitoResolucao[p.id] as 'telex_aceito' | 'telex_negado' | undefined;
                const effectiveProximaAcao = resolucao === 'telex_aceito'
                  ? { label: 'Iniciar Agendamento', tipo: 'agendar' as const }
                  : p.proximaAcao;
                const feito = effectiveProximaAcao.tipo === 'agendar' && agendamentoFeito.has(p.id);
                const effectiveStatus = resolucao === 'telex_aceito' ? 'Apto para Liberação'
                  : resolucao === 'telex_negado' ? 'Conflito resolvido'
                  : feito ? 'Agendamento confirmado'
                  : p.status;
                const effectiveClaraConclusao = resolucao === 'telex_aceito'
                  ? 'Telex Release aceito apesar do conflito documental. Responsabilidade assumida pela Rocket.'
                  : resolucao === 'telex_negado'
                  ? 'Conflito resolvido. Cliente notificado sobre o OHBL físico enviado via courier.'
                  : feito
                  ? 'Agendamento realizado e aguardando confirmação para envio à agência Unimar.'
                  : p.claraConclusao;
                const effectiveClaraCor = resolucao ? 'green' : feito ? 'green' : p.claraCor;
                const effectiveResponsabilidade = resolucao === 'telex_aceito' ? 'Rocket'
                  : feito ? 'Armador'
                  : p.responsabilidade;
                return (
                  <div key={p.id} ref={(el) => { cardRefs.current[p.id] = el; }} className="card">
                    {/* Collapsed row */}
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => toggleExpand(p.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getCardIconBg(p)}`}>
                          {getCardIcon(p)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-text-primary">{p.codigo} — {p.cliente}</span>
                            <StatusBadge variant={getStatusBadgeVariant(effectiveStatus) as any}>{effectiveStatus}</StatusBadge>
                          </div>
                          <div className="flex items-center gap-4 mt-1.5 text-xs text-text-tertiary flex-wrap">
                            <span className="flex items-center gap-1"><Ship className="w-3 h-3" />{p.navio}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />ETA: {p.eta}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.local}</span>
                          </div>
                          {/* Stagnation indicator */}
                          <div className="mt-2 flex items-center gap-2">
                            <Clock className="w-3 h-3 text-text-tertiary" />
                            <span className="text-[11px] text-text-tertiary italic">{p.estagnacao}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-[10px] text-text-tertiary">Responsável:</p>
                          <p className={`text-xs font-semibold ${getResponsabilidadeColor(effectiveResponsabilidade)}`}>
                            {effectiveResponsabilidade}
                          </p>
                        </div>
                        {effectiveStatus === 'Processo Crítico' && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-danger-50 rounded-lg text-[10px] font-semibold text-danger-700">
                            <AlertTriangle className="w-3 h-3" />
                            Risco
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-text-tertiary" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-text-tertiary" />
                        )}
                      </div>
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
                        {/* Clara conclusion */}
                        <div className={`rounded-xl p-4 mb-5 ${
                          effectiveClaraCor === 'green' ? 'bg-success-50 border border-success-100' :
                          effectiveClaraCor === 'yellow' ? 'bg-warning-50 border border-warning-100' :
                          effectiveClaraCor === 'orange' ? 'bg-orange-50 border border-orange-100' :
                          'bg-danger-50 border border-danger-100'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                              <Sparkles className={`w-4 h-4 ${
                                effectiveClaraCor === 'green' ? 'text-success-600' :
                                effectiveClaraCor === 'yellow' ? 'text-warning-600' :
                                effectiveClaraCor === 'orange' ? 'text-orange-600' :
                                'text-danger-600'
                              }`} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-text-primary mb-0.5">Clara</p>
                              <p className="text-sm text-text-primary font-medium">{effectiveClaraConclusao}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {/* O que temos */}
                          <div>
                            <p className="text-xs font-semibold text-text-primary flex items-center gap-1.5 mb-3">
                              <CheckCircle className="w-3.5 h-3.5 text-success-500" />
                              O que temos
                            </p>
                            <div className="space-y-2">
                              {p.oQueTemos.map((item) => (
                                <div key={item.item} className="flex items-center gap-2 text-xs">
                                  {item.ok ? (
                                    <CheckCircle className="w-3.5 h-3.5 text-success-500 flex-shrink-0" />
                                  ) : (
                                    <AlertCircle className="w-3.5 h-3.5 text-danger-400 flex-shrink-0" />
                                  )}
                                  <span className={item.ok ? 'text-text-secondary' : 'text-danger-600 font-medium'}>
                                    {item.item}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Responsabilidade */}
                            <div className="mt-4 pt-3 border-t border-gray-100">
                              <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-1">Responsabilidade Atual</p>
                              <p className={`text-sm font-bold ${getResponsabilidadeColor(effectiveResponsabilidade)}`}>
                                {effectiveResponsabilidade}
                              </p>
                            </div>
                          </div>

                          {/* Evidências */}
                          <div>
                            <p className="text-xs font-semibold text-text-primary flex items-center gap-1.5 mb-3">
                              <FileCheck className="w-3.5 h-3.5 text-priora-500" />
                              Evidências
                            </p>
                            <div className="space-y-1.5">
                              {p.evidencias.map((ev) => (
                                <button
                                  key={ev.id}
                                  onClick={(e) => { e.stopPropagation(); setDrawerEvidence(ev); }}
                                  className="w-full flex items-center justify-between text-xs text-text-secondary group hover:text-priora-600 py-1.5 px-2 rounded-lg hover:bg-priora-50/50 transition-all"
                                >
                                  <div className="flex items-center gap-2">
                                    {getEvidenciaIcon(ev.tipo)}
                                    <span>{ev.label}</span>
                                  </div>
                                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              ))}
                            </div>

                            {/* Historico resumido */}
                            <div className="mt-4 pt-3 border-t border-gray-100">
                              <p className="text-[10px] text-text-tertiary uppercase tracking-wide mb-2">Histórico</p>
                              <div className="space-y-1.5">
                                {p.historico.slice(-4).map((h, i) => (
                                  <div key={i} className="flex items-center gap-2 text-[11px]">
                                    <span className="text-text-tertiary w-10 flex-shrink-0">{h.data}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-priora-300 flex-shrink-0" />
                                    <span className="text-text-secondary">{h.descricao}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Proxima ação */}
                          <div>
                            <p className="text-xs font-semibold text-text-primary flex items-center gap-1.5 mb-3">
                              <ArrowRight className="w-3.5 h-3.5 text-success-500" />
                              Próxima ação recomendada
                            </p>
                            {feito ? (
                              <div className="flex items-center gap-2 p-3 bg-success-50 border border-success-100 rounded-xl">
                                <CalendarCheck className="w-4 h-4 text-success-600 flex-shrink-0" />
                                <span className="text-xs font-semibold text-success-700">Agendamento realizado</span>
                              </div>
                            ) : resolucao === 'telex_negado' ? (
                              <div className="flex items-center gap-2 p-3 bg-success-50 border border-success-100 rounded-xl">
                                <CheckCircle className="w-4 h-4 text-success-600 flex-shrink-0" />
                                <span className="text-xs font-semibold text-success-700">Conflito resolvido — OHBL confirmado</span>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (effectiveProximaAcao.tipo === 'agendar') {
                                    setAgendamentoModal({ open: true, codigo: p.codigo, id: p.id });
                                  } else if (effectiveProximaAcao.tipo === 'revisar_conflito') {
                                    setConflitosModal({ open: true, processoId: p.id });
                                  } else {
                                    handleAction(effectiveProximaAcao.label, p.codigo);
                                  }
                                }}
                                className="btn-primary-purple text-xs w-full"
                              >
                                {getActionIcon(effectiveProximaAcao.tipo)}
                                {effectiveProximaAcao.label}
                              </button>
                            )}
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={(e) => { e.stopPropagation(); setDrawerEvidence(p.evidencias[0] || null); }}
                                className="btn-secondary text-xs flex-1"
                              >
                                Ver Evidências
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAction('Abrir Processo', p.codigo); }}
                                className="btn-secondary text-xs flex-1"
                              >
                                Abrir Processo
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center py-4">
              <p className="text-sm text-text-tertiary">
                Mostrando {sorted.length} de 29 processos
              </p>
              <button className="text-sm font-medium text-priora-600 hover:text-priora-700 flex items-center gap-1 mx-auto mt-1">
                Ver todos os processos <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="right-panel">
            <div className="right-panel-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-text-primary">Prontos para Liberar</h3>
                <button className="text-xs text-priora-600 font-medium">Ver todos</button>
              </div>
              <div className="space-y-3">
                {liberacaoProcessos
                  .filter((p) => p.status === 'Apto para Liberação')
                  .slice(0, 3)
                  .map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-priora-50 flex items-center justify-center">
                          <Ship className="w-3.5 h-3.5 text-priora-500" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-primary">{p.codigo} — {p.cliente}</p>
                          <p className="text-[11px] text-text-tertiary">{p.navio}</p>
                        </div>
                      </div>
                      <StatusBadge variant="green">Apto</StatusBadge>
                    </div>
                  ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50 text-center">
                <span className="text-xs text-priora-600 font-medium">Total de 18 processos</span>
              </div>
            </div>

            <div className="right-panel-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-text-primary">Riscos de Atraso</h3>
                <button className="text-xs text-priora-600 font-medium">Ver todos</button>
              </div>
              <div className="space-y-3">
                {liberacaoProcessos
                  .filter((p) => p.criticidade >= 7)
                  .sort((a, b) => b.criticidade - a.criticidade)
                  .slice(0, 3)
                  .map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 text-danger-500" />
                        <div>
                          <p className="text-xs font-semibold text-text-primary">{p.codigo} — {p.cliente}</p>
                          <p className="text-[11px] text-text-tertiary">{p.estagnacao}</p>
                        </div>
                      </div>
                      <StatusBadge variant={p.criticidade >= 9 ? 'red' : p.criticidade >= 7 ? 'orange' : 'yellow'}>
                        {p.criticidade >= 9 ? 'Crítico' : p.criticidade >= 7 ? 'Alto' : 'Médio'}
                      </StatusBadge>
                    </div>
                  ))}
              </div>
            </div>

            <ActivityFeed />
          </div>
        </div>
      </div>

      {/* Evidence Drawer */}
      {drawerEvidence && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setDrawerEvidence(null)} />
          <div ref={drawerRef} className="relative w-full max-w-md bg-white shadow-xl animate-slide-in overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-text-primary">Evidência</h3>
              <button onClick={() => setDrawerEvidence(null)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-priora-50 flex items-center justify-center">
                  {getEvidenciaIcon(drawerEvidence.tipo)}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{drawerEvidence.label}</p>
                  <p className="text-xs text-text-tertiary capitalize">{drawerEvidence.tipo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-text-tertiary mb-0.5">Data</p>
                  <p className="text-xs font-semibold text-text-primary">{drawerEvidence.data}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-text-tertiary mb-0.5">Fonte</p>
                  <p className="text-xs font-semibold text-text-primary">{drawerEvidence.fonte}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-primary mb-1.5">Resumo</p>
                <p className="text-sm text-text-secondary">{drawerEvidence.resumo}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-primary mb-1.5">Evidência Original</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs text-text-secondary font-mono leading-relaxed">{drawerEvidence.original}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal open={agendamentoModal.open} onClose={() => setAgendamentoModal({ open: false, codigo: '', id: '' })} title="Iniciar agendamento">
        <p className="text-sm text-text-secondary mb-5">
          Os documentos necessários para o agendamento já estão disponíveis.
        </p>

        <div className="mb-5">
          <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wide mb-3">Documentos</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-priora-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-priora-500" />
                </div>
                <span className="text-sm font-medium text-text-primary">MBL</span>
              </div>
              <button
                onClick={() => setToast({ visible: true, message: 'MBL disponível' })}
                className="flex items-center gap-1.5 text-xs font-medium text-priora-600 hover:text-priora-700 px-3 py-1.5 rounded-lg hover:bg-priora-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar MBL
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-priora-50 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-4 h-4 text-priora-500" />
                </div>
                <span className="text-sm font-medium text-text-primary">Procuração</span>
              </div>
              <button
                onClick={() => setToast({ visible: true, message: 'Procuração disponível' })}
                className="flex items-center gap-1.5 text-xs font-medium text-priora-600 hover:text-priora-700 px-3 py-1.5 rounded-lg hover:bg-priora-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Baixar Procuração
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wide mb-3">Portal do Armador</p>
          <button
            onClick={() => setToast({ visible: true, message: 'Abrindo portal do armador...' })}
            className="btn-primary-purple text-sm w-full"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir portal do armador
          </button>
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100">
          <button
            onClick={() => {
              setAgendamentoFeito((prev) => new Set([...prev, agendamentoModal.id]));
              setAgendamentoModal({ open: false, codigo: '', id: '' });
              setToast({ visible: true, message: `Agendamento confirmado para ${agendamentoModal.codigo}.` });
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-success-600 hover:bg-success-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            Confirmar agendamento
          </button>
        </div>
      </Modal>

      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />

      {/* Conflict review modal */}
      <Modal
        open={conflitosModal.open}
        onClose={() => setConflitosModal({ open: false, processoId: '' })}
        title="Revisar conflito"
      >
        <p className="text-sm text-text-secondary mb-5">
          Cliente solicitou Telex Release, porém o agente informou envio de OHBL físico via courier.
        </p>

        <div className="mb-5">
          <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wide mb-3">Evidências identificadas</p>
          <div className="space-y-2">
            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <AlertCircle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-text-secondary">OHBL enviado via courier ao cliente, informado pelo agente.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
              <AlertCircle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-text-secondary">Foto do OHBL em mãos não anexada no portal do cliente.</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setNegarModal(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-danger-50 hover:bg-danger-100 text-danger-700 text-sm font-semibold border border-danger-200 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
            Negar Telex Release ao cliente
          </button>
          <button
            onClick={() => {
              setConflitoResolucao((prev) => ({ ...prev, [conflitosModal.processoId]: 'telex_aceito' }));
              setConflitosModal({ open: false, processoId: '' });
              setToast({ visible: true, message: 'Telex Release aceito. Processo encaminhado para agendamento.' });
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-success-600 hover:bg-success-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Aceitar Telex Release
          </button>
        </div>
      </Modal>

      {/* Negar Telex confirmation modal */}
      <Modal
        open={negarModal}
        onClose={() => setNegarModal(false)}
        title="Confirmar negação"
      >
        <div className="bg-warning-50 border border-warning-100 rounded-xl p-4 mb-5">
          <p className="text-sm text-text-primary leading-relaxed">
            "Fomos informados pelo exportador que o OHBL foi enviado via courier ao cliente. Essa informação foi confirmada pelo nosso agente."
          </p>
        </div>

        <p className="text-sm font-semibold text-text-primary mb-5">
          Deseja enviar essa notificação para o portal do cliente?
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setConflitoResolucao((prev) => ({ ...prev, [conflitosModal.processoId]: 'telex_negado' }));
              setNegarModal(false);
              setConflitosModal({ open: false, processoId: '' });
              setToast({ visible: true, message: 'Notificação enviada ao portal do cliente.' });
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-priora-600 hover:bg-priora-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
            Enviar notificação
          </button>
          <button onClick={() => setNegarModal(false)} className="flex-1 btn-ghost text-sm">
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}
