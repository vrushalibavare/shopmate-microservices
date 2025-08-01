const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, DeleteCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  ...(process.env.NODE_ENV === 'development' && {
    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'
  })
});

const docClient = DynamoDBDocumentClient.from(client);

// Table names
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'shopmate-products-dev';
const CARTS_TABLE = process.env.CARTS_TABLE || 'shopmate-carts-dev';
const ORDERS_TABLE = process.env.ORDERS_TABLE || 'shopmate-orders-dev';

// Generic get operation
const get = async (tableName, key) => {
  try {
    const command = new GetCommand({
      TableName: tableName,
      Key: key
    });
    const result = await docClient.send(command);
    return result.Item;
  } catch (error) {
    console.error(`Error getting item from ${tableName}:`, error);
    throw error;
  }
};

// Generic put operation
const put = async (tableName, item) => {
  try {
    const command = new PutCommand({
      TableName: tableName,
      Item: item
    });
    await docClient.send(command);
    return item;
  } catch (error) {
    console.error(`Error putting item to ${tableName}:`, error);
    throw error;
  }
};

// Generic scan operation
const scan = async (params) => {
  try {
    const command = new ScanCommand(params);
    const result = await docClient.send(command);
    return result.Items;
  } catch (error) {
    console.error(`Error scanning table:`, error);
    throw error;
  }
};

// Generic delete operation
const deleteItem = async (tableName, key) => {
  try {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key
    });
    await docClient.send(command);
  } catch (error) {
    console.error(`Error deleting item from ${tableName}:`, error);
    throw error;
  }
};

// Generic update operation
const update = async (tableName, key, updateExpression, expressionAttributeValues) => {
  try {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    });
    const result = await docClient.send(command);
    return result.Attributes;
  } catch (error) {
    console.error(`Error updating item in ${tableName}:`, error);
    throw error;
  }
};

module.exports = {
  get,
  put,
  scan,
  deleteItem,
  update,
  PRODUCTS_TABLE,
  CARTS_TABLE,
  ORDERS_TABLE
};