require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { rateLimit } = require('../../shared/middleware/rateLimiter');

const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.disable('x-powered-by');

// Rate limiting
const orderRateLimit = rateLimit(15 * 60 * 1000, 10);
app.use('/api/orders', orderRateLimit);

// Routes
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'order-service',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});