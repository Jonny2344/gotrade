const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: path.join(__dirname, 'uploads') });

const merchants = require('./merchants-config');
const productSeed = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));

let products = structuredClone(productSeed);
let merchantProducts = [];

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

function toMiles(value) {
  const match = String(value || '').match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 999;
}

function refreshMerchantProducts() {
  const refreshed = products.map(product => {
    const suppliers = product.suppliers.map(supplier => {
      const jitter = 0.92 + Math.random() * 0.16;
      const updatedPrice = Number((supplier.price * jitter).toFixed(2));
      return {
        ...supplier,
        price: updatedPrice,
        stock: Math.random() > 0.2 ? 'In Stock' : 'Low Stock'
      };
    });

    const sorted = [...suppliers].sort((a, b) => a.price - b.price);

    return {
      ...product,
      suppliers: sorted
    };
  });

  products = refreshed;
  merchantProducts = refreshed.flatMap(product => {
    return product.suppliers.map(supplier => ({
      id: `${product.id}-${supplier.name.toLowerCase().replace(/\s+/g, '-')}`,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      image: product.image,
      merchant: supplier.name,
      price: supplier.price,
      distance: supplier.distance,
      stock: supplier.stock,
      rating: supplier.rating,
      category: product.category
    }));
  });

  return merchantProducts.length;
}

function fuzzySearch(items, query) {
  const q = query.toLowerCase();
  return items.filter(item => {
    const haystack = `${item.name} ${item.brand} ${item.category || ''}`.toLowerCase();
    return haystack.includes(q);
  });
}

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/merchants', (req, res) => {
  res.json(merchants);
});

app.get('/api/merchant-products', (req, res) => {
  res.json(merchantProducts);
});

app.get('/api/search', (req, res) => {
  const query = String(req.query.q || '').trim();
  if (!query) {
    return res.json([]);
  }

  let results = fuzzySearch(products, query);

  results = results.map(product => {
    const suppliers = [...product.suppliers].sort((a, b) => a.price - b.price);
    return {
      ...product,
      suppliers
    };
  });

  if (req.query.lat && req.query.lng) {
    results = results.map(product => ({
      ...product,
      suppliers: product.suppliers.map(s => ({
        ...s,
        distance: `${Math.max(1, toMiles(s.distance) + Math.floor(Math.random() * 2) - 1)} miles`
      }))
    }));
  }

  res.json(results.slice(0, 60));
});

app.post('/api/refresh-merchants', (req, res) => {
  const count = refreshMerchantProducts();
  res.json({ success: true, count });
});

app.post('/api/scan', upload.single('photo'), (req, res) => {
  if (req.file && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }

  const randomProduct = products[Math.floor(Math.random() * products.length)];
  res.json(randomProduct);
});

refreshMerchantProducts();

app.listen(PORT, () => {
  console.log(`GoTrade reset server running on http://localhost:${PORT}`);
});
