require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { rateLimit } = require('../../shared/middleware/rateLimiter');

const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.disable('x-powered-by');

// Rate limiting
const generalRateLimit = rateLimit(15 * 60 * 1000, 100);
app.use(generalRateLimit);

// Routes
app.use('/api/cart', cartRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'cart-service',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Cart service running on port ${PORT}`);
});