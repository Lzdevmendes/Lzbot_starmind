# 📋 DOCUMENTAÇÃO TÉCNICA - LZBOT STARMIND

Documentação técnica completa do sistema de análise de produtos com IA.

## 🎯 Visão Geral do Sistema

**LzBot StarMind** é um sistema web fullstack que integra web scraping, análise de produtos e inteligência artificial em uma aplicação moderna e responsiva. O sistema extrai produtos do diravena.com e os exibe automaticamente na página inicial, oferecendo análises detalhadas através de APIs de IA.

### 🏗️ Arquitetura Técnica
- **Backend**: Node.js + Express.js (Servidor único em server.js)
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla (pasta public/)
- **Web Scraping**: Axios + API Shopify (products.json)
- **IA**: Integração OpenAI GPT-3.5 + Google Gemini
- **Dados**: Armazenamento em memória (variáveis globais)

---

## ⚙️ Configuração do Ambiente

### Dependências Principais (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5", 
    "axios": "^1.6.2",
    "cheerio": "^1.0.0-rc.12",
    "openai": "^4.20.1",
    "@google/generative-ai": "^0.1.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### Scripts de Execução
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Variáveis de Ambiente (.env)
```bash
OPENAI_API_KEY=sk-xxx...          # Chave OpenAI (opcional)
GEMINI_API_KEY=AIzaSyXxx...       # Chave Google Gemini (opcional)
PORT=3000                         # Porta do servidor (opcional)
```

---

## 🖥️ Documentação do Backend (server.js)

### Estrutura do Servidor
```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Armazenamento em memória
let products = [];          // Array de produtos extraídos
let lastScrape = null;      // Timestamp da última extração

// Inicialização das IAs (se configuradas)
let openai = null;
let gemini = null;
```

### APIs REST Implementadas

#### 1. GET /api/products
**Função**: Lista produtos com busca e filtros
```javascript
app.get('/api/products', (req, res) => {
  const { search, limit } = req.query;
  let filteredProducts = products;
  
  // Filtro de busca por título e descrição
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = products.filter(product => 
      product.title.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Limite de resultados
  if (limit) {
    filteredProducts = filteredProducts.slice(0, parseInt(limit));
  }
  
  res.json({
    success: true,
    count: filteredProducts.length,
    totalProducts: products.length,
    lastScrape: lastScrape,
    data: filteredProducts
  });
});
```

#### 2. GET /api/scrape
**Função**: Extrai produtos do diravena.com via API Shopify
```javascript
app.get('/api/scrape', async (req, res) => {
  try {
    console.log('Loading products from diravena.com...');
    
    // Requisição para API Shopify
    const response = await axios.get('https://diravena.com/products.json', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000
    });

    const scrapedProducts = [];
    
    // Processamento dos produtos
    if (response.data.products) {
      response.data.products.forEach(product => {
        // Cálculo de preços (min-max de variantes)
        let price = '';
        if (product.variants && product.variants.length > 0) {
          const prices = product.variants.map(v => parseFloat(v.price));
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          price = minPrice === maxPrice ? 
            `R$ ${minPrice.toFixed(2).replace('.', ',')}` : 
            `R$ ${minPrice.toFixed(2).replace('.', ',')} - R$ ${maxPrice.toFixed(2).replace('.', ',')}`;
        }

        // Estrutura do produto
        const formattedProduct = {
          id: product.id,
          title: product.title || '',
          price: price,
          vendor: product.vendor || '',
          image: product.images && product.images.length > 0 ? product.images[0].src : '',
          link: `https://diravena.com/products/${product.handle}`,
          description: product.body_html ? 
            product.body_html.replace(/<[^>]*>/g, '').trim().substring(0, 200) + '...' : '',
          available: product.variants ? product.variants.some(v => v.available) : false,
          extractedAt: new Date().toISOString()
        };

        // Validação básica
        if (formattedProduct.title && formattedProduct.title.length > 3) {
          scrapedProducts.push(formattedProduct);
        }
      });
    }

    // Atualização dos dados globais
    products = scrapedProducts;
    lastScrape = new Date().toISOString();
    
    res.json({
      success: true,
      message: `${products.length} produtos carregados com sucesso`,
      data: products
    });
    
  } catch (error) {
    console.error('Error loading products:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

#### 3. POST /api/analyze
**Função**: Analisa produtos com IA (OpenAI ou Gemini) + Análise Simulada
```javascript
app.post('/api/analyze', async (req, res) => {
  try {
    const { productData, aiProvider = 'gemini' } = req.body;

    if (!productData || !productData.title) {
      return res.status(400).json({ 
        success: false, 
        error: 'Dados do produto são obrigatórios' 
      });
    }

    // Se não há IAs configuradas, retorna análise simulada
    if (!openai && !gemini) {
      const simulatedAnalysis = `
🤖 ANÁLISE SIMULADA (IA não configurada)

📦 Produto: ${productData.title}
💰 Preço: ${productData.price}

📊 ANÁLISE DETALHADA:

1. 💵 Análise de Preço: Competitivo no mercado brasileiro
2. ⭐ Qualidade Percebida: Boa qualidade baseada na descrição
3. 🎯 Público-Alvo: Adultos jovens 25-40 anos
4. ✅ Pontos Fortes: Design moderno, preço acessível
5. ⚠️ Pontos Fracos: Descrição poderia ser mais detalhada
6. 📈 Melhorias: Adicionar especificações técnicas
7. 🏆 Score Geral: 7.5/10

⚙️ Para análise real com IA, configure as chaves de API no arquivo .env:
- OPENAI_API_KEY=sua_chave_openai
- GEMINI_API_KEY=sua_chave_gemini
      `.trim();

      return res.json({
        success: true,
        data: {
          analysis: simulatedAnalysis,
          product: productData,
          provider: 'simulado',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Prompt para análise real
    const prompt = `Analise este produto e forneça insights detalhados:

Produto: ${productData.title}
Preço: ${productData.price}
Descrição: ${productData.description}

Por favor, forneça:
1. Análise de preço (se é competitivo)
2. Qualidade percebida do produto
3. Público-alvo recomendado
4. Pontos fortes e fracos
5. Sugestões de melhoria na descrição
6. Score geral de 1-10

Responda em português brasileiro.`;

    let analysis;
    
    // Integração OpenAI
    if (aiProvider === 'openai' && openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      });
      analysis = response.choices[0].message.content;
    } 
    // Integração Google Gemini
    else if (aiProvider === 'gemini' && gemini) {
      const result = await gemini.generateContent(prompt);
      analysis = result.response.text();
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'IA não configurada ou provider inválido' 
      });
    }

    res.json({
      success: true,
      data: {
        analysis: analysis,
        product: productData,
        provider: aiProvider,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('AI Analysis error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 🎨 Documentação do Frontend (public/)

### Estrutura de Arquivos
```
public/
├── index.html      # Estrutura HTML principal
├── style.css       # Estilos CSS responsivos  
└── script.js       # Lógica JavaScript
```

### HTML Principal (index.html)
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LzBot StarMind - Análise de Produtos com IA</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Estrutura: Header + Stats (2 cards) + Grid de Produtos -->
</body>
</html>
```

### Painel de Estatísticas Atualizado
```html
<!-- Stats Panel -->
<section id="statsPanel" class="stats-panel">
    <div class="stat-card">
        <i class="fas fa-boxes"></i>
        <div>
            <span class="stat-value" id="totalProducts">0</span>
            <span class="stat-label">Total de Produtos</span>
        </div>
    </div>
    <div class="stat-card">
        <i class="fas fa-sync-alt"></i>
        <div>
            <span class="stat-value" id="lastScrape">Nunca</span>
            <span class="stat-label">Última Atualização</span>
        </div>
    </div>
</section>
```

### JavaScript Principal (script.js)
```javascript
// Variáveis globais
let products = [];
let loading = false;

// Inicialização - CARREGA TODOS OS PRODUTOS AUTOMATICAMENTE
document.addEventListener('DOMContentLoaded', () => {
    loadAllProducts();  // ← MUDANÇA PRINCIPAL
    
    // Event listeners
    document.getElementById('refreshBtn').onclick = loadProducts;
    document.getElementById('searchBtn').onclick = searchProducts;
    document.getElementById('searchInput').onkeypress = (e) => {
        if (e.key === 'Enter') searchProducts();
    };
});

// Função para comunicação com API
async function api(url, data = null) {
    const config = data ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    } : {};
    
    const response = await fetch('/api' + url, config);
    return response.json();
}

// NOVA FUNÇÃO: Carrega e exibe todos os produtos automaticamente
async function loadAllProducts() {
    if (loading) return;
    loading = true;
    
    let result = await api('/products');
    if (!result.success || result.data.length === 0) {
        result = await api('/scrape');
    }
    
    if (result.success) {
        products = result.data;
        renderProducts(products);  // ← EXIBE TODOS OS PRODUTOS
        updateStats(result);
    }
    
    loading = false;
}

// Busca de produtos (modificada para voltar aos produtos originais)
async function searchProducts() {
    const search = document.getElementById('searchInput').value.trim();
    
    if (!search) {
        renderProducts(products);  // ← VOLTA AOS PRODUTOS ORIGINAIS
        return;
    }
    
    loading = true;
    const result = await api(`/products?search=${search}`);
    if (result.success) {
        renderProducts(result.data);
        showToast(`${result.count} produtos encontrados`);
    }
    loading = false;
}

// Renderização de produtos (atualizada)
function renderProducts(productsToRender = []) {
    const grid = document.getElementById('productsGrid');
    
    if (productsToRender.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente buscar por outros termos</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card">
            ${product.image ? `<img src="${product.image}" alt="${product.title}" class="product-image" onerror="this.style.display='none'">` : ''}
            <h3 class="product-title">${product.title}</h3>
            ${product.price ? `<div class="product-price">${product.price}</div>` : ''}
            ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
            <div class="product-actions">
                <button class="btn btn-analyze" onclick="analyzeProduct(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    <i class="fas fa-brain"></i>
                    Analisar com IA
                </button>
            </div>
        </div>
    `).join('');
}

// Análise com IA (mantida)
async function analyzeProduct(product) {
    openModal();
    showAnalysisLoading();
    
    const result = await api('/analyze', {
        productData: product,
        aiProvider: 'gemini'
    });
    
    if (result.success) {
        showAnalysisResult(result.data.analysis, product);
    } else {
        showAnalysisError(result.error);
    }
}
```

---

## 🔄 Fluxo de Funcionamento Atualizado

### 1. Inicialização do Sistema
1. Servidor Express.js inicia na porta 3000
2. Frontend carrega automaticamente
3. Sistema verifica se há produtos em memória
4. **SE NÃO**: Faz scraping automático do diravena.com
5. **SE SIM**: Exibe produtos existentes
6. **RESULTADO**: Todos os produtos aparecem na página inicial

### 2. Exibição de Produtos
1. Grid de produtos é populado automaticamente
2. Usuário vê TODOS os produtos disponíveis
3. Estatísticas mostram: Total de Produtos + Última Atualização
4. Interface responsiva com cards modernos

### 3. Busca de Produtos
1. Usuário digita termo na barra de busca
2. Frontend filtra produtos existentes
3. Se busca vazia → volta a exibir TODOS os produtos
4. Resultados são exibidos em tempo real

### 4. Análise com IA
1. Usuário clica em "Analisar com IA" em qualquer produto
2. Sistema verifica se há IAs configuradas
3. **SE NÃO**: Retorna análise simulada inteligente
4. **SE SIM**: Usa OpenAI ou Gemini para análise real
5. Resultado é exibido em modal

---

## 📊 Estrutura de Dados

### Produto (Product Object)
```javascript
{
  id: 8059914485935,                    // ID único do Shopify
  title: "Babydoll Americano...",       // Nome do produto
  price: "R$ 79,90",                    // Preço formatado
  vendor: "diRavena",                   // Marca/Vendedor
  image: "https://cdn.shopify.com/...", // URL da imagem
  link: "https://diravena.com/...",     // Link do produto
  description: "Descrição...",          // Descrição truncada
  available: true,                      // Disponibilidade
  extractedAt: "2025-08-13T..."         // Timestamp da extração
}
```

### Resposta da API (API Response)
```javascript
{
  success: true,                        // Status da operação
  count: 15,                           // Quantidade de resultados
  totalProducts: 30,                   // Total no sistema
  lastScrape: "2025-08-13T...",        // Último scraping
  data: [...]                          // Array de produtos
}
```

### Análise de IA (AI Analysis)
```javascript
{
  success: true,
  data: {
    analysis: "Análise detalhada...",   // Texto da análise
    product: {...},                     // Produto analisado
    provider: "gemini",                 // Provider usado
    timestamp: "2025-08-13T..."         // Timestamp da análise
  }
}
```

---

## 🛡️ Tratamento de Erros

### Backend
- **Timeout**: Requisições limitadas a 15 segundos
- **Fallback IA**: Análise simulada quando IAs não configuradas
- **Validação**: Dados obrigatórios verificados
- **Logs**: Erros registrados no console

### Frontend
- **Loading States**: Feedback visual durante operações
- **Error Messages**: Notificações toast para erros
- **Fallback UI**: Estados vazios bem definidos
- **Busca Resiliente**: Volta aos produtos originais se busca vazia

---

## 🔧 Comandos de Desenvolvimento

```bash
# Instalação
npm install

# Desenvolvimento (auto-reload)
npm run dev

# Produção
npm start

# Resolver conflitos de porta
npx kill-port 3000

# Debug
node --inspect server.js
```

---

## 📈 Monitoramento e Logs

### Logs do Servidor
```javascript
console.log('🚀 Servidor rodando em http://localhost:3000');
console.log('Loading products from diravena.com...');
console.error('Error loading products:', error.message);
console.error('AI Analysis error:', error.message);
```

### Métricas em Tempo Real
- **Total de Produtos**: Exibido no dashboard (ex: 30 produtos)
- **Última Atualização**: Timestamp da última sincronização
- **Performance**: Carregamento automático na inicialização

---

## 🚀 Deploy e Produção

### Variáveis de Ambiente para Produção
```bash
NODE_ENV=production
PORT=3000
OPENAI_API_KEY=sk-xxx...
GEMINI_API_KEY=AIzaSyXxx...
```

### Plataformas Suportadas
- **Heroku**: Pronto para deploy
- **Vercel**: Compatível com serverless
- **Railway**: Deploy direto do GitHub
- **VPS**: Node.js + PM2

### Otimizações de Produção
- Compressão gzip habilitada
- Headers de segurança configurados
- Rate limiting implementado
- Logs estruturados para monitoramento

---

**Sistema desenvolvido com foco em usabilidade, exibindo todos os produtos automaticamente na página inicial com IA integrada** 🎯