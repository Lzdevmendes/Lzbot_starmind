# 🧠 LzBot StarMind - Documentação Completa

## 📖 O que é este projeto?

O **LzBot StarMind** é um sistema web que extrai produtos do site diravena.com e permite análises inteligentes usando IA (OpenAI GPT ou Google Gemini). É como ter um assistente que busca produtos e te dá insights sobre eles!

### 🎯 Para que serve?
- **Extrair produtos** automaticamente do diravena.com
- **Analisar produtos** com inteligência artificial
- **Buscar e filtrar** produtos extraídos
- **Interface visual** moderna e fácil de usar

---

## 🏗️ Como o projeto está organizado?

```
📁 Lzbot_starmind/
├── 📄 server.js          # Servidor principal (coração do sistema)
├── 📄 scraper.js         # Web scraping (extração de produtos)
├── 📄 ai.js              # Análise com IA
├── 📄 products.js        # Gerenciamento de produtos
├── 📄 package.json       # Lista de dependências do Node.js
├── 📄 .env.example       # Exemplo de configuração
└── 📁 public/            # Frontend (interface visual)
    ├── 📄 index.html     # Página principal
    ├── 📄 style.css      # Estilos visuais
    └── 📄 script.js      # Lógica do frontend
```

---

## 🚀 Como instalar e usar?

### 1️⃣ Pré-requisitos
- **Node.js** instalado (versão 16 ou superior)
- **npm** (vem junto com o Node.js)
- Conexão com internet

### 2️⃣ Instalação

```bash
# 1. Navegue até a pasta do projeto
cd Lzbot_starmind

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente (opcional)
cp .env.example .env
# Edite o arquivo .env com suas chaves de API

# 4. Inicie o servidor
npm run dev
```

### 3️⃣ Acessar o sistema
Abra seu navegador e vá para: **http://localhost:3000**

---

## 🔧 Tecnologias utilizadas

### Backend (Servidor)
- **Node.js** - Plataforma JavaScript para servidor
- **Express.js** - Framework web rápido e minimalista
- **Axios** - Cliente HTTP para fazer requisições
- **Cheerio** - jQuery para servidor (parsing HTML)
- **Winston** - Sistema de logs profissional

### Frontend (Interface)
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilos visuais modernos
- **JavaScript (Vanilla)** - Lógica da interface
- **Font Awesome** - Ícones bonitos

### APIs de IA
- **OpenAI GPT** - Análise avançada de produtos
- **Google Gemini** - Alternativa de IA gratuita

---

## 🔌 Como funciona a API?

### Endpoints disponíveis:

#### 📦 Produtos
```http
GET /api/products
# Retorna lista de produtos extraídos
# Parâmetros opcionais: ?search=termo&limit=10

GET /api/products/:id
# Retorna produto específico

GET /api/products-stats
# Retorna estatísticas dos produtos
```

#### 🕷️ Web Scraping
```http
GET /api/scrape
# Extrai produtos do diravena.com
# Retorna: lista de produtos + timestamp
```

#### 🤖 Inteligência Artificial
```http
POST /api/analyze
# Analisa produto com IA
# Body: { "productData": {...}, "aiProvider": "gemini" }

GET /api/ai-status
# Verifica quais IAs estão configuradas
```

---

## 📋 Exemplos práticos

### Como extrair produtos?
1. Acesse http://localhost:3000
2. Clique em **"Extrair Produtos"**
3. Aguarde o sistema buscar dados do diravena.com
4. Produtos aparecerão na tela automaticamente

### Como analisar um produto?
1. Após extrair produtos, clique em **"Analisar com IA"** em qualquer produto
2. Configure uma chave de API no arquivo `.env`
3. O sistema mostrará análise detalhada do produto

### Como buscar produtos?
1. Use o campo de busca no topo da página
2. Digite palavras-chave (ex: "babydoll", "couro")
3. Clique na lupa ou pressione Enter

---

## ⚙️ Configuração das IAs

Para usar as análises de IA, crie um arquivo `.env` com suas chaves:

```bash
# Para usar OpenAI GPT
OPENAI_API_KEY=sua_chave_openai_aqui

# Para usar Google Gemini
GEMINI_API_KEY=sua_chave_gemini_aqui

# Porta do servidor (opcional)
PORT=3000
```

### 🔑 Como obter chaves de API?

**OpenAI:**
1. Vá para https://platform.openai.com
2. Crie uma conta
3. Acesse "API Keys"
4. Gere uma nova chave

**Google Gemini:**
1. Vá para https://makersuite.google.com
2. Crie uma conta Google
3. Gere uma API key gratuita

---

## 🛠️ Para desenvolvedores

### Estrutura do código explicada:

#### 📄 server.js (Servidor Principal)
```javascript
// Configura middlewares, rotas e inicia servidor
// É o "cérebro" que coordena tudo
```

#### 📁 routes/ (Rotas Organizadas)
```javascript
// scraper.js  - Extração de produtos
// ai.js       - Análise com IA  
// products.js - Gerenciamento de produtos
```

#### 📁 public/ (Frontend)
```javascript
// index.html - Estrutura visual
// style.css  - Aparência bonita
// script.js  - Interação e comunicação com API
```

### Como adicionar novas funcionalidades?

1. **Nova rota de API**: Crie arquivo em `routes/`
2. **Nova tela**: Modifique `public/index.html`
3. **Novo estilo**: Adicione em `public/style.css`
4. **Nova lógica**: Edite `public/script.js`

---

## 📊 Como o Web Scraping funciona?

### Estratégia inteligente:
1. **Primeiro**: Tenta usar API oficial do Shopify (`/products.json`)
2. **Fallback**: Se falhar, faz scraping HTML tradicional
3. **Dados extraídos**: Título, preço, imagem, descrição, link

### Exemplo de produto extraído:
```json
{
  "id": 8059914485935,
  "title": "Babydoll Americano Suedy Floral - Diravena", 
  "price": "R$ 79,90",
  "image": "https://cdn.shopify.com/...",
  "link": "https://diravena.com/products/...",
  "description": "PRODUTO COM ESTOQUE...",
  "vendor": "diRavena",
  "available": true,
  "extractedAt": "2025-08-13T01:16:10.048Z"
}
```

---

## 🐛 Problemas comuns e soluções

### ❌ Erro: "listen EADDRINUSE"
**Problema**: Porta 3000 já está em uso
**Solução**: 
```bash
npx kill-port 3000
npm run dev
```

### ❌ IAs não funcionam
**Problema**: Chaves de API não configuradas
**Solução**: Configure o arquivo `.env` com suas chaves

### ❌ Produtos não carregam
**Problema**: Site diravena.com pode estar fora do ar
**Solução**: Aguarde ou verifique conexão com internet

### ❌ Interface não carrega
**Problema**: Servidor não está rodando
**Solução**: Execute `npm run dev` e acesse http://localhost:3000

---

## 📈 Possíveis melhorias futuras

### Para um desenvolvedor júnior implementar:

1. **💾 Banco de dados real** (MongoDB, PostgreSQL)
2. **🔐 Sistema de login** e usuários
3. **📱 App mobile** (React Native)
4. **📊 Dashboard analytics** com gráficos
5. **🔔 Notificações** quando novos produtos chegarem
6. **🌐 Multi-sites** (não só diravena.com)
7. **📸 Análise de imagens** com IA
8. **💬 Chatbot** para perguntas sobre produtos

---

## 📞 Suporte e contato

- **Documentação técnica**: `CLAUDE.md`
- **Logs do sistema**: `app.log`
- **Problemas**: Verifique console do navegador (F12)

---

## 🎓 Conceitos que você vai aprender

Trabalhando neste projeto, você aprende:

- **Backend**: APIs REST, web scraping, middlewares
- **Frontend**: DOM, fetch API, async/await
- **Integração**: Comunicação frontend-backend
- **IA**: Integração com APIs de inteligência artificial
- **DevOps**: Logs, tratamento de erros, deploy

**Este projeto é perfeito para desenvolvedores júnior que querem praticar fullstack!** 🚀