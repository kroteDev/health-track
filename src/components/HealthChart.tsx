'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Activity, Droplet, Scale } from 'lucide-react';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

interface HealthChartProps {
  glucoseLogs: any[];
  bpLogs: any[];
  weightLogs: any[];
}

export const HealthChart: React.FC<HealthChartProps> = ({
  glucoseLogs,
  bpLogs,
  weightLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'bp' | 'glucose' | 'weight'>('bp');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (activeTab === 'bp') {
      // Sort ascending by date
      const sorted = [...bpLogs].sort(
        (a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
      );
      const labels = sorted.map((item) =>
        new Date(item.measuredAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      );
      const systolicData = sorted.map((item) => item.systolic);
      const diastolicData = sorted.map((item) => item.diastolic);
      const pulseData = sorted.map((item) => item.pulse || null);

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Sistólica (PAS mmHg)',
              data: systolicData,
              borderColor: '#e11d48',
              backgroundColor: 'rgba(225, 29, 72, 0.08)',
              borderWidth: 2.5,
              pointBackgroundColor: '#e11d48',
              pointRadius: 4,
              pointHoverRadius: 6,
              tension: 0.25,
              fill: false,
            },
            {
              label: 'Diastólica (PAD mmHg)',
              data: diastolicData,
              borderColor: '#0284c7',
              backgroundColor: 'rgba(2, 132, 199, 0.08)',
              borderWidth: 2.5,
              pointBackgroundColor: '#0284c7',
              pointRadius: 4,
              pointHoverRadius: 6,
              tension: 0.25,
              fill: false,
            },
            {
              label: 'Pulso (bpm)',
              data: pulseData,
              borderColor: '#9333ea',
              borderDash: [4, 4],
              borderWidth: 1.5,
              pointBackgroundColor: '#9333ea',
              pointRadius: 3,
              tension: 0.2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 12, weight: 500 },
                color: '#334155',
              },
            },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 10,
              callbacks: {
                afterBody: (context) => {
                  return 'Metas SBC: Ótima < 120/80 mmHg | Normal 120-129 / 80-84 mmHg';
                },
              },
            },
          },
          scales: {
            y: {
              min: 40,
              max: 200,
              grid: {
                color: '#f1f5f9',
              },
              ticks: {
                stepSize: 20,
                color: '#64748b',
                font: { size: 11 },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#64748b',
                font: { size: 11 },
              },
            },
          },
        },
      });
    } else if (activeTab === 'glucose') {
      const sorted = [...glucoseLogs].sort(
        (a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
      );
      const labels = sorted.map((item) =>
        new Date(item.measuredAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      );
      const values = sorted.map((item) => item.value);

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Glicemia (mg/dL)',
              data: values,
              borderColor: '#059669',
              backgroundColor: 'rgba(5, 150, 105, 0.1)',
              borderWidth: 2.5,
              pointBackgroundColor: '#059669',
              pointRadius: 5,
              pointHoverRadius: 7,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 12, weight: 500 },
                color: '#334155',
              },
            },
            tooltip: {
              backgroundColor: '#0f172a',
              callbacks: {
                afterBody: () => 'Diretriz SBD: Jejum Normal < 100 mg/dL | Pós-prandial < 140 mg/dL',
              },
            },
          },
          scales: {
            y: {
              min: 50,
              max: 250,
              grid: {
                color: '#f1f5f9',
              },
              ticks: {
                stepSize: 25,
                color: '#64748b',
                font: { size: 11 },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#64748b',
                font: { size: 11 },
              },
            },
          },
        },
      });
    } else if (activeTab === 'weight') {
      const sorted = [...weightLogs].sort(
        (a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
      );
      const labels = sorted.map((item) =>
        new Date(item.measuredAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      );
      const values = sorted.map((item) => item.weightKg);

      const minWeight = Math.max(0, Math.floor(Math.min(...values, 60) - 5));
      const maxWeight = Math.ceil(Math.max(...values, 90) + 5);

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Peso Corporal (kg)',
              data: values,
              borderColor: '#d97706',
              backgroundColor: 'rgba(217, 119, 6, 0.08)',
              borderWidth: 2.5,
              pointBackgroundColor: '#d97706',
              pointRadius: 4,
              pointHoverRadius: 6,
              tension: 0.25,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 12, weight: 500 },
                color: '#334155',
              },
            },
          },
          scales: {
            y: {
              min: minWeight,
              max: maxWeight,
              grid: {
                color: '#f1f5f9',
              },
              ticks: {
                color: '#64748b',
                font: { size: 11 },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: '#64748b',
                font: { size: 11 },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [activeTab, glucoseLogs, bpLogs, weightLogs]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-lg">Curva de Tendência Clínica</h3>
          <p className="text-xs text-slate-500">Monitoramento evolutivo com faixas de referência médica</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('bp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'bp'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-600" />
            Pressão
          </button>
          <button
            onClick={() => setActiveTab('glucose')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'glucose'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-emerald-600" />
            Glicemia
          </button>
          <button
            onClick={() => setActiveTab('weight')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'weight'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            Peso
          </button>
        </div>
      </div>

      <div className="relative h-64 sm:h-72 w-full">
        {((activeTab === 'bp' && bpLogs.length === 0) ||
          (activeTab === 'glucose' && glucoseLogs.length === 0) ||
          (activeTab === 'weight' && weightLogs.length === 0)) ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            Nenhuma medição registrada no período selecionado.
          </div>
        ) : (
          <canvas ref={canvasRef} />
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        {activeTab === 'bp' && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Alvo SBC: PAS &lt; 120 e PAD &lt; 80 mmHg (Ótima)
            </span>
            <span>Diretrizes SBC / AHA 2020</span>
          </>
        )}
        {activeTab === 'glucose' && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Alvo SBD: Jejum 70–99 mg/dL | Pós-prandial &lt; 140 mg/dL
            </span>
            <span>Diretrizes SBD 2024 / ADA 2024</span>
          </>
        )}
        {activeTab === 'weight' && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Classificação Eutrófica OMS: IMC entre 18.5 e 24.9 kg/m²
            </span>
            <span>Classificação da OMS</span>
          </>
        )}
      </div>
    </div>
  );
};
