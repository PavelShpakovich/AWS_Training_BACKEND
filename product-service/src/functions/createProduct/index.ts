import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        responseData: {
          200: {
            description: 'Success',
            bodyType: 'Product',
          },
          400: {
            description: 'Validation error',
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
