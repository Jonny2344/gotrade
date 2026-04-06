const state = {
  productsCount: 0,
  merchantsCount: 0,
  results: [],
  activeFilter: 'best',
  shortlist: JSON.parse(localStorage.getItem('goTradeShortlist') || '[]')
};

const elements = {
  searchInput: document.getElementById('search-input'),
  searchBtn: document.getElementById('search-btn'),
  voiceBtn: document.getElementById('voice-btn'),
  photoInput: document.getElementById('photo-input'),
  scanBtn: document.getElementById('scan-btn'),
  scanResult: document.getElementById('scan-result'),
  refreshBtn: document.getElementById('refresh-merchants-btn'),
  chips: document.querySelectorAll('.chip'),
  resultSummary: document.getElementById('result-summary'),
  resultsList: document.getElementById('results-list'),
  savedList: document.getElementById('saved-list'),
  clearShortlist: document.getElementById('clear-shortlist'),
  statProducts: document.getElementById('stat-products'),
  statMerchants: document.getElementById('stat-merchants'),
  statSync: document.getElementById('stat-sync')
};

function init() {
  wireEvents();
  loadDashboardStats();
  renderShortlist();
}

function wireEvents() {
  elements.searchBtn.addEventListener('click', runSearch);
  elements.searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      runSearch();
    }
  });

  elements.scanBtn.addEventListener('click', runImageScan);
  elements.voiceBtn.addEventListener('click', runVoiceInput);
  elements.refreshBtn.addEventListener('click', refreshMerchants);
  elements.clearShortlist.addEventListener('click', clearShortlist);

  elements.chips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.chips.forEach(btn => btn.classList.remove('active'));
      chip.classList.add('active');
      state.activeFilter = chip.dataset.filter;
      renderResults(state.results);
    });
  });
}

async function loadDashboardStats() {
  try {
    const [productsRes, merchantsRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/merchants')
    ]);

    if (productsRes.ok) {
      const products = await productsRes.json();
      state.productsCount = products.length;
      elements.statProducts.textContent = products.length;
    }

    if (merchantsRes.ok) {
      const merchants = await merchantsRes.json();
      state.merchantsCount = merchants.length;
      elements.statMerchants.textContent = merchants.length;
    }
  } catch (error) {
    elements.statProducts.textContent = '--';
    elements.statMerchants.textContent = '--';
    console.error('Failed to load dashboard stats:', error);
  }
}

async function runSearch() {
  const query = elements.searchInput.value.trim();
  if (!query) {
    elements.resultSummary.textContent = 'Enter a product name to start searching.';
    return;
  }

  elements.searchBtn.textContent = 'Searching...';
  elements.searchBtn.disabled = true;

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Search request failed');
    }

    state.results = await response.json();
    renderResults(state.results);
  } catch (error) {
    console.error(error);
    state.results = [];
    elements.resultSummary.textContent = 'Search failed. Please try again.';
    elements.resultsList.innerHTML = '<div class="empty">Could not load search results.</div>';
  } finally {
    elements.searchBtn.textContent = 'Find Deals';
    elements.searchBtn.disabled = false;
  }
}

async function runImageScan() {
  const file = elements.photoInput.files[0];
  if (!file) {
    elements.scanResult.textContent = 'Choose an image first, then run Identify Item.';
    return;
  }

  elements.scanBtn.textContent = 'Identifying...';
  elements.scanBtn.disabled = true;

  try {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch('/api/scan', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Scan failed');
    }

    const detected = await response.json();
    elements.scanResult.textContent = `Detected: ${detected.name} (${detected.brand})`;
    elements.searchInput.value = detected.name;
    runSearch();
  } catch (error) {
    console.error(error);
    elements.scanResult.textContent = 'Scan failed. Try another image or search by text.';
  } finally {
    elements.scanBtn.textContent = 'Identify Item';
    elements.scanBtn.disabled = false;
  }
}

function runVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    elements.resultSummary.textContent = 'Voice search is not supported in this browser.';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-GB';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  elements.voiceBtn.textContent = 'Listening...';

  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    elements.searchInput.value = transcript;
    elements.resultSummary.textContent = `Voice input captured: "${transcript}"`;
    runSearch();
  };

  recognition.onerror = () => {
    elements.resultSummary.textContent = 'Voice capture failed. Please type your search.';
    elements.voiceBtn.textContent = 'Voice';
  };

  recognition.onend = () => {
    elements.voiceBtn.textContent = 'Voice';
  };

  recognition.start();
}

async function refreshMerchants() {
  elements.refreshBtn.textContent = 'Refreshing...';
  elements.refreshBtn.disabled = true;

  try {
    const response = await fetch('/api/refresh-merchants', { method: 'POST' });
    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    elements.statSync.textContent = `${new Date().toLocaleTimeString()} • ${data.count} offers`;
    elements.resultSummary.textContent = 'Merchant data refreshed. Run search again for updated offers.';
  } catch (error) {
    console.error(error);
    elements.resultSummary.textContent = 'Could not refresh merchant data.';
  } finally {
    elements.refreshBtn.textContent = 'Refresh Merchant Data';
    elements.refreshBtn.disabled = false;
  }
}

function renderResults(results) {
  if (!Array.isArray(results) || results.length === 0) {
    elements.resultSummary.textContent = 'No matching products found.';
    elements.resultsList.innerHTML = '<div class="empty">No results yet. Try a broader product term.</div>';
    return;
  }

  const filtered = results.map(product => {
    const suppliers = Array.isArray(product.suppliers) ? [...product.suppliers] : [];
    return {
      ...product,
      suppliers: applySupplierFilter(suppliers, state.activeFilter)
    };
  }).filter(product => product.suppliers.length > 0);

  if (filtered.length === 0) {
    elements.resultSummary.textContent = 'No suppliers match the selected filter.';
    elements.resultsList.innerHTML = '<div class="empty">Try switching to another filter chip.</div>';
    return;
  }

  elements.resultSummary.textContent = `${filtered.length} products found with active filter: ${chipLabel(state.activeFilter)}.`;

  elements.resultsList.innerHTML = filtered.map(product => {
    const bestPrice = Math.min(...product.suppliers.map(s => Number(s.price) || Number.MAX_SAFE_INTEGER));
    const supplierRows = product.suppliers.slice(0, 4).map(supplier => {
      const stockClass = supplier.stock && supplier.stock.toLowerCase().includes('in stock') ? 'stock-ok' : 'stock-low';
      return `
        <div class="supplier-row">
          <div><strong>${escapeHtml(supplier.name)}</strong></div>
          <div>£${formatPrice(supplier.price)}</div>
          <div>${escapeHtml(String(supplier.distance || '-'))}</div>
          <div class="${stockClass}">${escapeHtml(String(supplier.stock || 'Unknown'))}</div>
          <button class="btn tiny" data-save-name="${escapeHtml(product.name)}" data-save-supplier="${escapeHtml(supplier.name)}" data-save-price="${formatPrice(supplier.price)}">Save</button>
        </div>
      `;
    }).join('');

    return `
      <article class="result-card">
        <div class="result-top">
          <img src="${escapeHtml(product.image || '')}" alt="${escapeHtml(product.name)}">
          <div class="result-meta">
            <h4>${escapeHtml(product.name)}</h4>
            <p class="brand-line">Brand: ${escapeHtml(product.brand || 'Unknown')}</p>
          </div>
          <p class="price-pill">Best £${formatPrice(bestPrice)}</p>
        </div>
        ${supplierRows}
      </article>
    `;
  }).join('');

  elements.resultsList.querySelectorAll('[data-save-name]').forEach(button => {
    button.addEventListener('click', () => {
      const item = {
        name: button.dataset.saveName,
        supplier: button.dataset.saveSupplier,
        price: button.dataset.savePrice
      };
      saveShortlistItem(item);
    });
  });
}

function applySupplierFilter(suppliers, filter) {
  const parsed = suppliers.map(item => ({
    ...item,
    numericPrice: Number(item.price) || Number.MAX_SAFE_INTEGER,
    numericDistance: parseDistance(item.distance),
    numericRating: Number(item.rating) || 0
  }));

  if (filter === 'in-stock' || filter === 'emergency') {
    const onlyStock = parsed.filter(item => String(item.stock || '').toLowerCase().includes('in stock'));
    if (filter === 'emergency') {
      return onlyStock.sort((a, b) => (a.numericDistance - b.numericDistance) || (a.numericPrice - b.numericPrice));
    }
    return onlyStock.sort((a, b) => a.numericPrice - b.numericPrice);
  }

  if (filter === 'cheapest') {
    return parsed.sort((a, b) => a.numericPrice - b.numericPrice);
  }

  if (filter === 'closest') {
    return parsed.sort((a, b) => a.numericDistance - b.numericDistance);
  }

  if (filter === 'rated') {
    return parsed.sort((a, b) => b.numericRating - a.numericRating);
  }

  return parsed.sort((a, b) => a.numericPrice - b.numericPrice);
}

function parseDistance(distanceValue) {
  if (typeof distanceValue === 'number') {
    return distanceValue;
  }

  const match = String(distanceValue || '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

function chipLabel(value) {
  const labels = {
    best: 'Best Match',
    cheapest: 'Cheapest',
    closest: 'Closest',
    rated: 'Top Rated',
    'in-stock': 'In Stock',
    emergency: 'Emergency Mode'
  };
  return labels[value] || 'Best Match';
}

function saveShortlistItem(item) {
  const alreadySaved = state.shortlist.some(saved => saved.name === item.name && saved.supplier === item.supplier);
  if (alreadySaved) {
    elements.resultSummary.textContent = `${item.name} from ${item.supplier} is already in shortlist.`;
    return;
  }

  state.shortlist.push(item);
  localStorage.setItem('goTradeShortlist', JSON.stringify(state.shortlist));
  renderShortlist();
  elements.resultSummary.textContent = `${item.name} saved to shortlist.`;
}

function clearShortlist() {
  state.shortlist = [];
  localStorage.removeItem('goTradeShortlist');
  renderShortlist();
}

function renderShortlist() {
  if (state.shortlist.length === 0) {
    elements.savedList.innerHTML = '<div class="empty">No saved products yet.</div>';
    return;
  }

  elements.savedList.innerHTML = state.shortlist.map((item, index) => `
    <article class="saved-item">
      <div>
        <p><strong>${escapeHtml(item.name)}</strong></p>
        <small>${escapeHtml(item.supplier)} • £${escapeHtml(String(item.price))}</small>
      </div>
      <button class="btn tiny" data-remove-index="${index}">Remove</button>
    </article>
  `).join('');

  elements.savedList.querySelectorAll('[data-remove-index]').forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.removeIndex);
      state.shortlist.splice(index, 1);
      localStorage.setItem('goTradeShortlist', JSON.stringify(state.shortlist));
      renderShortlist();
    });
  });
}

function formatPrice(value) {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return '--';
  }
  return num.toFixed(2);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

init();
