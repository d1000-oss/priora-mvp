import { useState } from 'react';
import { gestaoReportsByPeriod } from '../../../data/gestaoData';
import { LineChart } from '../../../components/LineChart';
import { Modal } from '../../../components/Modal';
import { Toast } from '../../../components/Toast';
import {
  Package,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Download,
  Share2,
  Users,
  Truck,
  Ship,
  Send,
  Lightbulb,
} from 'lucide-react';

type Periodo = 'mensal' | 'trimestral' | 'semestral' | 'anual';

const periodoLabels: Record<Periodo, string> = {
  mensal: 'Mensal',
  trimestral: 'Trimestral',
  semestral: 'Semestral',
  anual: 'Anual',
};

function Delta({
  value,
  suffix = '%',
  inverse = false,
}: {
  value: number;
  suffix?: string;
  inverse?: boolean;
}) {
  const isGood = inverse ? value <= 0 : value >= 0;
  const Icon = value >= 0 ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
        isGood ? 'text-success-600' : 'text-danger-600'
      }`}
    >
      <Icon className="w-3 h-3" />
      {value > 0 ? '+' : ''}
      {value}
      {suffix}
    </span>
  );
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <h2 className="text-[13px] font-bold text-text-primary mb-4">
      <span className="text-text-tertiary mr-1.5">{num}.</span>
      {title}
    </h2>
  );
}

function MiniStat({
  label,
  value,
  delta,
  inverse = false,
  highlight,
}: {
  label: string;
  value: string | number;
  delta?: number;
  inverse?: boolean;
  highlight?: 'danger' | 'success';
}) {
  const valueColor =
    highlight === 'danger'
      ? 'text-danger-600'
      : highlight === 'success'
      ? 'text-success-600'
      : 'text-text-primary';
  return (
    <div>
      <p className="text-[11px] text-text-tertiary mb-0.5 leading-tight">{label}</p>
      <p className={`text-sm font-bold leading-none ${valueColor}`}>{value}</p>
      {delta !== undefined && (
        <div className="mt-0.5">
          <Delta value={delta} inverse={inverse} />
        </div>
      )}
    </div>
  );
}

export function Relatorios() {
  const [periodo, setPeriodo] = useState<Periodo>('mensal');
  const [exportModal, setExportModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });

  const data = gestaoReportsByPeriod[periodo];

  const handleExport = () => {
    setExportModal(false);
    setToast({ visible: true, message: 'Relatório exportado com sucesso.' });
  };

  const handleShare = () => {
    if (!shareEmail.trim()) return;
    setShareModal(false);
    setShareEmail('');
    setToast({ visible: true, message: `Relatório enviado para ${shareEmail}.` });
  };

  const chartData = {
    labels: data.tendencia.meses,
    datasets: [
      { label: 'Volume Operacional', values: data.tendencia.volumeOperacional, color: '#6366f1' },
      { label: 'Liberações', values: data.tendencia.liberacoes, color: '#22c55e' },
      { label: 'Pendências de Cliente', values: data.tendencia.pendenciasCliente, color: '#f59e0b' },
      { label: 'Demurrages Ativas', values: data.tendencia.demurragesAtivas, color: '#ef4444' },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
      {/* ── Main column ── */}
      <div className="space-y-5 min-w-0">

        {/* Period selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {(Object.keys(periodoLabels) as Periodo[]).map((p) => (
            <label key={p} className="flex items-center gap-1.5 cursor-pointer select-none">
              <span
                onClick={() => setPeriodo(p)}
                className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all ${
                  periodo === p
                    ? 'border-priora-600 bg-priora-600'
                    : 'border-gray-300 bg-white'
                }`}
              />
              <span
                onClick={() => setPeriodo(p)}
                className={`text-xs font-medium ${
                  periodo === p ? 'text-text-primary' : 'text-text-secondary'
                }`}
              >
                {periodoLabels[p]}
              </span>
            </label>
          ))}
        </div>

        {/* Clara executive summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
          <div className="flex gap-5">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-priora-50 to-indigo-50 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-priora-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-text-primary">Clara</span>
                <span className="text-text-tertiary text-sm">—</span>
                <span className="text-sm font-semibold text-text-secondary">Resumo Executivo</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line mb-3">
                {data.claraSummary}
              </p>
              <p className="text-xs text-text-secondary">
                <span className="font-semibold text-priora-700">Recomendação: </span>
                {data.claraRecomendacao}
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-2 ml-4">
              <button
                onClick={() => setExportModal(true)}
                className="btn-secondary text-xs whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar PDF
              </button>
              <button
                onClick={() => setShareModal(true)}
                className="btn-secondary text-xs whitespace-nowrap"
              >
                <Share2 className="w-3.5 h-3.5" />
                Compartilhar Relatório
              </button>
            </div>
          </div>
        </div>

        {/* Section 1 — Visão Geral */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
          <SectionTitle num="1" title="Visão Geral da Operação" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Processos Recebidos',
                value: data.processosRecebidos.valor,
                delta: data.processosRecebidos.variacao,
                icon: <Package className="w-4 h-4 text-priora-500" />,
                bg: 'bg-priora-50',
              },
              {
                label: 'Processos Liberados',
                value: data.processosLiberados.valor,
                delta: data.processosLiberados.variacao,
                icon: <CheckCircle className="w-4 h-4 text-success-500" />,
                bg: 'bg-success-50',
              },
              {
                label: 'Liberações no Prazo',
                value: data.liberacoesNoPrazo.valor,
                delta: data.liberacoesNoPrazo.variacao,
                icon: <TrendingUp className="w-4 h-4 text-success-500" />,
                bg: 'bg-success-50',
              },
              {
                label: 'Processos Críticos',
                value: data.processosCriticos.valor,
                delta: data.processosCriticos.variacao,
                inverse: true,
                icon: <AlertTriangle className="w-4 h-4 text-danger-500" />,
                bg: 'bg-danger-50',
              },
            ].map((kpi) => (
              <div key={kpi.label} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                  {kpi.icon}
                </div>
                <div>
                  <p className="text-[11px] text-text-tertiary leading-tight">{kpi.label}</p>
                  <p className="text-xl font-bold text-text-primary leading-none mt-0.5">{kpi.value}</p>
                  <div className="mt-0.5">
                    <Delta value={kpi.delta} inverse={kpi.inverse} />
                    <span className="text-[10px] text-text-tertiary ml-1">vs. mês anterior</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 — O que mudou */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
          <SectionTitle num="2" title="O que mudou neste período" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              {
                label: 'Processos Liberados',
                variacao: data.mudancas.processosLiberados.variacao,
                de: data.mudancas.processosLiberados.de,
                para: data.mudancas.processosLiberados.para,
                good: true,
              },
              {
                label: 'Couriers Atrasados',
                variacao: data.mudancas.couriersAtrasados.variacao,
                de: data.mudancas.couriersAtrasados.de,
                para: data.mudancas.couriersAtrasados.para,
                good: data.mudancas.couriersAtrasados.para < data.mudancas.couriersAtrasados.de,
              },
              {
                label: 'Demurrages Ativas',
                variacao: data.mudancas.demurragesAtivas.variacao,
                de: data.mudancas.demurragesAtivas.de,
                para: data.mudancas.demurragesAtivas.para,
                good: data.mudancas.demurragesAtivas.para < data.mudancas.demurragesAtivas.de,
              },
              {
                label: 'Pendências de Cliente',
                variacao: data.mudancas.pendenciasCliente.variacao,
                de: data.mudancas.pendenciasCliente.de,
                para: data.mudancas.pendenciasCliente.para,
                good: data.mudancas.pendenciasCliente.para < data.mudancas.pendenciasCliente.de,
              },
            ].map((item) => {
              const isPositiveChange = item.variacao.startsWith('+');
              const colorClass = item.good ? 'text-success-600' : 'text-danger-600';
              const arrowBg = item.good ? 'bg-success-50' : 'bg-danger-50';
              return (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-text-tertiary mb-1">{item.label}</p>
                  <div className={`flex items-center gap-1 mb-1`}>
                    <div className={`w-5 h-5 rounded-full ${arrowBg} flex items-center justify-center`}>
                      {item.good ? (
                        <TrendingUp className={`w-2.5 h-2.5 ${colorClass}`} />
                      ) : (
                        <TrendingUp className={`w-2.5 h-2.5 ${colorClass}`} />
                      )}
                    </div>
                    <span className={`text-base font-bold ${colorClass}`}>{item.variacao}</span>
                  </div>
                  <p className="text-[10px] text-text-tertiary">
                    {item.de} → {item.para}
                  </p>
                </div>
              );
            })}
          </div>
          {/* Clara insight */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-amber-700">Clara </span>
              <span className="text-[11px] text-amber-700">
                O principal fator de deterioração foi o aumento de pendências documentais dos clientes.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3-4-5-6 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Section 3 — Clientes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <h2 className="text-[13px] font-bold text-text-primary">
                <span className="text-text-tertiary mr-1">3.</span>Clientes
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
              <MiniStat label="OHBL Recebidos" value={data.clientes.ohblRecebidos.valor} delta={data.clientes.ohblRecebidos.variacao} />
              <MiniStat label="Procurações Recebidas" value={data.clientes.procuracoesRecebidas.valor} delta={data.clientes.procuracoesRecebidas.variacao} />
              <MiniStat label="Termos Recebidos" value={data.clientes.termosRecebidos.valor} delta={data.clientes.termosRecebidos.variacao} />
              <MiniStat label="Pendências de Cliente" value={data.clientes.pendenciasCliente.valor} delta={data.clientes.pendenciasCliente.variacao} inverse highlight="danger" />
            </div>
            <button className="flex items-center gap-1 text-xs text-priora-600 font-medium hover:text-priora-700 transition-colors">
              Ver evolução <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Section 4 — Demurrage */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-danger-50 flex items-center justify-center">
                <Ship className="w-3.5 h-3.5 text-danger-500" />
              </div>
              <h2 className="text-[13px] font-bold text-text-primary">
                <span className="text-text-tertiary mr-1">4.</span>Demurrage
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
              <MiniStat label="Casos Ativos" value={data.demurrage.casosAtivos} highlight="danger" />
              <MiniStat label="Containers no Prazo" value={data.demurrage.containersNoPrazo.valor} delta={data.demurrage.containersNoPrazo.variacao} highlight="success" />
            </div>
            <button className="flex items-center gap-1 text-xs text-priora-600 font-medium hover:text-priora-700 transition-colors">
              Ver histórico <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Section 5 — Custos Operacionais */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-success-50 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-success-500" />
              </div>
              <h2 className="text-[13px] font-bold text-text-primary">
                <span className="text-text-tertiary mr-1">5.</span>Custos Operacionais
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-3">
              <MiniStat label="Memorandos Emitidos" value={data.custosOperacionais.memorandosEmitidos.valor} delta={data.custosOperacionais.memorandosEmitidos.variacao} />
              <MiniStat label="Entregas de Motoboy" value={data.custosOperacionais.entregasMotoboy.valor} delta={data.custosOperacionais.entregasMotoboy.variacao} />
              <MiniStat label="Custo Total de Motoboy" value={data.custosOperacionais.custoTotal.valor} delta={data.custosOperacionais.custoTotal.variacao} />
              <MiniStat label="MBL Emitidos no Destino" value={data.custosOperacionais.telexRelease.valor} delta={data.custosOperacionais.telexRelease.variacao} />
              <div className="col-span-2">
                <MiniStat label="Economia Gerada por Digitalização" value={data.custosOperacionais.economiaDigital.valor} highlight="success" />
              </div>
            </div>
            <div className="flex items-start gap-2 bg-success-50 border border-success-100 rounded-lg p-2.5 mt-1">
              <Lightbulb className="w-3.5 h-3.5 text-success-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-success-700 leading-relaxed">
                Foram emitidos aproximadamente {data.custosOperacionais.telexRelease.valor} MBLs no destino durante o período.
              </p>
            </div>
          </div>

          {/* Section 6 — Courier */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-priora-50 flex items-center justify-center">
                <Truck className="w-3.5 h-3.5 text-priora-500" />
              </div>
              <h2 className="text-[13px] font-bold text-text-primary">
                <span className="text-text-tertiary mr-1">6.</span>Courier
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-3 mb-4">
              <MiniStat label="Couriers Recebidos" value={data.courier.recebidos.valor} delta={data.courier.recebidos.variacao} />
              <MiniStat label="Documentos Atrasados" value={data.courier.atrasados.valor} delta={data.courier.atrasados.variacao} inverse highlight="danger" />
              <MiniStat label="Documentos Ausentes" value={data.courier.documentosAusentes} />
            </div>
            <button className="flex items-center gap-1 text-xs text-priora-600 font-medium hover:text-priora-700 transition-colors">
              Ver evolução <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Section 7 — Tendência Geral */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
          <div className="mb-4">
            <h2 className="text-[13px] font-bold text-text-primary">
              <span className="text-text-tertiary mr-1.5">7.</span>Tendência Geral
            </h2>
            <p className="text-[11px] text-text-tertiary mt-0.5">Evolução dos principais indicadores operacionais</p>
          </div>
          <LineChart data={chartData} height={220} />
        </div>

        {/* Footer quote */}
        <div className="text-center py-2">
          <p className="text-xs text-text-tertiary italic">
            " O objetivo dos relatórios não é mostrar números. É revelar tendências. "
          </p>
        </div>
      </div>

      {/* ── Right sidebar ── */}
      <div className="space-y-4 sticky top-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
          {/* Clara header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-priora-50 to-indigo-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-priora-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">Clara</p>
              <p className="text-[11px] text-text-tertiary">Insights Estratégicos</p>
            </div>
          </div>

          {/* O que melhorou */}
          <div className="mb-4">
            <p className="text-[11px] font-bold text-success-600 mb-2">O que melhorou</p>
            <ul className="space-y-1.5">
              {[
                'Processos críticos reduziram 40%.',
                'Couriers atrasados reduziram 40%.',
                'Liberações cresceram 12%.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-success-500 mt-1.5 flex-shrink-0" />
                  <span className="text-[11px] text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-4 mb-4">
            <p className="text-[11px] font-bold text-warning-600 mb-2">O que merece atenção</p>
            <ul className="space-y-1.5">
              {[
                'Pendências de cliente cresceram 15%.',
                'Documentação continua sendo responsável pela maioria dos atrasos.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-warning-500 mt-1.5 flex-shrink-0" />
                  <span className="text-[11px] text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-[11px] font-bold text-priora-600 mb-2">Próxima recomendação</p>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Criar rotina preventiva de cobrança documental antes da atracação.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExportModal(true)}
          className="btn-primary-purple w-full text-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Gerar relatório completo
          <ArrowRight className="w-3.5 h-3.5 ml-auto" />
        </button>
      </div>

      {/* Export Modal */}
      <Modal open={exportModal} onClose={() => setExportModal(false)} title="Exportar Relatório">
        <p className="text-sm text-text-secondary mb-4">
          O relatório {periodoLabels[periodo].toLowerCase()} será exportado em formato PDF com todos os dados e gráficos.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <p className="text-xs font-semibold text-text-primary mb-2">Conteúdo incluído:</p>
          <div className="space-y-1.5">
            {[
              'KPIs do período',
              'Mudanças e variações',
              'Dados por seção (Clientes, Demurrage, Courier, Custos)',
              'Gráfico de tendência',
              'Resumo da Clara',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-text-secondary">
                <CheckCircle className="w-3 h-3 text-success-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-primary-purple text-sm flex-1">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
          <button onClick={() => setExportModal(false)} className="btn-ghost text-sm flex-1">
            Cancelar
          </button>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal open={shareModal} onClose={() => setShareModal(false)} title="Compartilhar Relatório">
        <p className="text-sm text-text-secondary mb-4">
          Envie o relatório {periodoLabels[periodo].toLowerCase()} por e-mail.
        </p>
        <div className="mb-5">
          <label className="text-xs font-semibold text-text-primary mb-1.5 block">
            E-mail do destinatário
          </label>
          <input
            type="email"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            placeholder="nome@empresa.com"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-priora-500/20 focus:border-priora-400 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleShare} className="btn-primary-purple text-sm flex-1">
            <Send className="w-4 h-4" />
            Enviar
          </button>
          <button onClick={() => setShareModal(false)} className="btn-ghost text-sm flex-1">
            Cancelar
          </button>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  );
}
