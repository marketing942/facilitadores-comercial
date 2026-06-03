"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        if (res.status === 500) setError("Servidor não configurado. Avise o administrador.");
        else setError("Senha incorreta");
        return;
      }
      const next = sp.get("next") || "/";
      router.push(next);
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const configErr = sp.get("err") === "config";

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] p-7 space-y-5">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-slate-900 rounded-xl ring-1 ring-slate-900/10 flex items-center justify-center mb-4 shadow-sm">
            <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 6h7v7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Precificador</h1>
          <p className="text-sm text-slate-500 mt-1">Acesso restrito ao time CPPEM</p>
        </div>
        {configErr && (
          <div className="text-xs text-amber-800 bg-amber-50 ring-1 ring-amber-200 rounded-lg p-3 flex gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Servidor sem variáveis de ambiente configuradas.
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Senha do time</label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-white ring-1 ring-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-0 transition-all"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 active:bg-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
      <p className="text-center text-[11px] text-slate-400 mt-5">
        Esqueceu a senha? Fale com o administrador.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(16,185,129,0.08),transparent_40%),radial-gradient(circle_at_80%_110%,rgba(15,23,42,0.05),transparent_50%)] pointer-events-none" />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
