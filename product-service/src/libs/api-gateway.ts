import { APIGatewayProxyResult } from 'aws-lambda';

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
};

export const formatJSONResponse = (response?: Record<string, unknown>): APIGatewayProxyResult => {
  return {
    statusCode: response ? 200 : 204,
    headers: {
      ...defaultHeaders,
    },
    ...(response && { body: JSON.stringify(response) }),
  };
};

export const formatErrorResponse = (
  statusCode: number = 500,
  message: string = 'Something went wrong'
): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify({ message }),
  };
};
