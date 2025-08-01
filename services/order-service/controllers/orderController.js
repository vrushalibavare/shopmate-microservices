const Order = require('../models/order');
const axios = require('axios');

const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://localhost:3002';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';

exports.createOrder = async (req, res) => {
  try {
    const { userId, customer } = req.body;

    // Get cart items
    const cartResponse = await axios.get(`${CART_SERVICE_URL}/api/cart/${userId}`);
    const { items: cartItems, total } = cartResponse.data;

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Create order
    const orderData = {
      userId,
      customer,
      items: cartItems.map(item => ({
        product: {
          id: item.id,
          name: item.name,
          price: item.price
        },
        quantity: item.quantity,
        itemTotal: item.itemTotal
      })),
      total
    };

    const order = await Order.createOrder(orderData);

    // Clear cart after successful order
    await axios.delete(`${CART_SERVICE_URL}/api/cart/${userId}`);

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    if (error.response?.status === 400) {
      return res.status(400).json({ error: error.response.data.error });
    }
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.getOrdersByUserId(userId);
    res.json(orders);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};