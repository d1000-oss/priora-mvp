import { useState } from 'react';
import { useGlobalState } from '../../context/GlobalState';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import {
  Upload,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Ship,
  Sparkles,
  FileText,
  Bell,
  Clock,
  Minus,
  Shield,
} from 'lucide-react';

interface ReceivedItem {
  id: string;
  label: string;
  status: 'recebido' | 'nao_necessario';
  dataEnvio?: string;
  nomeArquivo?: string;
  validacao?: string;
}

export function ClienteLiberacaoPage() {
  const { addEvent } = useGlobalState();
  const [ohblSent, setOhblSent] = useState(false);
  const [telexConfirmed, setTelexConfirmed] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [telexModal, setTelexModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [expandedReceived, setExpandedReceived] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [reminded, setReminded] = useState(false);

  const receivedItems: ReceivedItem[] = [
    { id: 'termo', label: 'Termo por Embarque', status: 'recebido', dataEnvio: '12/06/2026', nomeArquivo: 'termo_embarque_IM2591.pdf', validacao: 'Validado pela equipe operacional' },
    { id: 'procuracao', label: 'Procuração', status: 'recebido', dataEnvio: '10/06/2026', nomeArquivo: 'procuracao_bratrade_2026.pdf', validacao: 'Validado pela equipe operacional' },
  ];

  const toggleItemExpand = (id: string) => {
    setExpandedItems((prev) => {
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
      setUploadModal(false);
      setOhblSent(true);
      setToast({ visible: true, message: 'Documento enviado com sucesso.' });
      addEvent({
        type: 'ohbl_enviado',
        processoCodigo: 'IM2591',
        cliente: 'BRA TRADE',
        descricao: 'Cliente enviou OHBL via portal.',
      });
    }, 2000);
  };

  const handleTelexConfirm = () => {
    setTelexModal(false);
    setTelexConfirmed(true);
    setToast({ visible: true, message: 'Telex Release informado com sucesso.' });
    addEvent({
      type: 'telex_confirmado',
      processoCodigo: 'IM2591',
      cliente: 'BRA TRADE',
      descricao: 'Cliente confirmou Telex Release via portal.',
    });
  };

  const handleRemind = () => {
    setReminded(true);
    setToast({ visible: true, message: 'Lembrete registrado.' });
  };

  const actionResolved = ohblSent || telexConfirmed;

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Journey Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-priora-500" />
                <span className="text-base font-bold text-text-primary">Shanghai</span>
              </div>
              <p className="text-xs text-text-tertiary">ETD: 06/05</p>
            </div>

            {/* Dashed line with ship */}
            <div className="flex-1 flex items-center mx-6 relative">
              <div className="w-full border-t-2 border-dashed border-priora-200" />
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2">
                <div className="w-12 h-12 rounded-full bg-priora-50 border-2 border-priora-200 flex items-center justify-center">
                  <Ship className="w-5 h-5 text-priora-600" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-text-primary">Navegantes</span>
                <span className="w-2.5 h-2.5 rounded-full bg-priora-500" />
              </div>
              <p className="text-xs text-text-tertiary">ETA: 29/07</p>
            </div>
          </div>
          <p className="text-center text-sm text-text-tertiary mt-4">
            Navio: CMA CGM KRYPTON
          </p>
        </div>

        {/* Priora Assistant Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start gap-5">
            {/* Robot avatar */}
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
                Sua carga está prevista para atracar em <span className="font-bold text-priora-700">29/07</span>.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed mt-2">
                Para garantirmos uma liberação rápida,<br />
                precisamos apenas deste item:
              </p>
            </div>
          </div>

          {/* Helper message */}
          <div className="mt-5 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <Sparkles className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <p className="text-sm text-text-tertiary">
              Mostramos apenas o que precisa da sua atenção.
            </p>
          </div>
        </div>

        {/* Action Center */}
        {!actionResolved ? (
          <div className="bg-white rounded-2xl border-2 border-priora-100 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-text-primary">OHBL</h3>
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-priora-50 text-priora-700 border border-priora-200">
                    Pendente
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-sm text-text-secondary">Status:</span>
                  <span className="w-2 h-2 rounded-full bg-danger-500" />
                  <span className="text-sm font-medium text-danger-600">Aguardando envio</span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => setUploadModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-priora-600 text-white text-sm font-semibold rounded-xl hover:bg-priora-700 transition-all shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Enviar documento
                  </button>
                  <button
                    onClick={() => setTelexModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white text-text-primary text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marcar como Telex Release
                  </button>
                  <button
                    onClick={handleRemind}
                    disabled={reminded}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-white text-text-primary text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Bell className="w-4 h-4" />
                    Lembrar depois
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty state — all resolved */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success-500" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Tudo certo</h3>
            <p className="text-sm text-text-secondary">
              Não identificamos nenhuma pendência para este processo.
            </p>
          </div>
        )}

        {/* Received Items Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Header */}
          <button
            onClick={() => setExpandedReceived(!expandedReceived)}
            className="w-full flex items-center justify-between p-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-success-600" />
              </div>
              <span className="text-base font-bold text-text-primary">
                Itens já recebidos ({ohblSent ? receivedItems.length + 1 : receivedItems.length})
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-text-tertiary">
              <span>Ver detalhes</span>
              {expandedReceived ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {/* Items list */}
          {expandedReceived && (
            <div className="border-t border-gray-50 animate-fade-in">
              {/* OHBL if sent */}
              {ohblSent && (
                <div className="border-b border-gray-50">
                  <button
                    onClick={() => toggleItemExpand('ohbl')}
                    className="w-full flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-success-100 flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-success-600" />
                      </div>
                      <span className="text-sm font-bold text-text-primary">OHBL</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-success-50 text-success-700 border border-success-200">
                        Recebido
                      </span>
                      {expandedItems.has('ohbl') ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
                    </div>
                  </button>
                  {expandedItems.has('ohbl') && (
                    <div className="px-5 pb-4 pl-16 animate-fade-in">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-text-tertiary mb-0.5">Data de envio</p>
                          <p className="font-medium text-text-primary">Hoje</p>
                        </div>
                        <div>
                          <p className="text-text-tertiary mb-0.5">Arquivo</p>
                          <p className="font-medium text-text-primary">ohbl_IM2591.pdf</p>
                        </div>
                        <div>
                          <p className="text-text-tertiary mb-0.5">Validação</p>
                          <p className="font-medium text-priora-600">Em análise</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {receivedItems.map((item) => (
                <div key={item.id} className="border-b border-gray-50 last:border-b-0">
                  <button
                    onClick={() => toggleItemExpand(item.id)}
                    className="w-full flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-success-100 flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-success-600" />
                      </div>
                      <span className="text-sm font-bold text-text-primary">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-success-50 text-success-700 border border-success-200">
                        Recebido
                      </span>
                      {expandedItems.has(item.id) ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
                    </div>
                  </button>
                  {expandedItems.has(item.id) && (
                    <div className="px-5 pb-4 pl-16 animate-fade-in">
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-text-tertiary mb-0.5">Data de envio</p>
                          <p className="font-medium text-text-primary">{item.dataEnvio}</p>
                        </div>
                        <div>
                          <p className="text-text-tertiary mb-0.5">Arquivo</p>
                          <p className="font-medium text-text-primary">{item.nomeArquivo}</p>
                        </div>
                        <div>
                          <p className="text-text-tertiary mb-0.5">Validação</p>
                          <p className="font-medium text-success-600">{item.validacao}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Prazo de Pagamento — optional / not required */}
              <div className="border-t border-gray-50">
                <button
                  onClick={() => toggleItemExpand('prazo')}
                  className="w-full flex items-center justify-between px-5 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                      <Minus className="w-3.5 h-3.5 text-text-tertiary" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-bold text-text-primary">Prazo de Pagamento</span>
                      <p className="text-xs text-text-tertiary mt-0.5">Cliente possui prazo de pagamento.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-text-tertiary border border-gray-200">
                      Não necessário
                    </span>
                    {expandedItems.has('prazo') ? <ChevronUp className="w-4 h-4 text-text-tertiary" /> : <ChevronDown className="w-4 h-4 text-text-tertiary" />}
                  </div>
                </button>
                {expandedItems.has('prazo') && (
                  <div className="px-5 pb-4 pl-16 animate-fade-in">
                    <p className="text-xs text-text-secondary">
                      Este cliente possui condição de prazo de pagamento previamente acordada. Nenhuma ação necessária.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer message */}
        <div className="flex items-center justify-center gap-2 py-4">
          <Clock className="w-4 h-4 text-text-tertiary" />
          <p className="text-sm text-text-tertiary">
            Todas as informações são atualizadas pela nossa equipe.
          </p>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal open={uploadModal} onClose={() => setUploadModal(false)} title="Enviar Documento">
        {!uploading ? (
          <>
            <p className="text-sm text-text-secondary mb-5">
              Selecione o arquivo do OHBL para envio. Formatos aceitos: PDF, JPG, PNG.
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
                Enviar documento
              </button>
              <button onClick={() => setUploadModal(false)} className="btn-ghost text-sm flex-1">
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-priora-100 border-t-priora-600 mx-auto mb-4 animate-spin" />
            <p className="text-sm font-medium text-text-primary mb-1">Enviando documento...</p>
            <p className="text-xs text-text-tertiary">Aguarde um momento.</p>
          </div>
        )}
      </Modal>

      {/* Telex Release Modal */}
      <Modal open={telexModal} onClose={() => setTelexModal(false)} title="Confirmar Telex Release">
        <p className="text-sm text-text-secondary mb-6">
          Confirma que este embarque será liberado via Telex Release?
        </p>
        <div className="bg-priora-50 rounded-xl p-4 mb-6 border border-priora-100">
          <p className="text-xs text-priora-700">
            Ao confirmar, a equipe operacional será notificada e o OHBL físico não será necessário.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleTelexConfirm} className="btn-primary-purple text-sm flex-1">
            Confirmar
          </button>
          <button onClick={() => setTelexModal(false)} className="btn-ghost text-sm flex-1">
            Cancelar
          </button>
        </div>
      </Modal>

      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  );
}
