import type { Metadata } from "next";
import Link from "next/link";
import PrecificacaoServico from "@/components/PrecificacaoServico";

export const metadata: Metadata = {
  title: "Precificação de Serviço · Facilitadores Comercial",
  description: "DRE para precificação de serviços com base em horas e custos operacionais",
};

export default function PrecificacaoPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800 transition-colors">
          Início
        </Link>
        <svg
          className="w-4 h-4 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-800 font-medium">Precificação de Serviço</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Precificação de Serviço
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Calcule o custo real da sua operação, o preço de venda por hora e visualize o DRE completo com lucro bruto e líquido.
        </p>
      </div>

      <PrecificacaoServico />
    </div>
  );
}
