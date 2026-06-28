import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  FileCheck,
  Mail,
  Truck,
  ClipboardList,
  CheckCircle2,
  FileText,
  Package,
  AlertTriangle,
  TrendingUp,
  Activity,
} from 'lucide-react';

export function InicioPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary">Início</h1>
          <p className="text-sm text-text-secondary mt-1">Central de atenção operacional.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Main column */}
          <div className="space-y-6">

            {/* Clara hero card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <div className="flex items-stretch gap-6">
                {/* Robot illustration */}
                <div className="w-28 flex-shrink-0 flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full bg-priora-100/60" />
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-priora-500 to-priora-700 flex items-center justify-center shadow-elevated">
                      <Sparkles className="w-9 h-9 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-white border-2 border-priora-200 flex items-center justify-center shadow-sm">
                      <span className="text-[9px] font-bold text-priora-700 leading-none">IA</span>
                    </div>
                  </div>
                </div>

                {/* Findings */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-priora-500" />
                    <span className="text-xs font-semibold text-priora-600 uppercase tracking-wide">Clara</span>
                  </div>
                  <h2 className="text-xl font-bold text-text-primary mb-0.5">Olá, Carlos.</h2>
                  <p className="text-sm text-text-secondary mb-4">Analisei 184 processos ativos.</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-danger-500 flex-shrink-0" />
                      <span className="text-sm text-text-primary">2 processos gerando demurrage</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 flex-shrink-0" />
                      <span className="text-sm text-text-primary">4 liberações aguardando cliente</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-warning-500 flex-shrink-0" />
                      <span className="text-sm text-text-primary">1 courier sem atualização</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-priora-500 flex-shrink-0" />
                      <span className="text-sm text-text-primary">3 decisões humanas pendentes</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2.5 bg-priora-50 border border-priora-100 rounded-xl px-3.5 py-2.5">
                    <div className="w-6 h-6 rounded-full bg-priora-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-priora-600" />
                    </div>
                    <p className="text-xs text-text-secondary leading-snug">
                      Sua atenção <span className="font-semibold text-priora-700">deve estar</span> em apenas{' '}
                      <span className="font-bold text-priora-700">3 situações hoje.</span>
                    </p>
                  </div>
                </div>

                {/* Summary card */}
                <div className="w-60 flex-shrink-0 bg-gray-50 rounded-xl p-5 flex flex-col justify-between border border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-success-100 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success-600" />
                      </div>
                      <span className="text-[10px] font-semibold text-success-700 uppercase tracking-wide">Status geral</span>
                    </div>
                    <p className="text-sm text-text-primary font-medium leading-snug mb-2">
                      Nenhum risco operacional crítico foi identificado.
                    </p>
                    <p className="text-sm text-text-secondary leading-snug">
                      Sua atenção é necessária em apenas{' '}
                      <span className="font-bold text-text-primary">3 situações</span> hoje.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/app/decisoes')}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-priora-600 text-white text-xs font-semibold rounded-xl hover:bg-priora-700 transition-colors group"
                  >
                    Ver prioridades
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sua atenção agora */}
            <div>
              <div className="mb-4">
                <h2 className="text-base font-semibold text-text-primary">Sua atenção agora</h2>
                <p className="text-sm text-text-secondary mt-0.5">As situações que mais precisam do seu foco.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Demurrage */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-danger-50 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-danger-500" />
                    </div>
                    <span className="text-[10px] font-bold text-danger-600 uppercase tracking-wider">Alto risco</span>
                  </div>
                  <p className="text-base font-bold text-text-primary leading-tight mb-0.5">Demurrage</p>
                  <p className="text-xs font-medium text-text-secondary mb-2">IM2567</p>
                  <p className="text-xs text-text-secondary leading-snug flex-1 mb-4">
                    Container gerando demurrage{' '}
                    <span className="font-semibold text-danger-600">há 4 dias.</span>
                  </p>
                  <button
                    onClick={() => navigate('/app/demurrage?processo=IM2567')}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-danger-50 text-danger-700 text-xs font-semibold rounded-xl hover:bg-danger-100 border border-danger-100 transition-colors group"
                  >
                    Abrir no Demurrage
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Liberação */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Ação necessária</span>
                  </div>
                  <p className="text-base font-bold text-text-primary leading-tight mb-0.5">Liberação</p>
                  <p className="text-xs font-medium text-text-secondary mb-2">IM1622 — LOGMINAS</p>
                  <p className="text-xs text-text-secondary leading-snug flex-1 mb-4">
                    Apto para agendamento há 5 dias.{' '}
                    <span className="font-semibold text-orange-600">ETA amanhã.</span>
                  </p>
                  <button
                    onClick={() => navigate('/app/liberacao?processo=IM1622')}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-orange-50 text-orange-700 text-xs font-semibold rounded-xl hover:bg-orange-100 border border-orange-100 transition-colors group"
                  >
                    Resolver agora
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {/* Courier */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-warning-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-warning-500" />
                    </div>
                    <span className="text-[10px] font-bold text-warning-600 uppercase tracking-wider">Atualização pendente</span>
                  </div>
                  <p className="text-base font-bold text-text-primary leading-tight mb-0.5">Courier</p>
                  <p className="text-xs font-medium text-text-secondary mb-2">DHL 44556677</p>
                  <p className="text-xs text-text-secondary leading-snug flex-1 mb-4">
                    Sem atualização de tracking{' '}
                    <span className="font-semibold text-warning-600">há 8 dias.</span>
                  </p>
                  <button
                    onClick={() => navigate('/app/couriers')}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-warning-50 text-warning-700 text-xs font-semibold rounded-xl hover:bg-warning-100 border border-warning-100 transition-colors group"
                  >
                    Ver courier
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Recent activities */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4">Atividades recentes</h3>
              <div className="space-y-3.5">
                {[
                  { icon: FileText, iconColor: 'text-priora-500', iconBg: 'bg-priora-50', label: 'Minuta recebida', sub: 'IM2544', time: 'Há 28 min' },
                  { icon: Mail, iconColor: 'text-blue-500', iconBg: 'bg-blue-50', label: 'Courier recebido', sub: 'DHL 77889910', time: 'Há 1 hora' },
                  { icon: CheckCircle2, iconColor: 'text-success-500', iconBg: 'bg-success-50', label: 'Telex confirmado', sub: 'IM2578', time: 'Há 2 horas' },
                  { icon: Package, iconColor: 'text-success-600', iconBg: 'bg-success-50', label: 'Processo liberado', sub: 'IM2531', time: 'Há 3 horas' },
                  { icon: Truck, iconColor: 'text-orange-500', iconBg: 'bg-orange-50', label: 'Container devolvido', sub: 'MSCU1234567', time: 'Há 5 horas' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-text-primary truncate">{item.label}</p>
                      <p className="text-[11px] text-text-tertiary">{item.sub}</p>
                    </div>
                    <span className="text-[10px] text-text-tertiary flex-shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full text-xs font-semibold text-priora-600 hover:text-priora-800 flex items-center justify-center gap-1 group transition-colors">
                Ver todas atividades
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Operational summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-priora-500" />
                <h3 className="text-sm font-semibold text-text-primary">Resumo operacional</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Activity, iconBg: 'bg-blue-50', iconColor: 'text-blue-500', value: '184', label: 'processos monitorados', valueColor: 'text-text-primary' },
                  { icon: FileCheck, iconBg: 'bg-success-50', iconColor: 'text-success-500', value: '18', label: 'aptos para liberação', valueColor: 'text-text-primary' },
                  { icon: AlertTriangle, iconBg: 'bg-danger-50', iconColor: 'text-danger-500', value: '3', label: 'alertas ativos', valueColor: 'text-text-primary' },
                  { icon: CheckCircle2, iconBg: 'bg-success-50', iconColor: 'text-success-600', value: '96%', label: 'dos processos dentro do prazo', valueColor: 'text-success-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <span className={`text-base font-bold ${item.valueColor}`}>{item.value}</span>
                      <span className="text-xs text-text-secondary ml-1.5">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/app/gestao/relatorios')}
                className="mt-4 w-full text-xs font-semibold text-priora-600 hover:text-priora-800 flex items-center justify-center gap-1 group transition-colors"
              >
                Ver resumo completo
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
