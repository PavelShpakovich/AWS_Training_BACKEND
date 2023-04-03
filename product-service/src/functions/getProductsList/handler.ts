import { APIGatewayProxyResult } from 'aws-lambda';
import { formatErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProducts } from 'src/mocks/data';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  try {
    const products = await getProducts();
    return formatJSONResponse({ products });
  } catch {
    return formatErrorResponse(500);
  }
};

export const main = middyfy(getProductsList);
