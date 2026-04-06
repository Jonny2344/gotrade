const axios = require('axios');
const cheerio = require('cheerio');

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const parserConfig = {
  screwfix: {
    item: '.product-list-item, .productCard',
    title: '.product-title, .product-list-item__title, .productCard-info .productCardName',
    price: '.product-pricing__price, .productPrice, .price, .productCardPrice',
    stock: '.product-availability, .availability, .stock, .productCardStock, .product-list-item__availability'
  },
  toolstation: {
    item: '.product, .product-list, .item, .grid-item',
    title: '.product-title, .product__title, .name, .item-name',
    price: '.price, .product__price, .pricing, .priceBox',
    stock: '.availability, .in-stock, .stock, .product__availability'
  },
  wickes: {
    item: '.product-tile, .searchResultItem, .product-list-item',
    title: '.product-name, .searchItemTitle, .name',
    price: '.price, .priceLabel, .product-price',
    stock: '.stock-status, .availability, .buttonBlock, .productAvailability'
  },
  jewson: {
    item: '.product-item, .product-list-item, .item',
    title: '.productTitle, .name, .title',
    price: '.price, .product-price, .itemPrice',
    stock: '.availability, .stock, .stock-status'
  },
  travisperkins: {
    item: '.product-item, .productListing, .product-list-item',
    title: '.productTitle, .name, .title, .item-title',
    price: '.price, .product-price, .itemPrice',
    stock: '.availability, .stock, .stock-status'
  },
  generic: {
    item: 'article, .product, .product-card, .product-item, .search-result, .product-list-item',
    title: 'h1, h2, h3, .product-title, .name, .title',
    price: '.price, .product-price, .price-label',
    stock: '.availability, .stock, .stock-status'
  }
};

const fetchSearchHtml = async (url) => {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': userAgent,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    },
    timeout: 20000
  });
  return response.data;
};

const parsePrice = (text) => {
  if (!text) return null;
  const match = text.replace(/,/g, '').match(/\d+\.?\d*/);
  return match ? parseFloat(match[0]) : null;
};

const parseStockText = (text) => {
  if (!text) return 'Unknown';
  const normalized = text.toLowerCase();
  if (normalized.includes('out of stock') || normalized.includes('out-of-stock')) return 'Out of Stock';
  if (normalized.includes('low stock') || normalized.includes('low-stock') || normalized.includes('limited')) return 'Low Stock';
  if (normalized.includes('in stock') || normalized.includes('available') || normalized.includes('available now')) return 'In Stock';
  return text.trim();
};

const normalizeText = (value) => value ? value.trim().replace(/\s+/g, ' ') : '';

const extractItems = ($, config) => {
  const results = [];
  const items = $(config.item).slice(0, 8);
  items.each((index, element) => {
    const item = $(element);
    let title = normalizeText(item.find(config.title).first().text());
    if (!title) {
      title = normalizeText(item.find('a').first().text());
    }
    let priceText = normalizeText(item.find(config.price).first().text());
    const price = parsePrice(priceText);
    let stockText = normalizeText(item.find(config.stock).first().text());
    const stock = stockText ? parseStockText(stockText) : 'Unknown';
    if (title && price != null) {
      results.push({ title, price, stock });
    }
  });
  return results;
};

const parseMerchantSearch = (merchant, html) => {
  const $ = cheerio.load(html);
  const parserKey = merchant.parser || 'generic';
  const config = parserConfig[parserKey] || parserConfig.generic;
  const items = extractItems($, config);
  if (items.length > 0) return items;

  // Generic fallback: try a broad query if no structured selectors matched
  return extractItems($, parserConfig.generic);
};

const fetchMerchantProductOffers = async (merchant, query) => {
  if (!merchant.searchUrlTemplate) {
    return [];
  }

  const searchUrl = merchant.searchUrlTemplate.replace('{query}', encodeURIComponent(query));
  try {
    const html = await fetchSearchHtml(searchUrl);
    const items = parseMerchantSearch(merchant, html);
    return items.map(item => ({
      merchant: merchant.name,
      merchantUrl: merchant.url,
      title: item.title,
      price: item.price,
      stock: item.stock,
      rating: null,
      lastUpdated: new Date().toISOString()
    }));
  } catch (error) {
    console.error(`Failed to scrape ${merchant.name}:`, error.message);
    return [];
  }
};

module.exports = {
  fetchMerchantProductOffers
};
