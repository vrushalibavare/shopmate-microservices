require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const frontendController = require('./controllers/frontendController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'shopmate-frontend-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', frontendController.home);
app.get('/products', frontendController.products);
app.get('/shop', frontendController.products);
app.get('/products/:id', frontendController.productDetails);
app.get('/cart', frontendController.cart);
app.post('/cart/add', frontendController.addToCart);
app.get('/checkout', frontendController.checkout);
app.post('/orders', frontendController.placeOrder);
app.get('/orders/confirmation/:id', frontendController.orderConfirmation);
app.get('/orders', frontendController.orders);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    service: 'frontend-service',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Frontend service running on port ${PORT}`);
});