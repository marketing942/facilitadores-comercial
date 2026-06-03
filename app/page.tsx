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
    eyebrow: null as string | null,
  },
  {
    href: "/precificacao-produtos",
    title: "CPPEM Concursos",
    description: "DRE por produto — Mentorias, Presencial, Online, Físicos e Supletivo",
    iconBg: "bg-rose-50 text-rose-700 ring-rose-100",
    accent: "from-rose-500/0 via-rose-500/0 to-rose-500/40",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    eyebrow: "Produtos",
  },
  {
    href: "/precificacao-colegio",
    title: "Colégio CPPEM",
    description: "Precificação de produtos do colégio — mensalidades, matrículas, materiais",
    iconBg: "bg-blue-50 text-blue-700 ring-blue-100",
    accent: "from-blue-500/0 via-blue-500/0 to-blue-500/40",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    eyebrow: "Produtos",
  },
  {
    href: "/precificacao-unicive",
    title: "Unicive Caruaru",
    description: "Precificação de produtos da Unicive — cursos, taxas, mensalidades",
    iconBg: "bg-amber-50 text-amber-700 ring-amber-100",
    accent: "from-amber-500/0 via-amber-500/0 to-amber-500/40",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    eyebrow: "Produtos",
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
    eyebrow: null,
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
            {tool.eyebrow && (
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{tool.eyebrow}</p>
            )}
            <h2 className={`text-[15px] font-semibold text-slate-900 tracking-tight ${tool.eyebrow ? "mt-0.5" : "mt-4"}`}>{tool.title}</h2>
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
