'use client';

import React, { useState } from 'react';
import { X, Play, CheckCircle2, XCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { runDomainUnitTests, TestCaseResult } from '@/tests/domain-rules.test';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [results, setResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: TestCaseResult[];
  } | null>(null);

  if (!isOpen) return null;

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runDomainUnitTests();
      setResults(res);
      setIsRunning(false);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Executor Visual de Testes Clínicos</h3>
              <p className="text-xs text-slate-500">Validação automatizada das regras SBC, SBD e OMS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            {results ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {results.passed} passaram
                </span>
                {results.failed > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    {results.failed} falharam
                  </span>
                )}
                <span className="text-slate-500">Total: {results.total} testes</span>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Execute os testes para validar os cálculos em tempo real.</p>
            )}
          </div>

          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Executando...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Executar Testes
              </>
            )}
          </button>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {!results ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Clique em &quot;Executar Testes&quot; para rodar a suíte clínica de validações.
            </div>
          ) : (
            results.results.map((r, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                  r.passed
                    ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-900'
                    : 'bg-rose-50/50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {r.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">
                      <span className="text-slate-500 mr-1.5">[{r.suite}]</span>
                      {r.name}
                    </div>
                    {r.message && <p className="text-[11px] text-rose-600 mt-1">{r.message}</p>}
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{r.durationMs}ms</span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
