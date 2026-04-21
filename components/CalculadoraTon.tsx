"use client";

import { useMemo, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanId = "super" | "turbo" | "max";

interface PlanRates {
  id: PlanId;
  label: string;
  subtitle: string;
  color: string;
  pix: number;
  debito: number;
  // index 0 = 1x, index 11 = 12x
  credito: number[];
}

// ─── TON rates (fontes públicas, abril/2026) ──────────────────────────────────
// Valores podem ser ajustados aqui se a TON atualizar as taxas oficiais.

const PLANS: PlanRates[] = [
  {
    id: "super",
    label: "Ton Super",
    subtitle: "Sem exigência de faturamento · ideal para começar",
    color: "gray",
    pix: 0,
    debito: 1.98,
    credito: [4.98, 7.9, 9.19, 10.48, 11.77, 13.06, 15.18, 16.57, 18.06, 19.55, 21.07, 22.59],
  },
  {
    id: "turbo",
    label: "Ton Turbo",
    subtitle: "Intermediário · faturamento acima de R$ 2 mil/mês",
    color: "blue",
    pix: 0,
    debito: 1.45,
    credito: [3.39, 4.95, 5.69, 6.5, 7.29, 8.09, 9.68, 10.48, 11.19, 11.79, 12.49, 13.29],
  },
  {
    id: "max",
    label: "Ton Max",
    subtitle: "Menores taxas · faturamento acima de R$ 15 mil/mês",
    color: "green",
    pix: 0,
    debito: 1.29,
    credito: [3.09, 6.7, 7.54, 8.42, 9.29, 11.37, 11.55, 11.73, 11.91, 12.1, 12.34, 12.59],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseN(s: string): number {
  const v = parseFloat((s ?? "").replace(/\./g, "").replace(",", "."));
  return isNaN(v) ? 0 : v;
}

function fmt(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

function fmtPct(v: number): string {
  return `${v.toFixed(2).replace(".", ",")}%`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Row({
  method,
  installments,
  rate,
  price,
  highlight,
}: {
  method: string;
  installments: number;
  rate: number;
  price: number;
  highlight?: "pix" | "best";
}) {
  const taxa = price * (rate / 100);
  const liquido = price - taxa;
  const parcela = installments > 0 ? price / installments : price;

  const bgClass = highlight === "pix"
    ? "bg-emerald-50/60 hover:bg-emerald-50"
    : highlight === "best"
    ? "bg-blue-50/40 hover:bg-blue-50"
    : "hover:bg-gray-50";

  return (
    <tr className={`border-b border-gray-50 last:border-0 transition-colors ${bgClass}`}>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          {highlight === "pix" && (
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          )}
          <span className={`text-sm ${highlight === "pix" ? "font-semibold text-emerald-800" : "text-gray-800 font-medium"}`}>
            {method}
          </span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-right">
        <span className={`text-sm font-mono ${rate === 0 ? "text-emerald-700 font-bold" : "text-gray-700"}`}>
          {fmtPct(rate)}
        </span>
      </td>
      <td className="px-3 py-2.5 text-right">
        <span className="text-sm font-mono text-red-600">{fmt(taxa)}</span>
      </td>
      <td className="px-3 py-2.5 text-right">
        <span className={`text-sm font-mono font-bold ${liquido >= price ? "text-emerald-700" : "text-gray-900"}`}>
          {fmt(liquido)}
        </span>
      </td>
      <td className="px-3 py-2.5 text-right">
        <span className="text-sm font-mono text-gray-600">
          {installments > 1 ? (
            <>
              {installments}× <strong className="text-gray-900">{fmt(parcela)}</strong>
            </>
          ) : (
            <span className="text-gray-400">—</span>
          )}
        </span>
      </td>
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PLAN_STYLES: Record<string, { active: string; badge: string }> = {
  gray: {
    active: "border-gray-500 bg-gray-50 text-gray-900",
    badge: "bg-gray-100 text-gray-700",
  },
  blue: {
    active: "border-blue-500 bg-blue-50 text-blue-900",
    badge: "bg-blue-100 text-blue-700",
  },
  green: {
    active: "border-emerald-500 bg-emerald-50 text-emerald-900",
    badge: "bg-emerald-100 text-emerald-700",
  },
};

export default function CalculadoraTon() {
  const [price, setPrice] = useLocalStorage<string>("ton_price", "1000");
  const [planId, setPlanId] = useLocalStorage<PlanId>("ton_plan", "turbo");
  const [maxInstallments, setMaxInstallments] = useLocalStorage<number>("ton_max_inst", 12);

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];
  const priceN = parseN(price);

  // Best credit option (lowest effective cost for vendor) among installments
  const bestCreditIdx = useMemo(() => {
    const rates = plan.credito.slice(0, maxInstallments);
    let best = 0;
    for (let i = 1; i < rates.length; i++) {
      if (rates[i] < rates[best]) best = i;
    }
    return best;
  }, [plan, maxInstallments]);

  // Summary: pick the three best options
  const pixLiquido = priceN * (1 - plan.pix / 100);
  const debitoLiquido = priceN * (1 - plan.debito / 100);
  const creditoVistaLiquido = priceN * (1 - plan.credito[0] / 100);
  const credito12xLiquido = priceN * (1 - plan.credito[Math.min(11, maxInstallments - 1)] / 100);

  return (
    <div className="space-y-5">
      {/* Plan selector */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
          Escolha o plano TON
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PLANS.map((p) => {
            const active = p.id === planId;
            const style = PLAN_STYLES[p.color];
            return (
              <button
                key={p.id}
                onClick={() => setPlanId(p.id)}
                className={`text-left rounded-xl border-2 p-4 transition-all ${
                  active
                    ? style.active
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{p.label}</span>
                  {active && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                      Selecionado
                    </span>
                  )}
                </div>
                <p className={`text-xs ${active ? "opacity-80" : "text-gray-500"}`}>{p.subtitle}</p>
                <div className={`mt-2 text-xs font-mono ${active ? "opacity-90" : "text-gray-600"}`}>
                  Débito {fmtPct(p.debito)} · Crédito 1× {fmtPct(p.credito[0])} · 12× {fmtPct(p.credito[11])}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price input */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Valor do produto
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">R$</span>
              <input
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border-2 border-amber-300 bg-amber-50 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                placeholder="0,00"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Máximo de parcelas
            </label>
            <div className="flex items-center gap-2">
              {[1, 3, 6, 10, 12].map((n) => (
                <button
                  key={n}
                  onClick={() => setMaxInstallments(n)}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    maxInstallments === n
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {n}×
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Pix</div>
          <div className="text-xs text-emerald-600 mt-0.5">Taxa {fmtPct(plan.pix)}</div>
          <div className="text-xl font-bold text-emerald-800 mt-2">{fmt(pixLiquido)}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">líquido recebido</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Débito</div>
          <div className="text-xs text-gray-500 mt-0.5">Taxa {fmtPct(plan.debito)}</div>
          <div className="text-xl font-bold text-gray-900 mt-2">{fmt(debitoLiquido)}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">líquido recebido</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Crédito à vista</div>
          <div className="text-xs text-gray-500 mt-0.5">Taxa {fmtPct(plan.credito[0])}</div>
          <div className="text-xl font-bold text-gray-900 mt-2">{fmt(creditoVistaLiquido)}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">líquido recebido</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Crédito {Math.min(12, maxInstallments)}×
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Taxa {fmtPct(plan.credito[Math.min(11, maxInstallments - 1)])}
          </div>
          <div className="text-xl font-bold text-gray-900 mt-2">{fmt(credito12xLiquido)}</div>
          <div className="text-[11px] text-gray-500 mt-0.5">líquido recebido</div>
        </div>
      </div>

      {/* Detailed breakdown table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900">Simulação por forma de pagamento</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Bandeiras Visa e Mastercard · recebimento em D+1
            </p>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${PLAN_STYLES[plan.color].badge}`}>
            {plan.label}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="text-left px-3 py-2.5 font-semibold">Forma de pagamento</th>
                <th className="text-right px-3 py-2.5 font-semibold">Taxa</th>
                <th className="text-right px-3 py-2.5 font-semibold">Valor da taxa</th>
                <th className="text-right px-3 py-2.5 font-semibold">Você recebe</th>
                <th className="text-right px-3 py-2.5 font-semibold">Cliente paga</th>
              </tr>
            </thead>
            <tbody>
              <Row method="Pix" installments={1} rate={plan.pix} price={priceN} highlight="pix" />
              <Row method="Débito" installments={1} rate={plan.debito} price={priceN} />
              {plan.credito.slice(0, maxInstallments).map((rate, i) => (
                <Row
                  key={i}
                  method={i === 0 ? "Crédito à vista" : `Crédito ${i + 1}×`}
                  installments={i + 1}
                  rate={rate}
                  price={priceN}
                  highlight={i === bestCreditIdx && i > 0 ? "best" : undefined}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-xs text-gray-600">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Pix — zero taxa, melhor opção
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Menor taxa dentro do crédito parcelado
          </span>
        </div>
        <p className="mt-3 text-[11px] text-gray-400 leading-relaxed">
          As taxas apresentadas são baseadas nos planos oficiais da TON para bandeiras Visa e Mastercard
          após o período promocional. Taxas de Elo, Hipercard e American Express podem variar. Consulte sempre
          o app TON para valores oficiais da sua conta.
        </p>
      </div>
    </div>
  );
}
