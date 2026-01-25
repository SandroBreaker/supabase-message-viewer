# Supabase Message Viewer Pro

Interface robusta e performática para inspeção de mensagens em bancos de dados Supabase.

### **🚀 Tecnologias Principais**

* 
**Frontend:** React 19 (ESM) via Vite.


* 
**Estilização:** Tailwind CSS com suporte nativo a Dark Mode e fontes otimizadas (Inter).


* 
**Backend:** Supabase (PostgreSQL + Realtime).


* 
**Linguagem:** TypeScript para tipagem estritamente definida.


* 
**Ícones:** Lucide React.



### **✨ Funcionalidades**

* 
**Visualização de Mensagens:** Suporte para textos, mídias (URLs), estados de edição e exclusão.


* 
**Interatividade:** Renderização de reações por mensagem e suporte a respostas (reply-to).


* 
**Gestão de Perfis:** Exibição de avatares, nomes de exibição e nomes de usuário.


* 
**UX/CX:** Scrollbars personalizadas, tipografia suavizada e transições de cor otimizadas.



### **🛠 Configuração e Instalação**

1. **Pré-requisitos:** Node.js instalado.
2. **Instalação:** ```bash
npm install
```

```


3. **Variáveis de Ambiente:** Configure o arquivo `.env.local` com sua chave:
* 
`GEMINI_API_KEY`: Necessária para funcionalidades de IA integradas via Vite.




4. 
**Integração Supabase:** As chaves de conexão já estão pré-configuradas no módulo `supabase.ts`.



### **💻 Desenvolvimento**

* 
**Rodar localmente:** `npm run dev`.


* 
**Build de produção:** `npm run build`.


* 
**Estrutura de Código:** Organização modular com aliases de caminho (`@/*`) definidos no `tsconfig.json` e `vite.config.ts`.



### **📊 Tipagem de Dados (Schemas)**

O sistema utiliza interfaces rigorosas para garantir a integridade dos dados:

* 
**Message:** Gerencia IDs, remetentes, timestamps, mídias e metadados de reações.


* 
**Profile:** Define a estrutura de dados dos usuários (Username, Avatar, Full Name).


* 
**ChatSession:** Gerencia o vínculo entre pares de usuários.



---

*Gerado via Senior Engineer Bot - Foco em Performance e UX.*
