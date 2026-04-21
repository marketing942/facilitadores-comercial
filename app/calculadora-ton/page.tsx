import type { Metadata } from "next";
import Link from "next/link";
import CalculadoraTon from "@/components/CalculadoraTon";

export const metadata: Metadata = {
  title: "Calculadora Maquineta TON · Facilitadores Comercial",
  description:
    "Simule taxas da maquineta TON por plano (Super, Turbo, Max) e forma de pagamento — Pix, débito e crédito parcelado.",
};

export default function CalculadoraTonPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800 transition-colors">
          Início
        </Link>
        <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-800 font-medium">Calculadora Maquineta TON</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calculadora Maquineta TON</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Digite o valor do produto, escolha o plano TON e veja o que você recebe líquido em Pix, débito
          e crédito parcelado — com o valor de cada parcela que o cliente vai pagar.
        </p>
      </div>

      <CalculadoraTon />
    </div>
  );
}
