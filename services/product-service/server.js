require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { rateLimit } = require('../../shared/middleware/rateLimiter');

const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.disable('x-powered-by');

// Rate limiting
const generalRateLimit = rateLimit(15 * 60 * 1000, 100);
app.use(generalRateLimit);

// Routes
app.use('/api/products', productRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'product-service',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, async () => {
  console.log(`Product service running on port ${PORT}`);
  
  // Initialize products on startup
  const Product = require('./models/product');
  await Product.initializeProducts();
});