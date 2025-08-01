const { get, put, CARTS_TABLE } = require('../../../shared/utils/dynamodb');

class Cart {
  static async getCart(userId) {
    try {
      const result = await get(CARTS_TABLE, { userId });
      return result ? result.items || [] : [];
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  }

  static async saveCart(userId, items) {
    try {
      await put(CARTS_TABLE, {
        userId,
        items,
        updatedAt: new Date().toISOString()
      });
      return items;
    } catch (error) {
      console.error('Error saving cart:', error);
      throw error;
    }
  }

  static async addItem(userId, productId, quantity) {
    try {
      const cartItems = await this.getCart(userId);
      
      if (cartItems.length >= 50) {
        throw new Error('Cart is full (maximum 50 items)');
      }

      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({ productId, quantity });
      }
      
      return await this.saveCart(userId, cartItems);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }

  static async updateItem(userId, productId, quantity) {
    try {
      let cartItems = await this.getCart(userId);
      
      if (quantity <= 0) {
        cartItems = cartItems.filter(item => item.productId !== productId);
      } else {
        const itemIndex = cartItems.findIndex(item => item.productId === productId);
        if (itemIndex >= 0) {
          cartItems[itemIndex].quantity = quantity;
        }
      }
      
      return await this.saveCart(userId, cartItems);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  static async removeItem(userId, productId) {
    try {
      const cartItems = await this.getCart(userId);
      const updatedItems = cartItems.filter(item => item.productId !== productId);
      return await this.saveCart(userId, updatedItems);
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  }

  static async clearCart(userId) {
    try {
      return await this.saveCart(userId, []);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}

module.exports = Cart;