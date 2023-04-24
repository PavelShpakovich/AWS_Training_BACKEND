import { formatJSONResponse, formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { combinedDBClient } from 'src/helpers/dynamoDBClient';
import { productPayloadMapper } from 'src/helpers/productMapper';
import { validationSchema } from './schema';

export const createProduct = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  try {
    const productData = JSON.parse(event.body);
    const isValid = await validationSchema.isValid(productData);

    if (!isValid) {
      return formatErrorResponse(400, 'Your request is not valid');
    }

    const payload = productPayloadMapper(productData);
    await combinedDBClient.transactPut(payload);

    return formatJSONResponse();
  } catch (e) {
    console.log(e);
    return formatErrorResponse(500);
  }
};
export const main = middyfy(createProduct);
