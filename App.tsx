import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from './supabase';
import { Message } from './types';
import ChatInterface from './components/ChatInterface';
import ExportControls from './utils/ExportControls';
import { AlertCircle, RefreshCw, LayoutDashboard, Sun, Moon, CalendarDays } from 'lucide-react';

const generateNickname = (uuid: string | null): string => {
  if (!uuid) return "Sistema";
  const adjectives = ["Neon", "Swift", "Silent", "Crimson", "Azure", "Golden", "Mystic", "Iron", "Vibrant", "Frost"];
  const names = ["Phoenix", "Shadow", "Falcon", "Nova", "Titan", "Echo", "Ghost", "Orion", "Raven", "Wolf"];
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = uuid.charCodeAt(i) + ((hash << 5) - hash);
  }
  const adjIndex = Math.abs(hash) % adjectives.length;
  const nameIndex = Math.abs(hash >> 1) % names.length;
  return `${adjectives[adjIndex]} ${names[nameIndex]}`;
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    darkMode ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;
      setMessages(data ? [...data].reverse() : []);
    } catch (err: any) {
      setError(err.message || 'Falha na sincronização');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const userAliases = useMemo(() => {
    const uniqueUsers = Array.from(new Set(messages.map(m => m.sender_id).filter(Boolean))) as string[];
    const mapping: Record<string, string> = {};
    uniqueUsers.forEach(uid => { mapping[uid] = generateNickname(uid); });
    return mapping;
  }, [messages]);

  const oldestDateLabel = useMemo(() => {
    if (messages.length === 0) return null;
    return new Date(messages[0].created_at).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [messages]);

  const uniqueUserIds = Object.keys(userAliases);

  useEffect(() => {
    if (uniqueUserIds.length > 0 && !activeUser) {
      const silentEchoId = uniqueUserIds.find(id => userAliases[id] === 'Silent Echo');
      setActiveUser(silentEchoId || uniqueUserIds[0]);
    }
  }, [uniqueUserIds, userAliases, activeUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-[#09090B]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] dark:bg-[#0B0B0C] overflow-hidden font-sans transition-colors duration-500">
      <header className="sticky top-0 w-full z-50 bg-white/80 dark:bg-[#121214]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Database Chat Explorer</h1>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Viewing as {activeUser ? userAliases[activeUser] : '...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest text-right">Perspective:</span>
            <select 
              value={activeUser || ''}
              onChange={(e) => setActiveUser(e.target.value)}
              className="text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-none rounded-lg px-2 py-1 outline-none cursor-pointer"
            >
              {uniqueUserIds.map((uid) => (
                <option key={uid} value={uid}>{userAliases[uid]}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 dark:text-zinc-400">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={fetchMessages} className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 dark:text-zinc-400">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <ExportControls />

      <main className="flex-1 overflow-hidden relative">
        <ChatInterface 
          messages={messages} 
          activeUser={activeUser}
          userAliases={userAliases}
        />
      </main>

      <footer className="bg-white/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 px-6 py-2.5 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
          {messages.length} Registros recuperados
        </p>
        
        {oldestDateLabel && (
          <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em]">
            <CalendarDays className="w-3 h-3" />
            <span>Limite do Histórico: {oldestDateLabel}</span>
          </div>
        )}
      </footer>
    </div>
  );
};

export default App;
