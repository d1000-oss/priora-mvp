import { CheckCircle, AlertTriangle, Mail, FileText, Package, User, Upload } from 'lucide-react';
import { type ReactNode } from 'react';
import { useGlobalState } from '../context/GlobalState';

interface Activity {
  id: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  time: string;
  alert?: boolean;
}

const staticActivities: Activity[] = [
  {
    id: 's1',
    icon: <Mail className="w-3.5 h-3.5 text-success-500" />,
    title: 'Courier recebido',
    subtitle: 'IM1612 — JBS',
    time: '09:21',
  },
  {
    id: 's2',
    icon: <FileText className="w-3.5 h-3.5 text-priora-500" />,
    title: 'Documento conferido',
    subtitle: 'IM1570 — BRA TRADE',
    time: '10:14',
  },
  {
    id: 's3',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-danger-500" />,
    title: 'Courier atrasado',
    subtitle: 'DHL 44556677',
    time: '10:47',
    alert: true,
  },
  {
    id: 's4',
    icon: <Package className="w-3.5 h-3.5 text-priora-500" />,
    title: 'Agente respondeu',
    subtitle: 'Ningbo Logistics',
    time: '11:07',
  },
];

function eventIcon(type: string): ReactNode {
  switch (type) {
    case 'minuta_enviada': return <Upload className="w-3.5 h-3.5 text-success-500" />;
    case 'telex_confirmado': return <CheckCircle className="w-3.5 h-3.5 text-priora-500" />;
    case 'ohbl_enviado': return <FileText className="w-3.5 h-3.5 text-priora-500" />;
    case 'retirada_documento': return <Package className="w-3.5 h-3.5 text-warning-500" />;
    case 'feedback_enviado': return <User className="w-3.5 h-3.5 text-success-500" />;
    case 'decisao_confirmada': return <CheckCircle className="w-3.5 h-3.5 text-success-500" />;
    case 'decisao_rejeitada': return <AlertTriangle className="w-3.5 h-3.5 text-warning-500" />;
    default: return <Mail className="w-3.5 h-3.5 text-text-tertiary" />;
  }
}

function eventTitle(type: string): string {
  switch (type) {
    case 'minuta_enviada': return 'Minuta recebida do cliente';
    case 'telex_confirmado': return 'Telex Release confirmado';
    case 'ohbl_enviado': return 'OHBL enviado pelo cliente';
    case 'retirada_documento': return 'Retirada solicitada';
    case 'feedback_enviado': return 'Feedback recebido';
    case 'decisao_confirmada': return 'Decisão confirmada';
    case 'decisao_rejeitada': return 'Encaminhado para revisão';
    default: return 'Evento registrado';
  }
}

function timeLabel(d: Date): string {
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

interface ActivityFeedProps {
  title?: string;
}

export function ActivityFeed({ title = 'Atividades recentes' }: ActivityFeedProps) {
  const { events } = useGlobalState();

  const portalActivities: Activity[] = events.slice(0, 3).map((e) => ({
    id: e.id,
    icon: eventIcon(e.type),
    title: eventTitle(e.type),
    subtitle: `${e.processoCodigo} — ${e.cliente}`,
    time: timeLabel(e.timestamp),
  }));

  const allActivities = [...portalActivities, ...staticActivities].slice(0, 6);

  return (
    <div className="right-panel-card">
      <h3 className="text-sm font-semibold text-text-primary mb-4">{title}</h3>
      <div className="space-y-3">
        {allActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{activity.title}</p>
              <p className="text-[11px] text-text-tertiary truncate">{activity.subtitle}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[11px] text-text-tertiary">{activity.time}</span>
              {activity.alert ? (
                <AlertTriangle className="w-3.5 h-3.5 text-warning-500" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5 text-success-500" />
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-xs font-medium text-priora-600 hover:text-priora-700 flex items-center justify-center gap-1 transition-colors">
        Ver todas as atividades
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
