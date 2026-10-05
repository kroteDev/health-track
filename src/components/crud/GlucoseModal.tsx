'use client';

import React, { useState } from 'react';
import { X, Droplet, AlertTriangle, CheckCircle } from 'lucide-react';
import { HealthClassificationService } from '@/domain/services/HealthClassificationService';
import { GlucoseContext } from '@/domain/entities';

interface GlucoseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const GlucoseModal: React.FC<GlucoseModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [value, setValue] = useState<string>('95');
  const [context, setContext] = useState<GlucoseContext>('FASTING');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const valNum = parseFloat(value);
  let preview = null;
  if (!isNaN(valNum) && valNum > 0) {
    try {
      preview = HealthClassificationService.classifyGlucose(valNum, context);
    } catch {
      // ignora
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/metrics/glucose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value: valNum,
          context,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar glicemia.');

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
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Registrar Glicemia Capilar</h3>
              <p className="text-xs text-slate-500">Diretrizes da SBD / ADA</p>
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Valor da Glicose
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                required
                min="20"
                max="800"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="Ex.: 95"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">mg/dL</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Momento / Contexto Clínico
            </label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value as GlucoseContext)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
            >
              <option value="FASTING">Em Jejum (Basal - 8 a 12 horas)</option>
              <option value="POST_MEAL">Pós-refeição (1h a 2h após)</option>
              <option value="PRE_MEAL">Pré-refeição</option>
              <option value="BEDTIME">Antes de dormir (Ao deitar)</option>
              <option value="RANDOM">Casual / Aleatória</option>
            </select>
          </div>

          {preview && (
            <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${preview.bgColor} ${preview.borderColor} ${preview.color}`}>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{preview.category}</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Ex.: Glucômetro Accu-Chek, dedo indicador"
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
              disabled={loading}
              className="px-4 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar Glicemia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
