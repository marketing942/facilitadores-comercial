import type { Metadata } from "next";
import Link from "next/link";
import PrecificacaoProdutos, { UNICIVE_CONFIG } from "@/components/PrecificacaoProdutos";

export const metadata: Metadata = {
  title: "Unicive Caruaru · Precificador",
  description: "DRE por produto da Unicive Caruaru — categorias e custos personalizados",
};

export default function PrecificacaoUnicivePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-[13px] text-slate-500 mb-5">
        <Link href="/" className="hover:text-slate-900 transition-colors">Início</Link>
        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-500">Produtos</span>
        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 font-medium">Unicive Caruaru</span>
      </nav>

      <div className="mb-7 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Unicive Caruaru</h1>
          <p className="text-slate-500 mt-1.5 text-sm max-w-2xl">
            DRE por produto da Unicive Caruaru. Crie suas categorias e produtos para começar a precificar.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide whitespace-nowrap">
          Empresa: Unicive Caruaru
        </span>
      </div>

      <PrecificacaoProdutos config={UNICIVE_CONFIG} />
    </div>
  );
}
