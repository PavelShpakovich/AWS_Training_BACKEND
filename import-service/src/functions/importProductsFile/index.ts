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
        authorizer: {
          arn: 'arn:aws:lambda:us-east-1:336087417252:function:authorization-service-dev-basicAuthorizer',
          type: 'token',
          name: 'basicAuthorizer',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
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
