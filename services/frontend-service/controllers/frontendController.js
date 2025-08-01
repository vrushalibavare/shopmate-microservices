const axios = require('axios');
const uuid = require('uuid');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:3002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3003';

const getUserId = (req) => {
  if (!req.session.userId) {
    req.session.userId = uuid.v4();
  }
  return req.session.userId;
};

exports.home = (req, res) => {
  const userId = getUserId(req);
  res.render('layout', { 
    content: 'home',
    cartCount: 0
  });
};

exports.products = async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products`);
    const products = response.data;
    
    res.render('layout', { 
      content: 'products',
      products,
      cartCount: 0
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.render('layout', { 
      content: 'products',
      products: [],
      cartCount: 0
    });
  }
};

exports.productDetails = async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${req.params.id}`);
    const product = response.data;
    
    res.render('layout', { 
      content: 'product-details',
      product,
      cartCount: 0
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(404).render('layout', { 
      content: 'error',
      message: 'Product not found',
      cartCount: 0
    });
  }
};

exports.cart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const response = await axios.get(`${CART_SERVICE_URL}/api/cart/${userId}`);
    const { items: cart, total } = response.data;
    
    res.render('layout', { 
      content: 'cart',
      cart,
      total,
      cartCount: cart.length
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.render('layout', { 
      content: 'cart',
      cart: [],
      total: 0,
      cartCount: 0
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    await axios.post(`${CART_SERVICE_URL}/api/cart/${userId}/items`, req.body);
    res.redirect('/cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.redirect('/products?error=Failed to add item to cart');
  }
};

exports.checkout = async (req, res) => {
  try {
    const userId = getUserId(req);
    const response = await axios.get(`${CART_SERVICE_URL}/api/cart/${userId}`);
    const { items } = response.data;
    
    if (items.length === 0) {
      return res.redirect('/cart');
    }
    
    res.render('layout', { 
      content: 'checkout',
      cartCount: items.length
    });
  } catch (error) {
    console.error('Error loading checkout:', error);
    res.redirect('/cart');
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const userId = getUserId(req);
    const orderData = {
      userId,
      customer: req.body
    };
    
    const response = await axios.post(`${ORDER_SERVICE_URL}/api/orders`, orderData);
    const order = response.data;
    
    res.redirect(`/orders/confirmation/${order.id}`);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).render('layout', {
      content: 'error',
      message: 'Failed to place order. Please try again.',
      cartCount: 0
    });
  }
};

exports.orderConfirmation = async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders/${req.params.id}`);
    const order = response.data;
    
    res.render('layout', { 
      content: 'order-confirmation',
      order,
      cartCount: 0
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(404).render('layout', { 
      content: 'error',
      message: 'Order not found',
      cartCount: 0
    });
  }
};

exports.orders = async (req, res) => {
  try {
    const userId = getUserId(req);
    const response = await axios.get(`${ORDER_SERVICE_URL}/api/orders/user/${userId}`);
    const orders = response.data;
    
    res.render('layout', { 
      content: 'orders',
      orders,
      cartCount: 0
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.render('layout', { 
      content: 'orders',
      orders: [],
      cartCount: 0
    });
  }
};