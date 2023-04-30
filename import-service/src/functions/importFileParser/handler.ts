import csv from 'csv-parser';
import { S3Event } from 'aws-lambda';
import { S3Client, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Readable } from 'stream';
import { Commands } from 'src/types';
import { getCommand } from '@functions/helpers';

const client = new S3Client({ region: 'us-east-1' });
const sqsClient = new SQSClient({ region: 'us-east-1' });

const importFileParser = async (event: S3Event): Promise<void> => {
  for (const record of event.Records) {
    console.log(record);

    const doCommand = getCommand(record);

    try {
      const response = await client.send(doCommand(Commands.get) as GetObjectCommand);
      const stream = (response.Body as Readable).pipe(csv());

      for await (const data of stream) {
        const command = new SendMessageCommand({
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(data),
        });
        await sqsClient.send(command);
      }

      await client.send(doCommand(Commands.copy) as CopyObjectCommand);
      console.log(`Object sucessfully copied to ${process.env.PARSED_FOLDER_NAME} folder`);

      await client.send(doCommand(Commands.delete) as DeleteObjectCommand);
      console.log(`Object sucessfully deleted from ${process.env.FOLDER_NAME} folde`);
    } catch (e) {
      console.error(e);
    }
  }
};

export const main = importFileParser;
