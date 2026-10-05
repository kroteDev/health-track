import Link from 'next/link';
import {
  HeartPulse,
  Activity,
  Droplet,
  Scale,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Download,
  CheckCircle2,
  LineChart,
  UserCheck,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                HealthTrack
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Clínico
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-xl transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors"
            >
              Acessar Plataforma
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/80 bg-linear-to-b from-white to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Classificação rigorosa pelas diretrizes da SBC, SBD e OMS
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
            Monitoramento de Saúde e Parâmetros Vitais com{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-rose-600">
              Rigor Clínico
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Acompanhe sua glicemia, pressão arterial e IMC em tempo real. Identifique tendências,
            receba alertas de faixas limítrofes e emita laudos médicos completos em PDF e Excel.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Iniciar Monitoramento Agora
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login?demo=true"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-sm font-semibold rounded-xl shadow-xs transition-all"
            >
              <UserCheck className="w-4 h-4 text-slate-600" />
              Explorar Conta Demo (Carlos Silva)
            </Link>
          </div>

          {/* Micro badges */}
          <div className="mt-10 pt-8 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Sociedade Brasileira de Cardiologia (SBC)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Sociedade Brasileira de Diabetes (SBD)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Organização Mundial da Saúde (OMS)
            </span>
          </div>
        </div>
      </section>

      {/* OS 3 PILARES CLÍNICOS */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Protocolos Validados
          </h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Classificações Médicas Automatizadas
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Validação fisiológica instantânea e separação clínica por faixas de risco.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Pressão */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Pressão Arterial (SBC/AHA)</h3>
              <p className="text-xs text-slate-500 mt-1">Sistólica (PAS), Diastólica (PAD) e Pulso</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <strong>Ótima:</strong> &lt; 120 e &lt; 80 mmHg
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <strong>Normal:</strong> 120–129 e/ou 80–84 mmHg
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <strong>Pré-hipertensão:</strong> 130–139 e/ou 85–89 mmHg
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <strong>Hipertensão Estágio 1 &amp; 2:</strong> ≥ 140/90 mmHg
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-rose-700 font-medium bg-rose-50/50 p-2.5 rounded-xl">
              ✓ Bloqueio fisiológico automático de inversão pressórica (PAS ≤ PAD).
            </div>
          </div>

          {/* Card Glicemia */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Droplet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Glicemia (SBD/ADA)</h3>
              <p className="text-xs text-slate-500 mt-1">Estratificação por momento de coleta</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <strong>Alerta de Hipoglicemia:</strong> &lt; 70 mg/dL
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <strong>Jejum Normal:</strong> 70–99 mg/dL
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <strong>Pré-diabetes (Jejum):</strong> 100–125 mg/dL
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <strong>Pós-prandial Normal:</strong> &lt; 140 mg/dL
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-emerald-700 font-medium bg-emerald-50/50 p-2.5 rounded-xl">
              ✓ Contextos clínicos: Jejum, Pós-refeição, Ao deitar e Casual.
            </div>
          </div>

          {/* Card IMC */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Peso &amp; IMC (OMS)</h3>
              <p className="text-xs text-slate-500 mt-1">Índice de Massa Corporal em tempo real</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <strong>Abaixo do Peso:</strong> &lt; 18.5 kg/m²
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <strong>Eutrófico (Normal):</strong> 18.5–24.9 kg/m²
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <strong>Sobrepeso:</strong> 25.0–29.9 kg/m²
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <strong>Obesidade Graus I, II e III:</strong> ≥ 30.0 kg/m²
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-amber-800 font-medium bg-amber-50/50 p-2.5 rounded-xl">
              ✓ Fórmula: peso / (altura)² com sincronização de estatura.
            </div>
          </div>
        </div>
      </section>

      {/* RECURSOS PROFISSIONAIS */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <LineChart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Gráficos com Metas Clínicas</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Curvas de evolução temporal alimentadas por Chart.js com limites e metas terapêuticas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Laudo Médico em PDF</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Emissão de prontuário formatado para impressão direta ou envio ao seu médico de confiança.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Exportação Excel (.csv)</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Arquivo com codificação UTF-8 BOM e delimitador ponto-e-vírgula para abertura nativa no Excel em português.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 sm:py-20 bg-linear-to-r from-indigo-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Pronto para organizar seu histórico clínico?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Acesse agora com a conta de demonstração ou crie seu perfil seguro.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              Acessar HealthTrack
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto py-8 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>© 2026 HealthTrack — Sistema Clínico em Next.js, Prisma e Clean Architecture.</p>
        <p className="mt-1 text-[11px] text-slate-400">
          As classificações têm finalidade informativa baseadas em diretrizes médicas reconhecidas e não substituem o diagnóstico presencial.
        </p>
      </footer>
    </div>
  );
}
