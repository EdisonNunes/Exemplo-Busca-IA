import Link from 'next/link';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-200">
        <BookOpen className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-4">404 - Página não encontrada</h1>
      <p className="text-lg text-slate-600 mb-8 max-w-md">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para o Início
      </Link>
    </div>
  );
}
