"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/precificacao" },
];

const productItems = [
  { label: "CPPEM Concursos", href: "/precificacao-produtos", dot: "bg-rose-500" },
  { label: "Colégio CPPEM", href: "/precificacao-colegio", dot: "bg-blue-500" },
  { label: "Unicive Caruaru", href: "/precificacao-unicive", dot: "bg-amber-500" },
];

const trailingItems = [{ label: "SaaS", href: "/precificacao-saas" }];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [produtosOpen, setProdutosOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!produtosOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProdutosOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [produtosOpen]);

  // Close the dropdown whenever the route changes
  useEffect(() => {
    setProdutosOpen(false);
  }, [pathname]);

  if (pathname === "/login") return null;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const inProducts = productItems.some((p) => pathname === p.href);

  return (
    <nav className="bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative w-8 h-8 rounded-lg bg-slate-900 ring-1 ring-slate-900/10 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-9" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 6h7v7" />
              </svg>
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-slate-900 text-sm tracking-tight">Precificador</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">CPPEM Comercial</span>
            </div>
          </Link>

          <div className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Produtos dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setProdutosOpen((o) => !o)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors inline-flex items-center gap-1 ${
                  inProducts ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Produtos
                <svg
                  className={`w-3 h-3 transition-transform ${produtosOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {produtosOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl ring-1 ring-slate-200 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] overflow-hidden py-1 z-50">
                  {productItems.map((p) => {
                    const active = pathname === p.href;
                    return (
                      <Link
                        key={p.href}
                        href={p.href}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                          active ? "bg-slate-50 text-slate-900 font-medium" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${p.dot} flex-shrink-0`} />
                        <span>{p.label}</span>
                        {active && (
                          <svg className="w-3.5 h-3.5 text-slate-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {trailingItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <a
              href="https://www.notion.so/cppem/Hub-Comercial-2cebbae8074c8070bc5fd7f409e374c9?source=copy_link"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
              </svg>
              Notion
            </a>
            <button
              onClick={logout}
              title="Sair"
              className="ml-1 p-2 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
