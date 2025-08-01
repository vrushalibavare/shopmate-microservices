const { get, put, scan, ORDERS_TABLE } = require('../../../shared/utils/dynamodb');

class Order {
  static async createOrder(orderData) {
    try {
      const order = {
        id: Date.now(),
        ...orderData,
        createdAt: new Date().toISOString(),
        status: 'Confirmed'
      };
      return await put(ORDERS_TABLE, order);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async getOrderById(id) {
    try {
      return await get(ORDERS_TABLE, { id: parseInt(id) });
    } catch (error) {
      console.error('Error getting order by ID:', error);
      return null;
    }
  }

  static async getOrdersByUserId(userId) {
    try {
      const params = {
        TableName: ORDERS_TABLE,
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      };
      
      const orders = await scan(params);
      return orders || [];
    } catch (error) {
      console.error('Error getting orders by user ID:', error);
      return [];
    }
  }
}

module.exports = Order;