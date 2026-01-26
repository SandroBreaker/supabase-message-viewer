
import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageItem from './MessageItem';

interface ChatInterfaceProps {
  messages: Message[];
  activeUser: string | null;
  userAliases: Record<string, string>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, activeUser, userAliases }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const groupedMessagesByDate = messages.reduce<Record<string, Message[]>>((acc, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto px-4 py-8 md:px-12 scroll-smooth"
    >
      <div className="max-w-5xl mx-auto space-y-10">
        {(Object.entries(groupedMessagesByDate) as [string, Message[]][]).map(([date, msgs]) => (
          <div key={date} className="space-y-6">
            <div className="flex justify-center sticky top-2 z-10">
              <span className="bg-zinc-200/80 dark:bg-zinc-800/80 backdrop-blur-sm text-zinc-600 dark:text-zinc-400 text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest border border-zinc-300/50 dark:border-zinc-700/50">
                {date}
              </span>
            </div>
            
            <div className="space-y-2">
              {msgs.map((msg) => (
                <MessageItem 
                  key={msg.id} 
                  message={msg} 
                  isOwn={msg.sender_id === activeUser}
                  senderAlias={msg.sender_id ? userAliases[msg.sender_id] : 'Sistema'}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="h-4" />
      </div>
    </div>
  );
};

export default ChatInterface;
