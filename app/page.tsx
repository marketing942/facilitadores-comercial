import Link from "next/link";

const tools = [
  {
    href: "/precificacao",
    title: "Precificação de Serviço",
    description: "Custo da operação, preço por hora e DRE completo",
    iconBg: "bg-blue-50 text-blue-700 ring-blue-100",
    accent: "from-blue-500/0 via-blue-500/0 to-blue-500/40",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: "/precificacao-produtos",
    title: "Precificação de Produtos",
    description: "DRE por produto — Mentorias, Presencial, Online, Físicos e Supletivo",
    iconBg: "bg-rose-50 text-rose-700 ring-rose-100",
    accent: "from-rose-500/0 via-rose-500/0 to-rose-500/40",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
  {
    href: "/precificacao-saas",
    title: "Precificação de SaaS",
    description: "Preço mensal ideal a partir de Churn, CAC, Margem e LTV/CAC alvo",
    iconBg: "bg-violet-50 text-violet-700 ring-violet-100",
    accent: "from-violet-500/0 via-violet-500/0 to-violet-500/40",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Sistema online
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Precificador
        </h1>
        <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-xl">
          Modelos de precificação para o time comercial — DRE, margem de contribuição, break-even e LTV/CAC em um só lugar.
        </p>
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group relative bg-white rounded-2xl ring-1 ring-slate-200 hover:ring-slate-300 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_-12px_rgba(15,23,42,0.18)] overflow-hidden p-5"
          >
            <div className={`absolute inset-x-0 -bottom-px h-px bg-gradient-to-r ${tool.accent}`} />
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ${tool.iconBg}`}>
                {tool.icon}
              </div>
              <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-[15px] font-semibold text-slate-900 tracking-tight">{tool.title}</h2>
            <p className="mt-1 text-[13px] text-slate-500 leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-center gap-3 text-[11px] text-slate-400">
        <span>
          Idealizador:{" "}
          <a
            href="https://www.instagram.com/itallomota1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 font-medium hover:text-pink-500 transition-colors"
          >
            @itallomota1
          </a>
        </span>
        <span className="hidden sm:inline text-slate-200">·</span>
        <span>
          Desenvolvido com{" "}
          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 font-medium hover:text-orange-500 transition-colors"
          >
            Claude Code
          </a>
        </span>
      </footer>
    </div>
  );
}
