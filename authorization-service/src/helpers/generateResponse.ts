export const enum Effect {
  ALLOW = 'Allow',
  DENY = 'Deny',
}

export const generateResponse = (effect: Effect, resourse: string) => {
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resourse,
        },
      ],
    },
  };
};
