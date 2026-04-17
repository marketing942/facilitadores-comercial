import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Facilitadores Comercial
        </h1>
        <p className="text-lg text-gray-500">
          Ferramentas para agilizar o dia a dia do time comercial
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/calculadora" className="group">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-green-400 transition-all duration-200">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <svg
                className="w-6 h-6 text-green-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Calculadora de Parcelas
            </h2>
            <p className="text-sm text-gray-500">
              Simule juros, parcelas e o valor líquido recebido via Guru +
              Pagar.me
            </p>
            <span className="inline-block mt-4 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
              Disponível
            </span>
          </div>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 p-6 opacity-50 cursor-not-allowed">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-400 mb-1">
            Em breve
          </h2>
          <p className="text-sm text-gray-400">
            Novas ferramentas serão adicionadas aqui
          </p>
        </div>
      </div>
    </div>
  );
}
