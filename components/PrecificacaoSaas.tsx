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

function fmtNum(value: number, decimals = 1): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function InputRow({
  label,
  value,
  onChange,
  prefix,
  suffix,
  description,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0 gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="relative flex items-center shrink-0">
        {prefix && (
          <span className="absolute left-3 text-gray-400 text-sm font-medium pointer-events-none">{prefix}</span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-32 py-2 border border-amber-300 bg-amber-50 rounded-lg text-sm font-semibold text-right focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition ${
            prefix ? "pl-10 pr-3" : suffix ? "pl-3 pr-8" : "px-3"
          }`}
        />
        {suffix && (
          <span className="absolute right-3 text-gray-400 text-sm font-medium pointer-events-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function ResultRow({
  label,
  value,
  isHighlight,
  isBold,
  description,
}: {
  label: string;
  value: string;
  isHighlight?: boolean;
  isBold?: boolean;
  description?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0 gap-4 ${
        isHighlight ? "bg-green-50 -mx-6 px-6 rounded-xl" : ""
      }`}
    >
      <div className="flex-1">
        <p className={`text-sm ${isBold ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <p className={`text-sm shrink-0 ${isBold ? "font-bold text-green-700 text-base" : "font-semibold text-gray-800"}`}>
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub?: string;
  color: "green" | "blue" | "purple" | "orange";
}) {
  const styles = {
    green: "bg-green-50 border-green-200 text-green-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
  };
  return (
    <div className={`rounded-xl border p-4 ${styles[color]}`}>
      <p className="text-xs font-medium opacity-60 mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  );
}

export default function PrecificacaoSaas() {
  // ── Inputs ──────────────────────────────────────────────────────
  const [sChurn, setChurn] = useLocalStorage("saas_churn", "5,0");
  const [sCac, setCac] = useLocalStorage("saas_cac", "200");
  const [sMargem, setMargem] = useLocalStorage("saas_margem", "60");
  const [sLtvCac, setLtvCac] = useLocalStorage("saas_ltv_cac", "6,0");

  // ── Parsed values ────────────────────────────────────────────────
  const churnPct = useMemo(() => parseNum(sChurn), [sChurn]);
  const cac = useMemo(() => parseNum(sCac), [sCac]);
  const margemPct = useMemo(() => parseNum(sMargem), [sMargem]);
  const ltvCacAlvo = useMemo(() => parseNum(sLtvCac), [sLtvCac]);

  const churn = churnPct / 100;
  const margem = margemPct / 100;

  // ── Core formula ────────────────────────────────────────────────
  // LTV_alvo = CAC × (LTV/CAC_alvo)
  // LTV = (Preço × Margem) / Churn  →  Preço = (LTV × Churn) / Margem
  const ltvAlvo = cac * ltvCacAlvo;
  const precoMensalAlvo = margem > 0 && churn > 0 ? (ltvAlvo * churn) / margem : 0;

  // ── Derived metrics ──────────────────────────────────────────────
  const retencaoMedia = churn > 0 ? 1 / churn : 0; // months
  const paybackMeses = precoMensalAlvo > 0 && margem > 0 ? cac / (precoMensalAlvo * margem) : 0;
  const mrrNecessario = precoMensalAlvo; // per client
  const ltvReal = margem > 0 && churn > 0 ? (precoMensalAlvo * margem) / churn : 0;
  const ltvCacReal = cac > 0 ? ltvReal / cac : 0;

  const isValid = cac > 0 && churnPct > 0 && margemPct > 0 && ltvCacAlvo > 0;

  return (
    <div className="space-y-6">
      {/* Explanation card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
        <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-blue-800 mb-1">Como funciona o cálculo</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Defina o <strong>Churn</strong>, o <strong>CAC</strong>, a <strong>Margem de Contribuição</strong> e o <strong>LTV/CAC alvo</strong>.
            A fórmula calcula o <strong>Preço Mensal Alvo</strong> necessário para atingir a relação LTV/CAC desejada:{" "}
            <span className="font-mono bg-blue-100 px-1 rounded">Preço = (CAC × LTV/CAC × Churn) / Margem</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">Parâmetros do negócio</h2>
          <p className="text-xs text-gray-400 mb-4">Campos em amarelo são editáveis</p>

          <InputRow
            label="Churn Mensal"
            value={sChurn}
            onChange={setChurn}
            suffix="%"
            description="percentual de clientes perdidos por mês"
          />
          <InputRow
            label="CAC"
            value={sCac}
            onChange={setCac}
            prefix="R$"
            description="custo de aquisição de cliente"
          />
          <InputRow
            label="Margem de Contribuição Estimada"
            value={sMargem}
            onChange={setMargem}
            suffix="%"
            description="receita menos custos variáveis"
          />
          <InputRow
            label="LTV/CAC alvo"
            value={sLtvCac}
            onChange={setLtvCac}
            description="relação desejada entre LTV e CAC (recomendado ≥ 3)"
          />
        </div>

        {/* Results */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Resultados calculados</h2>

          {isValid ? (
            <>
              <ResultRow
                label="LTV Alvo"
                value={fmt(ltvAlvo)}
                description={`CAC × LTV/CAC = ${fmt(cac)} × ${fmtNum(ltvCacAlvo)}`}
              />
              <ResultRow
                label="Tempo médio de retenção"
                value={`${fmtNum(retencaoMedia)} meses`}
                description={`1 ÷ Churn = 1 ÷ ${fmtNum(churnPct)}%`}
              />
              <ResultRow
                label="Payback Period"
                value={`${fmtNum(paybackMeses)} meses`}
                description="tempo para recuperar o CAC"
              />
              <ResultRow
                label="LTV/CAC com este preço"
                value={`${fmtNum(ltvCacReal, 1)}x`}
                description="deve ser ≥ 3 para negócio saudável"
              />

              {/* Destaque: Preço Mensal Alvo */}
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-xs font-medium text-green-600 mb-1">Preço Mensal Alvo</p>
                <p className="text-3xl font-bold text-green-700">{fmt(precoMensalAlvo)}</p>
                <p className="text-xs text-green-600 mt-1">
                  por cliente / mês para atingir LTV/CAC de {fmtNum(ltvCacAlvo)}x
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Preencha todos os campos para ver os resultados
            </div>
          )}
        </div>
      </div>

      {/* Metrics bar */}
      {isValid && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Preço Mensal Alvo"
            value={fmt(precoMensalAlvo)}
            sub="por cliente/mês"
            color="green"
          />
          <MetricCard
            label="LTV Alvo"
            value={fmt(ltvAlvo)}
            sub={`LTV/CAC: ${fmtNum(ltvCacAlvo)}x`}
            color="blue"
          />
          <MetricCard
            label="Retenção Média"
            value={`${fmtNum(retencaoMedia)} meses`}
            sub={`Churn: ${fmtNum(churnPct)}%/mês`}
            color="purple"
          />
          <MetricCard
            label="Payback Period"
            value={`${fmtNum(paybackMeses)} meses`}
            sub="para recuperar o CAC"
            color="orange"
          />
        </div>
      )}

      {/* Health indicator */}
      {isValid && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Indicadores de saúde do SaaS</h3>
          <div className="space-y-3">
            <HealthRow
              label="LTV/CAC"
              value={`${fmtNum(ltvCacReal, 1)}x`}
              good={ltvCacReal >= 3}
              warn={ltvCacReal >= 1 && ltvCacReal < 3}
              goodMsg="Excelente — acima de 3x"
              warnMsg="Atenção — o ideal é ≥ 3x"
              badMsg="Crítico — LTV menor que CAC"
            />
            <HealthRow
              label="Payback Period"
              value={`${fmtNum(paybackMeses, 1)} meses`}
              good={paybackMeses <= 12}
              warn={paybackMeses > 12 && paybackMeses <= 18}
              goodMsg="Ótimo — recuperação em até 12 meses"
              warnMsg="Aceitável — idealmente abaixo de 12 meses"
              badMsg="Alto risco — payback acima de 18 meses"
            />
            <HealthRow
              label="Churn Mensal"
              value={`${fmtNum(churnPct, 1)}%`}
              good={churnPct <= 2}
              warn={churnPct > 2 && churnPct <= 5}
              goodMsg="Saudável — churn controlado"
              warnMsg="Atenção — tente reduzir o churn"
              badMsg="Alto churn — impacto severo no LTV"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function HealthRow({
  label,
  value,
  good,
  warn,
  goodMsg,
  warnMsg,
  badMsg,
}: {
  label: string;
  value: string;
  good: boolean;
  warn: boolean;
  goodMsg: string;
  warnMsg: string;
  badMsg: string;
}) {
  const status = good ? "good" : warn ? "warn" : "bad";
  const styles = {
    good: { bar: "bg-green-500", bg: "bg-green-50", text: "text-green-700", msg: goodMsg },
    warn: { bar: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-700", msg: warnMsg },
    bad: { bar: "bg-red-500", bg: "bg-red-50", text: "text-red-700", msg: badMsg },
  };
  const s = styles[status];

  return (
    <div className={`flex items-center gap-3 rounded-xl p-3 ${s.bg}`}>
      <div className={`w-2 h-8 rounded-full ${s.bar} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className={`text-sm font-semibold ${s.text}`}>{s.msg}</p>
      </div>
      <p className={`text-base font-bold ${s.text} shrink-0`}>{value}</p>
    </div>
  );
}
