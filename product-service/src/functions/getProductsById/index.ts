import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        cors: true,
        responseData: {
          200: {
            description: 'Success',
            bodyType: 'GetProductsByIdResponse',
          },
          404: {
            description: 'Not found',
            bodyType: 'ErrorResponse',
          },
          500: {
            description: 'Server Error',
            bodyType: 'ErrorResponse',
          },
        },
      },
    },
  ],
};
