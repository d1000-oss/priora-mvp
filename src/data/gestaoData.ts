export interface GestaoRisk {
  id: string;
  processo: string;
  cliente: string;
  categoria: 'Demurrage' | 'Liberação' | 'Courier' | 'Cliente';
  responsavel: string;
  status: string;
  resumo: string;
  badgeLabel: string;
  badgeVariant: 'red' | 'orange' | 'yellow';
  claraAnalise: string;
  evidencias: string[];
  recomendacao: string;
  proximaAcao: string;
  criticidade: number;
  moduloLink: string;
}

export interface GestaoAnalista {
  id: string;
  nome: string;
  processos: number;
  criticos: number;
  aguardandoCliente: number;
  saudaveis: number;
  cargaOperacional: number;
  processosDetalhados: { codigo: string; cliente: string; status: string }[];
  gargalos: string[];
  riscos: string[];
  pendencias: string[];
  claraRecomendacao: string;
}

export interface GestaoReportData {
  periodo: string;
  processosRecebidos: { valor: number; variacao: number };
  processosLiberados: { valor: number; variacao: number };
  liberacoesNoPrazo: { valor: string; variacao: number };
  processosCriticos: { valor: number; variacao: number };
  mudancas: {
    processosLiberados: { variacao: string; de: number; para: number };
    couriersAtrasados: { variacao: string; de: number; para: number };
    demurragesAtivas: { variacao: string; de: number; para: number };
    pendenciasCliente: { variacao: string; de: number; para: number };
  };
  clientes: {
    ohblRecebidos: { valor: string; variacao: number };
    procuracoesRecebidas: { valor: string; variacao: number };
    termosRecebidos: { valor: string; variacao: number };
    pendenciasCliente: { valor: number; variacao: number };
  };
  demurrage: {
    casosAtivos: number;
    containersNoPrazo: { valor: string; variacao: number };
  };
  custosOperacionais: {
    memorandosEmitidos: { valor: number; variacao: number };
    entregasMotoboy: { valor: number; variacao: number };
    custoTotal: { valor: string; variacao: number };
    telexRelease: { valor: number; variacao: number };
    economiaDigital: { valor: string };
  };
  courier: {
    recebidos: { valor: number; variacao: number };
    atrasados: { valor: number; variacao: number };
    documentosAusentes: number;
  };
  claraSummary: string;
  claraRecomendacao: string;
  tendencia: {
    meses: string[];
    volumeOperacional: number[];
    liberacoes: number[];
    pendenciasCliente: number[];
    demurragesAtivas: number[];
  };
}

export const gestaoRisks: GestaoRisk[] = [
  {
    id: '1',
    processo: 'IM2567',
    cliente: 'BRA TRADE',
    categoria: 'Demurrage',
    responsavel: 'Pedro',
    status: 'Custo em andamento',
    resumo: 'Container gerando demurrage há 6 dias.',
    badgeLabel: 'Custo em andamento',
    badgeVariant: 'red',
    claraAnalise: 'Último contato com cliente há 4 dias. Recomendação: realizar nova cobrança e solicitar atualização sobre devolução.',
    evidencias: ['Container TGHU1234567 em demurrage há 6 dias', 'Minuta não recebida', 'Última cobrança sem resposta'],
    recomendacao: 'Realizar nova cobrança e solicitar atualização sobre devolução.',
    proximaAcao: 'Cobrar cliente',
    criticidade: 10,
    moduloLink: '/app/processos/IM2567',
  },
  {
    id: '2',
    processo: 'IM1610',
    cliente: 'AMBEV',
    categoria: 'Liberação',
    responsavel: 'Samuel',
    status: 'Liberação bloqueada',
    resumo: 'Telex Release ainda não validado pelo agente.',
    badgeLabel: 'Liberação bloqueada',
    badgeVariant: 'orange',
    claraAnalise: 'Todos os requisitos do cliente estão completos: termo, procuração, OHBL e prazo de pagamento recebidos. O único impedimento é a confirmação do Telex Release pelo agente Long Sail, notificado há 3 dias sem retorno. Recomendo cobrar o agente imediatamente.',
    evidencias: [
      'Telex Release ainda não confirmado pelo agente Long Sail',
      'Termo de responsabilidade recebido (15/06)',
      'Procuração validada (15/06)',
      'OHBL recebido via courier DHL (12/06)',
      'Prazo de pagamento confirmado',
      'Agente notificado há 3 dias sem retorno',
    ],
    recomendacao: 'Cobrar confirmação do Telex Release junto ao agente Long Sail.',
    proximaAcao: 'Cobrar agente',
    criticidade: 8,
    moduloLink: '/app/liberacao?processo=IM1610',
  },
  {
    id: '3',
    processo: 'IM2478',
    cliente: 'EXTRUSA',
    categoria: 'Courier',
    responsavel: 'Kaio',
    status: 'Atualização atrasada',
    resumo: 'Courier sem atualização há 8 dias.',
    badgeLabel: 'Atualização atrasada',
    badgeVariant: 'orange',
    claraAnalise: 'A previsão original já expirou. Recomendo contato com o agente para confirmar a localização do envelope.',
    evidencias: ['DHL 77889911 sem tracking há 8 dias', 'Previsão original expirada', 'Agente não respondeu'],
    recomendacao: 'Contato com agente para confirmar localização.',
    proximaAcao: 'Cobrar agente',
    criticidade: 7,
    moduloLink: '/app/couriers',
  },
  {
    id: '4',
    processo: 'IM2581',
    cliente: 'AMBEV',
    categoria: 'Cliente',
    responsavel: 'Angelina',
    status: 'Pendente com cliente',
    resumo: 'Procuração pendente.',
    badgeLabel: 'Pendente com cliente',
    badgeVariant: 'yellow',
    claraAnalise: 'A única pendência restante para este processo é a procuração. Recomendo enviar novo lembrete ao cliente.',
    evidencias: ['Procuração não recebida', 'Demais documentos OK', 'Lembrete anterior há 3 dias'],
    recomendacao: 'Enviar novo lembrete ao cliente.',
    proximaAcao: 'Cobrar cliente',
    criticidade: 5,
    moduloLink: '/app/liberacao?processo=IM2581',
  },
];

export const gestaoAnalistas: GestaoAnalista[] = [
  {
    id: '1',
    nome: 'Pedro',
    processos: 42,
    criticos: 2,
    aguardandoCliente: 5,
    saudaveis: 35,
    cargaOperacional: 92,
    processosDetalhados: [
      { codigo: 'IM2567', cliente: 'BRA TRADE', status: 'Gerando Demurrage' },
      { codigo: 'IM2591', cliente: 'COBRAX', status: 'Aguardando Telex' },
      { codigo: 'IM1570', cliente: 'JBS', status: 'Liberado' },
    ],
    gargalos: ['2 processos em demurrage ativo', 'Concentração de processos críticos'],
    riscos: ['IM2567 — demurrage acumulando R$ 460/dia', 'IM2591 — Telex Release pendente'],
    pendencias: ['5 clientes sem resposta', '1 agente sem retorno'],
    claraRecomendacao: 'Redistribuir 3 processos não-críticos para Kaio ou Gilmar para balancear carga.',
  },
  {
    id: '2',
    nome: 'Angelina',
    processos: 38,
    criticos: 0,
    aguardandoCliente: 3,
    saudaveis: 35,
    cargaOperacional: 72,
    processosDetalhados: [
      { codigo: 'IM2588', cliente: 'KLABIN', status: 'Próximo do Vencimento' },
      { codigo: 'IM1604', cliente: 'KLABIN', status: 'Pendência Cliente' },
      { codigo: 'IM2581', cliente: 'AMBEV', status: 'Pendente com cliente' },
    ],
    gargalos: ['3 processos aguardando resposta do cliente'],
    riscos: ['IM2588 — free time se encerrando em 3 dias'],
    pendencias: ['3 clientes sem resposta'],
    claraRecomendacao: 'Enviar lembretes automatizados para os 3 clientes pendentes.',
  },
  {
    id: '3',
    nome: 'Kaio',
    processos: 31,
    criticos: 1,
    aguardandoCliente: 0,
    saudaveis: 30,
    cargaOperacional: 58,
    processosDetalhados: [
      { codigo: 'IM2478', cliente: 'EXTRUSA', status: 'Courier atrasado' },
      { codigo: 'IM2550', cliente: 'JBS', status: 'Aguardando Minuta' },
    ],
    gargalos: ['1 courier sem atualização'],
    riscos: ['IM2478 — courier DHL atrasado 8 dias'],
    pendencias: ['1 agente sem retorno'],
    claraRecomendacao: 'Capacidade disponível para absorver 5-8 novos processos.',
  },
  {
    id: '4',
    nome: 'Gilmar',
    processos: 27,
    criticos: 0,
    aguardandoCliente: 0,
    saudaveis: 27,
    cargaOperacional: 42,
    processosDetalhados: [
      { codigo: 'IM2540', cliente: 'ENCANTEX', status: 'Possível Responsabilidade Rocket' },
    ],
    gargalos: [],
    riscos: ['IM2540 — possível conflito documental'],
    pendencias: [],
    claraRecomendacao: 'Menor carga operacional. Pode absorver processos redistribuídos.',
  },
];

const reportDataMensal: GestaoReportData = {
  periodo: 'Mensal',
  processosRecebidos: { valor: 312, variacao: 18 },
  processosLiberados: { valor: 164, variacao: 12 },
  liberacoesNoPrazo: { valor: '96%', variacao: 3 },
  processosCriticos: { valor: 5, variacao: -2 },
  mudancas: {
    processosLiberados: { variacao: '+12%', de: 164, para: 184 },
    couriersAtrasados: { variacao: '-40%', de: 5, para: 3 },
    demurragesAtivas: { variacao: '-33%', de: 3, para: 2 },
    pendenciasCliente: { variacao: '+15%', de: 12, para: 14 },
  },
  clientes: {
    ohblRecebidos: { valor: '97%', variacao: 4 },
    procuracoesRecebidas: { valor: '95%', variacao: 2 },
    termosRecebidos: { valor: '98%', variacao: 3 },
    pendenciasCliente: { valor: 14, variacao: 15 },
  },
  demurrage: {
    casosAtivos: 2,
    containersNoPrazo: { valor: '96%', variacao: 2 },
  },
  custosOperacionais: {
    memorandosEmitidos: { valor: 164, variacao: 12 },
    entregasMotoboy: { valor: 164, variacao: 12 },
    custoTotal: { valor: 'R$ 2.460', variacao: 12 },
    telexRelease: { valor: 91, variacao: 24 },
    economiaDigital: { valor: 'R$ 1.365' },
  },
  courier: {
    recebidos: { valor: 42, variacao: 8 },
    atrasados: { valor: 3, variacao: -40 },
    documentosAusentes: 2,
  },
  claraSummary: 'Junho apresentou crescimento operacional de 18% em relação ao mês anterior. A operação manteve estabilidade, com 96% das liberações concluídas dentro do prazo esperado. Foram identificados apenas 2 casos de demurrage ativa e nenhum processo crítico permaneceu sem acompanhamento. O principal ponto de atenção foi o aumento de pendências documentais por parte dos clientes, responsável por 62% dos atrasos registrados no período.',
  claraRecomendacao: 'Reforçar comunicação preventiva junto aos clientes.',
  tendencia: {
    meses: ['Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    volumeOperacional: [180, 220, 260, 290, 312],
    liberacoes: [120, 140, 155, 160, 164],
    pendenciasCliente: [8, 10, 9, 12, 14],
    demurragesAtivas: [4, 3, 5, 3, 2],
  },
};

const reportDataTrimestral: GestaoReportData = {
  periodo: 'Trimestral',
  processosRecebidos: { valor: 862, variacao: 22 },
  processosLiberados: { valor: 479, variacao: 15 },
  liberacoesNoPrazo: { valor: '94%', variacao: 5 },
  processosCriticos: { valor: 12, variacao: -8 },
  mudancas: {
    processosLiberados: { variacao: '+15%', de: 416, para: 479 },
    couriersAtrasados: { variacao: '-25%', de: 12, para: 9 },
    demurragesAtivas: { variacao: '-20%', de: 10, para: 8 },
    pendenciasCliente: { variacao: '+10%', de: 32, para: 35 },
  },
  clientes: {
    ohblRecebidos: { valor: '95%', variacao: 3 },
    procuracoesRecebidas: { valor: '93%', variacao: 1 },
    termosRecebidos: { valor: '96%', variacao: 2 },
    pendenciasCliente: { valor: 35, variacao: 10 },
  },
  demurrage: {
    casosAtivos: 8,
    containersNoPrazo: { valor: '93%', variacao: 4 },
  },
  custosOperacionais: {
    memorandosEmitidos: { valor: 480, variacao: 15 },
    entregasMotoboy: { valor: 480, variacao: 10 },
    custoTotal: { valor: 'R$ 7.200', variacao: 10 },
    telexRelease: { valor: 265, variacao: 18 },
    economiaDigital: { valor: 'R$ 4.100' },
  },
  courier: {
    recebidos: { valor: 124, variacao: 12 },
    atrasados: { valor: 9, variacao: -25 },
    documentosAusentes: 5,
  },
  claraSummary: 'O trimestre apresentou crescimento consistente de 22% no volume operacional. A taxa de liberação no prazo subiu para 94%. Demurrages ativas reduziram 20%. Principal ponto de atenção: pendências de cliente cresceram 10%, indicando necessidade de comunicação mais assertiva.',
  claraRecomendacao: 'Implementar rotina preventiva de cobrança documental antes da atracação.',
  tendencia: {
    meses: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    volumeOperacional: [150, 180, 220, 260, 290, 312],
    liberacoes: [100, 120, 140, 155, 160, 164],
    pendenciasCliente: [6, 8, 10, 9, 12, 14],
    demurragesAtivas: [5, 4, 3, 5, 3, 2],
  },
};

const reportDataSemestral: GestaoReportData = {
  periodo: 'Semestral',
  processosRecebidos: { valor: 1580, variacao: 28 },
  processosLiberados: { valor: 920, variacao: 20 },
  liberacoesNoPrazo: { valor: '92%', variacao: 8 },
  processosCriticos: { valor: 22, variacao: -15 },
  mudancas: {
    processosLiberados: { variacao: '+20%', de: 766, para: 920 },
    couriersAtrasados: { variacao: '-30%', de: 24, para: 17 },
    demurragesAtivas: { variacao: '-18%', de: 22, para: 18 },
    pendenciasCliente: { variacao: '+12%', de: 58, para: 65 },
  },
  clientes: {
    ohblRecebidos: { valor: '94%', variacao: 5 },
    procuracoesRecebidas: { valor: '92%', variacao: 3 },
    termosRecebidos: { valor: '95%', variacao: 4 },
    pendenciasCliente: { valor: 65, variacao: 12 },
  },
  demurrage: {
    casosAtivos: 18,
    containersNoPrazo: { valor: '91%', variacao: 6 },
  },
  custosOperacionais: {
    memorandosEmitidos: { valor: 920, variacao: 20 },
    entregasMotoboy: { valor: 920, variacao: 18 },
    custoTotal: { valor: 'R$ 14.800', variacao: 18 },
    telexRelease: { valor: 510, variacao: 22 },
    economiaDigital: { valor: 'R$ 8.200' },
  },
  courier: {
    recebidos: { valor: 240, variacao: 15 },
    atrasados: { valor: 17, variacao: -30 },
    documentosAusentes: 8,
  },
  claraSummary: 'O semestre encerrou com crescimento de 28% no volume operacional. Liberações no prazo estabilizaram em 92%. Demurrages reduziram significativamente (-18%). Destaque para a economia gerada por digitalização: R$ 8.200.',
  claraRecomendacao: 'Manter foco em redução de pendências de cliente e ampliar adoção de Telex Release.',
  tendencia: {
    meses: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    volumeOperacional: [150, 180, 220, 260, 290, 312],
    liberacoes: [100, 120, 140, 155, 160, 164],
    pendenciasCliente: [6, 8, 10, 9, 12, 14],
    demurragesAtivas: [5, 4, 3, 5, 3, 2],
  },
};

const reportDataAnual: GestaoReportData = {
  periodo: 'Anual',
  processosRecebidos: { valor: 2840, variacao: 35 },
  processosLiberados: { valor: 1680, variacao: 30 },
  liberacoesNoPrazo: { valor: '90%', variacao: 12 },
  processosCriticos: { valor: 38, variacao: -22 },
  mudancas: {
    processosLiberados: { variacao: '+30%', de: 1292, para: 1680 },
    couriersAtrasados: { variacao: '-35%', de: 42, para: 27 },
    demurragesAtivas: { variacao: '-25%', de: 40, para: 30 },
    pendenciasCliente: { variacao: '+18%', de: 95, para: 112 },
  },
  clientes: {
    ohblRecebidos: { valor: '93%', variacao: 8 },
    procuracoesRecebidas: { valor: '91%', variacao: 5 },
    termosRecebidos: { valor: '94%', variacao: 6 },
    pendenciasCliente: { valor: 112, variacao: 18 },
  },
  demurrage: {
    casosAtivos: 30,
    containersNoPrazo: { valor: '89%', variacao: 10 },
  },
  custosOperacionais: {
    memorandosEmitidos: { valor: 1680, variacao: 30 },
    entregasMotoboy: { valor: 1680, variacao: 25 },
    custoTotal: { valor: 'R$ 28.400', variacao: 25 },
    telexRelease: { valor: 940, variacao: 35 },
    economiaDigital: { valor: 'R$ 15.800' },
  },
  courier: {
    recebidos: { valor: 450, variacao: 20 },
    atrasados: { valor: 27, variacao: -35 },
    documentosAusentes: 12,
  },
  claraSummary: 'O ano registrou crescimento de 35% no volume operacional. Todos os indicadores principais melhoraram. Demurrages reduziram 25%. Economia por digitalização acumulou R$ 15.800. Ponto de atenção: pendências de cliente cresceram 18%.',
  claraRecomendacao: 'Investir em automação de cobrança preventiva e ampliar digitalização.',
  tendencia: {
    meses: ['Jan', 'Mar', 'Mai', 'Jul', 'Set', 'Nov'],
    volumeOperacional: [120, 180, 250, 280, 300, 312],
    liberacoes: [80, 120, 150, 160, 165, 164],
    pendenciasCliente: [5, 8, 10, 11, 13, 14],
    demurragesAtivas: [6, 4, 5, 3, 3, 2],
  },
};

export const gestaoReportsByPeriod: Record<string, GestaoReportData> = {
  mensal: reportDataMensal,
  trimestral: reportDataTrimestral,
  semestral: reportDataSemestral,
  anual: reportDataAnual,
};
