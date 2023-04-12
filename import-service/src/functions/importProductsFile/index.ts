import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: { name: true },
          },
        },
        responseData: {
          200: {
            description: 'Success',
            bodyType: 'SignedUrl',
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
