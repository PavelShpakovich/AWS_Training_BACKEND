import { getProductsById } from '@functions/getProductsById/handler';
import { getProducts } from '../mocks/data';

jest.mock('../mocks/data');
jest.mock('@libs/lambda');

const mockData = [
  {
    description: 'Short Product Description1',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    price: 24,
    title: 'ProductOne',
  },
  {
    description: 'Short Product Description7',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
    price: 15,
    title: 'ProductTitle',
  },
];

describe('getProductsList function', () => {
  beforeEach(() => {
    (getProducts as jest.Mock).mockResolvedValue(mockData);
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
      body: JSON.stringify({ product: mockData[0] }),
    });
  });

  it('should return 500 if there is an error', async () => {
    (getProducts as jest.Mock).mockRejectedValueOnce({});

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
