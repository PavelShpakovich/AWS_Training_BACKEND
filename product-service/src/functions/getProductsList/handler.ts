import { APIGatewayProxyResult } from 'aws-lambda';
import { formatErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsDBClient, stocksDBClient } from 'src/helpers/dynamoDBClient';
import { Product, Stock } from 'src/types';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  try {
    const productsData = (await productsDBClient.getItems()) as Product[];
    const stocksData = (await stocksDBClient.getItems()) as Stock[];

    const products = productsData.map((productData) => {
      const { count } = stocksData.find((stockData) => stockData.product_id === productData.id);
      return { ...productData, count };
    });
    return formatJSONResponse({ products });
  } catch (e) {
    console.log(e);
    return formatErrorResponse(500);
  }
};

export const main = middyfy(getProductsList);
