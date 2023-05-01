import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { Effect, generateResponse } from 'src/helpers/generateResponse';

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  console.log(event);

  try {
    const token = event.authorizationToken;
    if (!token) {
      throw new Error('Unauthorized');
    }

    const [user_name, password] = Buffer.from(token.split(' ')[1], 'base64').toString().split(':');
    return generateResponse(process.env[user_name] === password ? Effect.ALLOW : Effect.DENY, event.methodArn);
  } catch (e) {
    console.log(e);
    throw new Error('Unauthorized');
  }
};

export const main = basicAuthorizer;
