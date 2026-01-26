
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from './supabase';
import { Message } from './types';
import ChatInterface from './components/ChatInterface';
import { AlertCircle, RefreshCw, LayoutDashboard, Sun, Moon, User } from 'lucide-react';

// Deterministic nickname generator
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
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
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
      
      const result = data ? [...data].reverse() : [];
      setMessages(result);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      setError(err.message || 'Falha na sincronização com o banco de dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const userAliases = useMemo(() => {
    const uniqueUsers = Array.from(new Set(messages.map(m => m.sender_id).filter(Boolean))) as string[];
    const mapping: Record<string, string> = {};
    uniqueUsers.forEach(uid => {
      mapping[uid] = generateNickname(uid);
    });
    return mapping;
  }, [messages]);

  const uniqueUserIds = useMemo(() => Object.keys(userAliases), [userAliases]);

  // Handle default perspective logic: Prioritize 'Silent Echo'
  useEffect(() => {
    if (uniqueUserIds.length > 0 && !activeUser) {
      const silentEchoId = uniqueUserIds.find(id => userAliases[id] === 'Silent Echo');
      if (silentEchoId) {
        setActiveUser(silentEchoId);
      } else {
        setActiveUser(uniqueUserIds[0]);
      }
    }
  }, [uniqueUserIds, userAliases, activeUser]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-[#09090B]">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-medium animate-pulse">Carregando mensagens...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-zinc-200 dark:border-zinc-800">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Erro de Conexão</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">{error}</p>
          <button onClick={fetchMessages} className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" /> Tentar novamente
          </button>
        </div>
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
            <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">Set My Perspective:</span>
            <select 
              value={activeUser || ''}
              onChange={(e) => setActiveUser(e.target.value)}
              className="text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-none rounded-lg px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              {uniqueUserIds.map((uid) => (
                <option key={uid} value={uid}>
                  {userAliases[uid]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 dark:text-zinc-400"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={fetchMessages}
              className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all text-zinc-500 dark:text-zinc-400"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <ChatInterface 
          messages={messages} 
          activeUser={activeUser}
          userAliases={userAliases}
        />
      </main>

      <footer className="bg-white/50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 px-6 py-2">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center">
          {messages.length} Registros recuperados da tabela messages
        </p>
      </footer>
    </div>
  );
};

export default App;
