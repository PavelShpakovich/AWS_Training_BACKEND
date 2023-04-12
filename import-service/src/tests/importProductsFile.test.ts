import { importProductsFile } from '@functions/importProductsFile/handler';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

jest.mock('@aws-sdk/s3-request-presigner');
jest.mock('@aws-sdk/client-s3');

describe('getProductsList function', () => {
  beforeEach(() => {
    (S3Client as jest.Mock).mockReturnValue({});
    (PutObjectCommand as unknown as jest.Mock).mockReturnValue({});
    (getSignedUrl as jest.Mock).mockResolvedValue('http://File.csv');
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should return 200 success response', async () => {
    const response = await importProductsFile({
      queryStringParameters: { name: 'File.csv' },
    } as any);
    expect(response).toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ url: 'http://File.csv' }),
    });
  });

  it('should return 500 if there is an error', async () => {
    (getSignedUrl as jest.Mock).mockRejectedValue({});

    const response = await importProductsFile({
      queryStringParameters: { name: 'File.csv' },
    } as any);
    expect(response).toEqual({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Something went wrong' }),
    });
  });

  it('should return 400 if product is not found', async () => {
    const response = await importProductsFile({
      queryStringParameters: {},
    } as any);
    expect(response).toEqual({
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'File name was not provided' }),
    });
  });
});
