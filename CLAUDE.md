
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LzBot StarMind** é um sistema web completo para análise de produtos com IA e web scraping. O projeto extrai produtos do diravena.com e oferece análises inteligentes usando OpenAI GPT com fallback inteligente.

### Arquitetura Atual
- **Backend Node.js**: Express.js na raiz com APIs REST
- **Frontend**: HTML/CSS/JS vanilla na pasta `/public`
- **Web Scraper**: Extração via API Shopify (`/products.json`)
- **Integração IA**: OpenAI GPT com sistema de fallback inteligente

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

1. Crie arquivo `.env` na raiz do projeto
2. Configure a API OpenAI:
   ```
   OPENAI_API_KEY=sua_chave_openai_aqui
   PORT=3000
   ```
3. Sistema funciona mesmo sem API (usa fallback inteligente)

## API Endpoints Implementados

### Products
- `GET /api/products` - Lista produtos com filtros (search, limit)
- `GET /api/scrape` - Extrai produtos do diravena.com via Shopify API

### AI Analysis
- `POST /api/analyze` - Analisa produto com OpenAI (com fallback)
- `GET /api/ai-status` - Status da configuração OpenAI

## Estrutura Atual do Projeto

```
Lzbot_starmind/
├── server.js              # Servidor Express completo
├── package.json            # Dependências do projeto
├── .env                    # Configurações (não commitado)
├── CLAUDE.md              # Documentação técnica
├── README.md              # Documentação do usuário
└── public/
    ├── index.html         # Interface principal
    ├── style.css          # Tema azul StarMind
    └── script.js          # Lógica frontend
```

## Funcionalidades Implementadas

### Web Scraping
- Extração via API Shopify (`/products.json`)
- 30+ produtos do diravena.com
- Dados: ID, título, preço, imagem, descrição, disponibilidade

### Sistema de IA
- OpenAI GPT-3.5-turbo para análises
- Fallback inteligente quando quota excedida
- Análises profissionais simuladas
- Provider: 'sistema-inteligente' no fallback

### Interface
- Tema azul StarMind AI (#0c72ed)
- Design responsivo mobile-first
- Sistema de busca em tempo real
- Loading states otimizados
- Auto-refresh a cada 5 minutos

## Stack Tecnológica

### Backend
- **Express.js** - Framework web
- **Axios** - Cliente HTTP
- **Cheerio** - HTML parsing (não usado atualmente)
- **OpenAI SDK** - Integração IA
- **dotenv** - Variáveis de ambiente
- **CORS** - Configuração de CORS

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização com tema StarMind
- **JavaScript Vanilla** - Lógica
- **Font Awesome** - Ícones

### Ferramentas
- **Nodemon** - Auto-reload desenvolvimento
- **kill-port** - Gerenciamento de portas

## Configuração de Deploy

- **Variáveis**: Apenas OPENAI_API_KEY e PORT
- **CORS**: Configurado para cross-origin
- **Logs**: Console integrado
- **Erros**: Tratamento completo implementado
- **Plataformas**: Heroku, Vercel, Railway, DigitalOcean

## URL de Desenvolvimento

**http://localhost:3000** - Servidor local funcionando

Sistema completo e pronto para produção!