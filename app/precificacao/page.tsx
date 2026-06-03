import type { Metadata } from "next";
import Link from "next/link";
import PrecificacaoServico from "@/components/PrecificacaoServico";

export const metadata: Metadata = {
  title: "Precificação de Serviço · Precificador",
  description: "DRE para precificação de serviços com base em horas e custos operacionais",
};

export default function PrecificacaoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-[13px] text-slate-500 mb-5">
        <Link href="/" className="hover:text-slate-900 transition-colors">Início</Link>
        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 font-medium">Precificação de Serviço</span>
      </nav>

      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Precificação de Serviço
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm max-w-2xl">
          Calcule o custo real da operação, o preço de venda por hora e visualize o DRE completo com lucro bruto e líquido.
        </p>
      </div>

      <PrecificacaoServico />
    </div>
  );
}
