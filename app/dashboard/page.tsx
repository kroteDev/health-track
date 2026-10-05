'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  HeartPulse,
  Activity,
  Droplet,
  Scale,
  Ruler,
  Plus,
  Calendar,
  Download,
  Printer,
  ShieldCheck,
  LogOut,
  Trash2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { HealthChart } from '@/components/HealthChart';
import { BloodPressureModal } from '@/components/crud/BloodPressureModal';
import { GlucoseModal } from '@/components/crud/GlucoseModal';
import { WeightModal } from '@/components/crud/WeightModal';
import { HeightModal } from '@/components/crud/HeightModal';
import { ReportModal } from '@/components/ReportModal';
import { TestRunnerModal } from '@/components/TestRunnerModal';

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [daysFilter, setDaysFilter] = useState<string>('30');

  // Dados
  const [summary, setSummary] = useState<any>(null);
  const [glucoseLogs, setGlucoseLogs] = useState<any[]>([]);
  const [bpLogs, setBpLogs] = useState<any[]>([]);
  const [weightLogs, setWeightLogs] = useState<any[]>([]);
  const [latestHeight, setLatestHeight] = useState<any>(null);

  // Tab da tabela
  const [tableTab, setTableTab] = useState<'bp' | 'glucose' | 'weight'>('bp');

  // Modais
  const [isBpModalOpen, setIsBpModalOpen] = useState<boolean>(false);
  const [isGlucoseModalOpen, setIsGlucoseModalOpen] = useState<boolean>(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState<boolean>(false);
  const [isHeightModalOpen, setIsHeightModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  // 1. Valida autenticação
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (!data.user) {
          router.push('/login');
          return;
        }
        setUser(data.user);
      } catch {
        router.push('/login');
      }
    }
    checkAuth();
  }, [router]);

  // 2. Carrega métricas
  const loadMetrics = useCallback(async () => {
    try {
      const [sumRes, gluRes, bpRes, wRes, hRes] = await Promise.all([
        fetch(`/api/metrics/summary?days=${daysFilter}`),
        fetch(`/api/metrics/glucose?days=${daysFilter}`),
        fetch(`/api/metrics/blood-pressure?days=${daysFilter}`),
        fetch(`/api/metrics/weight?days=${daysFilter}`),
        fetch('/api/metrics/height'),
      ]);

      if (sumRes.ok) {
        const d = await sumRes.json();
        setSummary(d.summary);
      }
      if (gluRes.ok) {
        const d = await gluRes.json();
        setGlucoseLogs(d.logs || []);
      }
      if (bpRes.ok) {
        const d = await bpRes.json();
        setBpLogs(d.logs || []);
      }
      if (wRes.ok) {
        const d = await wRes.json();
        setWeightLogs(d.logs || []);
      }
      if (hRes.ok) {
        const d = await hRes.json();
        setLatestHeight(d.logs && d.logs.length > 0 ? d.logs[0] : null);
      }
    } catch (err) {
      console.error('Erro ao buscar métricas:', err);
    } finally {
      setLoading(false);
    }
  }, [daysFilter]);

  useEffect(() => {
    if (user) {
      loadMetrics();
    }
  }, [user, loadMetrics]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleDeleteLog = async (type: 'bp' | 'glucose' | 'weight', id: string) => {
    if (!confirm('Deseja excluir este registro de medição?')) return;

    const endpoint =
      type === 'bp'
        ? `/api/metrics/blood-pressure/${id}`
        : type === 'glucose'
        ? `/api/metrics/glucose/${id}`
        : `/api/metrics/weight/${id}`;

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        loadMetrics();
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-slate-500">Carregando painel clínico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg flex items-center gap-1.5">
                HealthTrack
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Prontuário
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão Testes Clínicos */}
            <button
              onClick={() => setIsTestModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="Executar bateria de testes clínicos SBC/SBD/OMS"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Testes de Domínio</span>
            </button>

            {/* Exportar Excel */}
            <a
              href="/api/metrics/export/csv"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Excel (.csv)</span>
            </a>

            {/* Laudo Médico */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Laudo Médico</span>
            </button>

            {/* Usuário e Logout */}
            <div className="pl-2 border-l border-slate-200 flex items-center gap-2">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Sair da conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex-1 space-y-6">
        {/* BARRA DE AÇÕES E FILTROS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          {/* Filtro de período */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1.5 mr-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              Período:
            </span>
            {[
              { id: '7', label: '7 dias' },
              { id: '30', label: '30 dias' },
              { id: '90', label: '90 dias' },
              { id: 'all', label: 'Geral' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDaysFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  daysFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Botões de Ação Rápida */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsBpModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              + Pressão
            </button>
            <button
              onClick={() => setIsGlucoseModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              + Glicemia
            </button>
            <button
              onClick={() => setIsWeightModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              + Peso
            </button>
            <button
              onClick={() => setIsHeightModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold transition-colors"
              title="Ajustar estatura para o cálculo de IMC"
            >
              <Ruler className="w-3.5 h-3.5" />
              Estatura {latestHeight ? `(${latestHeight.heightCm}cm)` : ''}
            </button>
          </div>
        </div>

        {/* CARDS DE RESUMO CLÍNICO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card Pressão Arterial */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pressão Arterial (SBC)
              </span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="my-3">
              {summary?.latestBloodPressure ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {summary.latestBloodPressure.log.systolic}/{summary.latestBloodPressure.log.diastolic}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">mmHg</span>
                    {summary.latestBloodPressure.log.pulse && (
                      <span className="text-xs text-slate-500 ml-auto font-medium">
                        {summary.latestBloodPressure.log.pulse} bpm
                      </span>
                    )}
                  </div>
                  <div className="mt-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${summary.latestBloodPressure.classification.bgColor} ${summary.latestBloodPressure.classification.borderColor} ${summary.latestBloodPressure.classification.color}`}
                    >
                      {summary.latestBloodPressure.classification.category}
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-4 text-slate-400 text-xs">Nenhum registro de pressão.</div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Média do período:</span>
              <strong className="text-slate-800">
                {summary?.averages?.systolicAvg && summary?.averages?.diastolicAvg
                  ? `${summary.averages.systolicAvg}/${summary.averages.diastolicAvg} mmHg`
                  : '-'}
              </strong>
            </div>
          </div>

          {/* Card Glicemia */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Glicemia Capilar (SBD)
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Droplet className="w-5 h-5" />
              </div>
            </div>

            <div className="my-3">
              {summary?.latestGlucose ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {summary.latestGlucose.log.value}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">mg/dL</span>
                    <span className="text-xs text-slate-500 ml-auto font-medium capitalize">
                      {summary.latestGlucose.log.context === 'FASTING'
                        ? 'Jejum'
                        : summary.latestGlucose.log.context === 'POST_MEAL'
                        ? 'Pós-refeição'
                        : 'Casual'}
                    </span>
                  </div>
                  <div className="mt-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${summary.latestGlucose.classification.bgColor} ${summary.latestGlucose.classification.borderColor} ${summary.latestGlucose.classification.color}`}
                    >
                      {summary.latestGlucose.classification.category}
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-4 text-slate-400 text-xs">Nenhum registro de glicose.</div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Média de Jejum:</span>
              <strong className="text-slate-800">
                {summary?.averages?.fastingGlucoseAvg ? `${summary.averages.fastingGlucoseAvg} mg/dL` : '-'}
              </strong>
            </div>
          </div>

          {/* Card Peso & IMC */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Peso &amp; IMC (OMS)
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Scale className="w-5 h-5" />
              </div>
            </div>

            <div className="my-3">
              {summary?.latestWeight ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {summary.latestWeight.weightKg}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">kg</span>

                    {summary?.bmiCalculation && (
                      <span className="text-sm font-bold text-slate-700 ml-auto">
                        IMC: {summary.bmiCalculation.bmi}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">kg/m²</span>
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5">
                    {summary?.bmiCalculation ? (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${summary.bmiCalculation.classification.bgColor} ${summary.bmiCalculation.classification.borderColor} ${summary.bmiCalculation.classification.color}`}
                      >
                        {summary.bmiCalculation.classification.category}
                      </span>
                    ) : (
                      <span className="inline-block text-xs text-slate-400">
                        Cadastre sua estatura para calcular o IMC.
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-4 text-slate-400 text-xs">Nenhum registro de peso.</div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Estatura cadastrada:</span>
              <strong className="text-slate-800">
                {latestHeight ? `${latestHeight.heightCm} cm` : 'Não informada'}
              </strong>
            </div>
          </div>
        </div>

        {/* GRÁFICOS */}
        <HealthChart glucoseLogs={glucoseLogs} bpLogs={bpLogs} weightLogs={weightLogs} />

        {/* TABELA DE REGISTROS HISTÓRICOS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Histórico Detalhado de Medições</h3>
              <p className="text-xs text-slate-500">Registros em ordem cronológica decrescente</p>
            </div>

            {/* Alternador de tabela */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setTableTab('bp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tableTab === 'bp' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Pressão ({bpLogs.length})
              </button>
              <button
                onClick={() => setTableTab('glucose')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tableTab === 'glucose' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Glicemia ({glucoseLogs.length})
              </button>
              <button
                onClick={() => setTableTab('weight')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tableTab === 'weight' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Peso ({weightLogs.length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {tableTab === 'bp' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">Data e Hora</th>
                    <th className="py-3 px-4">PAS / PAD</th>
                    <th className="py-3 px-4">Pulso</th>
                    <th className="py-3 px-4">Classificação SBC</th>
                    <th className="py-3 px-4">Observações</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bpLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(log.measuredAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                        {log.systolic} / {log.diastolic}{' '}
                        <span className="text-[11px] font-normal text-slate-400">mmHg</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{log.pulse ? `${log.pulse} bpm` : '-'}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md font-medium text-[11px] ${log.classification?.bgColor} ${log.classification?.color}`}
                        >
                          {log.classification?.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{log.notes || '-'}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteLog('bp', log.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Excluir medição"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bpLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Nenhum registro de pressão arterial encontrado no período.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {tableTab === 'glucose' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">Data e Hora</th>
                    <th className="py-3 px-4">Valor</th>
                    <th className="py-3 px-4">Momento Clínico</th>
                    <th className="py-3 px-4">Classificação SBD</th>
                    <th className="py-3 px-4">Observações</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {glucoseLogs.map((log) => {
                    const ctxLabel =
                      log.context === 'FASTING'
                        ? 'Jejum'
                        : log.context === 'POST_MEAL'
                        ? 'Pós-refeição'
                        : log.context === 'PRE_MEAL'
                        ? 'Pré-refeição'
                        : log.context === 'BEDTIME'
                        ? 'Ao deitar'
                        : 'Casual';
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 text-slate-600">
                          {new Date(log.measuredAt).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                          {log.value}{' '}
                          <span className="text-[11px] font-normal text-slate-400">mg/dL</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{ctxLabel}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md font-medium text-[11px] ${log.classification?.bgColor} ${log.classification?.color}`}
                          >
                            {log.classification?.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{log.notes || '-'}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteLog('glucose', log.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir medição"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {glucoseLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Nenhum registro de glicemia encontrado no período.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {tableTab === 'weight' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4">Data e Hora</th>
                    <th className="py-3 px-4">Peso</th>
                    <th className="py-3 px-4">Estatura</th>
                    <th className="py-3 px-4">IMC Calculado</th>
                    <th className="py-3 px-4">Observações</th>
                    <th className="py-3 px-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {weightLogs.map((log) => {
                    let calcBmi = null;
                    if (latestHeight) {
                      const hM = latestHeight.heightCm / 100;
                      calcBmi = (log.weightKg / (hM * hM)).toFixed(1);
                    }
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 text-slate-600">
                          {new Date(log.measuredAt).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                          {log.weightKg} <span className="text-[11px] font-normal text-slate-400">kg</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {latestHeight ? `${latestHeight.heightCm} cm` : '-'}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {calcBmi ? `${calcBmi} kg/m²` : '-'}
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{log.notes || '-'}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteLog('weight', log.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir medição"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {weightLogs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Nenhum registro de peso encontrado no período.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* MODAIS */}
      <BloodPressureModal
        isOpen={isBpModalOpen}
        onClose={() => setIsBpModalOpen(false)}
        onSuccess={loadMetrics}
      />
      <GlucoseModal
        isOpen={isGlucoseModalOpen}
        onClose={() => setIsGlucoseModalOpen(false)}
        onSuccess={loadMetrics}
      />
      <WeightModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        onSuccess={loadMetrics}
      />
      <HeightModal
        isOpen={isHeightModalOpen}
        onClose={() => setIsHeightModalOpen(false)}
        onSuccess={loadMetrics}
        currentHeight={latestHeight?.heightCm}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        user={user}
        summary={summary}
        glucoseLogs={glucoseLogs}
        bpLogs={bpLogs}
        weightLogs={weightLogs}
        height={latestHeight}
      />
      <TestRunnerModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
}
