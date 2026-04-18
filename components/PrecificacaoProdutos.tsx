"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VariableCost {
  id: string;
  name: string;
  type: "percent" | "fixed";
  value: string;
}

interface Discounts {
  venda: string;
  dupla: string;
  renovacao: string;
}

interface Product {
  id: string;
  name: string;
  cost: string;
  price: string;
  qty: string;
  variableCosts: VariableCost[];
  despesasFixas: string;
  discounts: Discounts;
}

type CategoryId = string;

interface Category {
  id: CategoryId;
  label: string;
  color: string;
  isCustom?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { id: "mentorias", label: "Mentorias", color: "blue" },
  { id: "presencial", label: "Presencial", color: "green" },
  { id: "online", label: "Online e Digitais", color: "purple" },
  { id: "fisicos", label: "Físicos", color: "orange" },
  { id: "supletivo", label: "Supletivo", color: "red" },
];

function vc(id: string, name: string, type: "percent" | "fixed", value: string): VariableCost {
  return { id, name, type, value };
}

const MENTORIA_COSTS = (): VariableCost[] => [
  vc("v1", "Fornecedores", "fixed", "0"),
  vc("v2", "Imposto sobre venda", "percent", "13"),
  vc("v3", "Taxas de Gateway %", "percent", "3"),
  vc("v4", "Comissões", "percent", "4"),
  vc("v5", "Acesso Plataforma", "fixed", "10.5"),
  vc("v6", "Taxa Gateway R$", "fixed", "4"),
  vc("v7", "CPA Médio Tráfego", "fixed", "100"),
];

const PRESENCIAL_COSTS = (acesso = "10.5"): VariableCost[] => [
  vc("v1", "Fornecedores", "fixed", "0"),
  vc("v2", "Imposto sobre venda", "percent", "13"),
  vc("v3", "Taxas de Gateway %", "percent", "3"),
  vc("v4", "Comissões", "percent", "2"),
  vc("v5", "Acesso Plataforma", "fixed", acesso),
  vc("v6", "Taxa Gateway R$", "fixed", "4"),
  vc("v7", "CPA Médio Tráfego", "fixed", "100"),
];

const ONLINE_COSTS = (comissoes = "2"): VariableCost[] => [
  vc("v1", "Fornecedores", "fixed", "0"),
  vc("v2", "Imposto sobre venda", "percent", "13"),
  vc("v3", "Taxas de Gateway %", "percent", "3"),
  vc("v4", "Comissões", "percent", comissoes),
  vc("v5", "Acesso Plataforma", "fixed", "0.56"),
  vc("v6", "Taxa Gateway R$", "fixed", "4"),
  vc("v7", "CPA Médio Tráfego", "fixed", "0"),
];

const FISICO_COSTS = (fornecedores: string): VariableCost[] => [
  vc("v1", "Fornecedores", "fixed", fornecedores),
  vc("v2", "Imposto sobre venda", "percent", "13"),
  vc("v3", "Taxas de Plataforma %", "percent", "0.9"),
  vc("v4", "Comissões", "percent", "2"),
  vc("v5", "Correios", "percent", "15"),
  vc("v6", "Taxa Plataforma R$", "fixed", "4"),
  vc("v7", "CPA Médio Tráfego", "fixed", "0"),
];

const SUPLETIVO_COSTS = (fornecedores: string): VariableCost[] => [
  vc("v1", "Fornecedores", "fixed", fornecedores),
  vc("v2", "Imposto sobre venda", "percent", "13"),
  vc("v3", "Taxas de Plataforma %", "percent", "3"),
  vc("v4", "Comissões", "percent", "2"),
  vc("v5", "Taxa Plataforma R$", "fixed", "4"),
  vc("v6", "CPA Médio Tráfego", "fixed", "0"),
];

const GENERIC_COSTS = (): VariableCost[] => [
  vc("v1", "Imposto sobre venda", "percent", "13"),
  vc("v2", "Taxas de Gateway %", "percent", "3"),
  vc("v3", "Comissões", "percent", "4"),
  vc("v4", "Taxa Gateway R$", "fixed", "4"),
  vc("v5", "CPA Médio Tráfego", "fixed", "0"),
];

const CATEGORY_TEMPLATES: Record<string, () => VariableCost[]> = {
  mentorias: MENTORIA_COSTS,
  presencial: () => PRESENCIAL_COSTS("10.5"),
  online: () => ONLINE_COSTS("2"),
  fisicos: () => FISICO_COSTS("0"),
  supletivo: () => SUPLETIVO_COSTS("0"),
};

const CUSTOM_COLORS = [
  { id: "teal", label: "Teal" },
  { id: "indigo", label: "Índigo" },
  { id: "pink", label: "Rosa" },
  { id: "yellow", label: "Amarelo" },
  { id: "cyan", label: "Ciano" },
  { id: "lime", label: "Lima" },
];

function p(
  id: string,
  name: string,
  cost: string,
  price: string,
  costs: VariableCost[],
  despesas: string,
  discounts: Discounts
): Product {
  return { id, name, cost, price, qty: "1", variableCosts: costs, despesasFixas: despesas, discounts };
}

const DEFAULT_DATA: Record<CategoryId, Product[]> = {
  mentorias: [
    p("m1", "Plano Combate - Supremo", "0", "1997", MENTORIA_COSTS(), "5250", { venda: "5", dupla: "10", renovacao: "20" }),
    p("m2", "Plano Combate - Tático", "0", "997", MENTORIA_COSTS(), "1750", { venda: "5", dupla: "10", renovacao: "20" }),
    p("m3", "Plano Combate - Operacional", "0", "597", MENTORIA_COSTS(), "0", { venda: "0", dupla: "10", renovacao: "20" }),
  ],
  presencial: [
    p("p1", "Black - Anual", "0", "3900", PRESENCIAL_COSTS("10.5"), "61000", { venda: "3", dupla: "5", renovacao: "10" }),
    p("p2", "Dourado - Anual", "0", "2700", PRESENCIAL_COSTS("0"), "61000", { venda: "3", dupla: "5", renovacao: "10" }),
    p("p3", "Prata - Anual", "0", "2300", PRESENCIAL_COSTS("0"), "61000", { venda: "0", dupla: "0", renovacao: "5" }),
    p("p4", "Black - Semestral", "0", "2900", PRESENCIAL_COSTS("10.5"), "30500", { venda: "3", dupla: "5", renovacao: "10" }),
    p("p5", "Dourado - Semestral", "0", "2000", PRESENCIAL_COSTS("0"), "30500", { venda: "3", dupla: "5", renovacao: "10" }),
    p("p6", "Prata - Semestral", "0", "1800", PRESENCIAL_COSTS("0"), "30500", { venda: "0", dupla: "0", renovacao: "5" }),
  ],
  online: [
    p("o1", "Cursos Federais", "0", "597", ONLINE_COSTS("2"), "0", { venda: "15", dupla: "10", renovacao: "20" }),
    p("o2", "Cursos Penais", "0", "497", ONLINE_COSTS("2"), "0", { venda: "15", dupla: "10", renovacao: "20" }),
    p("o3", "Cursos Civis", "0", "497", ONLINE_COSTS("2"), "0", { venda: "15", dupla: "10", renovacao: "20" }),
    p("o4", "Cursos Militares", "0", "437", ONLINE_COSTS("4"), "0", { venda: "15", dupla: "10", renovacao: "20" }),
    p("o5", "Cursos GCM", "0", "397", ONLINE_COSTS("2"), "0", { venda: "15", dupla: "10", renovacao: "20" }),
    p("o6", "Presencial em Casa", "0", "462", ONLINE_COSTS("2"), "0", { venda: "15", dupla: "10", renovacao: "25" }),
  ],
  fisicos: [
    p("f1", "Apostila Padrão", "50", "140", FISICO_COSTS("50"), "0", { venda: "0", dupla: "0", renovacao: "0" }),
    p("f2", "Caderno Padrão", "36", "77", FISICO_COSTS("36"), "0", { venda: "0", dupla: "0", renovacao: "0" }),
    p("f3", "Vade Mecum Padrão", "45", "110", FISICO_COSTS("45"), "0", { venda: "0", dupla: "0", renovacao: "0" }),
    p("f4", "Camisa de Algodão", "33", "60", FISICO_COSTS("33"), "0", { venda: "0", dupla: "0", renovacao: "0" }),
    p("f5", "Camisa UV", "45", "90", FISICO_COSTS("45"), "0", { venda: "0", dupla: "0", renovacao: "0" }),
    p("f6", "Camisa FIT", "35", "70", FISICO_COSTS("35"), "0", { venda: "0", dupla: "0", renovacao: "0" }),
  ],
  supletivo: [
    p("s1", "Supletivo Fund + Médio", "400", "1197", SUPLETIVO_COSTS("400"), "0", { venda: "15", dupla: "0", renovacao: "0" }),
    p("s2", "Supletivo Médio", "400", "897", SUPLETIVO_COSTS("400"), "0", { venda: "5", dupla: "0", renovacao: "0" }),
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseN(s: string): number {
  const v = parseFloat((s ?? "").replace(/\./g, "").replace(",", "."));
  return isNaN(v) ? 0 : v;
}

function fmt(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

function fmtPct(v: number): string {
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1).replace(".", ",")}%`;
}

function uid(): string {
  return `c_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
}

function calcDRE(product: Product) {
  const price = parseN(product.price);
  const qty = parseN(product.qty) || 1;
  const valorVenda = price * qty;
  const despesasFixas = parseN(product.despesasFixas);

  let custoVarTotal = 0;
  const costDetails = product.variableCosts.map((c) => {
    const val = parseN(c.value);
    const amount = c.type === "percent" ? valorVenda * (val / 100) : val;
    custoVarTotal += amount;
    return { ...c, amount };
  });

  const lucroBruto = valorVenda - custoVarTotal;
  const lucroLiquido = lucroBruto - despesasFixas;
  const pct = (v: number) => (valorVenda > 0 ? (v / valorVenda) * 100 : 0);
  const cost = parseN(product.cost);
  const markup = cost > 0 ? price / cost : null;

  const discounts = {
    venda: { pct: parseN(product.discounts.venda), amt: valorVenda * (parseN(product.discounts.venda) / 100) },
    dupla: { pct: parseN(product.discounts.dupla), amt: valorVenda * (parseN(product.discounts.dupla) / 100) },
    renovacao: { pct: parseN(product.discounts.renovacao), amt: valorVenda * (parseN(product.discounts.renovacao) / 100) },
  };

  return { valorVenda, custoVarTotal, costDetails, lucroBruto, lucroLiquido, pct, markup, despesasFixas, discounts };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SmallInput({
  value,
  onChange,
  prefix,
  suffix,
  className = "",
  placeholder = "0",
}: {
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  className?: string;
  placeholder?: string;
}) {
  return (
    <div className="relative inline-flex items-center">
      {prefix && <span className="absolute left-2 text-gray-400 text-xs pointer-events-none">{prefix}</span>}
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border border-amber-300 bg-amber-50 rounded text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-transparent ${prefix ? "pl-6 pr-2" : suffix ? "pl-2 pr-6" : "px-2"} py-1 ${className}`}
      />
      {suffix && <span className="absolute right-2 text-gray-400 text-xs pointer-events-none">{suffix}</span>}
    </div>
  );
}

function ProductCard({
  product,
  onUpdate,
  onDelete,
  defaultExpanded,
}: {
  product: Product;
  onUpdate: (p: Product) => void;
  onDelete: () => void;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const dre = useMemo(() => calcDRE(product), [product]);

  const set = useCallback(
    (field: keyof Product, value: string) => onUpdate({ ...product, [field]: value }),
    [product, onUpdate]
  );

  const setDiscount = useCallback(
    (field: keyof Discounts, value: string) =>
      onUpdate({ ...product, discounts: { ...product.discounts, [field]: value } }),
    [product, onUpdate]
  );

  const updateCost = useCallback(
    (id: string, field: keyof VariableCost, value: string) =>
      onUpdate({
        ...product,
        variableCosts: product.variableCosts.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
      }),
    [product, onUpdate]
  );

  const toggleCostType = useCallback(
    (id: string) =>
      onUpdate({
        ...product,
        variableCosts: product.variableCosts.map((c) =>
          c.id === id ? { ...c, type: c.type === "percent" ? "fixed" : "percent" } : c
        ),
      }),
    [product, onUpdate]
  );

  const removeCost = useCallback(
    (id: string) =>
      onUpdate({ ...product, variableCosts: product.variableCosts.filter((c) => c.id !== id) }),
    [product, onUpdate]
  );

  const addCost = useCallback(() => {
    onUpdate({
      ...product,
      variableCosts: [...product.variableCosts, { id: uid(), name: "Novo custo", type: "percent", value: "0" }],
    });
  }, [product, onUpdate]);

  const mcPct = dre.pct(dre.lucroBruto);
  const mlPct = dre.pct(dre.lucroLiquido);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-semibold text-gray-800 text-sm flex-1 min-w-0 truncate">{product.name}</span>
        <div className="flex items-center gap-3 text-xs shrink-0">
          <span className="text-gray-500">{fmt(parseN(product.price))}</span>
          <span className={`font-semibold px-1.5 py-0.5 rounded ${mcPct >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            MC {fmtPct(mcPct)}
          </span>
          <span className={`font-semibold px-1.5 py-0.5 rounded ${mlPct >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            ML {fmtPct(mlPct)}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); if (confirm(`Excluir "${product.name}"?`)) onDelete(); }}
            className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
            title="Excluir produto"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-4 pt-4 pb-5 space-y-5">
          {/* Product header fields */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nome do produto</label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full px-2 py-1.5 border border-amber-300 bg-amber-50 rounded text-sm font-medium focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Preço de Custo</label>
              <SmallInput value={product.cost} onChange={(v) => set("cost", v)} prefix="R$" className="w-full" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Preço de Venda</label>
              <SmallInput value={product.price} onChange={(v) => set("price", v)} prefix="R$" className="w-full" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Qtde/mês</label>
              <SmallInput value={product.qty} onChange={(v) => set("qty", v)} className="w-full" />
            </div>
          </div>

          {/* Mark-Up display */}
          <div className="flex gap-4 text-xs text-gray-500">
            <span>Mark-Up: <strong className="text-gray-700">{dre.markup !== null ? `${dre.markup.toFixed(1).replace(".", ",")}x` : "—"}</strong></span>
            <span>Valor de Venda/mês: <strong className="text-gray-700">{fmt(dre.valorVenda)}</strong></span>
          </div>

          {/* DRE Table */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="text-left px-3 py-2 font-semibold">DRE</th>
                  <th className="text-right px-3 py-2 font-semibold">Valores</th>
                  <th className="text-right px-3 py-2 font-semibold w-24">% da Venda</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {/* Valor de Venda */}
                <tr className="bg-blue-50 border-b border-gray-100">
                  <td className="px-3 py-2 font-bold text-blue-900">VALOR DE VENDA</td>
                  <td className="px-3 py-2 text-right font-bold text-blue-900">{fmt(dre.valorVenda)}</td>
                  <td className="px-3 py-2 text-right font-bold text-blue-700">100,0%</td>
                  <td />
                </tr>

                {/* Custo Var Total */}
                <tr className="bg-gray-50 border-b border-gray-100">
                  <td className="px-3 py-2 font-bold text-gray-800">CUSTO VAR. TOTAL</td>
                  <td className="px-3 py-2 text-right font-bold text-gray-800">{fmt(dre.custoVarTotal)}</td>
                  <td className="px-3 py-2 text-right text-gray-600 font-semibold">{fmtPct(dre.pct(dre.custoVarTotal)).replace("+", "")}</td>
                  <td />
                </tr>

                {/* Variable costs */}
                {dre.costDetails.map((c) => (
                  <tr key={c.id} className="border-b border-gray-50 group hover:bg-amber-50/30">
                    <td className="pl-6 pr-2 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-300">└</span>
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => updateCost(c.id, "name", e.target.value)}
                          className="flex-1 text-xs text-gray-600 bg-transparent border-b border-transparent focus:border-amber-400 focus:outline-none min-w-0"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      {c.type === "fixed" ? (
                        <SmallInput value={c.value} onChange={(v) => updateCost(c.id, "value", v)} prefix="R$" className="w-24 text-right" />
                      ) : (
                        <span className="text-gray-700">{fmt(c.amount)}</span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-right">
                      {c.type === "percent" ? (
                        <SmallInput value={c.value} onChange={(v) => updateCost(c.id, "value", v)} suffix="%" className="w-16 text-right" />
                      ) : (
                        <span className="text-gray-500">{dre.pct(c.amount).toFixed(1).replace(".", ",")}%</span>
                      )}
                    </td>
                    <td className="pr-1 py-1.5">
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleCostType(c.id)}
                          title={c.type === "percent" ? "Mudar para R$ fixo" : "Mudar para %"}
                          className="px-1 py-0.5 rounded text-xs text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          {c.type === "percent" ? "%" : "R$"}
                        </button>
                        <button
                          onClick={() => removeCost(c.id)}
                          className="p-0.5 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Add cost row */}
                <tr className="border-b border-gray-100">
                  <td colSpan={4} className="pl-6 py-1.5">
                    <button
                      onClick={addCost}
                      className="flex items-center gap-1 text-xs text-green-700 hover:text-green-800 font-medium transition-colors"
                    >
                      <span className="w-4 h-4 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                      Adicionar custo variável
                    </button>
                  </td>
                </tr>

                {/* Lucro Bruto */}
                <tr className={`border-b border-gray-100 ${dre.lucroBruto >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                  <td className="px-3 py-2 font-bold text-gray-800">LUCRO BRUTO (MC)</td>
                  <td className={`px-3 py-2 text-right font-bold ${dre.lucroBruto >= 0 ? "text-green-700" : "text-red-600"}`}>{fmt(dre.lucroBruto)}</td>
                  <td className={`px-3 py-2 text-right font-bold ${dre.lucroBruto >= 0 ? "text-green-600" : "text-red-500"}`}>{fmtPct(mcPct)}</td>
                  <td />
                </tr>

                {/* Despesas Fixas */}
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-3 py-2 font-bold text-gray-800">DESPESAS FIXAS</td>
                  <td className="px-3 py-2 text-right">
                    <SmallInput value={product.despesasFixas} onChange={(v) => set("despesasFixas", v)} prefix="R$" className="w-32 text-right" />
                  </td>
                  <td className="px-3 py-2 text-right text-gray-500">{dre.pct(dre.despesasFixas).toFixed(1).replace(".", ",")}%</td>
                  <td />
                </tr>

                {/* Lucro Líquido */}
                <tr className={dre.lucroLiquido >= 0 ? "bg-green-100" : "bg-red-100"}>
                  <td className="px-3 py-2 font-bold text-gray-900">LUCRO LÍQUIDO (ML)</td>
                  <td className={`px-3 py-2 text-right font-bold text-sm ${dre.lucroLiquido >= 0 ? "text-green-800" : "text-red-700"}`}>{fmt(dre.lucroLiquido)}</td>
                  <td className={`px-3 py-2 text-right font-bold ${dre.lucroLiquido >= 0 ? "text-green-700" : "text-red-600"}`}>{fmtPct(mlPct)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Discounts */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="text-left px-3 py-2 font-semibold">Desconto</th>
                  <th className="text-right px-3 py-2 font-semibold">Valor máximo</th>
                  <th className="text-right px-3 py-2 font-semibold w-24">%</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    { key: "venda", label: "Desconto Máx P/Venda" },
                    { key: "dupla", label: "Desconto Máx P/Dupla" },
                    { key: "renovacao", label: "Desconto Máx P/Renovação" },
                  ] as { key: keyof Discounts; label: string }[]
                ).map(({ key, label }) => (
                  <tr key={key} className="border-b border-gray-50 last:border-0">
                    <td className="px-3 py-1.5 font-medium text-gray-700">{label}</td>
                    <td className="px-3 py-1.5 text-right text-gray-700">{fmt(dre.discounts[key].amt)}</td>
                    <td className="px-3 py-1.5 text-right">
                      <SmallInput
                        value={product.discounts[key]}
                        onChange={(v) => setDiscount(key, v)}
                        suffix="%"
                        className="w-16 text-right"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const TAB_COLORS: Record<string, string> = {
  blue: "border-blue-500 text-blue-700 bg-blue-50",
  green: "border-green-500 text-green-700 bg-green-50",
  purple: "border-purple-500 text-purple-700 bg-purple-50",
  orange: "border-orange-500 text-orange-700 bg-orange-50",
  red: "border-red-500 text-red-700 bg-red-50",
  teal: "border-teal-500 text-teal-700 bg-teal-50",
  indigo: "border-indigo-500 text-indigo-700 bg-indigo-50",
  pink: "border-pink-500 text-pink-700 bg-pink-50",
  yellow: "border-yellow-500 text-yellow-700 bg-yellow-50",
  cyan: "border-cyan-500 text-cyan-700 bg-cyan-50",
  lime: "border-lime-500 text-lime-700 bg-lime-50",
};

const DOT_COLORS: Record<string, string> = {
  teal: "bg-teal-500",
  indigo: "bg-indigo-500",
  pink: "bg-pink-500",
  yellow: "bg-yellow-400",
  cyan: "bg-cyan-500",
  lime: "bg-lime-500",
};

export default function PrecificacaoProdutos() {
  const [data, setData] = useLocalStorage<Record<string, Product[]>>("prod_data", DEFAULT_DATA);
  const [customCategories, setCustomCategories] = useLocalStorage<Category[]>("prod_custom_categories", []);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("mentorias");
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("teal");
  const newCatInputRef = useRef<HTMLInputElement>(null);

  const allCategories = useMemo(
    () => [...CATEGORIES, ...customCategories],
    [customCategories]
  );

  useEffect(() => {
    if (addingCategory) newCatInputRef.current?.focus();
  }, [addingCategory]);

  const confirmAddCategory = useCallback(() => {
    const name = newCatName.trim();
    if (!name) return;
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      label: name,
      color: newCatColor,
      isCustom: true,
    };
    setCustomCategories((prev) => [...prev, newCat]);
    setData((prev) => ({ ...prev, [newCat.id]: [] }));
    setActiveCategory(newCat.id);
    setAddingCategory(false);
    setNewCatName("");
    setNewCatColor("teal");
  }, [newCatName, newCatColor, setCustomCategories, setData]);

  const deleteCategory = useCallback(
    (catId: string) => {
      if (!confirm("Excluir esta categoria e todos os seus produtos?")) return;
      setCustomCategories((prev) => prev.filter((c) => c.id !== catId));
      setData((prev) => {
        const next = { ...prev };
        delete next[catId];
        return next;
      });
      setActiveCategory("mentorias");
    },
    [setCustomCategories, setData]
  );

  const products = data[activeCategory] ?? [];

  const updateProduct = useCallback(
    (id: string, updated: Product) =>
      setData((prev) => ({
        ...prev,
        [activeCategory]: (prev[activeCategory] ?? []).map((p) => (p.id === id ? updated : p)),
      })),
    [activeCategory, setData]
  );

  const deleteProduct = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        [activeCategory]: (prev[activeCategory] ?? []).filter((p) => p.id !== id),
      })),
    [activeCategory, setData]
  );

  const addProduct = useCallback(() => {
    const template = CATEGORY_TEMPLATES[activeCategory] ?? GENERIC_COSTS;
    const newProduct: Product = {
      id: uid(),
      name: "Novo Produto",
      cost: "0",
      price: "0",
      qty: "1",
      variableCosts: template(),
      despesasFixas: "0",
      discounts: { venda: "0", dupla: "0", renovacao: "0" },
    };
    setData((prev) => ({
      ...prev,
      [activeCategory]: [...(prev[activeCategory] ?? []), newProduct],
    }));
  }, [activeCategory, setData]);

  const catConfig = allCategories.find((c) => c.id === activeCategory) ?? CATEGORIES[0];

  return (
    <div className="space-y-5">
      {/* Category tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-1 flex gap-1 overflow-x-auto items-center">
        {allCategories.map((cat) => (
          <div key={cat.id} className="relative group/tab flex-1 min-w-max">
            <button
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? `${TAB_COLORS[cat.color] ?? TAB_COLORS.teal} border`
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {cat.label}
            </button>
            {cat.isCustom && (
              <button
                onClick={() => deleteCategory(cat.id)}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs items-center justify-center hidden group-hover/tab:flex z-10 leading-none"
                title="Excluir categoria"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {/* Add category */}
        {addingCategory ? (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-xl border border-gray-200 min-w-max">
            <input
              ref={newCatInputRef}
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") confirmAddCategory(); if (e.key === "Escape") setAddingCategory(false); }}
              placeholder="Nome da categoria"
              className="text-sm border-0 bg-transparent focus:outline-none w-36 placeholder:text-gray-400"
            />
            <div className="flex gap-1">
              {CUSTOM_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setNewCatColor(c.id)}
                  title={c.label}
                  className={`w-3.5 h-3.5 rounded-full ${DOT_COLORS[c.id]} ring-offset-1 transition-all ${newCatColor === c.id ? "ring-2 ring-gray-500" : "hover:scale-125"}`}
                />
              ))}
            </div>
            <button onClick={confirmAddCategory} className="text-green-600 hover:text-green-700 font-bold text-sm px-1">✓</button>
            <button onClick={() => setAddingCategory(false)} className="text-gray-400 hover:text-gray-600 text-sm px-0.5">✕</button>
          </div>
        ) : (
          <button
            onClick={() => setAddingCategory(true)}
            className="flex-shrink-0 w-8 h-8 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center text-lg leading-none"
            title="Nova categoria"
          >
            +
          </button>
        )}
      </div>

      {/* Products list */}
      <div className="space-y-3">
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            onUpdate={(updated) => updateProduct(product.id, updated)}
            onDelete={() => deleteProduct(product.id)}
            defaultExpanded={i === 0}
          />
        ))}

        {/* Add product button */}
        <button
          onClick={addProduct}
          className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:text-green-700 hover:border-green-300 hover:bg-green-50 font-medium transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo produto em {catConfig.label}
        </button>
      </div>

      {/* Info footer */}
      <p className="text-xs text-gray-400 text-center">
        Campos em amarelo são editáveis · passe o mouse sobre um custo para remover ou trocar o tipo (R$ / %)
      </p>
    </div>
  );
}
