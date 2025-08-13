# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LzBot StarMind** é um sistema web completo para análise de produtos com IA e web scraping, desenvolvido com foco educacional para desenvolvedores júnior. O projeto extrai produtos do diravena.com e permite análises inteligentes usando OpenAI GPT ou Google Gemini.

### Arquitetura Simples
- **Backend Node.js**: Express.js na raiz com APIs REST bem documentadas
- **Frontend**: HTML/CSS/JS vanilla na pasta `/public` (sem frameworks complexos)
- **Web Scraper**: Extração inteligente usando API Shopify + fallback HTML
- **Integração IA**: Suporte duplo para OpenAI GPT e Google Gemini

## Development Commands

```bash
# Instalar dependências
npm install

# Desenvolvimento com auto-reload
npm run dev

# Produção
npm start

# Matar processo na porta 3000 (se necessário)
npx kill-port 3000
```

## Environment Setup

1. Copie `.env.example` para `.env` 
2. Configure pelo menos uma API de IA:
   ```
   OPENAI_API_KEY=sua_chave_openai
   GEMINI_API_KEY=sua_chave_gemini  
   PORT=3000
   ```
3. As IAs são opcionais - sistema funciona sem elas

## API Endpoints (Bem Documentados)

### Products
- `GET /api/products` - Lista produtos (suporte a search, limit, sortBy)
- `GET /api/products/:id` - Produto específico por ID
- `GET /api/products-stats` - Estatísticas detalhadas

### Scraping  
- `GET /api/scrape` - Extrai produtos do diravena.com (API Shopify + fallback)

### AI Analysis
- `POST /api/analyze` - Analisa produto com IA (body: productData, aiProvider)
- `GET /api/ai-status` - Status das APIs configuradas

## Code Structure (Educacional)

### Backend (Comentado para Júnior)
```
server.js          # Servidor principal com comentários explicativos
scraper.js         # Web scraping com estratégia dupla
ai.js              # Integração OpenAI/Gemini  
products.js        # CRUD de produtos
```

### Frontend (Vanilla JS)
```
public/
├── index.html     # Interface responsiva moderna
├── style.css      # Design com gradientes e animações
└── script.js      # Lógica bem estruturada e comentada
```

## Key Features

### Web Scraping Inteligente
- **Primeira tentativa**: API oficial Shopify (`/products.json`)
- **Fallback**: HTML scraping com seletores adaptativos
- **Dados ricos**: ID, preços, variantes, disponibilidade, imagens

### Sistema de IA Flexível  
- Suporte a múltiplos providers (OpenAI/Gemini)
- Análises detalhadas de produtos
- Fallback gracioso se APIs não configuradas

### Interface Moderna
- Design responsivo (mobile-first)
- Loading states e feedback visual
- Modal para análises
- Sistema de notificações toast
- Busca e filtros em tempo real

## Development Workflow

### Para Novos Desenvolvedores
1. **Leia**: `README.md` - Visão geral completa
2. **Estude**: `GUIA_DESENVOLVEDOR.md` - Tutorial passo-a-passo  
3. **Pratique**: Modifique cores, adicione campos, crie rotas
4. **Evolua**: Implemente banco de dados, testes, deploy

### Debugging
- **Logs**: Winston integrado (console + arquivo)
- **Frontend**: F12 > Console para debug JavaScript
- **Backend**: Terminal mostra todas as requisições
- **Network**: F12 > Network para investigar APIs

## Technologies (Modernas mas Simples)

- **Backend**: Express.js, Axios, Cheerio, Winston
- **Frontend**: Vanilla JS (sem frameworks), CSS Grid, Font Awesome
- **AI**: OpenAI SDK, Google Generative AI
- **Tools**: Nodemon, kill-port

## Important Notes for Development

- Código extensivamente comentado para aprendizado
- Tratamento de erros robusto em toda aplicação  
- Logs detalhados para debug fácil
- Estrutura modular para fácil extensão
- README e documentação completos
- Exemplos práticos de uso
- Exercícios sugeridos para evolução

## Deployment Ready

- Variáveis de ambiente configuradas
- Sistema de logs para produção
- Tratamento de erros adequado
- CORS configurado
- Pronto para Heroku, Vercel, Railway

O projeto serve como **excelente base educacional** para desenvolvedores júnior aprenderem fullstack com Node.js!