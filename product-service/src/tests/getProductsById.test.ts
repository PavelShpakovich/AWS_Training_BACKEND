import { getProductsById } from '@functions/getProductsById/handler';
import { productsDBClient, stocksDBClient } from '../helpers/dynamoDBClient';
import { mockProductsData, mockStocksData } from './mock';

jest.mock('@libs/lambda');

describe('getProductsList function', () => {
  beforeEach(() => {
    jest.spyOn(productsDBClient, 'getItem').mockResolvedValue(mockProductsData[0]);
    jest.spyOn(stocksDBClient, 'getItem').mockResolvedValue(mockStocksData[0]);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should return 200 success response', async () => {
    const response = await getProductsById({
      pathParameters: { productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' },
    } as any);
    expect(response).toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ product: { ...mockProductsData[0], count: mockStocksData[0].count } }),
    });
  });

  it('should return 500 if there is an error', async () => {
    jest.spyOn(productsDBClient, 'getItem').mockRejectedValueOnce({});

    const response = await getProductsById({
      pathParameters: { productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' },
    } as any);
    expect(response).toEqual({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Something went wrong' }),
    });
  });

  it('should return 404 if product is not found', async () => {
    jest.spyOn(productsDBClient, 'getItem').mockResolvedValueOnce(undefined);

    const response = await getProductsById({
      pathParameters: { productId: 'product-id' },
    } as any);
    expect(response).toEqual({
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Product not found' }),
    });
  });
});
