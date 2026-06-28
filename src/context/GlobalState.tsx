import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface PortalEvent {
  id: string;
  type:
    | 'minuta_enviada'
    | 'telex_confirmado'
    | 'ohbl_enviado'
    | 'retirada_documento'
    | 'feedback_enviado'
    | 'decisao_confirmada'
    | 'decisao_rejeitada'
    | 'documento_upload';
  processoCodigo: string;
  cliente: string;
  timestamp: Date;
  descricao: string;
}

export interface TimelineEvent {
  id: string;
  processoCodigo: string;
  tipo: string;
  descricao: string;
  timestamp: Date;
  autor: 'sistema' | 'analista' | 'cliente';
}

export interface ProcessState {
  minutaRecebida: boolean;
  telexConfirmado: boolean;
  ohblEnviado: boolean;
  retiradaSolicitada: boolean;
  feedbackEnviado: boolean;
  decisaoStatus?: 'confirmada' | 'rejeitada' | 'pendente';
}

interface DecisionState {
  [decisaoId: string]: 'confirmada' | 'rejeitada' | 'pendente';
}

interface GlobalStateShape {
  events: PortalEvent[];
  timeline: TimelineEvent[];
  processStates: { [codigo: string]: ProcessState };
  decisionStates: DecisionState;
  addEvent: (event: Omit<PortalEvent, 'id' | 'timestamp'>) => void;
  addTimeline: (event: Omit<TimelineEvent, 'id' | 'timestamp'>) => void;
  getProcessState: (codigo: string) => ProcessState;
  confirmDecision: (decisaoId: string, processoCodigo: string, tipo?: string) => void;
  rejectDecision: (decisaoId: string, processoCodigo: string) => void;
}

const defaultProcessState: ProcessState = {
  minutaRecebida: false,
  telexConfirmado: false,
  ohblEnviado: false,
  retiradaSolicitada: false,
  feedbackEnviado: false,
  decisaoStatus: 'pendente',
};

const GlobalStateContext = createContext<GlobalStateShape | null>(null);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<PortalEvent[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [processStates, setProcessStates] = useState<{ [codigo: string]: ProcessState }>({
    'IM2567': {
      minutaRecebida: false,
      telexConfirmado: true,
      ohblEnviado: false,
      retiradaSolicitada: true,
      feedbackEnviado: false,
      decisaoStatus: 'pendente',
    },
    'IM2588': {
      minutaRecebida: false,
      telexConfirmado: false,
      ohblEnviado: true,
      retiradaSolicitada: false,
      feedbackEnviado: false,
      decisaoStatus: 'pendente',
    },
  });
  const [decisionStates, setDecisionStates] = useState<DecisionState>({});

  const addEvent = useCallback((event: Omit<PortalEvent, 'id' | 'timestamp'>) => {
    const newEvent: PortalEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setEvents((prev) => [newEvent, ...prev]);

    // Auto-update process state based on event type
    setProcessStates((prev) => {
      const current = prev[event.processoCodigo] ?? { ...defaultProcessState };
      const updated = { ...current };
      if (event.type === 'minuta_enviada') updated.minutaRecebida = true;
      if (event.type === 'telex_confirmado') updated.telexConfirmado = true;
      if (event.type === 'ohbl_enviado') updated.ohblEnviado = true;
      if (event.type === 'retirada_documento') updated.retiradaSolicitada = true;
      if (event.type === 'feedback_enviado') updated.feedbackEnviado = true;
      return { ...prev, [event.processoCodigo]: updated };
    });

    // Auto-add timeline entry
    setTimeline((prev) => [
      {
        id: crypto.randomUUID(),
        processoCodigo: event.processoCodigo,
        tipo: event.type,
        descricao: event.descricao,
        timestamp: new Date(),
        autor: 'cliente',
      },
      ...prev,
    ]);
  }, []);

  const addTimeline = useCallback((event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    setTimeline((prev) => [
      { ...event, id: crypto.randomUUID(), timestamp: new Date() },
      ...prev,
    ]);
  }, []);

  const getProcessState = useCallback(
    (codigo: string): ProcessState => {
      return processStates[codigo] ?? { ...defaultProcessState };
    },
    [processStates]
  );

  const confirmDecision = useCallback((decisaoId: string, processoCodigo: string, tipo?: string) => {
    setDecisionStates((prev) => ({ ...prev, [decisaoId]: 'confirmada' }));
    const isTelexDecision = tipo?.toLowerCase().includes('telex') ?? false;
    if (isTelexDecision) {
      setProcessStates((prev) => {
        const current = prev[processoCodigo] ?? { ...defaultProcessState };
        return { ...prev, [processoCodigo]: { ...current, telexConfirmado: true } };
      });
    }
    setTimeline((prev) => [
      {
        id: crypto.randomUUID(),
        processoCodigo,
        tipo: isTelexDecision ? 'telex_confirmado_analista' : 'decisao_confirmada',
        descricao: isTelexDecision
          ? 'Telex Release confirmado pelo analista.'
          : 'Decisão confirmada pelo analista.',
        timestamp: new Date(),
        autor: 'analista',
      },
      ...prev,
    ]);
  }, []);

  const rejectDecision = useCallback((decisaoId: string, processoCodigo: string) => {
    setDecisionStates((prev) => ({ ...prev, [decisaoId]: 'rejeitada' }));
    setTimeline((prev) => [
      {
        id: crypto.randomUUID(),
        processoCodigo,
        tipo: 'decisao_rejeitada',
        descricao: 'Decisão encaminhada para revisão pelo analista.',
        timestamp: new Date(),
        autor: 'analista',
      },
      ...prev,
    ]);
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        events,
        timeline,
        processStates,
        decisionStates,
        addEvent,
        addTimeline,
        getProcessState,
        confirmDecision,
        rejectDecision,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error('useGlobalState must be used within GlobalStateProvider');
  return context;
}
