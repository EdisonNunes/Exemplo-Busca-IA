'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Loader2, Send, Cpu, Factory, ArrowRight, History } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { generateManual } from '@/lib/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ManualEntry {
  id: string;
  equipment: string;
  manufacturer: string;
  content: string;
  timestamp: number;
}

export default function ManualChat() {
  const [equipment, setEquipment] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ManualEntry[]>([]);
  const [currentManual, setCurrentManual] = useState<ManualEntry | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment || !manufacturer || loading) return;

    setLoading(true);
    try {
      const content = await generateManual(equipment, manufacturer);
      const newEntry: ManualEntry = {
        id: Math.random().toString(36).substring(7),
        equipment,
        manufacturer,
        content: content || 'Não foi possível gerar o manual.',
        timestamp: Date.now(),
      };
      setHistory(prev => [newEntry, ...prev]);
      setCurrentManual(newEntry);
      setEquipment('');
      setManufacturer('');
    } catch (error) {
      console.error('Error generating manual:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentManual]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200"
        >
          <BookOpen className="w-8 h-8 text-white" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4"
        >
          EquipManual <span className="text-indigo-600">AI</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600 max-w-2xl mx-auto"
        >
          Encontre manuais detalhados, guias de segurança e instruções de operação para qualquer equipamento em segundos.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & History */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              Nova Busca
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> Equipamento
                </label>
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  placeholder="Ex: Furadeira de Impacto"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-slate-50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Factory className="w-4 h-4" /> Fabricante
                </label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="Ex: Bosch"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-slate-50"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Busca Informações Técnicas
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {history.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                Histórico
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentManual(item)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border transition-all text-sm",
                      currentManual?.id === item.id 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200" 
                        : "bg-slate-50 border-slate-100 text-slate-600 hover:border-indigo-200"
                    )}
                  >
                    <p className="font-semibold truncate">{item.equipment}</p>
                    <p className="text-xs opacity-70">{item.manufacturer}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {currentManual ? (
              <motion.div
                key={currentManual.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="bg-indigo-600 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold">{currentManual.equipment}</h3>
                      <p className="text-indigo-100 flex items-center gap-2 mt-1">
                        <Factory className="w-4 h-4" /> {currentManual.manufacturer}
                      </p>
                    </div>
                    <div className="text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                      Gerado por IA
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-10 prose prose-slate max-w-none prose-headings:text-indigo-900 prose-a:text-indigo-600 prose-strong:text-slate-900">
                  <div ref={scrollRef} />
                  <Markdown remarkPlugins={[remarkGfm]}>{currentManual.content}</Markdown>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-100/50 rounded-3xl border-2 border-dashed border-slate-200"
              >
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Nenhuma informação selecionada</h3>
                <p className="text-slate-500 max-w-xs">
                  Preencha os dados ao lado para buscar especificações e instruções técnicas com inteligência artificial.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        
        .prose h1 { font-size: 1.875rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
        .prose h2 { font-size: 1.5rem; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #312e81; }
        .prose h3 { font-size: 1.25rem; margin-top: 1.25rem; margin-bottom: 0.5rem; }
        .prose p { margin-bottom: 1rem; line-height: 1.6; }
        .prose ul, .prose ol { margin-bottom: 1rem; padding-left: 1.5rem; }
        .prose li { margin-bottom: 0.5rem; }
        
        .prose table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.875rem; }
        .prose th { background: #f8fafc; text-align: left; padding: 0.75rem; border: 1px solid #e2e8f0; font-weight: 600; color: #1e293b; }
        .prose td { padding: 0.75rem; border: 1px solid #e2e8f0; color: #475569; }
        .prose tr:nth-child(even) { background: #fcfcfd; }
      `}</style>
    </div>
  );
}
