const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

let products = [];
let lastScrape = null;

let openai = null;
let gemini = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  gemini = genAI.getGenerativeModel({ model: "gemini-pro" });
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/scrape', async (req, res) => {
  try {
    console.log('Loading products from diravena.com...');
    
    const response = await axios.get('https://diravena.com/products.json', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000
    });

    const scrapedProducts = [];
    
    if (response.data.products) {
      response.data.products.forEach(product => {
        let price = '';
        if (product.variants && product.variants.length > 0) {
          const prices = product.variants.map(v => parseFloat(v.price));
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          price = minPrice === maxPrice ? `R$ ${minPrice.toFixed(2).replace('.', ',')}` : 
                  `R$ ${minPrice.toFixed(2).replace('.', ',')} - R$ ${maxPrice.toFixed(2).replace('.', ',')}`;
        }

        const formattedProduct = {
          id: product.id,
          title: product.title || '',
          price: price,
          vendor: product.vendor || '',
          image: product.images && product.images.length > 0 ? product.images[0].src : '',
          link: `https://diravena.com/products/${product.handle}`,
          description: product.body_html ? product.body_html.replace(/<[^>]*>/g, '').trim().substring(0, 200) + '...' : '',
          available: product.variants ? product.variants.some(v => v.available) : false,
          extractedAt: new Date().toISOString()
        };

        if (formattedProduct.title && formattedProduct.title.length > 3) {
          scrapedProducts.push(formattedProduct);
        }
      });
    }

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

app.get('/api/products', (req, res) => {
  const { search, limit } = req.query;
  let filteredProducts = products;
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = products.filter(product => 
      product.title.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    );
  }
  
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

app.get('/api/ai-status', (req, res) => {
  res.json({
    success: true,
    data: {
      openai: {
        available: !!openai,
        configured: !!process.env.OPENAI_API_KEY,
        status: openai ? 'Ativo' : 'Não configurado'
      },
      gemini: {
        available: !!gemini,
        configured: !!process.env.GEMINI_API_KEY,
        status: gemini ? 'Ativo' : 'Não configurado'
      }
    }
  });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { productData, aiProvider = 'gemini' } = req.body;

    if (!productData || !productData.title) {
      return res.status(400).json({ success: false, error: 'Dados do produto são obrigatórios' });
    }

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
    
    if (aiProvider === 'openai' && openai) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      });
      analysis = response.choices[0].message.content;
    } else if (aiProvider === 'gemini' && gemini) {
      const result = await gemini.generateContent(prompt);
      analysis = result.response.text();
    } else {
      return res.status(400).json({ success: false, error: 'IA não configurada ou provider inválido' });
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

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});