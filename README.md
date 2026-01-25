# Supabase Message Viewer

[cite_start]Uma interface de visualização (read-only) otimizada para navegar e inspecionar mensagens de banco de dados entre usuários, com suporte nativo a mídias e reações[cite: 19].

## 🚀 Tecnologias e Performance
* [cite_start]**Framework:** React 19.2.3 (ESM)[cite: 13, 19].
* [cite_start]**Build Tool:** Vite 6.2.0 configurado para alta velocidade de carregamento[cite: 19, 29].
* [cite_start]**Estilização:** Tailwind CSS com suporte a Dark Mode e fontes Inter via Google Fonts[cite: 10, 13].
* [cite_start]**Backend:** Supabase JS v2.91.0 para integração de dados em tempo real[cite: 19, 21].
* [cite_start]**Ícones:** Lucide React para uma interface limpa e intuitiva[cite: 13, 19].

## ✨ Funcionalidades Implementadas
* [cite_start]**Suporte a Mídia:** Renderização de URLs de imagem e diferentes tipos de mensagens[cite: 24].
* [cite_start]**Engajamento:** Sistema de reações por mensagem e suporte a respostas (reply-to)[cite: 24, 25].
* [cite_start]**Estado da Mensagem:** Verificação de status de leitura (`read_at`), entrega (`delivered_at`) e edição/exclusão[cite: 25, 26].
* [cite_start]**Arquitetura de Tipos:** Tipagem rigorosa via TypeScript para Mensagens, Perfis e Sessões de Chat.

## 🛠️ Configuração Local
1.  **Instalar dependências:**
    ```bash
    npm install
    ``` 
2.  **Configurar ambiente:**
    Defina sua `GEMINI_API_KEY` no arquivo `.env.local`.
3.  **Executar projeto:**
    ```bash
    npm run dev
    ``` 

## 📦 Scripts Disponíveis
* [cite_start]`npm run dev`: Inicia o servidor de desenvolvimento na porta 3000[cite: 19, 29].
* [cite_start]`npm run build`: Gera o build otimizado para produção[cite: 19].
* [cite_start]`npm run preview`: Visualiza o build de produção localmente[cite: 19].

## 🏗️ Estrutura de Dados
[cite_start]O projeto utiliza um esquema modular de dados definido em `types.ts`[cite: 24]:
* [cite_start]**Message:** IDs, sender_id, text, media_url, type, created_at, read_at, reactions, is_edited, reply_to_id, is_deleted, delivered_at[cite: 24, 25, 26].
* [cite_start]**Profile:** Gerenciamento de username, avatar_url e full_name[cite: 27].
