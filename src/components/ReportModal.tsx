'use client';

import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { HealthClassificationService } from '@/domain/services/HealthClassificationService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  summary: any;
  glucoseLogs: any[];
  bpLogs: any[];
  weightLogs: any[];
  height: any;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  user,
  summary,
  glucoseLogs,
  bpLogs,
  weightLogs,
  height,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    window.location.href = '/api/metrics/export/csv';
  };

  const bmiCalc =
    summary?.bmiCalculation ||
    (summary?.latestWeight && height
      ? HealthClassificationService.calculateBMI(summary.latestWeight.weightKg, height.heightCm)
      : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Barra superior de ações (oculta na impressão) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-slate-800">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-lg">Laudo e Prontuário de Saúde</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600" />
              Planilha Excel (.csv)
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ÁREA DO LAUDO IMPRESSO */}
        <div className="space-y-6 text-slate-800 print:text-black">
          {/* Cabeçalho do Prontuário */}
          <div className="border-b-2 border-indigo-600 pb-4 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-indigo-600">HealthTrack</span>
                <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-sm bg-indigo-100 text-indigo-800">
                  Prontuário Clínico
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Relatório de Monitoramento Contínuo dos Parâmetros Vitais
              </p>
            </div>
            <div className="text-xs text-slate-500 sm:text-right">
              <p>Data de Emissão: <strong className="text-slate-700">{new Date().toLocaleDateString('pt-BR')}</strong></p>
              <p>Horário: {new Date().toLocaleTimeString('pt-BR')}</p>
            </div>
          </div>

          {/* Dados do Paciente */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Paciente:</span>
              <strong className="text-slate-800 text-sm">{user?.name || 'Não informado'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">E-mail:</span>
              <strong className="text-slate-800">{user?.email || 'Não informado'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Estatura Cadastrada:</span>
              <strong className="text-slate-800">{height ? `${height.heightCm} cm` : 'Não informada'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Status Clínico Atual:</span>
              <strong className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Monitoramento Ativo
              </strong>
            </div>
          </div>

          {/* Resumo Consolidado */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
              1. Síntese dos Indicadores Vitais Atuais
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Card PA */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
                <span className="text-xs text-slate-500 block font-medium">Pressão Arterial Recente</span>
                {summary?.latestBloodPressure ? (
                  <>
                    <div className="text-xl font-bold text-slate-800 mt-1">
                      {summary.latestBloodPressure.log.systolic} / {summary.latestBloodPressure.log.diastolic}
                      <span className="text-xs font-normal text-slate-400 ml-1">mmHg</span>
                    </div>
                    <span className="inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {summary.latestBloodPressure.classification.category}
                    </span>
                  </>
                ) : (
                  <p className="text-xs text-slate-400 mt-2">Sem registros</p>
                )}
              </div>

              {/* Card Glicemia */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
                <span className="text-xs text-slate-500 block font-medium">Glicemia Recente</span>
                {summary?.latestGlucose ? (
                  <>
                    <div className="text-xl font-bold text-slate-800 mt-1">
                      {summary.latestGlucose.log.value}
                      <span className="text-xs font-normal text-slate-400 ml-1">mg/dL</span>
                    </div>
                    <span className="inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {summary.latestGlucose.classification.category}
                    </span>
                  </>
                ) : (
                  <p className="text-xs text-slate-400 mt-2">Sem registros</p>
                )}
              </div>

              {/* Card IMC */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
                <span className="text-xs text-slate-500 block font-medium">IMC e Peso Atual</span>
                {bmiCalc ? (
                  <>
                    <div className="text-xl font-bold text-slate-800 mt-1">
                      {bmiCalc.bmi} <span className="text-xs font-normal text-slate-400">kg/m²</span>
                      <span className="text-xs font-normal text-slate-500 ml-2">
                        ({summary?.latestWeight?.weightKg} kg)
                      </span>
                    </div>
                    <span className="inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {bmiCalc.classification.category}
                    </span>
                  </>
                ) : (
                  <p className="text-xs text-slate-400 mt-2">Cadastre peso e altura</p>
                )}
              </div>
            </div>
          </div>

          {/* Histórico Recente de Pressão Arterial */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
              2. Histórico de Pressão Arterial (Diretrizes SBC / AHA)
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="p-2.5">Data/Hora</th>
                    <th className="p-2.5">PAS / PAD</th>
                    <th className="p-2.5">Pulso</th>
                    <th className="p-2.5">Classificação SBC</th>
                    <th className="p-2.5">Observações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bpLogs.slice(0, 10).map((log) => {
                    const c = HealthClassificationService.classifyBloodPressure(log.systolic, log.diastolic);
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-2.5 text-slate-500">{new Date(log.measuredAt).toLocaleString('pt-BR')}</td>
                        <td className="p-2.5 font-bold text-slate-800">{log.systolic} / {log.diastolic} mmHg</td>
                        <td className="p-2.5 text-slate-600">{log.pulse ? `${log.pulse} bpm` : '-'}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${c.bgColor} ${c.color}`}>
                            {c.category}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-500">{log.notes || '-'}</td>
                      </tr>
                    );
                  })}
                  {bpLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400">Nenhum registro de pressão.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Histórico Recente de Glicemia */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-2">
              3. Histórico de Glicemia Capilar (Diretrizes SBD / ADA)
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="p-2.5">Data/Hora</th>
                    <th className="p-2.5">Valor (mg/dL)</th>
                    <th className="p-2.5">Momento</th>
                    <th className="p-2.5">Classificação SBD</th>
                    <th className="p-2.5">Observações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {glucoseLogs.slice(0, 10).map((log) => {
                    const c = HealthClassificationService.classifyGlucose(log.value, log.context);
                    const contextLabel =
                      log.context === 'FASTING' ? 'Jejum' : log.context === 'POST_MEAL' ? 'Pós-refeição' : 'Casual';
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-2.5 text-slate-500">{new Date(log.measuredAt).toLocaleString('pt-BR')}</td>
                        <td className="p-2.5 font-bold text-slate-800">{log.value} mg/dL</td>
                        <td className="p-2.5 text-slate-600">{contextLabel}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${c.bgColor} ${c.color}`}>
                            {c.category}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-500">{log.notes || '-'}</td>
                      </tr>
                    );
                  })}
                  {glucoseLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400">Nenhum registro de glicose.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Campo de Assinatura e Carimbo para Impressão */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs mt-10">
            <div>
              <div className="border-b border-slate-300 w-3/4 mx-auto mb-1"></div>
              <span className="text-slate-500">Assinatura do Paciente</span>
            </div>
            <div>
              <div className="border-b border-slate-300 w-3/4 mx-auto mb-1"></div>
              <span className="text-slate-500">Médico / Avaliador Clínico (CRM)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
