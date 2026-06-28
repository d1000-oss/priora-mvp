export interface Container {
  id: string;
  numero: string;
}

export interface Processo {
  id: string;
  codigo: string;
  cliente: string;
  analista: string;
  status: string;
  armador?: string;
  eta?: string;
  etb?: string;
  containers?: Container[];
}

export interface Courier {
  id: string;
  tracking: string;
  transportadora: string;
  status: string;
  origem?: string;
  destino?: string;
  processosVinculados: string[];
}

export interface Decisao {
  id: string;
  processoCodigo: string;
  tipo: string;
  analista: string;
  claraEncontrou: string[];
}

export interface DemurrageItem {
  id: string;
  processoCodigo: string;
  cliente: string;
  containers: number;
  diasDemurrage?: number;
  valorEstimado?: string;
  ultimaCobranca?: string;
  minuta?: string;
  diasFreeTime?: number;
  statusResumo: string;
  risco?: string;
}

export const processos: Processo[] = [
  {
    id: '1',
    codigo: 'IM2567',
    cliente: 'BRA TRADE',
    analista: 'Pedro',
    status: 'Gerando Demurrage',
    armador: 'MSC',
    eta: '20/06/2026',
    etb: '22/06/2026',
    containers: [
      { id: 'c1', numero: 'FBIU5238915' },
      { id: 'c2', numero: 'GAOU6159773' },
    ],
  },
  {
    id: '2',
    codigo: 'IM2588',
    cliente: 'KLABIN',
    analista: 'Angelina',
    status: 'Próximo do Vencimento',
    armador: 'Maersk',
    containers: [
      { id: 'c3', numero: 'TCLU7887654' },
      { id: 'c4', numero: 'MSKU2233445' },
    ],
  },
  {
    id: '3',
    codigo: 'IM2550',
    cliente: 'JBS',
    analista: 'Kaio',
    status: 'Aguardando Minuta',
  },
  {
    id: '4',
    codigo: 'IM2540',
    cliente: 'ENCANTEX',
    analista: 'Gilmar',
    status: 'Possível Responsabilidade Rocket',
  },
  {
    id: '5',
    codigo: 'IM2591',
    cliente: 'COBRAX',
    analista: 'Pedro',
    status: 'Aguardando Telex',
  },
  {
    id: '6',
    codigo: 'IM1604',
    cliente: 'KLABIN',
    analista: 'Angelina',
    status: 'Pendência Cliente',
  },
];

export const couriers: Courier[] = [
  {
    id: '1',
    tracking: 'DHL 77889911',
    transportadora: 'DHL',
    status: 'Recebido',
    origem: 'Shanghai',
    destino: 'Itajaí',
    processosVinculados: ['IM2567'],
  },
  {
    id: '2',
    tracking: 'DHL 44556677',
    transportadora: 'DHL',
    status: 'Sem atualização há 8 dias',
    processosVinculados: ['IM2591'],
  },
  {
    id: '3',
    tracking: 'FedEx 44556677',
    transportadora: 'FedEx',
    status: 'Recebido',
    processosVinculados: ['IM2550'],
  },
];

export const decisoes: Decisao[] = [
  {
    id: '1',
    processoCodigo: 'IM2591',
    tipo: 'Confirmar Telex Release',
    analista: 'Pedro',
    claraEncontrou: [
      'E-mail do agente confirmando Telex Release',
      'Nenhum courier relacionado localizado',
      'Nenhuma instrução de HBL Original',
    ],
  },
  {
    id: '2',
    processoCodigo: 'IM2580',
    tipo: 'Validar OHBL',
    analista: 'Angelina',
    claraEncontrou: [
      'OHBL enviado pelo cliente',
      'Documento legível',
      'Nenhuma divergência aparente',
    ],
  },
  {
    id: '3',
    processoCodigo: 'IM2540',
    tipo: 'Revisar possível conflito documental',
    analista: 'Gilmar',
    claraEncontrou: [
      'Cliente informou Telex',
      'E-mail do agente menciona HBL Original',
      'Courier DHL identificado',
    ],
  },
];

export const demurrageItems: DemurrageItem[] = [
  {
    id: '1',
    processoCodigo: 'IM2567',
    cliente: 'BRA TRADE',
    containers: 2,
    diasDemurrage: 4,
    valorEstimado: 'R$ 1.840',
    ultimaCobranca: 'há 4 dias',
    minuta: 'Não recebida',
    statusResumo: 'Em demurrage',
  },
  {
    id: '2',
    processoCodigo: 'IM2588',
    cliente: 'KLABIN',
    containers: 2,
    diasFreeTime: 3,
    statusResumo: 'Restam 3 dias de free time',
  },
  {
    id: '3',
    processoCodigo: 'IM2550',
    cliente: 'JBS',
    containers: 1,
    statusResumo: 'Container devolvido',
    minuta: 'Não localizada',
  },
  {
    id: '4',
    processoCodigo: 'IM2540',
    cliente: 'ENCANTEX',
    containers: 1,
    statusResumo: 'Carga atracada — documentação completa — aguardando liberação',
    risco: 'Possível risco operacional Rocket',
  },
];
