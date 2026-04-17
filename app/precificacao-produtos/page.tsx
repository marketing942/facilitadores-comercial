import type { Metadata } from "next";
import Link from "next/link";
import PrecificacaoProdutos from "@/components/PrecificacaoProdutos";

export const metadata: Metadata = {
  title: "Precificação de Produtos · Facilitadores Comercial",
  description: "DRE por produto — Mentorias, Presencial, Online, Físicos e Supletivo",
};

export default function PrecificacaoProdutosPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800 transition-colors">Início</Link>
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-800 font-medium">Precificação de Produtos</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Precificação de Produtos</h1>
        <p className="text-gray-500 mt-1 text-sm">
          DRE por produto separado por categoria. Edite preços, custos variáveis e despesas fixas de cada item.
        </p>
      </div>

      <PrecificacaoProdutos />
    </div>
  );
}
