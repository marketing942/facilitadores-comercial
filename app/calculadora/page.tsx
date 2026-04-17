import type { Metadata } from "next";
import Link from "next/link";
import CalculadoraJuros from "@/components/CalculadoraJuros";

export const metadata: Metadata = {
  title: "Calculadora de Parcelas · Facilitadores Comercial",
  description:
    "Simule juros, parcelas e valor líquido recebido via Guru + Pagar.me",
};

export default function CalculadoraPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="text-gray-800 font-medium">Calculadora de Parcelas</span>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Calculadora de Parcelas — Guru + Pagar.me
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Preencha o valor do produto e a taxa de juros para ver a simulação
          completa de parcelas, repasse de juros e o valor líquido que você
          recebe.
        </p>
      </div>

      <CalculadoraJuros />
    </div>
  );
}
