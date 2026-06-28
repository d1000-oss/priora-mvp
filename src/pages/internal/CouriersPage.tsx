import { useState } from 'react';
import { KPICard } from '../../components/KPICard';
import { StatusBadge } from '../../components/StatusBadge';
import { SearchBar } from '../../components/SearchBar';
import { Modal } from '../../components/Modal';
import {
  Mail, Package, Calendar, Truck, AlertTriangle, CheckCircle,
  ChevronDown, ArrowRight, Sparkles, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalState';

// ─── carrier logos ────────────────────────────────────────────────────────────

function CarrierLogo({ name }: { name: string }) {
  const n = name.toLowerCase();
  if (n.includes('fedex')) {
    return (
      <img
        src="/assets/images/download.png"
        alt="FedEx"
        style={{ height: 28, width: 'auto', objectFit: 'contain', background: 'transparent', border: 'none', boxShadow: 'none', display: 'block' }}
      />
    );
  }
  if (n.includes('dhl')) {
    return (
      <img
        src="/assets/images/image copy copy copy copy.png"
        alt="DHL"
        style={{ height: 26, width: 'auto', objectFit: 'contain', background: 'transparent', border: 'none', boxShadow: 'none', display: 'block' }}
      />
    );
  }
  return <span className="text-sm font-bold text-text-primary">{name}</span>;
}

// ─── data ─────────────────────────────────────────────────────────────────────

interface DocRow {
  processo: string;
  cliente: string;
  eta: string;
  mbl: boolean;
  hbl: boolean;
  telexConfirmado: boolean;
  claraText: string;
}

const fedexDocuments: DocRow[] = [
  { processo: 'IM1570', cliente: 'BRA TRADE', eta: '28/05', mbl: false, hbl: false, telexConfirmado: false, claraText: 'Este processo ainda depende da chegada do envelope para conferência documental.' },
  { processo: 'IM1578', cliente: 'EXTRUSA',   eta: '29/05', mbl: false, hbl: false, telexConfirmado: false, claraText: 'Este processo ainda depende da chegada do envelope para conferência documental.' },
  { processo: 'IM1602', cliente: 'KLABIN',    eta: '31/05', mbl: false, hbl: false, telexConfirmado: false, claraText: 'Este processo ainda depende da chegada do envelope para conferência documental.' },
  { processo: 'IM1610', cliente: 'AMBEV',     eta: '01/06', mbl: false, hbl: false, telexConfirmado: false, claraText: 'Este processo ainda depende da chegada do envelope para conferência documental.' },
  { processo: 'IM1615', cliente: 'JBS',       eta: '02/06', mbl: false, hbl: false, telexConfirmado: false, claraText: 'Nenhum documento recebido até o momento. Aguardando courier.' },
];

interface MainCourierData {
  carrier: string;
  tracking: string;
  status: 'Em trânsito' | 'Recebido' | 'Atrasado';
  statusVariant: 'green' | 'yellow' | 'red';
  origem: string;
  destino: string;
  saida: string;
  chegada: string;
  agente: string;
  processos: number;
  documents: DocRow[];
}

const mainCouriers: MainCourierData[] = [
  {
    carrier: 'DHL',
    tracking: '77889911',
    status: 'Recebido',
    statusVariant: 'green',
    origem: 'Shanghai',
    destino: 'Itajaí',
    saida: '08/05',
    chegada: '15/05',
    agente: 'DHL Express BR',
    processos: 1,
    documents: [
      {
        processo: 'IM2567',
        cliente: 'BRA TRADE',
        eta: '20/05',
        mbl: true,
        hbl: false,
        telexConfirmado: true,
        claraText: 'MBL recebido e conferido. HBL físico não se aplica: liberação realizada via Telex Release confirmado pelo agente. Documentação completa para este processo.',
      },
    ],
  },
  {
    carrier: 'FedEx',
    tracking: '77889911',
    status: 'Em trânsito',
    statusVariant: 'green',
    origem: 'Shanghai',
    destino: 'Itajaí',
    saida: '25/05',
    chegada: '31/05',
    agente: 'Ningbo Logistics',
    processos: 5,
    documents: fedexDocuments,
  },
  {
    carrier: 'DHL',
    tracking: '44556677',
    status: 'Atrasado',
    statusVariant: 'red',
    origem: 'Shanghai',
    destino: 'Itajaí',
    saida: '18/05',
    chegada: '29/05',
    agente: 'DHL Express BR',
    processos: 1,
    documents: [
      { processo: 'IM2591', cliente: 'COBRAX', eta: '30/05', mbl: false, hbl: false, telexConfirmado: false, claraText: 'Courier sem atualização há 8 dias. Recomendo contato com o agente para confirmar localização.' },
    ],
  },
  {
    carrier: 'DHL',
    tracking: '55667788',
    status: 'Em trânsito',
    statusVariant: 'green',
    origem: 'Ningbo',
    destino: 'Itajaí',
    saida: '22/05',
    chegada: '03/06',
    agente: 'DHL Express BR',
    processos: 3,
    documents: [
      { processo: 'IM1604', cliente: 'KLABIN',  eta: '04/06', mbl: false, hbl: false, telexConfirmado: false, claraText: 'Este processo ainda depende da chegada do envelope para conferência documental.' },
      { processo: 'IM1618', cliente: 'AMBEV',   eta: '05/06', mbl: false, hbl: false, telexConfirmado: false, claraText: 'Este processo ainda depende da chegada do envelope para conferência documental.' },
      { processo: 'IM1622', cliente: 'JBS',     eta: '06/06', mbl: false, hbl: false, telexConfirmado: false, claraText: 'Este processo ainda depende da chegada do envelope para conferência documental.' },
    ],
  },
];

// ─── document status radio cell ───────────────────────────────────────────────

interface DocStatusCellProps {
  checked: boolean;
  disabled: boolean;
  onChange: (val: boolean) => void;
}

function DocStatusCell({ checked, disabled, onChange }: DocStatusCellProps) {
  if (disabled) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded border border-gray-200 bg-gray-100 flex-shrink-0" />
        <span className="text-[11px] text-text-tertiary italic">Aguardando courier</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => onChange(true)}
        className="flex items-center gap-1.5 text-xs cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className={`w-3 h-3 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-success-500 border-success-500' : 'border-gray-300 bg-white'}`}>
          {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
        <span className={checked ? 'text-success-700 font-medium' : 'text-text-tertiary'}>Recebido</span>
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className="flex items-center gap-1.5 text-xs cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className={`w-3 h-3 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${!checked ? 'bg-danger-500 border-danger-500' : 'border-gray-300 bg-white'}`}>
          {!checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
        <span className={!checked ? 'text-danger-700 font-medium' : 'text-text-tertiary'}>Não recebido</span>
      </button>
    </div>
  );
}

// ─── process row ──────────────────────────────────────────────────────────────

interface ProcessRowProps {
  doc: DocRow;
  isExpanded: boolean;
  onToggle: () => void;
  mblState: boolean;
  hblState: boolean;
  onMblChange: (val: boolean) => void;
  onHblChange: (val: boolean) => void;
  courierIsTransit: boolean;
}

function ProcessRow({ doc, isExpanded, onToggle, mblState, hblState, onMblChange, onHblChange, courierIsTransit }: ProcessRowProps) {
  const navigate = useNavigate();

  // Compute per-row document status
  const rowStatus: { label: string; variant: 'green' | 'yellow' | 'orange' | 'red' } = (() => {
    if (courierIsTransit) return { label: 'Em trânsito', variant: 'yellow' };
    if (mblState && (hblState || doc.telexConfirmado)) return { label: 'Recebido', variant: 'green' };
    if (!mblState && !hblState && !doc.telexConfirmado) return { label: 'Documento ausente', variant: 'red' };
    return { label: 'Pendente', variant: 'orange' };
  })();

  const showOhblWarning = !courierIsTransit && !hblState && !doc.telexConfirmado;
  const showTelexWarning = !courierIsTransit && !hblState && !doc.telexConfirmado;

  return (
    <>
      <tr
        className={`border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-priora-50/30' : ''}`}
        onClick={onToggle}
      >
        <td className="py-3 font-semibold text-text-primary">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/app/processos/${doc.processo}`); }}
            className="text-priora-700 hover:text-priora-900 hover:underline font-semibold"
          >
            {doc.processo}
          </button>
          {' '}– {doc.cliente}
        </td>
        <td className="py-3 text-text-secondary">
          <div className="flex items-center gap-1 text-xs">
            <Calendar className="w-3 h-3 flex-shrink-0" /> {doc.eta}
          </div>
        </td>
        <td className="py-3" onClick={(e) => e.stopPropagation()}>
          <DocStatusCell checked={mblState} disabled={courierIsTransit} onChange={onMblChange} />
        </td>
        <td className="py-3" onClick={(e) => e.stopPropagation()}>
          <DocStatusCell checked={hblState} disabled={courierIsTransit} onChange={onHblChange} />
        </td>
        <td className="py-3">
          <StatusBadge variant={rowStatus.variant}>{rowStatus.label}</StatusBadge>
        </td>
        <td className="py-3 text-right">
          <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-priora-50/20 border-b border-priora-100">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wide mb-2">Documentos esperados</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${mblState ? 'bg-success-500' : 'bg-gray-200'}`} />
                    <span className={mblState ? 'text-success-700 font-medium' : 'text-text-secondary'}>
                      MBL — {mblState ? 'Recebido' : 'Não recebido'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${hblState || doc.telexConfirmado ? 'bg-success-500' : 'bg-gray-200'}`} />
                    <span className={hblState || doc.telexConfirmado ? 'text-success-700 font-medium' : 'text-text-secondary'}>
                      HBL Original — {hblState ? 'Recebido' : doc.telexConfirmado ? 'Via Telex Release — não aplicável' : 'Não recebido'}
                    </span>
                  </div>
                </div>

                {courierIsTransit && (
                  <div className="mt-3 flex items-start gap-2 text-[11px] text-warning-700 bg-warning-50 border border-warning-100 rounded-lg px-3 py-2">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    A conferência dos documentos só pode ser realizada após o recebimento do courier.
                  </div>
                )}

                {(showOhblWarning || showTelexWarning) && (
                  <div className="mt-3 space-y-2">
                    {showOhblWarning && (
                      <div className="flex items-start gap-2 text-[11px] text-danger-700 bg-danger-50 border border-danger-100 rounded-lg px-3 py-2">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span className="font-semibold">OHBL não recebido</span>
                      </div>
                    )}
                    {showTelexWarning && (
                      <div className="flex items-start gap-2 text-[11px] text-danger-700 bg-danger-50 border border-danger-100 rounded-lg px-3 py-2">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span className="font-semibold">Sem confirmação de Telex Release</span>
                      </div>
                    )}
                    {(showOhblWarning || showTelexWarning) && (
                      <div className="text-[11px] text-text-secondary bg-gray-50 rounded-lg px-3 py-2 space-y-1">
                        <p>Não localizei OHBL recebido nem confirmação de Telex Release para este processo.</p>
                        <p className="font-medium text-text-primary">Solicitar OHBL ao cliente ou confirmar Telex Release com o agente.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-start gap-2 bg-white border border-priora-100 rounded-xl p-3">
                <div className="w-6 h-6 rounded-full bg-priora-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-priora-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-priora-700 mb-0.5">Clara</p>
                  <p className="text-[11px] text-text-secondary leading-relaxed">{doc.claraText}</p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── courier card ─────────────────────────────────────────────────────────────

function CourierCard({ data, defaultExpanded = false }: { data: MainCourierData; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [courierStatus, setCourierStatus] = useState<'Em trânsito' | 'Recebido' | 'Atrasado'>(data.status);
  const [docStates, setDocStates] = useState<Record<string, { mbl: boolean; hbl: boolean }>>(
    () => Object.fromEntries(data.documents.map((d) => [d.processo, { mbl: d.mbl, hbl: d.hbl }]))
  );

  const courierIsTransit = courierStatus !== 'Recebido';

  const toggleRow = (processo: string) =>
    setExpandedRow((prev) => (prev === processo ? null : processo));

  const setDoc = (processo: string, field: 'mbl' | 'hbl', val: boolean) => {
    const next = { ...docStates, [processo]: { ...docStates[processo], [field]: val } };
    setDocStates(next);
    // Auto-upgrade courier status: if every process has both mbl+hbl received → Recebido
    const allReceived = data.documents.every(
      (d) => (next[d.processo]?.mbl ?? false) && ((next[d.processo]?.hbl ?? false) || d.telexConfirmado)
    );
    if (allReceived) setCourierStatus('Recebido');
  };

  const statusVariant: 'green' | 'yellow' | 'red' =
    courierStatus === 'Recebido' ? 'green' :
    courierStatus === 'Atrasado' ? 'red' : 'yellow';

  return (
    <div className="card">
      {/* Header — always visible */}
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3 flex-wrap min-w-0">
          <CarrierLogo name={data.carrier} />
          <span className="text-base font-bold text-text-primary">{data.tracking}</span>
          <StatusBadge variant={statusVariant}>{courierStatus}</StatusBadge>
          <StatusBadge variant="red">{data.processos} processos no envelope</StatusBadge>
          {data.origem && (
            <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
              <span>{data.origem}</span>
              <ArrowRight className="w-3 h-3" />
              <span>{data.destino}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-text-tertiary">
            ETA <span className={`font-semibold ml-1 ${courierStatus === 'Atrasado' ? 'text-danger-600' : 'text-text-primary'}`}>{data.chegada}</span>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform duration-200 flex-shrink-0 ml-4 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded body */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[2000px] opacity-100 mt-5' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        {/* Route */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-5 gap-4 flex-wrap">
          <div className="text-center">
            <p className="text-sm font-semibold text-text-primary">{data.origem}</p>
            <div className="flex items-center gap-1 text-xs text-text-tertiary mt-1">
              <Calendar className="w-3 h-3" /> {data.saida}
            </div>
            <p className="text-[11px] text-text-tertiary">Data de saída</p>
          </div>

          <div className="flex-1 mx-4 flex items-center min-w-[60px]">
            <div className="flex-1 border-t-2 border-dashed border-priora-300" />
            <div className="w-8 h-8 rounded-full bg-priora-100 flex items-center justify-center mx-2">
              <Mail className="w-4 h-4 text-priora-600" />
            </div>
            <div className="flex-1 border-t-2 border-dashed border-priora-300" />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-text-primary">{data.destino}</p>
            <div className="flex items-center gap-1 text-xs text-text-tertiary mt-1">
              <Calendar className="w-3 h-3" /> {data.chegada}
            </div>
            <p className="text-[11px] text-text-tertiary">Data prevista de chegada</p>
          </div>

          <div className="border-l border-gray-200 pl-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Package className="w-3 h-3 flex-shrink-0" />
              <span className="text-text-tertiary">Agente</span>
            </div>
            <p className="text-xs font-semibold text-text-primary pl-4">{data.agente}</p>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Truck className="w-3 h-3 flex-shrink-0" />
              <span className="text-text-tertiary">Tracking</span>
            </div>
            <p className="text-xs font-semibold text-text-primary pl-4">{data.tracking}</p>
          </div>
        </div>

        {/* Document table */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Conteúdo esperado do envelope</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-2 text-text-tertiary font-medium">Processo</th>
                  <th className="text-left pb-2 text-text-tertiary font-medium">
                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> ETA do processo</div>
                  </th>
                  <th className="text-left pb-2 text-text-tertiary font-medium">MBL</th>
                  <th className="text-left pb-2 text-text-tertiary font-medium">HBL Original</th>
                  <th className="text-left pb-2 text-text-tertiary font-medium">Status</th>
                  <th className="pb-2 w-6"></th>
                </tr>
              </thead>
              <tbody>
                {data.documents.map((doc) => (
                  <ProcessRow
                    key={doc.processo}
                    doc={doc}
                    isExpanded={expandedRow === doc.processo}
                    onToggle={() => toggleRow(doc.processo)}
                    mblState={docStates[doc.processo]?.mbl ?? doc.mbl}
                    hblState={docStates[doc.processo]?.hbl ?? doc.hbl}
                    onMblChange={(val) => setDoc(doc.processo, 'mbl', val)}
                    onHblChange={(val) => setDoc(doc.processo, 'hbl', val)}
                    courierIsTransit={courierIsTransit}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {courierIsTransit && (
          <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-blue-700">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              A conferência dos documentos só pode ser realizada após o recebimento do courier.
            </div>
            <button
              type="button"
              onClick={() => setCourierStatus('Recebido')}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Marcar como Recebido
            </button>
          </div>
        )}
        {!courierIsTransit && (
          <div className="bg-success-50 rounded-xl p-3 flex items-center gap-2 text-xs text-success-700">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Courier recebido. Documentos disponíveis para conferência.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── activity drawer ──────────────────────────────────────────────────────────

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: string;
  courier?: string;
  description: string;
  alert?: boolean;
}

const allActivities: ActivityItem[] = [
  { id: 'a1', title: 'Courier recebido',       subtitle: 'IM1612 — JBS',         time: '09:21', type: 'Recebimento',  courier: 'FedEx 77889911', description: 'O envelope FedEx foi recebido na unidade. Documentos disponíveis para conferência.' },
  { id: 'a2', title: 'Documento conferido',    subtitle: 'IM1570 — BRA TRADE',   time: '10:14', type: 'Conferência',  courier: 'FedEx 77889911', description: 'MBL e HBL Original do processo IM1570 foram conferidos e validados.' },
  { id: 'a3', title: 'Courier atrasado',       subtitle: 'DHL 44556677',         time: '10:47', type: 'Alerta',       courier: 'DHL 44556677',   description: 'Courier DHL sem atualização de tracking há 8 dias. Contato com agente necessário.', alert: true },
  { id: 'a4', title: 'Agente respondeu',       subtitle: 'Ningbo Logistics',     time: '11:07', type: 'Comunicação',  courier: 'FedEx 77889911', description: 'Ningbo Logistics confirmou o despacho do envelope. Previsão mantida para 31/05.' },
  { id: 'a5', title: 'Novo courier cadastrado',subtitle: 'DHL 55667788',         time: '12:05', type: 'Cadastro',     courier: 'DHL 55667788',   description: 'Novo courier DHL registrado com 3 processos vinculados. ETA 03/06.' },
  { id: 'a6', title: 'Pendência documental',   subtitle: 'IM1578 — EXTRUSA',     time: '12:31', type: 'Alerta',       courier: 'FedEx 77889911', description: 'MBL e HBL Original de IM1578 ainda não recebidos. Processo aguardando conferência.', alert: true },
];

// ─── sidebar data ─────────────────────────────────────────────────────────────

const processosSemCourier = [
  { codigo: 'IM1604', cliente: 'KLABIN',  chegada: '15/06 (15 dias)', level: 'Crítico' as const },
  { codigo: 'IM1599', cliente: 'EXTRUSA', chegada: '12/06 (12 dias)', level: 'Atenção' as const },
  { codigo: 'IM1618', cliente: 'AMBEV',   chegada: '09/06 (9 dias)',  level: 'Atenção' as const },
  { codigo: 'IM1622', cliente: 'JBS',     chegada: '08/06 (8 dias)',  level: 'Atenção' as const },
  { codigo: 'IM1589', cliente: 'COBRAX',  chegada: '07/06 (7 dias)',  level: 'Crítico' as const },
];

// ─── page ─────────────────────────────────────────────────────────────────────

export function CouriersPage() {
  const navigate = useNavigate();
  const { events } = useGlobalState();

  const [activityDrawerOpen, setActivityDrawerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [processosModal, setProcessosModal] = useState(false);

  const portalActivities: ActivityItem[] = events.slice(0, 3).map((e) => ({
    id: e.id,
    title: e.type === 'minuta_enviada' ? 'Minuta recebida' : e.type === 'telex_confirmado' ? 'Telex confirmado' : 'Evento registrado',
    subtitle: `${e.processoCodigo} — ${e.cliente}`,
    time: e.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    type: 'Portal',
    description: `Evento registrado via portal para ${e.processoCodigo}.`,
  }));

  const feedActivities = [...portalActivities, ...allActivities].slice(0, 6);

  const openActivity = (a: ActivityItem) => {
    setSelectedActivity(a);
    setActivityDrawerOpen(true);
  };

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Couriers</h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Acompanhe envelopes internacionais e documentos físicos.
              </p>
            </div>
          </div>
          <div className="w-80">
            <SearchBar placeholder="Buscar courier, tracking, processo ou agente..." />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main */}
          <div className="space-y-6">
            {/* KPIs */}
            <div className="kpi-grid">
              <KPICard label="Recebidos"            value={8} sublabel="Couriers entregues"    icon={<CheckCircle className="w-5 h-5 text-success-500" />} variant="success" />
              <KPICard label="Em trânsito"           value={3} sublabel="Aguardando chegada"    icon={<Truck       className="w-5 h-5 text-warning-500" />} variant="warning" />
              <KPICard label="Atrasados"             value={1} sublabel="Prazo excedido"         icon={<AlertTriangle className="w-5 h-5 text-danger-500" />} variant="danger" />
              <KPICard label="Documentos pendentes"  value={4} sublabel="Ainda não conferidos"  icon={<Package     className="w-5 h-5 text-priora-500" />} variant="purple" />
            </div>

            {/* Courier cards — first one expanded by default */}
            {mainCouriers.map((c, i) => (
              <CourierCard key={c.tracking} data={c} defaultExpanded={i === 0} />
            ))}
          </div>

          {/* Right sidebar */}
          <div className="right-panel">
            {/* Processos sem courier */}
            <div className="right-panel-card">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-danger-500" />
                <h3 className="text-sm font-bold text-danger-700">Processos sem courier</h3>
                <span className="w-5 h-5 rounded-full bg-danger-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</span>
              </div>
              <p className="text-xs text-text-secondary mb-4">
                Embarques com chegada prevista em até 15 dias e sem informação de courier.
              </p>
              <div className="space-y-3">
                {processosSemCourier.slice(0, 3).map((p) => (
                  <div key={p.codigo} className="rounded-xl border border-gray-100 p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-xs font-semibold text-text-primary">{p.codigo} – {p.cliente}</p>
                        <p className="text-[11px] text-text-tertiary mt-0.5">Chegada prevista: {p.chegada}</p>
                      </div>
                      <StatusBadge variant={p.level === 'Crítico' ? 'red' : 'orange'}>{p.level}</StatusBadge>
                    </div>
                    <button
                      onClick={() => navigate(`/app/processos/${p.codigo}`)}
                      className="text-[11px] font-medium text-priora-600 hover:text-priora-700 flex items-center gap-1 transition-colors"
                    >
                      Ver processo <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setProcessosModal(true)}
                className="text-xs font-medium text-priora-600 hover:text-priora-700 mt-3 flex items-center gap-1 transition-colors"
              >
                Ver todos os processos <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Activity feed */}
            <div className="right-panel-card">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Atividades recentes</h3>
              <div className="space-y-2.5">
                {feedActivities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => openActivity(activity)}
                    className="flex items-start gap-2.5 w-full text-left hover:bg-gray-50 rounded-lg px-2 py-1.5 -mx-2 transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {activity.alert
                        ? <AlertTriangle className="w-3.5 h-3.5 text-warning-500" />
                        : <CheckCircle  className="w-3.5 h-3.5 text-success-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary truncate group-hover:text-priora-700 transition-colors">{activity.title}</p>
                      <p className="text-[11px] text-text-tertiary truncate">{activity.subtitle}</p>
                    </div>
                    <span className="text-[11px] text-text-tertiary flex-shrink-0 mt-0.5">{activity.time}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setSelectedActivity(null); setActivityDrawerOpen(true); }}
                className="w-full mt-4 text-xs font-medium text-priora-600 hover:text-priora-700 flex items-center justify-center gap-1 transition-colors"
              >
                Ver todas as atividades <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Processos sem courier modal ── */}
      <Modal open={processosModal} onClose={() => setProcessosModal(false)} title="Processos sem courier">
        <p className="text-sm text-text-secondary mb-4">
          Todos os embarques com chegada prevista nos próximos 15 dias sem courier registrado.
        </p>
        <div className="space-y-2">
          {processosSemCourier.map((p) => (
            <div key={p.codigo} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">{p.codigo} – {p.cliente}</p>
                  <p className="text-xs text-text-tertiary">Chegada prevista: {p.chegada}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge variant={p.level === 'Crítico' ? 'red' : 'orange'}>{p.level}</StatusBadge>
                <button
                  onClick={() => { setProcessosModal(false); navigate(`/app/processos/${p.codigo}`); }}
                  className="text-xs font-medium text-priora-600 hover:text-priora-700 flex items-center gap-1 transition-colors"
                >
                  Ver <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* ── Activity drawer ── */}
      {activityDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/20" onClick={() => setActivityDrawerOpen(false)} />
          <div className="w-[400px] max-w-full bg-white shadow-modal flex flex-col animate-slide-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-text-primary">
                {selectedActivity ? selectedActivity.title : 'Todas as atividades'}
              </h2>
              <button
                onClick={() => setActivityDrawerOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedActivity ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${selectedActivity.alert ? 'bg-danger-50' : 'bg-success-50'}`}>
                      {selectedActivity.alert
                        ? <AlertTriangle className="w-4 h-4 text-danger-500" />
                        : <CheckCircle  className="w-4 h-4 text-success-500" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">{selectedActivity.title}</p>
                      <p className="text-xs text-text-tertiary">{selectedActivity.subtitle}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Horário</span>
                      <span className="font-medium text-text-primary">{selectedActivity.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-tertiary">Tipo</span>
                      <span className="font-medium text-text-primary">{selectedActivity.type}</span>
                    </div>
                    {selectedActivity.courier && (
                      <div className="flex justify-between">
                        <span className="text-text-tertiary">Courier</span>
                        <span className="font-medium text-text-primary">{selectedActivity.courier}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text-primary mb-1.5">Descrição</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{selectedActivity.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedActivity(null)}
                    className="text-xs text-priora-600 hover:text-priora-700 flex items-center gap-1 font-medium transition-colors"
                  >
                    ← Ver todas as atividades
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {allActivities.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedActivity(a)}
                      className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all text-left"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${a.alert ? 'bg-danger-50' : 'bg-success-50'}`}>
                        {a.alert
                          ? <AlertTriangle className="w-3.5 h-3.5 text-danger-500" />
                          : <CheckCircle  className="w-3.5 h-3.5 text-success-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text-primary">{a.title}</p>
                        <p className="text-[11px] text-text-tertiary">{a.subtitle}</p>
                        <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{a.description}</p>
                      </div>
                      <span className="text-[11px] text-text-tertiary flex-shrink-0">{a.time}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
