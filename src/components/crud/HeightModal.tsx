'use client';

import React, { useState } from 'react';
import { X, Ruler, AlertTriangle } from 'lucide-react';

interface HeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentHeight?: number;
}

export const HeightModal: React.FC<HeightModalProps> = ({ isOpen, onClose, onSuccess, currentHeight }) => {
  const [height, setHeight] = useState<string>(currentHeight ? String(currentHeight) : '175');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hNum = parseFloat(height);
    if (isNaN(hNum) || hNum < 50 || hNum > 260) {
      setError('Informe uma estatura válida em centímetros (50 a 260 cm).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/metrics/height', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heightCm: hNum, notes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao registrar altura.');

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
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Definir Estatura Corporal</h3>
              <p className="text-xs text-slate-500">Utilizado para o cálculo de IMC</p>
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
              Estatura (Altura)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                required
                min="50"
                max="260"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Ex.: 175"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">cm</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Ex.: 1,75 m = 175 cm</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="Ex.: Medição com estadiômetro"
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
              className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar Estatura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
