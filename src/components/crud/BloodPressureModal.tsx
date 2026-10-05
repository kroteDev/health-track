'use client';

import React, { useState } from 'react';
import { X, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { HealthClassificationService } from '@/domain/services/HealthClassificationService';

interface BloodPressureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BloodPressureModal: React.FC<BloodPressureModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [systolic, setSystolic] = useState<string>('120');
  const [diastolic, setDiastolic] = useState<string>('80');
  const [pulse, setPulse] = useState<string>('72');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const sysNum = parseInt(systolic, 10);
  const diaNum = parseInt(diastolic, 10);

  let validationError: string | null = null;
  let previewClassification = null;

  if (!isNaN(sysNum) && !isNaN(diaNum)) {
    if (sysNum <= diaNum) {
      validationError = `Inversão pressórica: A Pressão Sistólica (${sysNum}) deve ser maior que a Diastólica (${diaNum}).`;
    } else {
      try {
        previewClassification = HealthClassificationService.classifyBloodPressure(sysNum, diaNum);
      } catch (err: any) {
        validationError = err.message;
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validationError) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/metrics/blood-pressure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systolic: sysNum,
          diastolic: diaNum,
          pulse: pulse ? parseInt(pulse, 10) : undefined,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao registrar pressão.');

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Registrar Pressão Arterial</h3>
              <p className="text-xs text-slate-500">Diretrizes da SBC / AHA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sistólica (PAS)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="50"
                  max="300"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  placeholder="120"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">mmHg</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diastólica (PAD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="30"
                  max="200"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  placeholder="80"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">mmHg</span>
              </div>
            </div>
          </div>

          {/* Validação fisiológica instantânea */}
          {validationError ? (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          ) : previewClassification ? (
            <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${previewClassification.bgColor} ${previewClassification.borderColor} ${previewClassification.color}`}>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Classificação: {previewClassification.category}</span>
              </div>
            </div>
          ) : null}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Frequência Cardíaca / Pulso (opcional)
            </label>
            <div className="relative">
              <input
                type="number"
                min="30"
                max="250"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                placeholder="72"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">bpm</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações Clínicas (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              placeholder="Ex.: Repouso de 5 min, braço esquerdo"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !!validationError}
              className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              {loading ? 'Salvando...' : 'Salvar Medição'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
