# 🧠 LzBot StarMind - Sistema de Análise de Produtos com IA

## 📖 Visão Geral do Projeto

O **LzBot StarMind** é um sistema web completo que permite visualizar e analisar produtos do site diravena.com utilizando inteligência artificial. O sistema carrega automaticamente todos os produtos disponíveis na página inicial e oferece análises detalhadas através de APIs de IA (OpenAI GPT ou Google Gemini).

### 🎯 Funcionalidades Principais
- **Exibição automática** de todos os produtos na página inicial
- **Sistema de busca** inteligente e filtros
- **Análise com IA** detalhada de cada produto
- **Interface moderna** e responsiva
- **Estatísticas em tempo real** do sistema

---

## 🏗️ Arquitetura do Sistema

```
📁 LzBot StarMind/
├── 📄 server.js                    # Servidor principal (Backend completo)
├── 📄 package.json                 # Dependências e scripts
├── 📄 .env.example                 # Configurações de ambiente
├── 📄 .gitignore                   # Arquivos ignorados pelo Git
├── 📄 PROJETO_DOCUMENTACAO.md      # Documentação técnica completa
├── 📄 GUIA_DESENVOLVEDOR.md        # Guia para desenvolvedores
└── 📁 public/                      # Frontend (Interface do usuário)
    ├── 📄 index.html               # Página principal
    ├── 📄 style.css                # Estilos e design
    └── 📄 script.js                # Lógica da interface
```

---

## 🚀 Como Instalar e Executar

### 1️⃣ Pré-requisitos
- **Node.js** (versão 16 ou superior)
- **npm** (incluído com Node.js)
- Conexão com internet

### 2️⃣ Instalação Rápida

```bash
# 1. Navegue até a pasta do projeto
cd Lzbot_starmind

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente (opcional para IA)
cp .env.example .env
# Edite o arquivo .env com suas chaves de API se desejar usar IA

# 4. Inicie o servidor
npm run dev
```

### 3️⃣ Acesso ao Sistema
Abra seu navegador e acesse: **http://localhost:3000**

---

## 🔧 Tecnologias Utilizadas

### Backend (Servidor)
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **Axios** - Cliente HTTP para requisições
- **Cheerio** - Parser HTML para web scraping
- **CORS** - Controle de acesso entre domínios

### Frontend (Interface)
- **HTML5** - Estrutura semântica
- **CSS3** - Design moderno com gradientes
- **JavaScript Vanilla** - Lógica sem frameworks
- **Font Awesome** - Ícones profissionais

### API de Inteligência Artificial
- **OpenAI GPT** - Análise avançada de produtos

---

## 🔌 APIs Disponíveis

### 📦 Produtos
```http
GET /api/products
# Lista todos os produtos carregados
# Parâmetros: ?search=termo&limit=quantidade

GET /api/scrape  
# Recarrega produtos do diravena.com
# Atualiza a base de dados interna
```

### 🤖 Inteligência Artificial
```http
POST /api/analyze
# Analisa produto específico com IA
# Body: { "productData": {...}, "aiProvider": "openai" }

GET /api/ai-status
# Verifica status da configuração da IA
```

---

## 📋 Como Usar o Sistema

### 🏠 Página Inicial
1. Acesse **http://localhost:3000**
2. O sistema carrega automaticamente **todos os produtos** disponíveis
3. Visualize as estatísticas:
   - **Total de Produtos**: Quantidade de produtos carregados
   - **Última Atualização**: Data/hora da última sincronização

### 🔍 Buscar Produtos
1. Digite na **barra de busca** termos como:
   - "babydoll"
   - "couro"
   - "mocassim"
   - "diravena"
2. Pressione **Enter** ou clique na **lupa**
3. Produtos relacionados serão filtrados
4. Para voltar a ver todos os produtos, deixe a busca vazia

### 🧠 Analisar com IA
1. Em qualquer produto, clique em **"Analisar com IA"**
2. Configure suas chaves de API no arquivo `.env` (opcional)
3. Aguarde a análise detalhada do produto
4. A IA fornecerá insights sobre:
   - Análise de preço
   - Qualidade percebida
   - Público-alvo
   - Pontos fortes e fracos
   - Score geral

### 🔄 Atualizar Dados
- Clique em **"Atualizar Lista"** para recarregar produtos
- O sistema busca automaticamente os dados mais recentes do site

---

## ⚙️ Configuração de IA (Opcional)

Para utilizar as análises de IA, crie um arquivo `.env`:

```bash
# Para usar OpenAI GPT
OPENAI_API_KEY=sua_chave_openai_aqui

# Porta do servidor (opcional)
PORT=3000
```

### 🔑 Como Obter a Chave da OpenAI

**OpenAI (GPT):**
1. Acesse: https://platform.openai.com
2. Crie uma conta
3. Vá em "API Keys"
4. Gere uma nova chave
5. Configure no arquivo `.env`

---

## 🛠️ Para Desenvolvedores

### Estrutura de Funcionamento

#### 🖥️ Backend (server.js)
- **Express Server** configurado na porta 3000
- **Web Scraping** inteligente via API Shopify
- **Integração OpenAI** para análises com IA
- **CORS habilitado** para frontend
- **Logs detalhados** para debugging

#### 🎨 Frontend (public/)
- **Carregamento automático** de todos os produtos na inicialização
- **Interface responsiva** (mobile-first)
- **Sistema de busca** em tempo real
- **Modal para análises** de IA
- **Notificações toast** para feedback

### Comandos de Desenvolvimento

```bash
# Desenvolvimento com auto-reload
npm run dev

# Produção
npm start

# Resolver conflitos de porta
npx kill-port 3000
```

---

## 📊 Como Funciona o Web Scraping

### Estratégia Inteligente
1. **API Shopify**: Primeiro tenta `diravena.com/products.json`
2. **Dados Estruturados**: Extrai informações completas
3. **Fallback Robusto**: Sistema resiliente a mudanças

### Dados Extraídos
```json
{
  "id": 8059914485935,
  "title": "Babydoll Americano Suedy Floral - Diravena",
  "price": "R$ 79,90",
  "image": "https://cdn.shopify.com/...",
  "link": "https://diravena.com/products/...",
  "description": "Descrição completa do produto...",
  "vendor": "diRavena",
  "available": true,
  "extractedAt": "2025-08-13T02:30:15.123Z"
}
```

---

## 🐛 Soluções para Problemas Comuns

### ❌ "Port 3000 already in use"
```bash
npx kill-port 3000
npm run dev
```

### ❌ Produtos não aparecem
- Verifique se o site diravena.com está acessível
- Clique em "Atualizar Lista"
- Confira console do navegador (F12)

### ❌ Busca não funciona
- Digite termos específicos como "babydoll", "couro"
- Aguarde o carregamento completo do sistema
- Verifique se há produtos carregados no contador

### ❌ IA não responde
- Verifique se as chaves de API estão corretas no `.env`
- Reinicie o servidor após configurar as chaves
- O sistema possui análise simulada quando IA não está configurada

---

## 📈 Estatísticas do Sistema

O sistema exibe em tempo real:
- **Total de Produtos**: Quantidade de produtos disponíveis no sistema
- **Última Atualização**: Data/hora da última sincronização com diravena.com

---

## 🎯 Fluxo de Uso Recomendado

1. **Acesse** `http://localhost:3000`
2. **Visualize** todos os produtos carregados automaticamente
3. **Use a busca** para filtrar produtos específicos
4. **Analise produtos** com IA para insights detalhados
5. **Atualize** a lista quando quiser dados mais recentes

---

## 🎓 Conceitos Aprendidos

Trabalhando com este projeto, você pratica:

### Backend
- **APIs REST** com Express.js
- **Web Scraping** com Axios e Cheerio
- **Integração com APIs** externas
- **Tratamento de erros** robusto
- **Middleware** e CORS

### Frontend
- **DOM Manipulation** com JavaScript
- **Fetch API** e async/await
- **Event Handling** e UI/UX
- **CSS Grid** e Flexbox
- **Design responsivo**

### Integração
- **Comunicação Frontend-Backend**
- **APIs de Inteligência Artificial**
- **Gerenciamento de estado**
- **Loading states** e feedback visual

---

## 📞 Suporte Técnico

- **Documentação Técnica**: `PROJETO_DOCUMENTACAO.md`
- **Guia Detalhado**: `GUIA_DESENVOLVEDOR.md`
- **Logs do Sistema**: Console do servidor
- **Debug Frontend**: F12 > Console no navegador

---

## 🚀 Melhorias Futuras Sugeridas

1. **💾 Banco de dados** (MongoDB/PostgreSQL)
2. **🔐 Sistema de usuários** e autenticação
3. **📊 Dashboard** com analytics
4. **🔔 Notificações** push
5. **📱 Progressive Web App** (PWA)
6. **🌐 Multi-sites** de e-commerce
7. **📸 Análise de imagens** com IA
8. **💬 Chatbot** inteligente

---

**Sistema completo e funcional para análise inteligente de produtos com interface moderna e IA integrada!** 🎯