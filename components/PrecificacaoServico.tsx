"use client";

import { useMemo } from "react";
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

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
}

function InputField({ label, value, onChange, prefix, suffix, hint }: InputFieldProps) {
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

interface CalcFieldProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function CalcField({ label, value, highlight }: CalcFieldProps) {
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

interface DreRowProps {
  label: string;
  value: number;
  pct: number;
  isHeader?: boolean;
  isSubitem?: boolean;
  isNegativeGood?: boolean;
  rateInput?: string;
  onRateChange?: (v: string) => void;
  valueInput?: string;
  onValueChange?: (v: string) => void;
  hideIfZero?: boolean;
}

function DreRow({
  label,
  value,
  pct,
  isHeader,
  isSubitem,
  isNegativeGood,
  rateInput,
  onRateChange,
  valueInput,
  onValueChange,
}: DreRowProps) {
  const isNegative = value < 0;
  const valueColor = isNegative
    ? isNegativeGood
      ? "text-green-700"
      : "text-red-600 font-bold"
    : isHeader
    ? "text-gray-900 font-bold"
    : "text-gray-800";
  const pctColor = isNegative
    ? isNegativeGood
      ? "text-green-600"
      : "text-red-500 font-bold"
    : isHeader
    ? "text-gray-700 font-semibold"
    : "text-gray-600";

  return (
    <tr
      className={`border-b border-gray-100 ${
        isHeader ? "bg-gray-50" : isSubitem ? "bg-white" : ""
      }`}
    >
      <td
        className={`px-4 py-2.5 text-sm ${
          isHeader ? "font-bold text-gray-800" : isSubitem ? "pl-8 text-gray-600" : "text-gray-700 font-medium"
        }`}
      >
        {isSubitem && (
          <span className="text-gray-300 mr-1">└</span>
        )}
        {label}
      </td>

      {/* Value column */}
      <td className="px-4 py-2 text-right">
        {onValueChange ? (
          <div className="flex justify-end">
            <div className="relative w-40">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                R$
              </span>
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
          <span className={`text-sm ${valueColor}`}>
            {fmt(value)}
          </span>
        )}
      </td>

      {/* % column */}
      <td className="px-4 py-2 text-right w-32">
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
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
                %
              </span>
            </div>
          </div>
        ) : (
          <span className={`text-sm ${pctColor}`}>
            {Number.isFinite(pct) ? fmtPct(pct) : "—"}
          </span>
        )}
      </td>
    </tr>
  );
}

export default function PrecificacaoServico() {
  // ── Editable inputs ──────────────────────────────────────────────
  const [sFuncionarios, setFuncionarios] = useLocalStorage("prec_funcionarios", "5");
  const [sSalario, setSalario] = useLocalStorage("prec_salario", "800,00");
  const [sHorasPorFuncionario, setHorasPorFuncionario] = useLocalStorage("prec_horas_func", "40");
  const [sPrecoHora, setPrecoHora] = useLocalStorage("prec_preco_hora", "100,00");
  const [sHorasVendidas, setHorasVendidas] = useLocalStorage("prec_horas_vendidas", "40");

  // Variable cost rates (%)
  const [sImposto, setImposto] = useLocalStorage("prec_imposto", "10");
  const [sCartao, setCartao] = useLocalStorage("prec_cartao", "5");
  const [sComissoes, setComissoes] = useLocalStorage("prec_comissoes", "4");
  const [sOutrosCustos, setOutrosCustos] = useLocalStorage("prec_outros", "3");

  // Fixed costs
  const [sDespesasFixas, setDespesasFixas] = useLocalStorage("prec_desp_fixas", "40.000,00");

  // ── Parsed numeric values ────────────────────────────────────────
  const funcionarios = useMemo(() => parseNum(sFuncionarios), [sFuncionarios]);
  const salario = useMemo(() => parseNum(sSalario), [sSalario]);
  const horasPorFuncionario = useMemo(() => parseNum(sHorasPorFuncionario), [sHorasPorFuncionario]);
  const precoHora = useMemo(() => parseNum(sPrecoHora), [sPrecoHora]);
  const horasVendidas = useMemo(() => parseNum(sHorasVendidas), [sHorasVendidas]);
  const taxaImposto = useMemo(() => parseNum(sImposto), [sImposto]);
  const taxaCartao = useMemo(() => parseNum(sCartao), [sCartao]);
  const taxaComissoes = useMemo(() => parseNum(sComissoes), [sComissoes]);
  const taxaOutros = useMemo(() => parseNum(sOutrosCustos), [sOutrosCustos]);
  const despesasFixas = useMemo(() => parseNum(sDespesasFixas), [sDespesasFixas]);

  // ── Calculated fields ────────────────────────────────────────────
  const horasTotal = funcionarios * horasPorFuncionario;
  const custoHora = horasPorFuncionario > 0 ? salario / horasPorFuncionario : 0;
  const markup = custoHora > 0 ? precoHora / custoHora : 0;
  const capacidadeOciosa = horasTotal > 0 ? ((horasTotal - horasVendidas) / horasTotal) * 100 : 0;

  // ── DRE ─────────────────────────────────────────────────────────
  const valorVenda = precoHora * horasVendidas;
  const maoDeObra = salario * funcionarios;
  const impostoValor = valorVenda * (taxaImposto / 100);
  const cartaoValor = valorVenda * (taxaCartao / 100);
  const comissoesValor = valorVenda * (taxaComissoes / 100);
  const outrosValor = valorVenda * (taxaOutros / 100);
  const custoVarTotal = maoDeObra + impostoValor + cartaoValor + comissoesValor + outrosValor;
  const lucroBruto = valorVenda - custoVarTotal;
  const lucroLiquido = lucroBruto - despesasFixas;

  function pct(val: number) {
    return valorVenda > 0 ? (val / valorVenda) * 100 : 0;
  }

  const isValid = valorVenda > 0;

  return (
    <div className="space-y-6">
      {/* ── Input section ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-5">
          Estrutura operacional
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            label="Qtde de funcionários operacionais"
            value={sFuncionarios}
            onChange={setFuncionarios}
            hint="número de colaboradores"
          />
          <InputField
            label="Salário médio dos funcionários"
            value={sSalario}
            onChange={setSalario}
            prefix="R$"
            hint="salário mensal por colaborador"
          />
          <InputField
            label="Horas trabalháveis / mês / funcionário"
            value={sHorasPorFuncionario}
            onChange={setHorasPorFuncionario}
            suffix="h"
            hint="horas disponíveis por colaborador"
          />
          <CalcField
            label="Horas trabalháveis total por mês"
            value={`${horasTotal.toLocaleString("pt-BR")} h`}
          />
          <CalcField
            label="Custo da hora"
            value={fmt(custoHora)}
            highlight={custoHora > 0}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-5">
          Precificação de horas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InputField
            label="Preço de venda da hora"
            value={sPrecoHora}
            onChange={setPrecoHora}
            prefix="R$"
          />
          <InputField
            label="Horas vendidas por mês"
            value={sHorasVendidas}
            onChange={setHorasVendidas}
            suffix="h"
          />
          <CalcField
            label="Mark-Up (multiplicador)"
            value={`${markup.toFixed(1).replace(".", ",")}x`}
            highlight={markup >= 3}
          />
          <CalcField
            label="Capacidade ociosa"
            value={fmtPct(capacidadeOciosa)}
            highlight={capacidadeOciosa < 30}
          />
        </div>
        {capacidadeOciosa > 50 && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <p className="text-xs text-amber-700">
              <strong>Alta capacidade ociosa ({fmtPct(capacidadeOciosa)}).</strong> Sua equipe está vendendo menos de metade das horas disponíveis — considere aumentar as horas vendidas ou reduzir a equipe.
            </p>
          </div>
        )}
      </div>

      {/* ── DRE Table ── */}
      {isValid ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-800">
                DRE — Demonstração de Resultado
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Campos em amarelo são editáveis
              </p>
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
                <th className="text-right px-4 py-3 w-32">% da Venda</th>
              </tr>
            </thead>
            <tbody>
              {/* Valor de Venda */}
              <tr className="border-b border-gray-100 bg-blue-50">
                <td className="px-4 py-3 text-sm font-bold text-blue-900">
                  VALOR DE VENDA
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-blue-900">
                  {fmt(valorVenda)}
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-blue-700">
                  100,0%
                </td>
              </tr>

              {/* Custo Var Total */}
              <DreRow
                label="CUSTO VAR. TOTAL"
                value={custoVarTotal}
                pct={pct(custoVarTotal)}
                isHeader
              />

              {/* Sub-items */}
              <DreRow
                label="Mão de Obra Operacional"
                value={maoDeObra}
                pct={pct(maoDeObra)}
                isSubitem
              />
              <DreRow
                label="Imposto sobre venda"
                value={impostoValor}
                pct={pct(impostoValor)}
                isSubitem
                rateInput={sImposto}
                onRateChange={setImposto}
              />
              <DreRow
                label="Taxas de Cartão"
                value={cartaoValor}
                pct={pct(cartaoValor)}
                isSubitem
                rateInput={sCartao}
                onRateChange={setCartao}
              />
              <DreRow
                label="Comissões"
                value={comissoesValor}
                pct={pct(comissoesValor)}
                isSubitem
                rateInput={sComissoes}
                onRateChange={setComissoes}
              />
              <DreRow
                label="Outros Custos Variáveis"
                value={outrosValor}
                pct={pct(outrosValor)}
                isSubitem
                rateInput={sOutrosCustos}
                onRateChange={setOutrosCustos}
              />

              {/* Lucro Bruto */}
              <tr className={`border-b border-gray-200 ${lucroBruto >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                <td className="px-4 py-3 text-sm font-bold text-gray-800">
                  LUCRO BRUTO (MC)
                </td>
                <td className={`px-4 py-3 text-right text-sm font-bold ${lucroBruto >= 0 ? "text-green-700" : "text-red-600"}`}>
                  {fmt(lucroBruto)}
                </td>
                <td className={`px-4 py-3 text-right text-sm font-bold ${lucroBruto >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {fmtPct(pct(lucroBruto))}
                </td>
              </tr>

              {/* Despesas Fixas */}
              <DreRow
                label="DESPESAS FIXAS"
                value={despesasFixas}
                pct={pct(despesasFixas)}
                isHeader
                valueInput={sDespesasFixas}
                onValueChange={setDespesasFixas}
              />

              {/* Lucro Líquido */}
              <tr className={`${lucroLiquido >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">
                  LUCRO LÍQUIDO (ML)
                </td>
                <td className={`px-4 py-3 text-right text-base font-bold ${lucroLiquido >= 0 ? "text-green-800" : "text-red-700"}`}>
                  {fmt(lucroLiquido)}
                </td>
                <td className={`px-4 py-3 text-right text-sm font-bold ${lucroLiquido >= 0 ? "text-green-700" : "text-red-600"}`}>
                  {fmtPct(pct(lucroLiquido))}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Summary bar */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <SummaryCard
              label="Valor de Venda"
              value={fmt(valorVenda)}
              color="blue"
            />
            <SummaryCard
              label="Custo Total (var + fixo)"
              value={fmt(custoVarTotal + despesasFixas)}
              color="gray"
            />
            <SummaryCard
              label="Lucro Bruto (MC)"
              value={fmt(lucroBruto)}
              color={lucroBruto >= 0 ? "green" : "red"}
            />
            <SummaryCard
              label="Lucro Líquido (ML)"
              value={fmt(lucroLiquido)}
              color={lucroLiquido >= 0 ? "green" : "red"}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm">
            Preencha o preço da hora e as horas vendidas para ver o DRE
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "blue" | "green" | "red" | "gray";
}) {
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
