
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from './supabase';
import { Message } from './types';
import ChatInterface from './components/ChatInterface';
import { AlertCircle, RefreshCw, LayoutDashboard, Sun, Moon, Database } from 'lucide-react';

const PAGE_SIZE = 25;

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingMore, setFetchingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(0);
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const fetchMessages = useCallback(async (isInitial = false) => {
    if (!isInitial && (!hasMore || fetchingMore)) return;

    if (isInitial) setLoading(true);
    else setFetchingMore(true);

    setError(null);
    
    try {
      const currentOffset = isInitial ? 0 : offset + PAGE_SIZE;
      
      const { data, error: fetchError, count } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + PAGE_SIZE - 1);

      if (fetchError) throw fetchError;
      
      if (data) {
        // As mensagens vêm ordenadas da mais nova para a mais antiga (desc)
        // No chat, queremos exibir da mais antiga para a mais nova (asc)
        const reversedNewData = [...data].reverse();
        
        setMessages(prev => isInitial ? reversedNewData : [...reversedNewData, ...prev]);
        setOffset(currentOffset);
        
        if (count !== null) {
          setHasMore(currentOffset + data.length < count);
        }
      }
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Falha na sincronização com o banco de dados');
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [offset, hasMore, fetchingMore]);

  useEffect(() => {
    fetchMessages(true);
  }, []);

  const mainUserId = useMemo(() => {
    // Definimos o usuário "ativo" como o que enviou a última mensagem para alinhar à direita
    return messages.length > 0 ? messages[messages.length - 1].sender_id : null;
  }, [messages]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-[#09090B]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-600 rounded-full animate-spin"></div>
          <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-600" />
        </div>
        <p className="mt-6 text-zinc-500 dark:text-zinc-400 font-medium animate-pulse tracking-wide uppercase text-[10px] font-black">Sincronizando Dados...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] dark:bg-[#0B0B0C] overflow-hidden font-sans transition-colors duration-500">
      <header className="sticky top-0 w-full z-50 bg-white/80 dark:bg-[#121214]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Message Explorer <span className="text-indigo-500">v2</span></h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></span>
              {error ? 'Erro de Sincronização' : 'Interface Read-Only Ativa'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 dark:text-zinc-400 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            title="Alternar Tema"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => fetchMessages(true)}
            className={`p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 dark:text-zinc-400 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 ${fetchingMore ? 'animate-spin' : ''}`}
            title="Recarregar"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <ChatInterface 
          messages={messages} 
          activeUser={mainUserId}
          onLoadMore={() => fetchMessages(false)}
          hasMore={hasMore}
          isLoadingMore={fetchingMore}
        />
        
        {error && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 animate-in slide-in-from-bottom-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 shadow-2xl backdrop-blur-md">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-xs font-bold flex-1">{error}</p>
              <button onClick={() => fetchMessages(true)} className="text-[10px] font-black uppercase underline tracking-widest">Tentar Novamente</button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 px-6 py-2">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            Database Inspector
          </p>
          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            {messages.length} mensagens exibidas
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
