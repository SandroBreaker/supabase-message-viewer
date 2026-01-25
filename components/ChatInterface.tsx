
import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Message } from '../types';
import MessageItem from './MessageItem';
import { Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  messages: Message[];
  activeUser: string | null;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  activeUser, 
  onLoadMore, 
  hasMore, 
  isLoadingMore 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState<number>(0);

  // Intersection Observer para carregar mais mensagens ao chegar no topo
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          // Guardar a altura atual antes de carregar novas mensagens
          if (scrollRef.current) {
            setPrevScrollHeight(scrollRef.current.scrollHeight);
          }
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px 0px 0px 0px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Manter a posição do scroll quando mensagens novas são adicionadas no topo
  useEffect(() => {
    if (scrollRef.current && prevScrollHeight > 0) {
      const newScrollHeight = scrollRef.current.scrollHeight;
      const heightDifference = newScrollHeight - prevScrollHeight;
      scrollRef.current.scrollTop = heightDifference;
      setPrevScrollHeight(0);
    } else if (scrollRef.current && messages.length <= 25) {
      // Scroll para o fim apenas no carregamento inicial
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const groupedMessagesByDate = useMemo(() => {
    return messages.reduce((acc: Record<string, Message[]>, msg: Message) => {
      const date = new Date(msg.created_at).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(msg);
      return acc;
    }, {} as Record<string, Message[]>);
  }, [messages]);

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto px-4 py-8 md:px-12 scroll-smooth bg-transparent"
    >
      <div className="max-w-5xl mx-auto space-y-10 flex flex-col">
        {/* Sentinela de Scroll e Loading de Histórico */}
        <div ref={observerTarget} className="h-20 flex items-center justify-center">
          {isLoadingMore ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm animate-in fade-in duration-300">
              <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Recuperando histórico...</span>
            </div>
          ) : hasMore ? (
             <div className="h-full w-full" />
          ) : (
            <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 opacity-50 text-center w-full py-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
              Início da conversa alcançado
            </div>
          )}
        </div>

        {(Object.entries(groupedMessagesByDate) as [string, Message[]][]).map(([date, msgs]) => (
          <div key={date} className="space-y-8">
            <div className="flex justify-center sticky top-2 z-10">
              <span className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-zinc-500 dark:text-zinc-400 text-[9px] font-black uppercase px-5 py-2 rounded-full tracking-[0.2em] shadow-sm border border-zinc-200 dark:border-zinc-800">
                {date}
              </span>
            </div>
            
            <div className="space-y-3">
              {msgs.map((msg) => (
                <MessageItem 
                  key={msg.id} 
                  message={msg} 
                  isOwn={msg.sender_id === activeUser}
                />
              ))}
            </div>
          </div>
        ))}
        
        <div className="h-10" />
      </div>
    </div>
  );
};

export default ChatInterface;
