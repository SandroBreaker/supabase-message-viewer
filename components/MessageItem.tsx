// FILE: MessageItem.tsx
// Alteração: Inversão da lógica visual de alinhamento e cores

import React from 'react';
import { Message } from '../types';
import { Check, CheckCheck, FileIcon, CornerUpRight, Trash2, Edit3 } from 'lucide-react';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
}

const USER_NAMES: Record<string, string> = {
  '00000000-0000-0000-0000-000000000001': 'FxllenGhost',
  '00000000-0000-0000-0000-000000000002': 'GhostGirl'
};

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwn }) => {
  // Inversão: O que era "Own" agora exibe como "Other" e vice-versa
  const displayAsOwn = !isOwn; 

  const formattedTime = new Date(message.created_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const getSenderName = (id: string | null) => {
    if (!id) return 'Sistema';
    return USER_NAMES[id] || `ID: ${id.split('-')[0]}`;
  };

  const getStatusIcon = () => {
    if (message.read_at) return <CheckCheck className="w-3.5 h-3.5 text-indigo-200" />;
    if (message.delivered_at) return <CheckCheck className="w-3.5 h-3.5 text-white/50" />;
    return <Check className="w-3.5 h-3.5 text-white/50" />;
  };

  const renderReactions = () => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) return null;
    
    return (
      <div className={`flex flex-wrap gap-1 mt-1 ${displayAsOwn ? 'justify-end' : 'justify-start'}`}>
        {Object.entries(message.reactions).map(([emoji, users]) => (
          <div 
            key={emoji} 
            className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 rounded-full text-[11px] shadow-sm flex items-center gap-1"
          >
            <span>{emoji}</span>
            <span className="text-[9px] text-zinc-400 font-bold">{Array.isArray(users) ? users.length : 1}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex w-full ${displayAsOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
      <div className={`max-w-[80%] md:max-w-[65%] flex flex-col ${displayAsOwn ? 'items-end' : 'items-start'}`}>
        
        {/* Nome exibido apenas no lado esquerdo (não-own visual) */}
        {!displayAsOwn && (
          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1 ml-2">
            {getSenderName(message.sender_id)}
          </span>
        )}

        <div className={`
          relative px-4 py-2.5 rounded-2xl shadow-sm border transition-all
          ${displayAsOwn 
            ? 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none' 
            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-none'}
          ${message.is_deleted ? 'opacity-50' : ''}
        `}>
          
          {message.reply_to_id && (
            <div className={`mb-2 p-2 rounded-lg border-l-2 text-[11px] ${displayAsOwn ? 'bg-black/10 border-white/30 text-indigo-100' : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500'}`}>
              <div className="flex items-center gap-1 font-bold mb-0.5 uppercase text-[8px] tracking-widest opacity-70">
                <CornerUpRight className="w-2.5 h-2.5" /> Respondendo à #{message.reply_to_id.split('-')[0]}
              </div>
            </div>
          )}

          {message.media_url && (
            <div className="mb-2 rounded-lg overflow-hidden border border-black/5">
              {message.type === 'image' ? (
                <img src={message.media_url} alt="Anexo" className="max-h-60 w-full object-cover" />
              ) : (
                <div className={`p-3 flex items-center gap-3 ${displayAsOwn ? 'bg-white/10' : 'bg-zinc-50 dark:bg-zinc-950/50'}`}>
                  <FileIcon className="w-4 h-4" />
                  <a href={message.media_url} target="_blank" rel="noreferrer" className="text-xs font-bold underline">Anexo</a>
                </div>
              )}
            </div>
          )}

          {message.text && (
            <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">
              {message.text}
            </p>
          )}

          {message.is_deleted && !message.text && (
            <div className="flex items-center gap-2 italic text-xs opacity-70">
              <Trash2 className="w-3 h-3" /> Mensagem apagada.
            </div>
          )}

          <div className={`flex items-center gap-1.5 mt-1.5 justify-end ${displayAsOwn ? 'text-indigo-100/70' : 'text-zinc-400 dark:text-zinc-500'}`}>
            {message.is_edited && <Edit3 className="w-2 h-2" />}
            <span className="text-[9px] font-bold uppercase">{formattedTime}</span>
            {displayAsOwn && getStatusIcon()}
          </div>
        </div>

        {renderReactions()}
      </div>
    </div>
  );
};

export default MessageItem;
