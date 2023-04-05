import { formatJSONResponse, formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getProducts } from 'src/mocks/data';

export const getProductsById = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { productId } = event.pathParameters;
  try {
    const products = await getProducts();
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return formatErrorResponse(404, 'Product not found');
    }

    return formatJSONResponse({ product });
  } catch {
    return formatErrorResponse(500);
  }
};
export const main = middyfy(getProductsById);
