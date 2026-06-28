import { useState } from 'react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { useGlobalState } from '../../context/GlobalState';
import {
  Ship,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Info,
  Map,
} from 'lucide-react';

type DecisionOption = 'retirar' | 'nao_retirar' | 'decidir_depois';

export function ClienteRetiradaPage() {
  const { addEvent } = useGlobalState();
  const [selected, setSelected] = useState<DecisionOption>('retirar');
  const [confirmed, setConfirmed] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const handleConfirmAction = () => {
    setConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    setConfirmModal(false);
    setConfirmed(true);

    let descricao = '';
    let toastMsg = '';

    switch (selected) {
      case 'retirar':
        descricao = 'Cliente solicitou retirada física do documento.';
        toastMsg = 'Solicitação registrada com sucesso.';
        break;
      case 'nao_retirar':
        descricao = 'Cliente dispensou retirada física.';
        toastMsg = 'Escolha registrada com sucesso.';
        break;
      case 'decidir_depois':
        descricao = 'Aguardando definição do cliente.';
        toastMsg = 'Lembrete registrado.';
        break;
    }

    addEvent({
      type: 'retirada_documento',
      processoCodigo: 'IM2591',
      cliente: 'BRA TRADE',
      descricao,
    });

    setToast({ visible: true, message: toastMsg });
  };

  const getButtonLabel = () => {
    switch (selected) {
      case 'retirar': return 'Confirmar Solicitação';
      case 'nao_retirar': return 'Confirmar Escolha';
      case 'decidir_depois': return 'Registrar Decisão';
    }
  };

  const getModalMessage = () => {
    switch (selected) {
      case 'retirar': return 'Confirma sua intenção de retirar o documento físico?';
      case 'nao_retirar': return 'Confirma que não precisará do documento físico?';
      case 'decidir_depois': return 'Deseja registrar que decidirá posteriormente?';
    }
  };

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
                O HBL deste processo foi validado, impresso e assinado.
              </p>
              <p className="text-sm text-text-secondary leading-relaxed mt-1">
                O documento encontra-se <span className="font-bold text-success-600">disponível para retirada</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Document Card + Decision */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {/* Document header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
              <FileText className="w-6 h-6 text-text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-text-primary">HBL Original</h3>
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-success-50 text-success-700 border border-success-200">
                  Disponível para retirada
                </span>
              </div>
              <p className="text-xs text-text-tertiary mt-0.5">1 documento disponível</p>
            </div>
          </div>

          {/* Decision section */}
          {!confirmed ? (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h4 className="text-base font-bold text-text-primary mb-1">
                Deseja retirar o documento físico?
              </h4>
              <p className="text-xs text-text-tertiary flex items-center gap-1.5 mb-4">
                <Info className="w-3.5 h-3.5" />
                A retirada deve ser feita pelo representante da empresa.
              </p>

              {/* Options */}
              <div className="space-y-3">
                <button
                  onClick={() => setSelected('retirar')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    selected === 'retirar'
                      ? 'border-priora-500 bg-priora-50/50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <CheckCircle className={`w-5 h-5 flex-shrink-0 ${
                    selected === 'retirar' ? 'text-priora-600' : 'text-text-tertiary'
                  }`} />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Sim, desejo retirar</p>
                    <p className="text-xs text-text-tertiary">Irei retirar o documento.</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelected('nao_retirar')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    selected === 'nao_retirar'
                      ? 'border-priora-500 bg-priora-50/50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <XCircle className={`w-5 h-5 flex-shrink-0 ${
                    selected === 'nao_retirar' ? 'text-priora-600' : 'text-text-tertiary'
                  }`} />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Não desejo retirar</p>
                    <p className="text-xs text-text-tertiary">Não precisarei do documento físico.</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelected('decidir_depois')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    selected === 'decidir_depois'
                      ? 'border-priora-500 bg-priora-50/50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Clock className={`w-5 h-5 flex-shrink-0 ${
                    selected === 'decidir_depois' ? 'text-priora-600' : 'text-text-tertiary'
                  }`} />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Decidirei posteriormente</p>
                    <p className="text-xs text-text-tertiary">Avisarei mais tarde.</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-success-50 rounded-xl p-5 border border-success-100 text-center">
              <CheckCircle className="w-8 h-8 text-success-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-success-700">
                {selected === 'retirar' && 'Solicitação de retirada registrada.'}
                {selected === 'nao_retirar' && 'Escolha registrada. Documento não será retirado.'}
                {selected === 'decidir_depois' && 'Decisão pendente registrada.'}
              </p>
            </div>
          )}

          {/* Location + Hours side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {/* Pickup Location */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-text-secondary" />
                <p className="text-sm font-bold text-text-primary">Local da retirada</p>
              </div>
              <p className="text-sm font-semibold text-text-primary">Priora Logistics</p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Rua Lauro Muller, 116 – Sala 1002<br />
                Centro – Itajaí/SC – CEP 88301-400
              </p>
              <a
                href="https://www.google.com/maps/search/Rua+Lauro+Muller+116+Itajai+SC"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-3 py-2 bg-white text-text-primary text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <Map className="w-3.5 h-3.5" />
                Ver no mapa
              </a>
            </div>

            {/* Business Hours */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-text-secondary" />
                <p className="text-sm font-bold text-text-primary">Horário de atendimento</p>
              </div>
              <p className="text-sm font-semibold text-text-primary">Segunda a Sexta</p>
              <p className="text-xs text-text-secondary mt-1">
                08:30 às 12:00 e 13:30 às 17:30
              </p>
              <div className="flex items-start gap-1.5 mt-3">
                <Info className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-text-tertiary leading-relaxed">
                  Fechado em feriados nacionais e municipais.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Card */}
        {!confirmed && (
          <div className="bg-priora-50/50 rounded-2xl border border-priora-100 p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-priora-100 flex-shrink-0">
                <Calendar className="w-5 h-5 text-priora-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-text-primary mb-1">Confirmação da solicitação</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Após confirmar sua escolha, nossa equipe entrará em contato para orientar sobre o processo de retirada.
                </p>
                <button
                  onClick={handleConfirmAction}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-priora-600 text-white text-sm font-semibold rounded-xl hover:bg-priora-700 transition-all"
                >
                  {getButtonLabel()}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal open={confirmModal} onClose={() => setConfirmModal(false)} title="Confirmar">
        <p className="text-sm text-text-secondary mb-6">
          {getModalMessage()}
        </p>
        <div className="flex gap-2">
          <button onClick={handleFinalConfirm} className="btn-primary-purple text-sm flex-1">
            Confirmar
          </button>
          <button onClick={() => setConfirmModal(false)} className="btn-ghost text-sm flex-1">
            Cancelar
          </button>
        </div>
      </Modal>

      <Toast message={toast.message} visible={toast.visible} onClose={() => setToast({ visible: false, message: '' })} />
    </div>
  );
}
