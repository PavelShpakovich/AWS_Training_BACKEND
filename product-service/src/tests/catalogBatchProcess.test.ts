import { combinedDBClient } from '../helpers/dynamoDBClient';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { catalogBatchProcess } from '@functions/catalogBatchProcess/handler';
import { v4 } from 'uuid';

jest.mock('@aws-sdk/client-sns');
jest.mock('uuid');

const recordMock = {
  Records: [
    {
      body: JSON.stringify({
        description: 'Short Product Description1',
        price: 24,
        title: 'ProductOne',
        count: 5,
      }),
    },
  ],
};

describe('catalogBatchProcess function', () => {
  const transactPutMock = jest.fn().mockResolvedValue({});
  const sendMock = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    jest.spyOn(combinedDBClient, 'transactPut').mockImplementation(transactPutMock);
    jest.spyOn(SNSClient.prototype, 'send').mockImplementation(sendMock);
    (PublishCommand as unknown as jest.Mock).mockReturnValue({});
    (v4 as jest.Mock).mockReturnValue('test-id');
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should add products to the DB and send notifications', async () => {
    await catalogBatchProcess(recordMock as any);

    expect(transactPutMock).toHaveBeenCalledWith({
      product: {
        description: 'Short Product Description1',
        price: 24,
        title: 'ProductOne',
        id: 'test-id',
      },
      stock: {
        product_id: 'test-id',
        count: 5,
      },
    });

    expect(sendMock).toHaveBeenCalled();
  });

  it('should log error if womething went wrong', async () => {
    const logMock = jest.fn();
    jest.spyOn(combinedDBClient, 'transactPut').mockRejectedValueOnce({});
    jest.spyOn(console, 'log').mockImplementation(logMock);

    await catalogBatchProcess(recordMock as any);
    expect(logMock).toHaveBeenCalled();
  });
});
