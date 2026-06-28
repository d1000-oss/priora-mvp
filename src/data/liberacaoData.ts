export type Responsabilidade = 'Cliente' | 'Rocket' | 'Agente' | 'Armador' | 'Conflito';

export type LiberacaoStatus =
  | 'Apto para Liberação'
  | 'Aguardando Cliente'
  | 'Aguardando Agente'
  | 'Aguardando Rocket'
  | 'Aguardando Armador'
  | 'Liberado'
  | 'Processo Crítico'
  | 'Conflito';

export interface Evidencia {
  id: string;
  tipo: 'email' | 'termo' | 'ohbl' | 'courier' | 'agendamento' | 'memorando' | 'telex' | 'procuracao';
  label: string;
  data: string;
  fonte: string;
  resumo: string;
  original: string;
}

export interface HistoricoItem {
  data: string;
  descricao: string;
}

export interface LiberacaoProcesso {
  id: string;
  codigo: string;
  cliente: string;
  navio: string;
  eta: string;
  chegada: string;
  local: string;
  status: LiberacaoStatus;
  responsabilidade: Responsabilidade;
  claraConclusao: string;
  claraCor: 'green' | 'yellow' | 'orange' | 'red';
  oQueTemos: { item: string; ok: boolean }[];
  evidencias: Evidencia[];
  proximaAcao: { label: string; tipo: 'agendar' | 'cobrar_agente' | 'solicitar_ohbl' | 'contatar_cliente' | 'revisar_conflito' | 'enviar_memorando' };
  historico: HistoricoItem[];
  estagnacao: string;
  diasParado: number;
  criticidade: number;
}

export const liberacaoProcessos: LiberacaoProcesso[] = [
  {
    id: '1',
    codigo: 'IM1578',
    cliente: 'BRA TRADE',
    navio: 'ONE HARMONY / 02SW',
    eta: '20/06',
    chegada: '20/06 (2 dias)',
    local: 'Santos, Brasil',
    status: 'Apto para Liberação',
    responsabilidade: 'Rocket',
    claraConclusao: 'Processo apto para liberação. Cliente já cumpriu todas as obrigações. Nenhum impedimento identificado.',
    claraCor: 'green',
    oQueTemos: [
      { item: 'Termo recebido', ok: true },
      { item: 'Procuração validada', ok: true },
      { item: 'OHBL validado', ok: true },
      { item: 'Prazo de pagamento', ok: true },
      { item: 'OMBL recebido', ok: true },
    ],
    evidencias: [
      { id: 'e1', tipo: 'telex', label: 'Telex confirmado', data: '13/06/2026', fonte: 'Agente — Shangai Maritime', resumo: 'Telex Release confirmado pelo agente de origem.', original: 'Dear Sirs, we confirm the Telex Release for B/L ONEYSHA250612345. Original B/L surrendered at origin.' },
      { id: 'e2', tipo: 'courier', label: 'Courier recebido', data: '08/06/2026', fonte: 'FedEx — 778899110022', resumo: 'Envelope recebido em escritório Santos.', original: 'Delivered: Jun 08, 2026 09:12 AM — Signed by: RECEPCAO' },
      { id: 'e3', tipo: 'termo', label: 'Termo localizado', data: '10/06/2026', fonte: 'Portal do Cliente', resumo: 'Termo de responsabilidade assinado digitalmente.', original: 'Documento assinado em 10/06/2026 via certificado ICP-Brasil.' },
      { id: 'e4', tipo: 'ohbl', label: 'OHBL validado', data: '12/06/2026', fonte: 'Conferência interna', resumo: 'OHBL original conferido e validado.', original: 'OHBL ONEYSHA250612345 — conferido por Angelina em 12/06/2026.' },
    ],
    proximaAcao: { label: 'Iniciar Agendamento', tipo: 'agendar' },
    historico: [
      { data: '08/06', descricao: 'Courier recebido' },
      { data: '10/06', descricao: 'Termo localizado' },
      { data: '12/06', descricao: 'OHBL validado' },
      { data: '13/06', descricao: 'Telex confirmado' },
      { data: '16/06', descricao: 'Processo apto para liberação' },
    ],
    estagnacao: 'Pronto para agendamento há 2 dias',
    diasParado: 2,
    criticidade: 8,
  },
  {
    id: '2',
    codigo: 'IM1622',
    cliente: 'LOGMINAS',
    navio: 'CMA CGM TANYA / 0FLJ9W1MA',
    eta: '19/06',
    chegada: '19/06 (1 dia)',
    local: 'Suape, Brasil',
    status: 'Processo Crítico',
    responsabilidade: 'Rocket',
    claraConclusao: 'Processo crítico. Apto para agendamento há 5 dias. ETA amanhã e nenhum agendamento foi iniciado.',
    claraCor: 'red',
    oQueTemos: [
      { item: 'Termo recebido', ok: true },
      { item: 'Procuração validada', ok: true },
      { item: 'OHBL validado', ok: true },
      { item: 'Prazo de pagamento', ok: true },
      { item: 'OMBL recebido', ok: true },
    ],
    evidencias: [
      { id: 'e5', tipo: 'termo', label: 'Termo recebido', data: '05/06/2026', fonte: 'Portal do Cliente', resumo: 'Termo enviado pelo cliente.', original: 'Documento assinado em 05/06/2026 via certificado ICP-Brasil.' },
      { id: 'e6', tipo: 'ohbl', label: 'OHBL validado', data: '07/06/2026', fonte: 'Conferência interna', resumo: 'OHBL conferido.', original: 'OHBL CMACGM0FLJ9W — conferido por Pedro em 07/06/2026.' },
      { id: 'e7', tipo: 'procuracao', label: 'Procuração validada', data: '06/06/2026', fonte: 'Cartório Digital', resumo: 'Procuração com poderes válidos.', original: 'Procuração pública lavrada em 06/06/2026 — Cartório 3o Ofício Santos.' },
    ],
    proximaAcao: { label: 'Iniciar Agendamento', tipo: 'agendar' },
    historico: [
      { data: '05/06', descricao: 'Termo recebido do cliente' },
      { data: '06/06', descricao: 'Procuração validada' },
      { data: '07/06', descricao: 'OHBL conferido' },
      { data: '11/06', descricao: 'Processo marcado como apto' },
    ],
    estagnacao: 'Pronto para agendamento há 5 dias',
    diasParado: 5,
    criticidade: 10,
  },
  {
    id: '3',
    codigo: 'IM1599',
    cliente: 'EXTRUSA',
    navio: 'MAERSK SELETAR / 1409W',
    eta: '22/06',
    chegada: '22/06 (4 dias)',
    local: 'Itajaí, Brasil',
    status: 'Aguardando Cliente',
    responsabilidade: 'Cliente',
    claraConclusao: 'Aguardando Cliente. OHBL ainda não localizado. Último contato há 3 dias sem resposta.',
    claraCor: 'yellow',
    oQueTemos: [
      { item: 'Termo recebido', ok: true },
      { item: 'Procuração validada', ok: true },
      { item: 'OHBL validado', ok: false },
      { item: 'Prazo de pagamento', ok: true },
      { item: 'OMBL recebido', ok: true },
    ],
    evidencias: [
      { id: 'e8', tipo: 'termo', label: 'Termo recebido', data: '14/06/2026', fonte: 'Portal do Cliente', resumo: 'Termo assinado pelo cliente.', original: 'Documento assinado em 14/06/2026.' },
      { id: 'e9', tipo: 'email', label: 'Cobrança enviada', data: '16/06/2026', fonte: 'E-mail para cliente', resumo: 'Solicitação de envio do OHBL original.', original: 'Prezado, solicitamos envio do OHBL original para prosseguimento.' },
    ],
    proximaAcao: { label: 'Solicitar OHBL', tipo: 'solicitar_ohbl' },
    historico: [
      { data: '14/06', descricao: 'Termo recebido' },
      { data: '15/06', descricao: 'Procuração validada' },
      { data: '16/06', descricao: 'Cobrança OHBL enviada ao cliente' },
    ],
    estagnacao: 'OHBL pendente há 4 dias',
    diasParado: 4,
    criticidade: 5,
  },
  {
    id: '4',
    codigo: 'IM1610',
    cliente: 'AMBEV',
    navio: 'MSC BRAZIL / 2510A',
    eta: '21/06',
    chegada: '21/06 (3 dias)',
    local: 'Santos, Brasil',
    status: 'Aguardando Agente',
    responsabilidade: 'Agente',
    claraConclusao: 'Aguardando Agente. Telex Release ainda não confirmado. Agente notificado há 3 dias.',
    claraCor: 'orange',
    oQueTemos: [
      { item: 'Termo recebido', ok: true },
      { item: 'Procuração validada', ok: true },
      { item: 'OHBL validado', ok: true },
      { item: 'Prazo de pagamento', ok: true },
      { item: 'Telex Release', ok: false },
    ],
    evidencias: [
      { id: 'e10', tipo: 'email', label: 'E-mail do agente', data: '15/06/2026', fonte: 'Long Sail', resumo: 'Agente informa que processamento está em andamento.', original: 'Dear Sirs, Telex Release is being processed. Expected confirmation within 48h.' },
      { id: 'e11', tipo: 'ohbl', label: 'OHBL recebido', data: '12/06/2026', fonte: 'Courier DHL', resumo: 'OHBL recebido via courier.', original: 'DHL delivery confirmation — 12/06/2026 10:42 AM.' },
    ],
    proximaAcao: { label: 'Cobrar agente', tipo: 'cobrar_agente' },
    historico: [
      { data: '10/06', descricao: 'Documentação do cliente completa' },
      { data: '12/06', descricao: 'OHBL recebido via courier' },
      { data: '15/06', descricao: 'Agente informou processamento em curso' },
    ],
    estagnacao: 'Sem resposta do agente há 3 dias',
    diasParado: 3,
    criticidade: 6,
  },
  {
    id: '5',
    codigo: 'IM1645',
    cliente: 'JBS',
    navio: 'EVER GOLDEN / 0987W',
    eta: '23/06',
    chegada: '23/06 (5 dias)',
    local: 'Paranaguá, Brasil',
    status: 'Aguardando Armador',
    responsabilidade: 'Armador',
    claraConclusao: 'Aguardando Armador. Memorando enviado há 2 dias. SISCARGA ainda mostra pendência.',
    claraCor: 'orange',
    oQueTemos: [
      { item: 'Termo recebido', ok: true },
      { item: 'Procuração validada', ok: true },
      { item: 'OHBL validado', ok: true },
      { item: 'Memorando enviado', ok: true },
      { item: 'SISCARGA liberado', ok: false },
    ],
    evidencias: [
      { id: 'e12', tipo: 'memorando', label: 'Memorando enviado', data: '16/06/2026', fonte: 'Protocolo interno', resumo: 'Memorando protocolado junto ao agente do armador.', original: 'Memorando ref. IM1645 protocolado em 16/06/2026 — Prot. 2026/4521.' },
      { id: 'e13', tipo: 'agendamento', label: 'Entrega ao agente', data: '17/06/2026', fonte: 'Motoboy', resumo: 'Documentos entregues ao agente do armador.', original: 'Entrega confirmada — 17/06/2026 14:30 — Assinatura: RECEPCAO EVERGREEN.' },
    ],
    proximaAcao: { label: 'Enviar memorando', tipo: 'enviar_memorando' },
    historico: [
      { data: '12/06', descricao: 'Documentação completa' },
      { data: '14/06', descricao: 'Memorando elaborado' },
      { data: '16/06', descricao: 'Memorando protocolado' },
      { data: '17/06', descricao: 'Documentos entregues ao agente' },
    ],
    estagnacao: 'Aguardando armador há 2 dias',
    diasParado: 2,
    criticidade: 4,
  },
  {
    id: '6',
    codigo: 'IM1633',
    cliente: 'COCA-COLA',
    navio: 'MSC BRAZIL / 2510A',
    eta: '21/06',
    chegada: '21/06 (3 dias)',
    local: 'Santos, Brasil',
    status: 'Conflito',
    responsabilidade: 'Conflito',
    claraConclusao: 'Conflito identificado. Cliente selecionou Telex Release no portal, porém agente informou envio de OHBL físico via courier.',
    claraCor: 'red',
    oQueTemos: [
      { item: 'Termo recebido', ok: true },
      { item: 'Procuração validada', ok: true },
      { item: 'OHBL validado', ok: false },
      { item: 'Telex Release', ok: false },
      { item: 'Courier informado', ok: true },
    ],
    evidencias: [
      { id: 'e14', tipo: 'email', label: 'E-mail do agente', data: '14/06/2026', fonte: 'Helka', resumo: 'Agente informa envio de OHBL físico.', original: 'Dear Sirs, physical B/L has been dispatched via DHL. Tracking: 5566778899.' },
      { id: 'e15', tipo: 'telex', label: 'Solicitação Telex', data: '15/06/2026', fonte: 'Portal do Cliente', resumo: 'Cliente selecionou Telex Release como modalidade.', original: 'Modalidade selecionada pelo cliente em 15/06/2026: Telex Release.' },
    ],
    proximaAcao: { label: 'Revisar conflito', tipo: 'revisar_conflito' },
    historico: [
      { data: '12/06', descricao: 'Documentação básica recebida' },
      { data: '14/06', descricao: 'Agente informou envio de OHBL físico' },
      { data: '15/06', descricao: 'Cliente selecionou Telex Release' },
      { data: '15/06', descricao: 'Conflito identificado pela Clara' },
    ],
    estagnacao: 'Conflito sem resolução há 3 dias',
    diasParado: 3,
    criticidade: 7,
  },
  {
    id: '7',
    codigo: 'IM1677',
    cliente: 'NUTRIBRAS',
    navio: 'MAERSK SELETAR / 1409W',
    eta: '22/06',
    chegada: '22/06 (4 dias)',
    local: 'Itajaí, Brasil',
    status: 'Apto para Liberação',
    responsabilidade: 'Rocket',
    claraConclusao: 'Processo apto para liberação. Todas as obrigações cumpridas. Sem impedimentos.',
    claraCor: 'green',
    oQueTemos: [
      { item: 'Termo recebido', ok: true },
      { item: 'Procuração validada', ok: true },
      { item: 'OHBL validado', ok: true },
      { item: 'Prazo de pagamento', ok: true },
      { item: 'OMBL recebido', ok: true },
    ],
    evidencias: [
      { id: 'e16', tipo: 'telex', label: 'Telex confirmado', data: '17/06/2026', fonte: 'Maersk Line', resumo: 'Telex Release confirmado.', original: 'Telex Release confirmed for B/L MAEU261234567.' },
      { id: 'e17', tipo: 'termo', label: 'Termo localizado', data: '15/06/2026', fonte: 'Portal do Cliente', resumo: 'Termo assinado digitalmente.', original: 'Documento assinado em 15/06/2026.' },
    ],
    proximaAcao: { label: 'Iniciar Agendamento', tipo: 'agendar' },
    historico: [
      { data: '14/06', descricao: 'Documentação recebida' },
      { data: '15/06', descricao: 'Termo localizado' },
      { data: '17/06', descricao: 'Telex confirmado' },
      { data: '18/06', descricao: 'Processo apto para liberação' },
    ],
    estagnacao: 'Pronto para agendamento há 1 dia',
    diasParado: 1,
    criticidade: 3,
  },
  {
    id: '8',
    codigo: 'IM1690',
    cliente: 'BRF FOODS',
    navio: 'HYUNDAI BRAVE / 112S',
    eta: '20/06',
    chegada: '20/06 (2 dias)',
    local: 'Santos, Brasil',
    status: 'Aguardando Cliente',
    responsabilidade: 'Cliente',
    claraConclusao: 'Aguardando Cliente. Procuração ainda não recebida. Demais documentos em ordem.',
    claraCor: 'yellow',
    oQueTemos: [
      { item: 'Termo recebido', ok: true },
      { item: 'Procuração validada', ok: false },
      { item: 'OHBL validado', ok: true },
      { item: 'Prazo de pagamento', ok: true },
      { item: 'OMBL recebido', ok: true },
    ],
    evidencias: [
      { id: 'e18', tipo: 'email', label: 'Cobrança enviada', data: '17/06/2026', fonte: 'E-mail para cliente', resumo: 'Solicitação de procuração.', original: 'Prezado, solicitamos envio da procuração para prosseguimento da liberação.' },
      { id: 'e19', tipo: 'ohbl', label: 'OHBL recebido', data: '14/06/2026', fonte: 'Courier FedEx', resumo: 'OHBL recebido via FedEx.', original: 'FedEx delivery — 14/06/2026 08:55 AM — Signed by: RECEPCAO.' },
    ],
    proximaAcao: { label: 'Contatar cliente', tipo: 'contatar_cliente' },
    historico: [
      { data: '12/06', descricao: 'OHBL recebido' },
      { data: '14/06', descricao: 'Termo recebido' },
      { data: '17/06', descricao: 'Cobrança de procuração enviada' },
    ],
    estagnacao: 'Procuração pendente há 6 dias',
    diasParado: 6,
    criticidade: 7,
  },
];

export type SortOption = 'criticidade' | 'eta' | 'parado' | 'rocket' | 'cliente' | 'agente' | 'armador';

export const sortOptions: { id: SortOption; label: string }[] = [
  { id: 'criticidade', label: 'Mais críticos' },
  { id: 'eta', label: 'ETA mais próxima' },
  { id: 'parado', label: 'Mais tempo parado' },
  { id: 'rocket', label: 'Responsabilidade Rocket' },
  { id: 'cliente', label: 'Responsabilidade Cliente' },
  { id: 'agente', label: 'Responsabilidade Agente' },
  { id: 'armador', label: 'Responsabilidade Armador' },
];
