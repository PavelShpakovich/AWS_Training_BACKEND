import { handlerPath } from '@libs/handler-resolver';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: process.env.BUCKET_NAME,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: `${process.env.FOLDER_NAME}/`,
          },
        ],
        existing: true,
      },
    },
  ],
};
