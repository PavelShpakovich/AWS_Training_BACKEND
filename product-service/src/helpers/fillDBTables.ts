import { Product, Stock } from 'src/types';

import { DynamoDB, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

import { faker } from '@faker-js/faker';

const dynamodb = new DynamoDB({ region: 'us-east-1' });

// Generate random products data
const productsData: Product[] = Array.from({ length: 10 }, () => ({
  id: faker.datatype.uuid(),
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.datatype.number({ min: 1, max: 1000 }),
}));

// Generate random stocks data
const stocksData: Stock[] = productsData.map((product) => ({
  product_id: product.id,
  count: faker.datatype.number({ min: 1, max: 50 }),
}));

(() => {
  const productsDataPromise = productsData.map((product) => {
    const params: PutItemCommandInput = {
      TableName: 'products',
      Item: marshall(product),
    };

    return dynamodb.putItem(params);
  });

  const stocksDataPromise = stocksData.map((stock) => {
    const params: PutItemCommandInput = {
      TableName: 'stocks',
      Item: marshall(stock),
    };

    return dynamodb.putItem(params);
  });

  // Fill tables
  Promise.all([...productsDataPromise, ...stocksDataPromise])
    .then(() => {
      console.log('Data filled successfully!');
    })
    .catch((error) => {
      console.error('Error filling data:', error);
    });
})();
