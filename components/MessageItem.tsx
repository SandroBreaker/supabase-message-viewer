
import React from 'react';
import { Message } from '../types';
import { Check, CheckCheck, FileIcon, CornerUpRight, Trash2, Edit3, User, AlertTriangle } from 'lucide-react';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  senderAlias: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwn, senderAlias }) => {
  const formattedTime = new Date(message.created_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const getStatusIcon = () => {
    if (message.read_at) return <CheckCheck className="w-3.5 h-3.5 text-indigo-200" />;
    if (message.delivered_at) return <CheckCheck className="w-3.5 h-3.5 text-white/50" />;
    return <Check className="w-3.5 h-3.5 text-white/50" />;
  };

  const renderReactions = () => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) return null;
    
    return (
      <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-start' : 'justify-end'}`}>
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

  // Perspectiva: Próprio (isOwn) na ESQUERDA, Outros na DIREITA
  return (
    <div className={`flex w-full ${isOwn ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
      <div className={`max-w-[80%] md:max-w-[65%] flex flex-col ${isOwn ? 'items-start' : 'items-end'}`}>
        
        {/* Identificação do Usuário (Apelido) */}
        {!isOwn && (
          <div className="flex items-center gap-1 text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 mr-2 text-right">
            {senderAlias}
            <User className="w-2.5 h-2.5" />
          </div>
        )}

        {/* Bolha de Mensagem */}
        <div className={`
          relative px-4 py-2.5 rounded-2xl shadow-sm border transition-all
          ${isOwn 
            ? 'bg-indigo-600 border-indigo-500 text-white rounded-tl-none' 
            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tr-none'}
          ${message.is_deleted ? 'border-red-500/50 bg-red-50/10 dark:bg-red-950/10' : ''}
        `}>
          
          {/* Indicador Vermelho de Deletado */}
          {message.is_deleted && (
            <div className="flex items-center gap-1 text-[8px] font-black text-red-500 uppercase tracking-widest mb-1.5 pb-1 border-b border-red-500/20">
              <AlertTriangle className="w-2.5 h-2.5" /> MENSAGEM DELETADA
            </div>
          )}

          {/* Contexto de Resposta */}
          {message.reply_to_id && (
            <div className={`mb-2 p-2 rounded-lg border-l-2 text-[11px] ${isOwn ? 'bg-black/10 border-white/30 text-indigo-100' : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500'}`}>
              <div className="flex items-center gap-1 font-bold mb-0.5 uppercase text-[8px] tracking-widest opacity-70">
                <CornerUpRight className="w-2.5 h-2.5" /> Resposta à #{message.reply_to_id.split('-')[0]}
              </div>
            </div>
          )}

          {/* Mídia */}
          {message.media_url && !message.is_deleted && (
            <div className="mb-2 rounded-lg overflow-hidden border border-black/5">
              {message.type === 'image' ? (
                <img src={message.media_url} alt="Anexo" className="max-h-60 w-full object-cover" />
              ) : (
                <div className={`p-3 flex items-center gap-3 ${isOwn ? 'bg-white/10' : 'bg-zinc-50 dark:bg-zinc-950/50'}`}>
                  <FileIcon className="w-4 h-4" />
                  <a href={message.media_url} target="_blank" rel="noreferrer" className="text-xs font-bold underline">Anexo</a>
                </div>
              )}
            </div>
          )}

          {/* Texto */}
          {message.text && (
            <p className={`text-[14px] leading-relaxed whitespace-pre-wrap break-words ${message.is_deleted ? 'opacity-60 italic' : ''}`}>
              {message.text}
            </p>
          )}

          {/* Mensagem Deletada Sem Texto */}
          {message.is_deleted && !message.text && (
            <div className="flex items-center gap-2 italic text-xs text-red-500/70 py-1">
              <Trash2 className="w-3 h-3" /> Conteúdo removido do servidor.
            </div>
          )}

          {/* Metadados (Hora e Status) */}
          <div className={`flex items-center gap-1.5 mt-1.5 ${isOwn ? 'justify-start text-indigo-100/70' : 'justify-end text-zinc-400 dark:text-zinc-500'}`}>
            {isOwn && getStatusIcon()}
            <span className="text-[9px] font-bold uppercase">{formattedTime}</span>
            {message.is_edited && <Edit3 className="w-2 h-2" />}
          </div>
        </div>

        {/* Reações */}
        {renderReactions()}
      </div>
    </div>
  );
};

export default MessageItem;
