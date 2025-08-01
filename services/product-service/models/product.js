const { get, put, scan, update, PRODUCTS_TABLE } = require('../../../shared/utils/dynamodb');

class Product {
  static async initializeProducts() {
    try {
      const existingProducts = await scan({ TableName: PRODUCTS_TABLE });
      if (existingProducts && existingProducts.length > 0) {
        return; // Products already exist
      }

      // Seed initial products
      const sampleProducts = [
        { id: 1, name: 'Laptop', price: 999.99, description: 'High-performance laptop', image: '/images/laptop.jpg', stock: 10 },
        { id: 2, name: 'Smartphone', price: 699.99, description: 'Latest smartphone', image: '/images/smartphone.jpg', stock: 15 },
        { id: 3, name: 'Headphones', price: 199.99, description: 'Wireless headphones', image: '/images/headphones.jpg', stock: 20 },
        { id: 4, name: 'Tablet', price: 399.99, description: 'Portable tablet', image: '/images/tablet.jpg', stock: 12 },
        { id: 5, name: 'Smartwatch', price: 299.99, description: 'Fitness smartwatch', image: '/images/smartwatch.jpg', stock: 8 }
      ];

      for (const product of sampleProducts) {
        await put(PRODUCTS_TABLE, { ...product, createdAt: new Date().toISOString() });
      }
      console.log('Sample products initialized');
    } catch (error) {
      console.error('Error initializing products:', error);
    }
  }

  static async getAllProducts() {
    try {
      const products = await scan({ TableName: PRODUCTS_TABLE });
      return products || [];
    } catch (error) {
      console.error('Error getting all products:', error);
      return [];
    }
  }

  static async getProductById(id) {
    try {
      return await get(PRODUCTS_TABLE, { id: parseInt(id) });
    } catch (error) {
      console.error('Error getting product by ID:', error);
      return null;
    }
  }

  static async createProduct(productData) {
    try {
      const product = {
        id: Date.now(),
        ...productData,
        createdAt: new Date().toISOString()
      };
      return await put(PRODUCTS_TABLE, product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(id, updates) {
    try {
      const updateExpression = 'SET #stock = :stock, updatedAt = :updatedAt';
      const expressionAttributeValues = {
        ':stock': updates.stock,
        ':updatedAt': new Date().toISOString()
      };

      return await update(PRODUCTS_TABLE, { id: parseInt(id) }, updateExpression, expressionAttributeValues);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
}

module.exports = Product;