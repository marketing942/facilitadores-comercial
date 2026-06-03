import type { Metadata } from "next";
import Link from "next/link";
import PrecificacaoSaas from "@/components/PrecificacaoSaas";

export const metadata: Metadata = {
  title: "Precificação de SaaS · Precificador",
  description: "Calcule o preço mensal ideal para seu SaaS com base em Churn, CAC, Margem e LTV/CAC alvo",
};

export default function PrecificacaoSaasPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-1.5 text-[13px] text-slate-500 mb-5">
        <Link href="/" className="hover:text-slate-900 transition-colors">Início</Link>
        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 font-medium">Precificação de SaaS</span>
      </nav>

      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Precificação de SaaS</h1>
        <p className="text-slate-500 mt-1.5 text-sm max-w-2xl">
          Defina Churn, CAC, Margem e o LTV/CAC alvo para descobrir o preço mensal ideal que garante a saúde financeira do produto.
        </p>
      </div>

      <PrecificacaoSaas />
    </div>
  );
}
