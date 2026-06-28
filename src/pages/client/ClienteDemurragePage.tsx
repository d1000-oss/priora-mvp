import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { useGlobalState } from '../../context/GlobalState';
import {
  CheckCircle,
  AlertTriangle,
  Upload,
  Bell,
  Info,
  ChevronDown,
  ChevronUp,
  Calendar,
  Shield,
  Container,
  MoreVertical,
} from 'lucide-react';

interface ContainerData {
  id: string;
  numero: string;
  status: 'devolvido' | 'atencao' | 'critico';
  diasRestantes: number;
  diasUtilizados: number;
  freeTime: number;
  dataDevolucao?: string;
  minutaRecebida: boolean;
  retirada: string;
  ultimaAtualizacao: string;
  recomendacao: string;
}

export function ClienteDemurragePage() {
  const { addEvent } = useGlobalState();
  const [containers, setContainers] = useState<ContainerData[]>([
    {
      id: '1',
      numero: 'TCLU7887123',
      status: 'devolvido',
      diasRestantes: 0,
      diasUtilizados: 21,
      freeTime: 21,
      dataDevolucao: '12/07/2026',
      minutaRecebida: true,
      retirada: '12/07/2026',
      ultimaAtualizacao: '12/07/2026 às 14:30',
      recomendacao: 'Nenhuma ação necessária.',
    },
    {
      id: '2',
      numero: 'MSCU9988776',
      status: 'atencao',
      diasRestantes: 6,
      diasUtilizados: 15,
      freeTime: 21,
      minutaRecebida: false,
      retirada: '06/07/2026',
      ultimaAtualizacao: 'Hoje às 08:45',
      recomendacao: 'Anexar minuta de devolução em breve.',
    },
    {
      id: '3',
      numero: 'OOLU1234567',
      status: 'critico',
      diasRestantes: 1,
      diasUtilizados: 20,
      freeTime: 21,
      minutaRecebida: false,
      retirada: '01/07/2026',
      ultimaAtualizacao: 'Hoje às 09:12',
      recomendacao: 'Anexar minuta imediatamente.',
    },
  ]);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [uploadModal, setUploadModal] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [reminded, setReminded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      const containerId = uploadModal;
      setUploadModal(null);
      if (containerId) {
        setContainers((prev) =>
          prev.map((c) =>
            c.id === containerId
              ? { ...c, minutaRecebida: true, status: 'devolvido' as const, dataDevolucao: '22/06/2026' }
              : c
          )
        );
        addEvent({
          type: 'minuta_enviada',
          processoCodigo: 'IM2567',
          cliente: 'BRA TRADE',
          descricao: `Cliente enviou minuta de devolução via portal.`,
        });
      }
      setToast({ visible: true, message: 'Minuta enviada com sucesso.' });
    }, 2000);
  };

  const handleRemind = (id: string) => {
    setReminded((prev) => new Set(prev).add(id));
    setToast({ visible: true, message: 'Lembrete registrado.' });
  };

  const pendingContainers = containers.filter((c) => c.status !== 'devolvido');
  const allRegularized = pendingContainers.length === 0;

  const totalFreeTime = 21;
  const maxDiasUtilizados = Math.max(...containers.filter(c => c.status !== 'devolvido').map(c => c.diasUtilizados), 15);
  const diasRestantes = totalFreeTime - maxDiasUtilizados;
  const percentage = Math.round((maxDiasUtilizados / totalFreeTime) * 100);

  const getProgressColor = () => {
    if (percentage >= 95) return 'bg-danger-500';
    if (percentage >= 70) return 'bg-gradient-to-r from-success-500 via-warning-500 to-warning-500';
    return 'bg-success-500';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'devolvido':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-success-50 text-success-700 border border-success-200">
            <CheckCircle className="w-3 h-3" />
            Devolvido
          </span>
        );
      case 'atencao':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-warning-50 text-warning-700 border border-warning-200">
            <AlertTriangle className="w-3 h-3" />
            Atenção
          </span>
        );
      case 'critico':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-danger-50 text-danger-700 border border-danger-200">
            <AlertTriangle className="w-3 h-3" />
            Crítico
          </span>
        );
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'devolvido': return 'border-l-4 border-l-success-500';
      case 'atencao': return 'border-l-4 border-l-warning-500';
      case 'critico': return 'border-l-4 border-l-danger-500';
      default: return '';
    }
  };

  // Sort: critico first, then atencao, then devolvido
  const sortedContainers = [...containers].sort((a, b) => {
    const order = { critico: 0, atencao: 1, devolvido: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Controle de Containers</h1>
          <p className="text-sm text-text-secondary mt-1">
            Acompanhe a devolução dos containers e evite custos de Demurrage.
          </p>
        </div>

        {/* Priora Assistant Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-priora-100 to-priora-50 flex items-center justify-center flex-shrink-0 border border-priora-100">
              <div className="w-10 h-10 rounded-xl bg-priora-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-text-primary mb-2">Priora</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                Olá, equipe <span className="font-bold text-priora-700">BRA TRADE</span>.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed mt-2">
                Identificamos {containers.length} containers vinculados a este processo.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed mt-1">
                {pendingContainers.length > 0 ? (
                  <>Um deles <span className="font-bold text-text-primary">exige atenção</span>.</>
                ) : (
                  <>Todos estão regularizados.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Free Time Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <p className="text-xs text-text-tertiary mb-1">Free Time Contratado</p>
              <p className="text-3xl font-bold text-text-primary">
                {totalFreeTime} <span className="text-base font-normal text-text-tertiary">dias</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-1">Dias Utilizados</p>
              <p className="text-3xl font-bold text-text-primary">
                {maxDiasUtilizados} <span className="text-base font-normal text-text-tertiary">dias</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary mb-1">Dias Restantes</p>
              <p className="text-3xl font-bold text-text-primary">
                {diasRestantes} <span className="text-base font-normal text-text-tertiary">dias</span>
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            {/* Indicator dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-300 shadow-sm"
              style={{ left: `${percentage}%`, marginLeft: '-8px' }}
            />
          </div>
          <p className="text-center text-sm text-text-tertiary mt-3">
            {percentage}% do Free Time utilizado
          </p>
        </div>

        {/* All regularized empty state */}
        {allRegularized && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success-500" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Todos os containers estão regularizados.</h3>
            <p className="text-sm text-text-secondary">
              Nenhuma ação é necessária neste momento.
            </p>
          </div>
        )}

        {/* Container Cards */}
        <div className="space-y-4">
          {sortedContainers.map((container) => {
            const isExpanded = expandedIds.has(container.id);
            return (
              <div
                key={container.id}
                className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${getBorderColor(container.status)}`}
              >
                {/* Card header */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {/* Container icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        container.status === 'devolvido' ? 'bg-success-50' :
                        container.status === 'atencao' ? 'bg-warning-50' :
                        'bg-danger-50'
                      }`}>
                        <Container className={`w-6 h-6 ${
                          container.status === 'devolvido' ? 'text-success-600' :
                          container.status === 'atencao' ? 'text-warning-600' :
                          'text-danger-600'
                        }`} />
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-base font-bold text-text-primary">{container.numero}</span>
                          {getStatusBadge(container.status)}
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          {container.status === 'devolvido' ? (
                            <>
                              <div className="flex items-center gap-2 text-text-secondary">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Data da devolução</span>
                              </div>
                              <span className="font-semibold text-text-primary">{container.dataDevolucao}</span>
                              <div className="flex items-center gap-2 text-text-secondary">
                                <span>Minuta</span>
                              </div>
                              <span className="flex items-center gap-1 text-success-600 font-medium">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Recebida
                              </span>
                            </>
                          ) : (
                            <>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
                                  <span className={`font-semibold ${
                                    container.status === 'critico' ? 'text-danger-600' : 'text-warning-600'
                                  }`}>
                                    {container.diasRestantes === 1 ? 'Resta 1 dia' : `Restam ${container.diasRestantes} dias`}
                                  </span>
                                </div>
                                <p className="text-xs text-text-tertiary ml-5">de Free Time</p>
                              </div>
                              <div>
                                <p className="text-sm text-text-secondary">Minuta</p>
                                <span className="flex items-center gap-1 text-danger-600 text-xs font-medium">
                                  <AlertTriangle className="w-3 h-3" />
                                  Não enviada
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side: actions + expand */}
                    <div className="flex items-start gap-2 flex-shrink-0">
                      {container.status !== 'devolvido' && (
                        <div className="flex flex-col gap-2 items-end">
                          <button
                            onClick={() => setUploadModal(container.id)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-priora-600 text-white text-xs font-semibold rounded-xl hover:bg-priora-700 transition-all"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            {container.status === 'critico' ? 'Anexar minuta' : 'Anexar minuta de devolução'}
                          </button>
                          {container.status === 'atencao' && (
                            <button
                              onClick={() => handleRemind(container.id)}
                              disabled={reminded.has(container.id)}
                              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-text-primary text-xs font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50"
                            >
                              <Bell className="w-3.5 h-3.5" />
                              Lembrar depois
                            </button>
                          )}
                        </div>
                      )}
                      <button
                        onClick={() => toggleExpand(container.id)}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-text-tertiary" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-gray-50 animate-fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                      <div>
                        <p className="text-[10px] uppercase text-text-tertiary tracking-wide mb-0.5">Container</p>
                        <p className="text-sm font-semibold text-text-primary">{container.numero}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-text-tertiary tracking-wide mb-0.5">Retirada</p>
                        <p className="text-sm font-semibold text-text-primary">{container.retirada}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-text-tertiary tracking-wide mb-0.5">Free Time</p>
                        <p className="text-sm font-semibold text-text-primary">{container.freeTime} dias</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-text-tertiary tracking-wide mb-0.5">Dias Utilizados</p>
                        <p className="text-sm font-semibold text-text-primary">{container.diasUtilizados}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-text-tertiary tracking-wide mb-0.5">Dias Restantes</p>
                        <p className={`text-sm font-semibold ${
                          container.diasRestantes <= 1 ? 'text-danger-600' :
                          container.diasRestantes <= 6 ? 'text-warning-600' :
                          'text-text-primary'
                        }`}>{container.diasRestantes}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-text-tertiary tracking-wide mb-0.5">Minuta</p>
                        <p className={`text-sm font-semibold ${container.minutaRecebida ? 'text-success-600' : 'text-danger-600'}`}>
                          {container.minutaRecebida ? 'Recebida' : 'Não enviada'}
                        </p>
                      </div>
                      <div className="col-span-2 md:col-span-3">
                        <p className="text-[10px] uppercase text-text-tertiary tracking-wide mb-0.5">Última atualização</p>
                        <p className="text-sm text-text-secondary">{container.ultimaAtualizacao}</p>
                      </div>
                      <div className="col-span-2 md:col-span-3">
                        <p className="text-[10px] uppercase text-text-tertiary tracking-wide mb-0.5">Próxima recomendação</p>
                        <p className="text-sm font-medium text-text-primary">{container.recomendacao}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-text-secondary leading-relaxed">
              A Demurrage é calculada quando o container não é devolvido dentro do Free Time contratado.
            </p>
            <p className="text-sm text-text-secondary leading-relaxed mt-1">
              Caso o container já tenha sido devolvido, favor anexar a minuta de devolução.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal
        open={uploadModal !== null}
        onClose={() => setUploadModal(null)}
        title="Anexar Minuta de Devolução"
      >
        {!uploading ? (
          <>
            <p className="text-sm text-text-secondary mb-5">
              Selecione o arquivo da minuta de devolução. Formatos aceitos: PDF, JPG, PNG.
            </p>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-5 hover:border-priora-300 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-text-tertiary mx-auto mb-3" />
              <p className="text-sm font-medium text-text-primary mb-1">
                Arraste o arquivo ou clique para selecionar
              </p>
              <p className="text-xs text-text-tertiary">PDF, JPG ou PNG (máx. 10MB)</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleUpload} className="btn-primary-purple text-sm flex-1">
                <Upload className="w-4 h-4" />
                Enviar minuta
              </button>
              <button onClick={() => setUploadModal(null)} className="btn-ghost text-sm flex-1">
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-priora-100 border-t-priora-600 mx-auto mb-4 animate-spin" />
            <p className="text-sm font-medium text-text-primary mb-1">Enviando minuta...</p>
            <p className="text-xs text-text-tertiary">Aguarde um momento.</p>
          </div>
        )}
      </Modal>

      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  );
}
