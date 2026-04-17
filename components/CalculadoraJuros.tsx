"use client";

import { useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Pagar.me MDR rates for D+2 anticipation per installment count
const D02_RATES: Record<number, number> = {
  1: 3.65,
  2: 5.32,
  3: 6.33,
  4: 7.35,
  5: 8.36,
  6: 9.37,
  7: 10.67,
  8: 11.68,
  9: 12.69,
  10: 13.70,
  11: 14.70,
  12: 15.71,
  13: 16.72,
  14: 17.73,
  15: 18.74,
  16: 19.74,
  17: 20.75,
  18: 21.76,
};

const BOLETO_FIXED_COST = 3.49; // R$ fixed fee per boleto
const PIX_RATE = 0.82; // % fee for Pix
const GATEWAY_COST = 0.40; // R$ fixed gateway fee per transaction

const MIN_RATE_WARNING = 1.70;
const MAX_RATE_SUGGESTION = 2.50;

function fmt(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtPct(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2).replace(".", ",")}%`;
}

interface InstallmentRow {
  label: string;
  installments: number | null;
  customerPerInstallment: number;
  customerTotal: number;
  interestTransferred: number;
  sellerReceives: number;
  pagarmeRate: number | null;
  profitLossPct: number;
}

function calcRows(price: number, interestRate: number): InstallmentRow[] {
  const rows: InstallmentRow[] = [];

  // Credit card installments 1x–18x
  for (let n = 1; n <= 18; n++) {
    let customerTotal: number;
    let customerPerInstallment: number;

    if (n === 1) {
      customerTotal = price;
      customerPerInstallment = price;
    } else {
      // Simple interest formula: total = price * (1 + rate * n)
      customerTotal = price * (1 + (interestRate / 100) * n);
      customerPerInstallment = customerTotal / n;
    }

    const interestTransferred = customerTotal - price;
    const d02 = D02_RATES[n];
    const sellerReceives = customerTotal * (1 - d02 / 100) - GATEWAY_COST;
    const profitLossPct = ((sellerReceives - price) / price) * 100;

    rows.push({
      label: `${n}x`,
      installments: n,
      customerPerInstallment,
      customerTotal,
      interestTransferred,
      sellerReceives,
      pagarmeRate: d02,
      profitLossPct,
    });
  }

  // Boleto
  const boletoTotal = price;
  const boletoReceived = price - BOLETO_FIXED_COST - GATEWAY_COST;
  rows.push({
    label: "Boleto",
    installments: null,
    customerPerInstallment: boletoTotal,
    customerTotal: boletoTotal,
    interestTransferred: 0,
    sellerReceives: boletoReceived,
    pagarmeRate: null,
    profitLossPct: ((boletoReceived - price) / price) * 100,
  });

  // Pix
  const pixTotal = price;
  const pixReceived = price * (1 - PIX_RATE / 100) - GATEWAY_COST;
  rows.push({
    label: "Pix",
    installments: null,
    customerPerInstallment: pixTotal,
    customerTotal: pixTotal,
    interestTransferred: 0,
    sellerReceives: pixReceived,
    pagarmeRate: PIX_RATE,
    profitLossPct: ((pixReceived - price) / price) * 100,
  });

  return rows;
}

export default function CalculadoraJuros() {
  const [priceInput, setPriceInput] = useLocalStorage("calc_price", "897,00");
  const [rateInput, setRateInput] = useLocalStorage("calc_rate", "1,89");

  const price = useMemo(() => {
    const cleaned = priceInput.replace(/\./g, "").replace(",", ".");
    const val = parseFloat(cleaned);
    return isNaN(val) || val <= 0 ? 0 : val;
  }, [priceInput]);

  const interestRate = useMemo(() => {
    const cleaned = rateInput.replace(",", ".");
    const val = parseFloat(cleaned);
    return isNaN(val) || val < 0 ? 0 : val;
  }, [rateInput]);

  const rows = useMemo(
    () => (price > 0 ? calcRows(price, interestRate) : []),
    [price, interestRate]
  );

  const rateWarning =
    interestRate > 0 && interestRate < MIN_RATE_WARNING;
  const rateOk =
    interestRate >= MIN_RATE_WARNING && interestRate <= MAX_RATE_SUGGESTION;
  const rateHigh = interestRate > MAX_RATE_SUGGESTION;

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPriceInput(e.target.value);
  }

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setRateInput(e.target.value);
  }

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">
          Parâmetros da simulação
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor do produto (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={priceInput}
                onChange={handlePriceChange}
                placeholder="0,00"
                className="w-full pl-10 pr-4 py-2.5 border border-amber-300 bg-amber-50 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Preço que o cliente vê no checkout
            </p>
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Taxa de juros mensal (%)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={rateInput}
                onChange={handleRateChange}
                placeholder="1,89"
                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:border-transparent transition ${
                  rateWarning
                    ? "border-red-400 bg-red-50 focus:ring-red-400"
                    : "border-amber-300 bg-amber-50 focus:ring-amber-400"
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                %
              </span>
            </div>

            {/* Rate feedback */}
            {rateWarning && (
              <div className="flex items-start gap-2 mt-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                <svg
                  className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-red-700">
                    Taxa muito baixa!
                  </p>
                  <p className="text-xs text-red-600">
                    Abaixo de {MIN_RATE_WARNING.toFixed(2).replace(".", ",")}%
                    pode resultar em prejuízo nas vendas parceladas. Sugerimos
                    entre{" "}
                    <strong>
                      {MIN_RATE_WARNING.toFixed(2).replace(".", ",")}%
                    </strong>{" "}
                    e{" "}
                    <strong>
                      {MAX_RATE_SUGGESTION.toFixed(2).replace(".", ",")}%
                    </strong>
                    .
                  </p>
                </div>
              </div>
            )}
            {rateOk && (
              <p className="text-xs text-green-700 mt-1 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Taxa dentro da faixa recomendada (1,70% – 2,50%)
              </p>
            )}
            {rateHigh && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Taxa acima do sugerido — verifique se o cliente aceitará
              </p>
            )}
            {!rateWarning && !rateOk && !rateHigh && (
              <p className="text-xs text-gray-400 mt-1">
                Sugestão: entre 1,70% e 2,50% ao mês
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results table */}
      {price > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">
              Simulação de venda —{" "}
              <span className="text-green-700">{fmt(price)}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Taxas Pagar.me (MDR D+2) · Gateway R$0,40 · Taxa de juros{" "}
              {rateInput.replace(".", ",")}% a.m.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3 w-16">Parcelas</th>
                  <th className="text-right px-4 py-3">
                    Valor por parcela
                    <span className="block font-normal normal-case text-gray-400">
                      cliente paga
                    </span>
                  </th>
                  <th className="text-right px-4 py-3">
                    Total do cliente
                  </th>
                  <th className="text-right px-4 py-3">
                    Juros repassados
                  </th>
                  <th className="text-right px-4 py-3">
                    Taxa Pagar.me
                  </th>
                  <th className="text-right px-4 py-3">
                    Você recebe
                    <span className="block font-normal normal-case text-gray-400">
                      líquido
                    </span>
                  </th>
                  <th className="text-right px-4 py-3 pr-5">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, idx) => {
                  const isBreakEven = Math.abs(row.profitLossPct) < 0.05;
                  const isPositive = row.profitLossPct > 0.05;
                  const isNegative = row.profitLossPct < -0.05;
                  const isSeparator =
                    row.label === "Boleto";

                  return (
                    <>
                      {isSeparator && (
                        <tr key={`sep-${idx}`}>
                          <td
                            colSpan={7}
                            className="px-4 py-2 bg-gray-50 text-xs text-gray-400 font-medium"
                          >
                            Outros métodos de pagamento
                          </td>
                        </tr>
                      )}
                      <tr
                        key={row.label}
                        className={`transition-colors hover:bg-gray-50 ${
                          isPositive ? "bg-green-50/30" : ""
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-gray-800">
                          {row.label}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {fmt(row.customerPerInstallment)}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">
                          {fmt(row.customerTotal)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {row.interestTransferred > 0 ? (
                            <span className="text-blue-600 font-medium">
                              {fmt(row.interestTransferred)}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-500">
                          {row.pagarmeRate !== null ? (
                            row.label === "Pix" ? (
                              `${PIX_RATE.toFixed(2).replace(".", ",")}%`
                            ) : row.label === "Boleto" ? (
                              `R$ ${BOLETO_FIXED_COST.toFixed(2).replace(".", ",")}`
                            ) : (
                              `${row.pagarmeRate.toFixed(2).replace(".", ",")}%`
                            )
                          ) : (
                            `R$ ${BOLETO_FIXED_COST.toFixed(2).replace(".", ",")}`
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          {fmt(row.sellerReceives)}
                        </td>
                        <td className="px-4 py-3 pr-5 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                              isPositive
                                ? "bg-green-100 text-green-800"
                                : isNegative
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {fmtPct(row.profitLossPct)}
                          </span>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-green-100 border border-green-300 inline-block" />
              Resultado positivo (você recebe mais que o preço original)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-300 inline-block" />
              Resultado negativo (você recebe menos que o preço original)
            </span>
            <span className="text-gray-400">
              * &ldquo;Resultado&rdquo; = diferença entre o líquido recebido e o
              preço original
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">
            Preencha o valor do produto para ver a simulação
          </p>
        </div>
      )}

      {/* Fee breakdown info */}
      {price > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Custos fixos do meio de pagamento (Pagar.me)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoCard
              label="Gateway (por transação)"
              value="R$ 0,40"
              sub="cobrado em toda venda"
            />
            <InfoCard
              label="Boleto bancário"
              value="R$ 3,49"
              sub="taxa fixa por emissão"
            />
            <InfoCard
              label="Pix"
              value="0,82%"
              sub="sobre o valor da transação"
            />

          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 border ${
        highlight
          ? "bg-amber-50 border-amber-200"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <p
        className={`text-xs font-medium mb-1 ${
          highlight ? "text-amber-700" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-lg font-bold ${
          highlight ? "text-amber-800" : "text-gray-800"
        }`}
      >
        {value}
      </p>
      <p
        className={`text-xs mt-0.5 ${
          highlight ? "text-amber-600" : "text-gray-400"
        }`}
      >
        {sub}
      </p>
    </div>
  );
}
