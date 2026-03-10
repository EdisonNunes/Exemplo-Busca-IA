'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-red-50">
        <AlertTriangle className="w-10 h-10 text-red-600" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">Algo deu errado!</h1>
      <p className="text-lg text-slate-600 mb-8 max-w-md">
        Ocorreu um erro inesperado ao carregar esta página.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
      >
        <RotateCcw className="w-5 h-5" />
        Tentar Novamente
      </button>
    </div>
  );
}
