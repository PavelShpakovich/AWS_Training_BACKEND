import { getProductsList } from '@functions/getProductsList/handler';
import { productsDBClient, stocksDBClient } from '../helpers/dynamoDBClient';
import { mockProductsData, mockStocksData } from './mock';

jest.mock('@libs/lambda');

describe('getProductsList function', () => {
  beforeEach(() => {
    jest.spyOn(productsDBClient, 'getItems').mockResolvedValue(mockProductsData);
    jest.spyOn(stocksDBClient, 'getItems').mockResolvedValue(mockStocksData);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should return 200 success response', async () => {
    const response = await getProductsList();
    expect(response).toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        products: mockProductsData.map((productData) => {
          const { count } = mockStocksData.find((stockData) => stockData.product_id === productData.id);
          return { ...productData, count };
        }),
      }),
    });
  });

  it('should return 500 if there is an error', async () => {
    jest.spyOn(productsDBClient, 'getItems').mockRejectedValueOnce({});

    const response = await getProductsList();
    expect(response).toEqual({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Something went wrong' }),
    });
  });
});
