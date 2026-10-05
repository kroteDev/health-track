import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HealthTrack — Monitoramento Clínico de Saúde',
  description: 'Monitoramento clínico de glicemia, pressão arterial, peso e IMC com regras SBC, SBD e OMS.',
  openGraph: {
    title: 'HealthTrack — Monitoramento Clínico de Saúde',
    description: 'Monitoramento clínico de glicemia, pressão arterial, peso e IMC com regras SBC, SBD e OMS.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
