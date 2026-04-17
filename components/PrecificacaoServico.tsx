"use client";

import { useMemo, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

function parseNum(str: string): number {
  const val = parseFloat(str.replace(/\./g, "").replace(",", "."));
  return isNaN(val) ? 0 : val;
}

function fmt(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtPct(value: number): string {
  return `${value.toFixed(1).replace(".", ",")}%`;
}

interface CustomCost {
  id: string;
  name: string;
  rate: string;
}

const DEFAULT_CUSTOM_COSTS: CustomCost[] = [
  { id: "comissoes", name: "Comissões", rate: "4" },
  { id: "outros", name: "Outros Custos Variáveis", rate: "3" },
];

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-gray-400 text-sm font-medium pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full py-2 border border-amber-300 bg-amber-50 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition ${
            prefix ? "pl-10 pr-4" : suffix ? "pl-4 pr-8" : "px-4"
          }`}
        />
        {suffix && (
          <span className="absolute right-3 text-gray-400 text-sm font-medium pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function CalcField({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div
        className={`w-full px-4 py-2 rounded-lg text-sm font-semibold border ${
          highlight
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-gray-100 border-gray-200 text-gray-700"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function DreRow({
  label,
  value,
  pct,
  isHeader,
  isSubitem,
  rateInput,
  onRateChange,
  valueInput,
  onValueChange,
}: {
  label: string;
  value: number;
  pct: number;
  isHeader?: boolean;
  isSubitem?: boolean;
  rateInput?: string;
  onRateChange?: (v: string) => void;
  valueInput?: string;
  onValueChange?: (v: string) => void;
}) {
  const isNegative = value < 0;
  const valueColor = isNegative
    ? "text-red-600 font-bold"
    : isHeader
    ? "text-gray-900 font-bold"
    : "text-gray-800";
  const pctColor = isNegative
    ? "text-red-500 font-bold"
    : isHeader
    ? "text-gray-700 font-semibold"
    : "text-gray-600";

  return (
    <tr className={`border-b border-gray-100 ${isHeader ? "bg-gray-50" : "bg-white"}`}>
      <td className={`px-4 py-2.5 text-sm ${isHeader ? "font-bold text-gray-800" : isSubitem ? "pl-8 text-gray-600" : "text-gray-700 font-medium"}`}>
        {isSubitem && <span className="text-gray-300 mr-1">└</span>}
        {label}
      </td>
      <td className="px-4 py-2 text-right">
        {onValueChange ? (
          <div className="flex justify-end">
            <div className="relative w-40">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">R$</span>
              <input
                type="text"
                inputMode="decimal"
                value={valueInput ?? ""}
                onChange={(e) => onValueChange(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 border border-amber-300 bg-amber-50 rounded-md text-sm font-medium text-right focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>
        ) : (
          <span className={`text-sm ${valueColor}`}>{fmt(value)}</span>
        )}
      </td>
      <td className="px-4 py-2 text-right w-36">
        {onRateChange ? (
          <div className="flex justify-end">
            <div className="relative w-24">
              <input
                type="text"
                inputMode="decimal"
                value={rateInput ?? ""}
                onChange={(e) => onRateChange(e.target.value)}
                className="w-full pl-3 pr-7 py-1.5 border border-amber-300 bg-amber-50 rounded-md text-sm font-medium text-right focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">%</span>
            </div>
          </div>
        ) : (
          <span className={`text-sm ${pctColor}`}>{Number.isFinite(pct) ? fmtPct(pct) : "—"}</span>
        )}
      </td>
      {/* spacer for the action column */}
      <td className="w-10" />
    </tr>
  );
}

function CustomCostRow({
  cost,
  value,
  pct,
  onChange,
  onRemove,
}: {
  cost: CustomCost;
  value: number;
  pct: number;
  onChange: (id: string, field: "name" | "rate", val: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <tr className="border-b border-gray-100 bg-white group">
      <td className="pl-8 pr-2 py-2">
        <div className="flex items-center gap-1">
          <span className="text-gray-300 mr-1 text-sm">└</span>
          <input
            type="text"
            value={cost.name}
            onChange={(e) => onChange(cost.id, "name", e.target.value)}
            placeholder="Nome do custo"
            className="flex-1 px-2 py-1 text-sm border border-amber-300 bg-amber-50 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent min-w-0"
          />
        </div>
      </td>
      <td className="px-4 py-2 text-right">
        <span className="text-sm text-gray-800">{fmt(value)}</span>
      </td>
      <td className="px-4 py-2 text-right w-36">
        <div className="flex justify-end">
          <div className="relative w-24">
            <input
              type="text"
              inputMode="decimal"
              value={cost.rate}
              onChange={(e) => onChange(cost.id, "rate", e.target.value)}
              className="w-full pl-3 pr-7 py-1.5 border border-amber-300 bg-amber-50 rounded-md text-sm font-medium text-right focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">%</span>
          </div>
        </div>
      </td>
      <td className="pr-3 py-2 w-10 text-right">
        <button
          onClick={() => onRemove(cost.id)}
          title="Remover"
          className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </td>
    </tr>
  );
}

export default function PrecificacaoServico() {
  const [sFuncionarios, setFuncionarios] = useLocalStorage("prec_funcionarios", "5");
  const [sSalario, setSalario] = useLocalStorage("prec_salario", "800,00");
  const [sHorasPorFuncionario, setHorasPorFuncionario] = useLocalStorage("prec_horas_func", "40");
  const [sPrecoHora, setPrecoHora] = useLocalStorage("prec_preco_hora", "100,00");
  const [sHorasVendidas, setHorasVendidas] = useLocalStorage("prec_horas_vendidas", "40");

  const [sImposto, setImposto] = useLocalStorage("prec_imposto", "10");
  const [sCartao, setCartao] = useLocalStorage("prec_cartao", "5");
  const [customCosts, setCustomCosts] = useLocalStorage<CustomCost[]>(
    "prec_custom_costs",
    DEFAULT_CUSTOM_COSTS
  );

  const [sDespesasFixas, setDespesasFixas] = useLocalStorage("prec_desp_fixas", "40.000,00");

  const funcionarios = useMemo(() => parseNum(sFuncionarios), [sFuncionarios]);
  const salario = useMemo(() => parseNum(sSalario), [sSalario]);
  const horasPorFuncionario = useMemo(() => parseNum(sHorasPorFuncionario), [sHorasPorFuncionario]);
  const precoHora = useMemo(() => parseNum(sPrecoHora), [sPrecoHora]);
  const horasVendidas = useMemo(() => parseNum(sHorasVendidas), [sHorasVendidas]);
  const taxaImposto = useMemo(() => parseNum(sImposto), [sImposto]);
  const taxaCartao = useMemo(() => parseNum(sCartao), [sCartao]);
  const despesasFixas = useMemo(() => parseNum(sDespesasFixas), [sDespesasFixas]);

  const horasTotal = funcionarios * horasPorFuncionario;
  const custoHora = horasPorFuncionario > 0 ? salario / horasPorFuncionario : 0;
  const markup = custoHora > 0 ? precoHora / custoHora : 0;
  const capacidadeOciosa = horasTotal > 0 ? ((horasTotal - horasVendidas) / horasTotal) * 100 : 0;

  const valorVenda = precoHora * horasVendidas;
  const maoDeObra = salario * funcionarios;
  const impostoValor = valorVenda * (taxaImposto / 100);
  const cartaoValor = valorVenda * (taxaCartao / 100);

  const customCostValues = useMemo(
    () => customCosts.map((c) => ({ id: c.id, value: valorVenda * (parseNum(c.rate) / 100) })),
    [customCosts, valorVenda]
  );
  const customCostsTotal = useMemo(
    () => customCostValues.reduce((sum, c) => sum + c.value, 0),
    [customCostValues]
  );

  const custoVarTotal = maoDeObra + impostoValor + cartaoValor + customCostsTotal;
  const lucroBruto = valorVenda - custoVarTotal;
  const lucroLiquido = lucroBruto - despesasFixas;

  function pct(val: number) {
    return valorVenda > 0 ? (val / valorVenda) * 100 : 0;
  }

  const handleCustomCostChange = useCallback(
    (id: string, field: "name" | "rate", val: string) => {
      setCustomCosts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
      );
    },
    [setCustomCosts]
  );

  const handleRemoveCustomCost = useCallback(
    (id: string) => {
      setCustomCosts((prev) => prev.filter((c) => c.id !== id));
    },
    [setCustomCosts]
  );

  const handleAddCustomCost = useCallback(() => {
    setCustomCosts((prev) => [
      ...prev,
      { id: `custom_${Date.now()}`, name: "Novo Custo", rate: "0" },
    ]);
  }, [setCustomCosts]);

  const isValid = valorVenda > 0;

  return (
    <div className="space-y-6">
      {/* Estrutura operacional */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-5">Estrutura operacional</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField label="Qtde de funcionários operacionais" value={sFuncionarios} onChange={setFuncionarios} hint="número de colaboradores" />
          <InputField label="Salário médio dos funcionários" value={sSalario} onChange={setSalario} prefix="R$" hint="salário mensal por colaborador" />
          <InputField label="Horas trabalháveis / mês / funcionário" value={sHorasPorFuncionario} onChange={setHorasPorFuncionario} suffix="h" hint="horas disponíveis por colaborador" />
          <CalcField label="Horas trabalháveis total por mês" value={`${horasTotal.toLocaleString("pt-BR")} h`} />
          <CalcField label="Custo da hora" value={fmt(custoHora)} highlight={custoHora > 0} />
        </div>
      </div>

      {/* Precificação de horas */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-5">Precificação de horas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField label="Preço de venda da hora" value={sPrecoHora} onChange={setPrecoHora} prefix="R$" />
          <InputField label="Horas vendidas por mês" value={sHorasVendidas} onChange={setHorasVendidas} suffix="h" />
          <CalcField label="Mark-Up (multiplicador)" value={`${markup.toFixed(1).replace(".", ",")}x`} highlight={markup >= 3} />
          <CalcField label="Capacidade ociosa" value={fmtPct(capacidadeOciosa)} highlight={capacidadeOciosa < 30} />
        </div>
        {capacidadeOciosa > 50 && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-amber-700">
              <strong>Alta capacidade ociosa ({fmtPct(capacidadeOciosa)}).</strong> Sua equipe está vendendo menos de metade das horas disponíveis — considere aumentar as horas vendidas ou reduzir a equipe.
            </p>
          </div>
        )}
      </div>

      {/* DRE Table */}
      {isValid ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-800">DRE — Demonstração de Resultado</h2>
              <p className="text-xs text-gray-500 mt-0.5">Campos em amarelo são editáveis · passe o mouse sobre uma linha para remover</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Valor de venda mensal</p>
              <p className="text-lg font-bold text-gray-900">{fmt(valorVenda)}</p>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-white text-xs font-semibold uppercase tracking-wide">
                <th className="text-left px-4 py-3">DRE</th>
                <th className="text-right px-4 py-3">Valores</th>
                <th className="text-right px-4 py-3 w-36">% da Venda</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {/* Valor de Venda */}
              <tr className="border-b border-gray-100 bg-blue-50">
                <td className="px-4 py-3 text-sm font-bold text-blue-900">VALOR DE VENDA</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-blue-900">{fmt(valorVenda)}</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-blue-700">100,0%</td>
                <td className="w-10" />
              </tr>

              {/* Custo Var Total */}
              <DreRow label="CUSTO VAR. TOTAL" value={custoVarTotal} pct={pct(custoVarTotal)} isHeader />

              {/* Fixed variable costs */}
              <DreRow label="Mão de Obra Operacional" value={maoDeObra} pct={pct(maoDeObra)} isSubitem />
              <DreRow label="Imposto sobre venda" value={impostoValor} pct={pct(impostoValor)} isSubitem rateInput={sImposto} onRateChange={setImposto} />
              <DreRow label="Taxas de Cartão" value={cartaoValor} pct={pct(cartaoValor)} isSubitem rateInput={sCartao} onRateChange={setCartao} />

              {/* Dynamic custom cost rows */}
              {customCosts.map((cost) => {
                const cv = customCostValues.find((c) => c.id === cost.id);
                return (
                  <CustomCostRow
                    key={cost.id}
                    cost={cost}
                    value={cv?.value ?? 0}
                    pct={pct(cv?.value ?? 0)}
                    onChange={handleCustomCostChange}
                    onRemove={handleRemoveCustomCost}
                  />
                );
              })}

              {/* Add cost button row */}
              <tr className="border-b border-gray-100 bg-white">
                <td colSpan={4} className="pl-8 py-2">
                  <button
                    onClick={handleAddCustomCost}
                    className="flex items-center gap-1.5 text-xs text-green-700 hover:text-green-800 font-medium transition-colors group"
                  >
                    <span className="w-5 h-5 rounded-full bg-green-100 group-hover:bg-green-200 flex items-center justify-center transition-colors">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                    Adicionar linha de custo variável
                  </button>
                </td>
              </tr>

              {/* Lucro Bruto */}
              <tr className={`border-b border-gray-200 ${lucroBruto >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                <td className="px-4 py-3 text-sm font-bold text-gray-800">LUCRO BRUTO (MC)</td>
                <td className={`px-4 py-3 text-right text-sm font-bold ${lucroBruto >= 0 ? "text-green-700" : "text-red-600"}`}>{fmt(lucroBruto)}</td>
                <td className={`px-4 py-3 text-right text-sm font-bold ${lucroBruto >= 0 ? "text-green-600" : "text-red-500"}`}>{fmtPct(pct(lucroBruto))}</td>
                <td className="w-10" />
              </tr>

              {/* Despesas Fixas */}
              <DreRow label="DESPESAS FIXAS" value={despesasFixas} pct={pct(despesasFixas)} isHeader valueInput={sDespesasFixas} onValueChange={setDespesasFixas} />

              {/* Lucro Líquido */}
              <tr className={`${lucroLiquido >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">LUCRO LÍQUIDO (ML)</td>
                <td className={`px-4 py-3 text-right text-base font-bold ${lucroLiquido >= 0 ? "text-green-800" : "text-red-700"}`}>{fmt(lucroLiquido)}</td>
                <td className={`px-4 py-3 text-right text-sm font-bold ${lucroLiquido >= 0 ? "text-green-700" : "text-red-600"}`}>{fmtPct(pct(lucroLiquido))}</td>
                <td className="w-10" />
              </tr>
            </tbody>
          </table>

          {/* Summary */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <SummaryCard label="Valor de Venda" value={fmt(valorVenda)} color="blue" />
            <SummaryCard label="Custo Total (var + fixo)" value={fmt(custoVarTotal + despesasFixas)} color="gray" />
            <SummaryCard label="Lucro Bruto (MC)" value={fmt(lucroBruto)} color={lucroBruto >= 0 ? "green" : "red"} />
            <SummaryCard label="Lucro Líquido (ML)" value={fmt(lucroLiquido)} color={lucroLiquido >= 0 ? "green" : "red"} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">Preencha o preço da hora e as horas vendidas para ver o DRE</p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: "blue" | "green" | "red" | "gray" }) {
  const colors = {
    blue: "text-blue-800 bg-blue-50 border-blue-200",
    green: "text-green-800 bg-green-50 border-green-200",
    red: "text-red-800 bg-red-50 border-red-200",
    gray: "text-gray-700 bg-white border-gray-200",
  };
  return (
    <div className={`rounded-xl border p-3 ${colors[color]}`}>
      <p className="text-xs font-medium opacity-70 mb-0.5">{label}</p>
      <p className="text-base font-bold">{value}</p>
    </div>
  );
}
