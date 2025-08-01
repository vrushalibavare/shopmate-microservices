const Cart = require('../models/cart');
const axios = require('axios');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';

exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await Cart.getCart(userId);
    
    // Get product details for each cart item
    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${item.productId}`);
          return {
            ...response.data,
            quantity: item.quantity,
            itemTotal: response.data.price * item.quantity
          };
        } catch (error) {
          console.error(`Error fetching product ${item.productId}:`, error.message);
          return null;
        }
      })
    );

    const validItems = cartWithProducts.filter(item => item !== null);
    const total = validItems.reduce((sum, item) => sum + item.itemTotal, 0);

    res.json({ items: validItems, total, count: validItems.length });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0 || quantity > 99) {
      return res.status(400).json({ error: 'Invalid product ID or quantity' });
    }

    // Verify product exists and has stock
    const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${productId}`);
    const product = productResponse.data;

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update product stock
    await axios.put(`${PRODUCT_SERVICE_URL}/api/products/${productId}`, {
      stock: product.stock - quantity
    });

    // Add to cart
    const cartItems = await Cart.addItem(userId, parseInt(productId), quantity);
    res.json({ message: 'Item added to cart', items: cartItems });
  } catch (error) {
    console.error('Error adding to cart:', error);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    const cartItems = await Cart.updateItem(userId, parseInt(productId), quantity);
    res.json({ message: 'Cart updated', items: cartItems });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cartItems = await Cart.removeItem(userId, parseInt(productId));
    res.json({ message: 'Item removed from cart', items: cartItems });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.clearCart(userId);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};