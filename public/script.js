let products = [];
let loading = false;

document.addEventListener('DOMContentLoaded', () => {
    checkAIStatus();
    loadProducts();
    
    document.getElementById('scrapeBtn').onclick = scrapeProducts;
    document.getElementById('refreshBtn').onclick = loadProducts;
    document.getElementById('searchBtn').onclick = searchProducts;
    document.getElementById('searchInput').onkeypress = (e) => {
        if (e.key === 'Enter') searchProducts();
    };
    document.querySelector('.modal-close').onclick = closeModal;
    document.getElementById('analysisModal').onclick = (e) => {
        if (e.target.id === 'analysisModal') closeModal();
    };
});

async function api(url, data = null) {
    const config = data ? {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    } : {};
    
    const response = await fetch('/api' + url, config);
    return response.json();
}

async function checkAIStatus() {
    const status = await api('/ai-status');
    const providers = [];
    
    if (status.data.openai.available) providers.push('OpenAI');
    if (status.data.gemini.available) providers.push('Gemini');
    
    document.getElementById('aiStatus').textContent = providers.length > 0 ? providers.join(', ') : 'Não configurado';
}

async function scrapeProducts() {
    if (loading) return;
    loading = true;
    
    showToast('Extraindo produtos...');
    const result = await api('/scrape');
    
    if (result.success) {
        products = result.data;
        renderProducts();
        updateStats(result);
        showToast(`${result.data.length} produtos extraídos!`, 'success');
    } else {
        showToast('Erro na extração', 'error');
    }
    
    loading = false;
}

async function loadProducts() {
    if (loading) return;
    loading = true;
    
    const result = await api('/products');
    if (result.success) {
        products = result.data;
        renderProducts();
        updateStats(result);
        showToast(`${result.data.length} produtos carregados`);
    } else {
        showToast('Erro ao carregar produtos', 'error');
    }
    
    loading = false;
}

async function searchProducts() {
    const search = document.getElementById('searchInput').value.trim();
    
    if (!search) {
        renderProducts();
        return;
    }
    
    loading = true;
    const result = await api(`/products?search=${search}`);
    if (result.success) {
        products = result.data;
        renderProducts();
        showToast(`${result.count} produtos encontrados`);
    }
    loading = false;
}

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

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>Nenhum produto encontrado</h3>
                <p>Clique em "Extrair Produtos" para começar</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(product => `
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

function updateStats(data = null) {
    if (data) {
        document.getElementById('totalProducts').textContent = data.totalProducts || 0;
        document.getElementById('lastScrape').textContent = data.lastScrape 
            ? new Date(data.lastScrape).toLocaleString('pt-BR')
            : 'Nunca';
    } else {
        document.getElementById('totalProducts').textContent = products.length;
    }
}

function setLoading(isLoading) {
    document.getElementById('loadingOverlay').style.display = isLoading ? 'flex' : 'none';
    
    document.getElementById('scrapeBtn').disabled = isLoading;
    document.getElementById('refreshBtn').disabled = isLoading;
    document.getElementById('searchBtn').disabled = isLoading;
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => toast.classList.remove('show'), 4000);
}

function openModal() {
    document.getElementById('analysisModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('analysisModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showAnalysisLoading() {
    document.getElementById('analysisContent').innerHTML = `
        <div class="analysis-loading">
            <div class="spinner-small"></div>
            <p>Analisando produto com IA...</p>
        </div>
    `;
}

function showAnalysisResult(analysis, product) {
    document.getElementById('analysisContent').innerHTML = `
        <div class="analysis-content">
            <h4><i class="fas fa-box"></i> Produto: ${product.title}</h4>
            ${product.price ? `<p><strong>Preço:</strong> ${product.price}</p>` : ''}
            
            <h4><i class="fas fa-brain"></i> Análise da IA:</h4>
            <div style="white-space: pre-wrap; line-height: 1.6;">${analysis}</div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 0.9rem; color: #6c757d;">
                <i class="fas fa-info-circle"></i> Análise gerada por IA. Use como referência complementar.
            </div>
        </div>
    `;
}

function showAnalysisError(error) {
    document.getElementById('analysisContent').innerHTML = `
        <div class="analysis-content">
            <div style="text-align: center; padding: 40px; color: #dc3545;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 15px;"></i>
                <h4>Erro na Análise</h4>
                <p>${error}</p>
                <button class="btn btn-secondary" onclick="closeModal()" style="margin-top: 15px;">
                    Fechar
                </button>
            </div>
        </div>
    `;
}


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});